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
      meridians: Array.from({ length: 48 }, (_, i) =>
        ringPath((i * Math.PI) / 24, "meridian"),
      ),
      parallels: Array.from({ length: 10 }, (_, i) =>
        ringPath((i * Math.PI) / 5, "parallel"),
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
        <span>The inference studies</span>
        <span>No. 01</span>
      </div>
      <div className="field__collage">
        <div className="field__main">
          <svg
            className="field__svg"
            viewBox="0 0 620 570"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>
              An interwoven ink torus on terracotta paper: many paths, one
              coordinated system.
            </title>
            <g
              className="field__sculpture"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            >
              {paths.meridians.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  opacity={0.65 + Math.sin(i / 10) * 0.2}
                />
              ))}
              {paths.parallels.map((path, i) => (
                <path key={`p${i}`} d={path} opacity="0.3" strokeWidth="0.65" />
              ))}
            </g>
          </svg>
          <span className="field__plate-label mono" aria-hidden="true">
            COMPUTE, COORDINATED.
          </span>
        </div>
        <div className="field__secondary" aria-hidden="true">
          <div className="field__study field__study--blue">
            <svg viewBox="0 0 160 220">
              <g fill="none" stroke="currentColor" strokeWidth="1.2">
                {Array.from({ length: 9 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${-30 + i * 17} 0 C ${120 + i * 10} 70, ${-65 + i * 10} 150, ${65 + i * 17} 220`}
                  />
                ))}
              </g>
            </svg>
            <span className="mono">01 / FLOW</span>
          </div>
          <div className="field__study field__study--green">
            <svg viewBox="0 0 160 220">
              <g fill="none" stroke="currentColor" strokeWidth="1.1">
                {Array.from({ length: 7 }, (_, i) => (
                  <rect
                    key={i}
                    x={26 + i * 5}
                    y={38 + i * 14}
                    width="82"
                    height="54"
                    transform={`rotate(-20 ${67 + i * 5} ${65 + i * 14})`}
                  />
                ))}
              </g>
            </svg>
            <span className="mono">02 / MEMORY</span>
          </div>
        </div>
      </div>
      <div className="field__caption">
        <span className="mono">A little more from every layer.</span>
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
