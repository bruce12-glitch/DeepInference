import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// Original parametric line sculpture; no remote renderer or WebGL dependency.
function ringPath(u: number, axis: "meridian" | "parallel") {
  const points = Array.from({ length: 105 }, (_, i) => {
    const v = (i / 104) * Math.PI * 2;
    const a = axis === "meridian" ? u : v,
      b = axis === "meridian" ? v : u;
    const radius = 150 + 58 * Math.cos(b);
    const x = radius * Math.cos(a),
      y = radius * Math.sin(a),
      z = 58 * Math.sin(b);
    const tiltedY = y * 0.63 - z * 0.78,
      tiltedZ = y * 0.78 + z * 0.63;
    const rotatedX = x * 0.9 + tiltedZ * 0.43;
    const finalX = rotatedX * 0.86 - tiltedY * 0.51,
      finalY = rotatedX * 0.51 + tiltedY * 0.86;
    return `${i ? "L" : "M"}${(310 + finalX * 1.18).toFixed(2)},${(287 + finalY * 1.18).toFixed(2)}`;
  });
  return `${points.join(" ")}Z`;
}
export function InferenceField() {
  const titleId = useId();
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [motionReduced, setMotionReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [inView, setInView] = useState(true);
  const fieldRef = useRef<HTMLDivElement>(null);
  const paths = useMemo(
    () => ({
      meridians: Array.from({ length: 64 }, (_, i) =>
        ringPath((i * Math.PI) / 32, "meridian"),
      ),
      parallels: Array.from({ length: 14 }, (_, i) =>
        ringPath((i * Math.PI) / 7, "parallel"),
      ),
    }),
    [],
  );
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      setMotionReduced(motion.matches);
      if (motion.matches) setPlaying(false);
    };
    motion.addEventListener("change", changed);
    let intersecting = true;
    const visibility = () => setInView(intersecting && !document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      visibility();
    });
    if (fieldRef.current) observer.observe(fieldRef.current);
    return () => {
      motion.removeEventListener("change", changed);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  return (
    <div
      className={`inference-field ${playing && inView ? "is-playing" : "is-paused"}`}
      ref={fieldRef}
    >
      <div className="field__coordinates mono" aria-hidden="true">
        <span>DI—001</span>
        <span>EFFICIENCY, IN MOTION</span>
      </div>
      <svg
        className="field__svg"
        viewBox="0 0 620 570"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          An interwoven terracotta torus: many paths, one coordinated system.
        </title>
        <g
          className="field__guides"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.65"
          opacity="0.18"
        >
          <circle cx="310" cy="287" r="247" strokeDasharray="2 7" />
          <path d="M310 15v35M310 525v30M40 287h30M550 287h30M118 96l20 20M482 458l20 20M118 478l20-20M482 116l20-20" />
        </g>
        <g
          className="field__sculpture"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          {paths.meridians.map((path, i) => (
            <path key={i} d={path} opacity={0.65 + Math.sin(i / 10) * 0.2} />
          ))}
          {paths.parallels.map((path, i) => (
            <path key={`p${i}`} d={path} opacity="0.3" strokeWidth="0.65" />
          ))}
        </g>
        <g className="field__orbit" fill="none">
          <circle
            cx="310"
            cy="287"
            r="247"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeDasharray="4 1548"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <div className="field__caption">
        <span className="mono">Many paths. One purpose.</span>
        <button
          className="icon-button"
          disabled={motionReduced}
          title={
            motionReduced
              ? "Motion is reduced in your system settings"
              : undefined
          }
          onClick={() => setPlaying((value) => !value)}
          aria-label={
            motionReduced
              ? "Artwork animation disabled by reduced motion preference"
              : playing
                ? "Pause artwork animation"
                : "Play artwork animation"
          }
        >
          {playing ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
