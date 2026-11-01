import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Drifting colour field + engineering mesh used behind dark stages. */
export function Aurora({ mesh = true }: { mesh?: boolean }) {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
      {mesh ? <span className="aurora__mesh" /> : null}
      <span className="aurora__vignette" />
    </div>
  );
}

/**
 * Pointer-tracked halo. Attach the ref to a positioned host and render
 * `<SpotlightLayer />` as its first child. Writes CSS custom properties
 * instead of re-rendering React, so it stays cheap during mouse moves.
 */
export function useSpotlight<T extends HTMLElement>() {
  const hostRef = useRef<T | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = host.getBoundingClientRect();
        host.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        host.style.setProperty("--my", `${event.clientY - rect.top}px`);
        host.classList.add("has-spotlight");
      });
    };
    const onLeave = () => host.classList.remove("has-spotlight");

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return hostRef;
}

export function SpotlightLayer() {
  return <span className="spotlight" aria-hidden="true" />;
}

/** Eases a number up the first time it enters the viewport. */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
  style,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: CSSProperties;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(prefersReducedMotion() ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    let raf = 0;
    let start = 0;
    const run = () => {
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(value * eased);
        if (t < 1) raf = window.requestAnimationFrame(step);
      };
      raf = window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return () => window.cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={hostRef} style={style}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Pulls its child a few pixels toward the cursor, then springs back. */
export function Magnetic({
  children,
  strength = 14,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const child = host.firstElementChild as HTMLElement | null;
    if (!child) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = host.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        child.style.transform = `translate(${dx * strength}px, ${dy * strength * 0.7}px)`;
      });
    };
    const reset = () => {
      child.style.transform = "";
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", reset);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  return (
    <span ref={hostRef} className="magnet">
      {children}
    </span>
  );
}

/** Bounded 3D tilt. Attach to a card that holds a canvas. */
export function useTilt<T extends HTMLElement>(max = 6) {
  const hostRef = useRef<T | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = host.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        host.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-5px)`;
      });
    };
    const reset = () => {
      host.style.transform = "";
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", reset);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
    };
  }, [max]);

  return hostRef;
}
