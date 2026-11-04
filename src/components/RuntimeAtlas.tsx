import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const stages = [
  {
    name: "Prefill",
    detail:
      "Process the prompt and build the attention state. Long inputs can dominate time to first token.",
  },
  {
    name: "KV cache",
    detail:
      "Keep keys and values from previous tokens in memory so later steps can reuse them.",
  },
  {
    name: "Decode",
    detail:
      "Generate one token at a time. Scheduling and memory bandwidth shape sustained throughput.",
  },
] as const;

export function RuntimeAtlas() {
  const [active, setActive] = useState(0);
  const gridId = useId();
  const titleId = useId();

  return (
    <figure className="runtime-atlas">
      <div className="atlas-heading">
        <span className="mono">FIG. 01 / THE INFERENCE PATH</span>
        <span className="atlas-signal mono">
          <i /> ARCHITECTURE STUDY
        </span>
      </div>
      <svg
        className="atlas-art"
        viewBox="0 0 560 364"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          Three stacked plates representing prefill, KV cache, and decode.{" "}
          {stages[active].name} is highlighted.
        </title>
        <defs>
          <pattern
            id={gridId}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.7" fill="currentColor" opacity=".26" />
          </pattern>
        </defs>
        <rect width="560" height="364" fill={`url(#${gridId})`} />
        <g fill="none" stroke="currentColor" opacity=".45">
          <path d="M72 30h20m-10-10v20M488 30h20m-10-10v20M72 334h20m-10-10v20M488 334h20m-10-10v20" />
          <path
            d="M83 99v201M318 46v202M490 105v201M255 158v200"
            strokeDasharray="3 5"
          />
          <path d="M102 329h49m-49 5h28m292-302h39m-25 5h25" />
        </g>
        {[2, 1, 0].map((index) => (
          <g key={index} transform={`translate(0 ${index * 89})`}>
            <g className={`atlas-layer${active === index ? " is-active" : ""}`}>
              <path
                className="atlas-layer__edge"
                d="M83 99 255 158 490 105v11l-235 53-172-59Z"
              />
              <path
                className="atlas-layer__face"
                d="M83 99 318 46 490 105 255 158Z"
              />
              <g
                transform="matrix(1 -.2255 .86 .295 83 99)"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
              >
                <rect x="12" y="12" width="211" height="176" />
                {index === 0 && (
                  <>
                    <rect
                      x="74"
                      y="43"
                      width="87"
                      height="114"
                      className="atlas-chip"
                    />
                    <rect x="83" y="55" width="69" height="90" />
                    {Array.from({ length: 5 }, (_, row) => (
                      <path
                        key={row}
                        d={`M18 ${40 + row * 29}h44l12 14m87 0 12-14h44`}
                      />
                    ))}
                    {Array.from({ length: 4 }, (_, col) => (
                      <path key={col} d={`M${88 + col * 19} 65v70`} />
                    ))}
                  </>
                )}
                {index === 1 &&
                  Array.from({ length: 24 }, (_, cell) => (
                    <rect
                      key={cell}
                      x={24 + (cell % 6) * 32}
                      y={26 + Math.floor(cell / 6) * 40}
                      width="24"
                      height="29"
                      className={cell % 5 === 0 ? "atlas-chip" : undefined}
                    />
                  ))}
                {index === 2 &&
                  Array.from({ length: 6 }, (_, row) => (
                    <path
                      key={row}
                      d={`M19 ${28 + row * 26}h47l20 ${row % 2 ? -12 : 12}h73l20 ${row % 2 ? 12 : -12}h37`}
                    />
                  ))}
              </g>
              <path d="M255 158v11" stroke="currentColor" />
            </g>
          </g>
        ))}
      </svg>
      <figcaption className="atlas-caption">
        <div
          className="atlas-controls"
          role="group"
          aria-label="Highlight an inference stage"
        >
          {stages.map((stage, index) => (
            <button
              key={stage.name}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className="mono">0{index + 1}</span>
              {stage.name}
              <ArrowUpRight size={13} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p aria-live="polite">{stages[active].detail}</p>
      </figcaption>
    </figure>
  );
}
