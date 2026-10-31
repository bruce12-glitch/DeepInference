import React from "react";

export function TelemetryPacketIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`icon-badge icon-badge--terracotta ${className}`} aria-hidden="true">
      <svg className="telemetry-icon icon-packet" viewBox="0 0 24 24" width="20" height="20" fill="none">
        {/* Dual-Tone Terracotta Core Fill */}
        <rect x="6" y="6" width="12" height="12" rx="3" fill="#D97757" fillOpacity="0.22" />
        {/* Outer Structural Frame */}
        <rect className="packet-core" x="6" y="6" width="12" height="12" rx="3" stroke="#D97757" strokeWidth="1.75" />
        {/* Animated Telemetry Pulse Lines */}
        <path className="packet-ray-top" d="M12 2V4.5" stroke="#141413" strokeWidth="1.75" strokeLinecap="round" />
        <path className="packet-ray-bottom" d="M12 19.5V22" stroke="#141413" strokeWidth="1.75" strokeLinecap="round" />
        <path className="packet-ray-left" d="M2 12H4.5" stroke="#141413" strokeWidth="1.75" strokeLinecap="round" />
        <path className="packet-ray-right" d="M19.5 12H22" stroke="#141413" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#C6613F" />
      </svg>
    </span>
  );
}

export function KvOptimalIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`icon-badge icon-badge--sage ${className}`} aria-hidden="true">
      <svg className="telemetry-icon icon-kv-optimal" viewBox="0 0 24 24" width="20" height="20" fill="none">
        {/* Top & Bottom Compressed Memory Pages */}
        <rect
          className="kv-layer-top"
          x="4"
          y="4"
          width="16"
          height="6"
          rx="2"
          fill="#788C5D"
          fillOpacity="0.24"
          stroke="#788C5D"
          strokeWidth="1.75"
        />
        <rect
          className="kv-layer-bottom"
          x="4"
          y="14"
          width="16"
          height="6"
          rx="2"
          fill="#788C5D"
          fillOpacity="0.24"
          stroke="#788C5D"
          strokeWidth="1.75"
        />
        {/* Center Compression Check / Lock */}
        <path
          className="kv-check"
          d="M9.5 12L11.2 13.5L14.8 10.5"
          stroke="#141413"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function FragWarningIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`icon-badge icon-badge--amber ${className}`} aria-hidden="true">
      <svg className="telemetry-icon icon-frag-warning" viewBox="0 0 24 24" width="20" height="20" fill="none">
        {/* Stable Memory Blocks */}
        <rect x="3" y="4" width="7" height="7" rx="1.5" fill="#D4883A" fillOpacity="0.20" stroke="#141413" strokeWidth="1.75" />
        <rect x="3" y="13" width="7" height="7" rx="1.5" fill="#D4883A" fillOpacity="0.20" stroke="#141413" strokeWidth="1.75" />
        <rect x="12" y="13" width="7" height="7" rx="1.5" fill="#D4883A" fillOpacity="0.20" stroke="#141413" strokeWidth="1.75" />
        {/* Drifting Fragmented Block (Animates on Hover) */}
        <rect
          className="frag-block-drift"
          x="13.5"
          y="2.5"
          width="7"
          height="7"
          rx="1.5"
          fill="#D4883A"
          stroke="#D4883A"
          strokeWidth="1.75"
        />
      </svg>
    </span>
  );
}

export function BlueprintCrosshair({
  position = "top-left",
  dark = false,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  dark?: boolean;
}) {
  const posClasses = {
    "top-left": "-top-[4px] -left-[4px]",
    "top-right": "-top-[4px] -right-[4px]",
    "bottom-left": "-bottom-[4px] -left-[4px]",
    "bottom-right": "-bottom-[4px] -right-[4px]",
  }[position];

  return (
    <svg
      className={`pointer-events-none absolute z-10 ${posClasses}`}
      width="7"
      height="7"
      viewBox="0 0 7 7"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 0V7M0 3.5H7"
        stroke={dark ? "#A6A49B" : "#5E5D59"}
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Anthropic-Signature Editorial Illustration:
 * Terracotta Clay (#D97757) canvas with Warm Parchment (#FAF9F5) Rényi-2 entropy pooling nodes
 * and organic Warm Near-Black Ink (#141413) calligraphic contour strokes.
 */
export function AnthropicEditorialArtwork() {
  return (
    <div className="w-full aspect-square max-w-[360px] mx-auto bg-[#D97757] rounded-[6px] p-6 flex items-center justify-center relative overflow-hidden select-none">
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Anthropic-inspired editorial illustration of GQA Rényi-2 entropy pooling"
      >
        {/* Warm Parchment (#FAF9F5) GQA Convergence Hub & Attention Sink Constellation */}
        <path
          d="M178 136 L92 136 M178 136 L146 84 M178 136 L224 78 M178 136 L252 126 M178 136 L242 184 M178 136 L192 204"
          stroke="#FAF9F5"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="178" cy="136" r="24" fill="#FAF9F5" />
        <circle cx="92" cy="136" r="11" fill="#FAF9F5" />
        <circle cx="146" cy="84" r="12" fill="#FAF9F5" />
        <circle cx="224" cy="78" r="11" fill="#FAF9F5" />
        <circle cx="252" cy="126" r="10" fill="#FAF9F5" />
        <circle cx="242" cy="184" r="13" fill="#FAF9F5" />
        <circle cx="192" cy="204" r="10" fill="#FAF9F5" />

        {/* Organic Hand-Drawn Calligraphic Ink Contour (#141413) */}
        <path
          d="M214 54 C168 42, 128 66, 124 106 C122 122, 108 134, 106 146 C104 158, 120 164, 124 176 C130 194, 178 188, 198 214 C214 234, 206 270, 166 278 C134 284, 106 266, 112 246"
          stroke="#141413"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Thinking Hand / Page-Table Structural Fingers Contour */}
        <path
          d="M126 196 C102 198, 86 212, 92 224 C98 234, 134 226, 152 228"
          stroke="#141413"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M96 226 C88 234, 92 246, 114 244 C132 242, 148 240, 156 242"
          stroke="#141413"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M104 244 C98 252, 104 262, 124 260 C138 258, 148 256, 154 256"
          stroke="#141413"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
