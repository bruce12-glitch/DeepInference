import { useState } from "react";
import { ArrowDownRight, Box, Equal } from "lucide-react";

const architectures = [
  {
    name: "Grouped query · 8 KV heads",
    layers: 32,
    queryHeads: 32,
    kvHeads: 8,
    headSize: 128,
  },
  {
    name: "Grouped query · 4 KV heads",
    layers: 28,
    queryHeads: 16,
    kvHeads: 4,
    headSize: 128,
  },
  {
    name: "Multi-head · 32 KV heads",
    layers: 32,
    queryHeads: 32,
    kvHeads: 32,
    headSize: 128,
  },
] as const;

const contexts = [4096, 16384, 32768, 65536, 131072];
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const gibibyte = 1024 ** 3;

export function CacheLab() {
  const [architectureIndex, setArchitectureIndex] = useState(0);
  const [context, setContext] = useState(32768);
  const [bytes, setBytes] = useState(2);
  const [sequences, setSequences] = useState(4);
  const { layers, kvHeads, queryHeads, headSize } =
    architectures[architectureIndex];
  const bytesPerToken = 2 * layers * kvHeads * headSize * bytes;
  const perSequence = (bytesPerToken * context) / gibibyte;
  const total = perSequence * sequences;
  const reference = (total * queryHeads) / kvHeads;

  return (
    <div className="cache-lab">
      <div className="lab-bar">
        <span className="mono">
          <Box size={15} aria-hidden="true" /> WORKLOAD MODEL / 01
        </span>
        <span className="mono">KV CACHE ESTIMATOR</span>
      </div>
      <div className="lab-body">
        <fieldset className="lab-inputs">
          <legend>Workload inputs</legend>
          <label htmlFor="cache-architecture">Model geometry</label>
          <select
            id="cache-architecture"
            value={architectureIndex}
            onChange={(event) =>
              setArchitectureIndex(Number(event.target.value))
            }
          >
            {architectures.map((architecture, index) => (
              <option key={architecture.name} value={index}>
                {architecture.name}
              </option>
            ))}
          </select>
          <div className="lab-inputs__pair">
            <div>
              <label htmlFor="cache-context">Context length</label>
              <select
                id="cache-context"
                value={context}
                onChange={(event) => setContext(Number(event.target.value))}
              >
                {contexts.map((tokens) => (
                  <option key={tokens} value={tokens}>
                    {tokens / 1024}K tokens
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cache-precision">Cache precision</label>
              <select
                id="cache-precision"
                value={bytes}
                onChange={(event) => setBytes(Number(event.target.value))}
              >
                <option value={2}>16-bit</option>
                <option value={1}>8-bit</option>
              </select>
            </div>
          </div>
          <label className="lab-range-label" htmlFor="cache-sequences">
            Concurrent sequences{" "}
            <span className="mono" aria-hidden="true">
              {sequences}
            </span>
          </label>
          <input
            id="cache-sequences"
            type="range"
            min={1}
            max={16}
            step={1}
            value={sequences}
            onChange={(event) => setSequences(Number(event.target.value))}
          />
          <div className="lab-range-ends mono" aria-hidden="true">
            <span>1</span>
            <span>16</span>
          </div>
        </fieldset>

        <div className="lab-output">
          <div className="lab-result" aria-live="polite" aria-atomic="true">
            <p className="mono">ESTIMATED KV MEMORY</p>
            <p className="lab-total">
              {number.format(total)} <span>GiB</span>
            </p>
            <p className="lab-detail">
              {number.format(perSequence)} GiB per sequence ·{" "}
              {number.format(bytesPerToken / 1024)} KiB per token
            </p>
          </div>
          <div
            className="lab-bars"
            aria-label="Selected layout versus multi-head reference"
          >
            <div className="lab-bar-item">
              <span>Selected geometry</span>
              <span className="mono">{number.format(total)} GiB</span>
              <div className="lab-track" aria-hidden="true">
                <div
                  className="lab-fill"
                  style={{ width: `${(total / reference) * 100}%` }}
                />
              </div>
            </div>
            <div className="lab-bar-item">
              <span>Multi-head reference</span>
              <span className="mono">{number.format(reference)} GiB</span>
              <div className="lab-track" aria-hidden="true">
                <div className="lab-fill lab-fill--reference" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <details className="lab-method">
        <summary>
          <Equal size={17} aria-hidden="true" /> How this estimate is calculated{" "}
          <ArrowDownRight size={16} aria-hidden="true" />
        </summary>
        <div>
          <p>
            <code>
              2 × layers × KV heads × head size × bytes × tokens × sequences
            </code>
          </p>
          <p>
            This layout uses {layers} layers, {kvHeads} KV heads, and {headSize}{" "}
            values per head. The factor of two accounts for keys and values. The
            reference assigns one KV head to each query head and holds the other
            inputs fixed.
          </p>
        </div>
      </details>
      <p className="lab-note">
        Analytical estimate for full sequences. Model weights, allocator
        overhead, quantization metadata, and shared prefixes are excluded.
      </p>
    </div>
  );
}
