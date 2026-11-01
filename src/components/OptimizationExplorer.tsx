import { useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
const AREAS = [
  {
    id: "latency",
    name: "First-token latency",
    number: "01",
    title: "Less waiting. More thinking.",
    description:
      "Long prompts can make the first token the hardest one. We look for redundant prefill work, repeated context, and opportunities to improve the path from request to response.",
    focus: "Prefill & context processing",
    labels: ["Incoming context", "Useful computation", "First token"],
  },
  {
    id: "memory",
    name: "Memory pressure",
    number: "02",
    title: "Make room for more context.",
    description:
      "The KV cache grows as conversations do. We study how context is retained and accessed, with memory decisions evaluated alongside the quality of the model’s responses.",
    focus: "KV cache & memory management",
    labels: [
      "Context grows",
      "Retain what matters",
      "Room for the next request",
    ],
  },
  {
    id: "capacity",
    name: "Serving capacity",
    number: "03",
    title: "Keep the whole system moving.",
    description:
      "A fast kernel is one part of a fast service. We examine batching, scheduling, and execution together to find where requests wait and GPU capacity goes unused.",
    focus: "Scheduling & execution",
    labels: ["Requests arrive", "Coordinate the work", "Keep compute moving"],
  },
] as const;
export function OptimizationExplorer() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const area = AREAS[selected];
  return (
    <div className="explorer">
      <div
        className="explorer__tabs"
        role="tablist"
        aria-label="Inference optimization focus"
      >
        {AREAS.map((item, i) => (
          <button
            ref={(node) => {
              buttons.current[i] = node;
            }}
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => {
              const offsets: Record<string, number> = {
                ArrowRight: 1,
                ArrowDown: 1,
                ArrowLeft: -1,
                ArrowUp: -1,
              };
              let next: number;
              if (event.key === "Home") next = 0;
              else if (event.key === "End") next = AREAS.length - 1;
              else if (event.key in offsets)
                next = (i + offsets[event.key] + AREAS.length) % AREAS.length;
              else return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            <span className="mono">{item.number}</span>
            {item.name}
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>
      {AREAS.map((item, i) => (
        <div
          key={item.id}
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={selected !== i}
          tabIndex={0}
        >
          {selected === i && (
            <div className={`explorer__panel explorer__panel--${area.id}`}>
              <div className="explorer__copy">
                <span className="eyebrow">{area.focus}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <a className="text-link" href="#approach">
                  How we evaluate it{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
              <div className="flow-visual">
                <div className="flow-visual__label mono">
                  A SYSTEM, RECONSIDERED
                </div>
                <div
                  className="flow-visual__drawing"
                  role="img"
                  aria-label={`Conceptual view: ${area.labels.join(", then ")}. This is an illustration, not measured performance.`}
                >
                  <div className="flow-visual__inputs">
                    {Array.from({ length: 8 }, (_, n) => (
                      <span key={n} style={{ "--n": n } as CSSProperties} />
                    ))}
                  </div>
                  <div className="flow-visual__connector" />
                  <div className="flow-visual__core">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="flow-visual__connector" />
                  <div className="flow-visual__outputs">
                    {Array.from({ length: 5 }, (_, n) => (
                      <span key={n} style={{ "--n": n } as CSSProperties} />
                    ))}
                  </div>
                </div>
                <div className="flow-visual__legend">
                  {area.labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <p className="visual-note">
                  Conceptual illustration · performance depends on the workload.
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
