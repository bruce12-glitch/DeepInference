import { useEffect, useRef, useState } from "react";
import type { EffectModule, EffectPreset } from "../data/effectPresets";

type EffectHandle = {
  update: (preset: EffectPreset) => Promise<void>;
  dispose: () => void;
};

type EffectModuleApi = {
  mount: (host: HTMLElement, preset: EffectPreset) => Promise<EffectHandle> | EffectHandle;
};

interface EffectCanvasProps {
  moduleName: EffectModule;
  preset: EffectPreset;
  playing?: boolean;
  className?: string;
  label: string;
  decorative?: boolean;
}

export function EffectCanvas({
  moduleName,
  preset,
  playing = false,
  className = "",
  label,
  decorative = false,
}: EffectCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<EffectHandle | null>(null);
  const presetRef = useRef(preset);
  const playingRef = useRef(playing);
  const [failed, setFailed] = useState(false);

  presetRef.current = preset;
  playingRef.current = playing;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    setFailed(false);

    const mountEffect = async () => {
      try {
        // Resolve against the document base so the build works both at the
        // site root and under a GitHub Pages project subpath.
        const moduleUrl = new URL(`effects/${moduleName}.js`, document.baseURI).href;
        const effect = (await import(/* @vite-ignore */ moduleUrl)) as EffectModuleApi;
        const initialPreset = {
          ...presetRef.current,
          playback: {
            ...presetRef.current.playback,
            playing: moduleName === "optical" ? playingRef.current : false,
          },
        };
        const handle = await effect.mount(host, initialPreset);
        if (cancelled) {
          handle.dispose();
          return;
        }
        handleRef.current = handle;
      } catch (error) {
        if (!cancelled) {
          console.error(`Unable to load ${moduleName} visual`, error);
          setFailed(true);
        }
      }
    };

    void mountEffect();

    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
      host.replaceChildren();
    };
  }, [moduleName]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const nextPreset = {
      ...preset,
      playback: {
        ...preset.playback,
        playing: moduleName === "optical" ? playing : false,
      },
    };
    void handle.update(nextPreset).catch((error: unknown) => {
      console.error(`Unable to update ${moduleName} visual`, error);
      setFailed(true);
    });
  }, [moduleName, playing, preset]);

  return (
    <div
      className={`effect-canvas ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      <div ref={hostRef} className="effect-canvas__host" aria-hidden="true" />
      {failed ? (
        <div className="effect-canvas__fallback" role="status">
          Visual preview unavailable
        </div>
      ) : null}
    </div>
  );
}
