import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  Database,
  Gauge,
  Layers3,
  LockKeyhole,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BenchmarkDashboard } from "./components/BenchmarkDashboard";
import { Brand } from "./components/Brand";
import { EffectCanvas } from "./components/EffectCanvas";
import { OpticalHero } from "./components/OpticalHero";
import { SiteHeader } from "./components/SiteHeader";
import { MINIMAL_PRESETS } from "./data/effectPresets";

const CONTACT_URL =
  "mailto:iambruce0012@gmail.com?subject=DeepInference%20private%20cluster%20benchmark";

const QUICKSTART = `# Install the DeepInference runtime
pip install deep-system-runtime

# Serve a distributed model
python -m system_runtime.entrypoint \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --tensor-parallel-size 8 \\
  --max-model-len 131072 \\
  --port 8000`;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const RUNTIME_FEATURES = [
  {
    number: "01",
    icon: Zap,
    title: "Remove redundant prefill work",
    description:
      "Filter unneeded token computation before it reaches expensive attention layers, without changing the model or application.",
    tag: "DYNAMIC TOKEN PRE-FILTERING",
  },
  {
    number: "02",
    icon: Database,
    title: "Reclaim cache memory safely",
    description:
      "Evict inactive KV-cache pages in hardware-aligned blocks while protecting the context needed for accurate responses.",
    tag: "HARDWARE-ALIGNED EVICTION",
  },
  {
    number: "03",
    icon: Cpu,
    title: "Keep GPU cores saturated",
    description:
      "Compile and group execution requests for CUDA and ROCm, reducing memory-bus idle time across distributed workloads.",
    tag: "CUSTOM CUDA / ROCm KERNELS",
  },
];

const DEPLOYMENTS = [
  {
    name: "Enterprise VPC / on-prem",
    architecture: "Runs inside isolated AWS, GCP, CoreWeave, or bare-metal GPU nodes.",
    commercial: `${currencyFormat.format(1500)}–${currencyFormat.format(3500)} / GPU / month`,
  },
  {
    name: "Value-share optimization",
    architecture: "Baseline audit, optimization-layer deployment, and verified savings measurement.",
    commercial: "20–30% of verified monthly savings",
  },
  {
    name: "Managed disaggregated PaaS",
    architecture: "Hosted control plane for metered input and output streams.",
    commercial: "Per 1M tokens + KV-cache GB-hour",
  },
  {
    name: "OEM silicon integration",
    architecture: "Runtime layers compiled directly into custom silicon SDK toolkits.",
    commercial: "Strategic vendor licensing",
  },
];

export default function App() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copyTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const copyQuickstart = async () => {
    try {
      await navigator.clipboard.writeText(QUICKSTART);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopyStatus("idle"), 2400);
  };

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">
              <span className="status-dot status-dot--live" aria-hidden="true" />
              Inference infrastructure, refined
            </p>
            <h1 id="hero-title">
              Serve more.
              <span>Spend less.</span>
            </h1>
            <p className="hero__lede">
              DeepInference is a drop-in runtime for distributed LLM serving. Remove wasted prefill work, reclaim GPU memory, and keep your existing OpenAI-compatible API.
            </p>
            <div className="hero__actions">
              <a className="button button--accent" href={CONTACT_URL}>
                Request a cluster benchmark
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="button button--text" href="#runtime">
                View technical architecture
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <ul className="hero__assurances" aria-label="Platform highlights">
              <li><Check size={15} aria-hidden="true" />OpenAI-compatible</li>
              <li><Check size={15} aria-hidden="true" />VPC & on-prem</li>
              <li><Check size={15} aria-hidden="true" />CUDA & ROCm</li>
            </ul>
          </div>
          <OpticalHero />
        </section>

        <div className="compatibility shell" aria-label="Supported infrastructure">
          <span className="mono-label">BUILT FOR YOUR EXISTING STACK</span>
          <div className="compatibility__items">
            {[
              "OpenAI API",
              "vLLM",
              "TensorRT-LLM",
              "Hugging Face TGI",
              "Linux / CUDA / ROCm",
            ].map((item) => (
              <span key={item} translate="no">{item}</span>
            ))}
          </div>
        </div>

        <section id="runtime" className="section section--dark" aria-labelledby="runtime-title">
          <div className="shell">
            <div className="section-intro section-intro--split">
              <div>
                <p className="eyebrow">01 / The runtime</p>
                <h2 id="runtime-title">One runtime. Every layer working together.</h2>
              </div>
              <p>
                DeepInference sits between your model weights and Linux, CUDA, or ROCm execution. It optimizes prefill, cache usage, and kernel dispatch as one system instead of treating each as a separate bottleneck.
              </p>
            </div>

            <div className="runtime-layout">
              <div className="architecture-board">
                <div className="architecture-board__header">
                  <span className="mono-label">DROP-IN SYSTEM ARCHITECTURE</span>
                  <span>01 — 04</span>
                </div>
                <div className="architecture-stack">
                  <div className="architecture-layer">
                    <span>01</span>
                    <div><strong>Your application</strong><small>Existing requests and business logic</small></div>
                    <CodeLabel>APP</CodeLabel>
                  </div>
                  <div className="architecture-layer architecture-layer--accent">
                    <span>02</span>
                    <div><strong>DeepInference runtime</strong><small>Prefill, KV-cache, scheduling, and compiled kernels</small></div>
                    <CodeLabel>OPTIMIZE</CodeLabel>
                  </div>
                  <div className="architecture-layer">
                    <span>03</span>
                    <div><strong>Model & serving layer</strong><small>Your weights, parallelism, and OpenAI-compatible API</small></div>
                    <CodeLabel>MODEL</CodeLabel>
                  </div>
                  <div className="architecture-layer">
                    <span>04</span>
                    <div><strong>Your GPU infrastructure</strong><small>Linux, CUDA / ROCm, cloud VPC, or bare metal</small></div>
                    <CodeLabel>HARDWARE</CodeLabel>
                  </div>
                </div>
                <p className="architecture-board__note">
                  <LockKeyhole size={16} aria-hidden="true" />
                  Your models and data stay inside your deployment boundary.
                </p>
              </div>

              <div className="runtime-visuals">
                <article className="visual-card visual-card--arc">
                  <div className="visual-card__caption">
                    <span className="mono-label">WORKLOAD SHAPING</span>
                    <strong>Direct compute where it matters.</strong>
                  </div>
                  <EffectCanvas
                    moduleName="minimal"
                    preset={MINIMAL_PRESETS.arc}
                    label="Architectural arc study representing workload distribution"
                  />
                </article>
                <article className="visual-card visual-card--twist">
                  <div className="visual-card__caption">
                    <span className="mono-label">COMPILED EXECUTION</span>
                    <strong>One coordinated execution path.</strong>
                  </div>
                  <EffectCanvas
                    moduleName="minimal"
                    preset={MINIMAL_PRESETS.twist}
                    label="Three-dimensional twisted tower representing coordinated kernel execution"
                  />
                </article>
              </div>
            </div>

            <div className="runtime-features">
              {RUNTIME_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.number} className="runtime-feature">
                    <div className="runtime-feature__topline">
                      <span>{feature.number}</span>
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <span className="mono-label">{feature.tag}</span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="performance" className="section section--paper" aria-labelledby="performance-title">
          <div className="shell">
            <div className="section-intro section-intro--split">
              <div>
                <p className="eyebrow">02 / Performance</p>
                <h2 id="performance-title">Benchmark the workload you actually run.</h2>
              </div>
              <p>
                See time to first token, concurrent throughput, and memory reclamation under your real context lengths and traffic shape. Then compare the same run, on the same hardware, with DeepInference enabled.
              </p>
            </div>

            <BenchmarkDashboard />

            <div className="audit-card">
              <div className="audit-card__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.dot}
                  label="Three-dimensional dot relief representing workload telemetry"
                />
              </div>
              <div className="audit-card__content">
                <p className="eyebrow">A benchmark you can audit</p>
                <h3>No synthetic leaderboard. Your models, your cluster, your raw results.</h3>
                <ul>
                  <li><Check size={16} aria-hidden="true" />Matched baseline and optimized runs</li>
                  <li><Check size={16} aria-hidden="true" />Consistent quantization, batching, and concurrency</li>
                  <li><Check size={16} aria-hidden="true" />Raw telemetry and configuration logs included</li>
                </ul>
                <a href={CONTACT_URL} className="text-link">
                  Scope a private benchmark <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="deployment" className="section section--tinted" aria-labelledby="deployment-title">
          <div className="shell">
            <div className="section-intro section-intro--split">
              <div>
                <p className="eyebrow">03 / Deployment</p>
                <h2 id="deployment-title">Your infrastructure. Your terms.</h2>
              </div>
              <p>
                Deploy inside your security boundary, pay from measured savings, use a managed control plane, or embed the runtime into your own silicon stack.
              </p>
            </div>

            <div className="deployment-overview">
              <div className="deployment-overview__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.corner}
                  label="Architectural corner rhythm representing modular cluster deployment"
                />
              </div>
              <div className="deployment-overview__content">
                <ShieldCheck size={28} aria-hidden="true" />
                <h3>Your data never has to leave your boundary.</h3>
                <p>Run the optimization layer directly on the infrastructure you already operate.</p>
                <div className="deployment-clouds" aria-label="Supported deployment environments">
                  {["AWS", "GCP", "CoreWeave", "Bare metal"].map((cloud) => (
                    <span key={cloud}>{cloud}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="deployment-table-wrapper">
              <table className="deployment-table">
                <caption className="sr-only">DeepInference deployment and commercial models</caption>
                <thead>
                  <tr>
                    <th scope="col">Deployment path</th>
                    <th scope="col">Infrastructure architecture</th>
                    <th scope="col">Commercial model</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPLOYMENTS.map((deployment, index) => (
                    <tr key={deployment.name}>
                      <td data-label="Deployment path">
                        <span className="deployment-index">0{index + 1}</span>
                        <strong>{deployment.name}</strong>
                      </td>
                      <td data-label="Infrastructure architecture">{deployment.architecture}</td>
                      <td data-label="Commercial model">{deployment.commercial}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="deployment-note">Final pricing depends on cluster size, support requirements, and integration scope.</p>
          </div>
        </section>

        <section id="developers" className="section section--developer" aria-labelledby="developers-title">
          <div className="shell developer-layout">
            <div className="developer-copy">
              <p className="eyebrow">04 / Developers</p>
              <h2 id="developers-title">Change the endpoint. Keep the application.</h2>
              <p>
                Start the optimized serving engine with your existing model weights, then point your OpenAI-compatible client at the new runtime.
              </p>
              <ul className="developer-benefits">
                <li><Server size={18} aria-hidden="true" /><span><strong>Drop-in serving</strong> across distributed GPU nodes</span></li>
                <li><Layers3 size={18} aria-hidden="true" /><span><strong>Long-context ready</strong> with configurable model length</span></li>
                <li><Gauge size={18} aria-hidden="true" /><span><strong>Observable by default</strong> for repeatable performance audits</span></li>
              </ul>
              <a
                className="text-link text-link--light"
                href="https://github.com/bruce12-glitch/DeepInference"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the runtime repository <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="quickstart">
              <div className="terminal">
                <div className="terminal__header">
                  <div className="terminal__dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>quickstart.sh</span>
                  <button type="button" onClick={copyQuickstart} className="terminal__copy">
                    <Copy size={14} aria-hidden="true" />
                    {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy"}
                  </button>
                </div>
                <pre aria-label="DeepInference shell quick-start"><code>{QUICKSTART}</code></pre>
                <span className="sr-only" aria-live="polite">
                  {copyStatus === "copied" ? "Quick-start commands copied to clipboard." : copyStatus === "failed" ? "Unable to copy. Select the commands manually." : ""}
                </span>
              </div>
              <div className="api-card">
                <div>
                  <span className="mono-label">OPENAI-COMPATIBLE API</span>
                  <span className="api-card__status"><i />READY</span>
                </div>
                <code><span>base_url</span> = <strong>"http://localhost:8000/v1"</strong></code>
                <p>One endpoint change. No application rewrite.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--paper cta-section" aria-labelledby="cta-title">
          <div className="shell">
            <div className="cta-card">
              <div className="cta-card__content">
                <p className="eyebrow">Start with your own hardware</p>
                <h2 id="cta-title">Find the capacity hiding in your cluster.</h2>
                <p>
                  Running production inference at scale? Get a private benchmark on your models and hardware, with the configuration and raw results included.
                </p>
                <a className="button button--dark" href={CONTACT_URL}>
                  Request a private benchmark
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <span className="cta-card__note">Built for teams with significant distributed inference spend.</span>
              </div>
              <div className="cta-card__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.fold}
                  label="Three-dimensional folded fan representing untapped cluster capacity"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__top">
          <div>
            <a href="#top" aria-label="DeepInference home"><Brand /></a>
            <p>Inference optimization for production infrastructure.</p>
          </div>
          <div className="site-footer__links">
            <div>
              <span className="mono-label">EXPLORE</span>
              <a href="#runtime">Runtime</a>
              <a href="#performance">Performance</a>
              <a href="#deployment">Deployment</a>
            </div>
            <div>
              <span className="mono-label">CONNECT</span>
              <a href="mailto:iambruce0012@gmail.com">Contact engineering</a>
              <a href="https://github.com/bruce12-glitch/DeepInference" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={12} aria-hidden="true" /></a>
              <a href="https://github.com/bruce12-glitch/PageEntro-KV" target="_blank" rel="noopener noreferrer">Research <ArrowUpRight size={12} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <div className="shell site-footer__bottom">
          <span>© {new Date().getFullYear()} DeepInference</span>
          <span>Infrastructure that does more with what you have.</span>
        </div>
      </footer>
    </div>
  );
}

function CodeLabel({ children }: { children: string }) {
  return <code className="architecture-layer__label">{children}</code>;
}
