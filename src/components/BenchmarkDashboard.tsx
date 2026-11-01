import { useState } from "react";
import { Activity, Gauge, MemoryStick } from "lucide-react";

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const BENCHMARKS = {
  h100: {
    shortLabel: "8× H100",
    cluster: "8× NVIDIA H100 SXM5",
    ttft: [
      { context: "32k", baseline: 2.9, optimized: 1.8 },
      { context: "64k", baseline: 4.6, optimized: 2.6 },
      { context: "128k", baseline: 7.8, optimized: 4.1 },
    ],
    throughput: {
      baseline: [680, 1050, 1280, 1190],
      optimized: [920, 1480, 1830, 1780],
    },
    memory: 38,
  },
  a100: {
    shortLabel: "4× A100",
    cluster: "4× NVIDIA A100 PCIe",
    ttft: [
      { context: "32k", baseline: 4.1, optimized: 2.8 },
      { context: "64k", baseline: 6.8, optimized: 4.2 },
      { context: "128k", baseline: 11.6, optimized: 6.9 },
    ],
    throughput: {
      baseline: [320, 490, 610, 560],
      optimized: [450, 690, 840, 810],
    },
    memory: 31,
  },
  mi300x: {
    shortLabel: "8× MI300X",
    cluster: "8× AMD Instinct MI300X",
    ttft: [
      { context: "32k", baseline: 2.6, optimized: 1.7 },
      { context: "64k", baseline: 4.1, optimized: 2.5 },
      { context: "128k", baseline: 6.9, optimized: 3.8 },
    ],
    throughput: {
      baseline: [740, 1180, 1420, 1360],
      optimized: [990, 1590, 1970, 1910],
    },
    memory: 42,
  },
} as const;

type HardwareKey = keyof typeof BENCHMARKS;
type Benchmark = (typeof BENCHMARKS)[HardwareKey];

function ThroughputChart({ benchmark }: { benchmark: Benchmark }) {
  const concurrency = [16, 32, 64, 128];
  const maxValue = Math.max(
    ...benchmark.throughput.baseline,
    ...benchmark.throughput.optimized,
  );
  const toPoints = (values: readonly number[]) =>
    values.map((value, index) => ({
      x: 34 + index * 92,
      y: 132 - (value / maxValue) * 104,
    }));
  const baseline = toPoints(benchmark.throughput.baseline);
  const optimized = toPoints(benchmark.throughput.optimized);
  const path = (points: { x: number; y: number }[]) =>
    points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <div className="throughput-chart">
      <div className="chart__header">
        <div>
          <span className="mono-label">CONCURRENT TOKEN THROUGHPUT</span>
          <h3>Stable output as concurrency rises</h3>
        </div>
        <div className="chart__legend" aria-label="Chart legend">
          <span><i className="legend-line legend-line--baseline" />Baseline</span>
          <span><i className="legend-line legend-line--optimized" />DeepInference</span>
        </div>
      </div>
      <svg
        viewBox="0 0 340 174"
        role="img"
        aria-labelledby="throughput-title throughput-description"
        className="throughput-chart__svg"
      >
        <title id="throughput-title">Illustrative concurrent token throughput</title>
        <desc id="throughput-description">
          Example tokens per second at 16, 32, 64, and 128 concurrent requests, comparing a baseline runtime with DeepInference.
        </desc>
        {[28, 63, 97, 132].map((y) => (
          <line key={y} x1="28" x2="324" y1={y} y2={y} className="chart-grid-line" />
        ))}
        <path d={path(baseline)} className="chart-path chart-path--baseline" />
        <path d={path(optimized)} className="chart-path chart-path--optimized" />
        {baseline.map((point, index) => (
          <circle key={`baseline-${point.x}`} cx={point.x} cy={point.y} r="3" className="chart-point chart-point--baseline">
            <title>{`${concurrency[index]} requests: ${numberFormat.format(benchmark.throughput.baseline[index])} tokens/s baseline`}</title>
          </circle>
        ))}
        {optimized.map((point, index) => (
          <circle key={`optimized-${point.x}`} cx={point.x} cy={point.y} r="3.5" className="chart-point chart-point--optimized">
            <title>{`${concurrency[index]} requests: ${numberFormat.format(benchmark.throughput.optimized[index])} tokens/s DeepInference`}</title>
          </circle>
        ))}
        {concurrency.map((value, index) => (
          <text key={value} x={34 + index * 92} y="158" textAnchor="middle" className="chart-axis-label">
            {value}
          </text>
        ))}
        <text x="28" y="171" className="chart-axis-caption">CONCURRENT REQUESTS</text>
      </svg>
    </div>
  );
}

export function BenchmarkDashboard() {
  const [hardware, setHardware] = useState<HardwareKey>("h100");
  const benchmark = BENCHMARKS[hardware];
  const maxTtft = Math.max(...benchmark.ttft.map((item) => item.baseline));
  const peakThroughput = Math.max(...benchmark.throughput.optimized);
  const longestContext = benchmark.ttft[benchmark.ttft.length - 1];

  return (
    <div className="benchmark-panel">
      <div className="benchmark-panel__topbar">
        <div>
          <span className="mono-label">BENCHMARK WORKSPACE</span>
          <p>{benchmark.cluster}</p>
        </div>
        <span className="demo-badge">ILLUSTRATIVE DATA</span>
      </div>

      <div className="hardware-switcher" aria-label="Example hardware configuration">
        {(Object.keys(BENCHMARKS) as HardwareKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={hardware === key}
            onClick={() => setHardware(key)}
          >
            {BENCHMARKS[key].shortLabel}
          </button>
        ))}
      </div>

      <div className="benchmark-stats">
        <article>
          <div className="benchmark-stat__icon"><Gauge size={17} aria-hidden="true" /></div>
          <span>TTFT at 128k</span>
          <strong>{numberFormat.format(longestContext.optimized)}<small>s</small></strong>
          <p>{numberFormat.format(longestContext.baseline)}s example baseline</p>
        </article>
        <article>
          <div className="benchmark-stat__icon"><Activity size={17} aria-hidden="true" /></div>
          <span>Peak throughput</span>
          <strong>{numberFormat.format(peakThroughput)}<small> tok/s</small></strong>
          <p>Example optimized run</p>
        </article>
        <article>
          <div className="benchmark-stat__icon"><MemoryStick size={17} aria-hidden="true" /></div>
          <span>Memory reclaimed</span>
          <strong>{numberFormat.format(benchmark.memory)}<small>%</small></strong>
          <p>Example active batch cycle</p>
        </article>
      </div>

      <div className="benchmark-panel__charts">
        <div className="latency-chart">
          <div className="chart__header">
            <div>
              <span className="mono-label">TIME TO FIRST TOKEN</span>
              <h3>Lower latency under long prefill</h3>
            </div>
            <span className="chart-unit">SECONDS · LOWER IS BETTER</span>
          </div>
          <div className="latency-chart__legend chart__legend">
            <span><i className="legend-block legend-block--baseline" />Baseline</span>
            <span><i className="legend-block legend-block--optimized" />DeepInference</span>
          </div>
          <div className="latency-chart__rows">
            {benchmark.ttft.map((item) => (
              <div className="latency-group" key={item.context}>
                <span className="latency-group__label">{item.context} context</span>
                <div className="latency-bars">
                  <div className="latency-bar-row">
                    <div className="latency-bar-track">
                      <div className="latency-bar latency-bar--baseline" style={{ width: `${(item.baseline / maxTtft) * 100}%` }} />
                    </div>
                    <span>{numberFormat.format(item.baseline)}s</span>
                  </div>
                  <div className="latency-bar-row">
                    <div className="latency-bar-track">
                      <div className="latency-bar latency-bar--optimized" style={{ width: `${(item.optimized / maxTtft) * 100}%` }} />
                    </div>
                    <span>{numberFormat.format(item.optimized)}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ThroughputChart benchmark={benchmark} />
      </div>

      <p className="benchmark-panel__note">
        Demo values show the reporting interface, not a performance claim. Your audit uses measured runs on your models, hardware, and traffic pattern.
      </p>
    </div>
  );
}
