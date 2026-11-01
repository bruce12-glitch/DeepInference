import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { OPTICAL_PRESETS } from "../data/effectPresets";
import { EffectCanvas } from "./EffectCanvas";

type OpticalMode = keyof typeof OPTICAL_PRESETS;

export function OpticalHero() {
  const [mode, setMode] = useState<OpticalMode>("prefill");
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [inView, setInView] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectMotionPreference = () => {
      if (media.matches) setPlaying(false);
    };
    media.addEventListener("change", respectMotionPreference);
    return () => media.removeEventListener("change", respectMotionPreference);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = playing && inView;

  return (
    <div ref={cardRef} className="optical-card">
      <div className="optical-card__topbar">
        <span className="mono-label">RUNTIME FIELD / 001</span>
        <span className="optical-card__status">
          <span className={shouldPlay ? "status-dot status-dot--live" : "status-dot"} />
          {shouldPlay ? "LIVE" : "PAUSED"}
        </span>
      </div>

      <div className="optical-card__stage">
        <EffectCanvas
          moduleName="optical"
          preset={OPTICAL_PRESETS[mode]}
          playing={shouldPlay}
          label="Abstract three-dimensional inference field representing prefill and decode workloads"
        />
        <div className="optical-card__readout" aria-hidden="true">
          <span>MODEL</span>
          <strong>Llama 3.1 / 70B</strong>
          <span>RUNTIME</span>
          <strong>DeepInference</strong>
        </div>
      </div>

      <div className="optical-card__controls">
        <div className="segmented-control" aria-label="Inference workload visual">
          {(Object.keys(OPTICAL_PRESETS) as OpticalMode[]).map((presetMode) => (
            <button
              key={presetMode}
              type="button"
              aria-pressed={mode === presetMode}
              onClick={() => setMode(presetMode)}
            >
              {presetMode === "prefill" ? "Prefill field" : "Decode field"}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={() => setPlaying((current) => !current)}
          aria-label={playing ? "Pause 3D animation" : "Play 3D animation"}
          title={playing ? "Pause animation" : "Play animation"}
        >
          {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
