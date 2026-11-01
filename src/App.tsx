import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
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
import { InteractivePageEntroSimulator } from "./components/InteractivePageEntroSimulator";
import { OpticalHero } from "./components/OpticalHero";
import { SiteHeader } from "./components/SiteHeader";
import { simulatePageEntroKV } from "./data/deepInferenceData";
import { MINIMAL_PRESETS } from "./data/effectPresets";

const ThreeKvTopologyScene = lazy(() =>
  import("./components/ThreeKvTopologyScene").then((module) => ({
    default: module.ThreeKvTopologyScene,
  })),
);

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

const MARQUEE_ITEMS = [
  "OpenAI API",
  "vLLM",
  "TensorRT-LLM",
  "Hugging Face TGI",
  "CUDA",
  "ROCm",
  "Kubernetes",
  "AWS",
  "GCP",
  "CoreWeave",
  "Bare metal",
];

const METRICS = [
  {
    value: "2.4",
    unit: "×",
    label: "Effective throughput",
    note: "Example optimized run at 128 concurrent requests.",
  },
  {
    value: "38",
    unit: "%",
    label: "KV memory reclaimed",
    note: "Active batch cycle at a 128k context window.",
  },
  {
    value: "128",
    unit: "k",
    label: "Token context",
    note: "Configurable model length without re-architecture.",
  },
  {
    value: "1",
    unit: "line",
    label: "API change",
    note: "Keep the OpenAI-compatible client you already ship.",
  },
];

const RUNTIME_LAYERS = [
  {
    index: "01",
    title: "Your application",
    detail: "Existing requests and business logic",
    label: "APP",
  },
  {
    index: "02",
    title: "DeepInference runtime",
    detail: "Prefill, KV-cache, scheduling, and compiled kernels",
    label: "OPTIMIZE",
    accent: true,
  },
  {
    index: "03",
    title: "Model & serving layer",
    detail: "Your weights, parallelism, and OpenAI-compatible API",
    label: "MODEL",
  },
  {
    index: "04",
    title: "Your GPU infrastructure",
    detail: "Linux, CUDA / ROCm, cloud VPC, or bare metal",
    label: "HARDWARE",
  },
];

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
    tag: "CUSTOM CUDA / ROCM KERNELS",
  },
];

const STUDIES = [
  {
    title: "Arc study",
    subtitle: "Workload shaping",
    preset: MINIMAL_PRESETS.arc,
    label: "Three-dimensional arc study representing workload distribution",
  },
  {
    title: "Twist tower",
    subtitle: "Coordinated execution",
    preset: MINIMAL_PRESETS.twist,
    label: "Three-dimensional twisted tower representing coordinated kernel execution",
  },
  {
    title: "Dot relief",
    subtitle: "Telemetry density",
    preset: MINIMAL_PRESETS.dot,
    label: "Three-dimensional dot relief representing workload telemetry",
  },
  {
    title: "Corner rhythm",
    subtitle: "Modular deployment",
    preset: MINIMAL_PRESETS.corner,
    label: "Architectural corner rhythm representing modular cluster deployment",
  },
  {
    title: "Fold fan",
    subtitle: "Reclaimed capacity",
    preset: MINIMAL_PRESETS.fold,
    label: "Three-dimensional folded fan representing untapped cluster capacity",
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
  const [kvBudgetPct, setKvBudgetPct] = useState(25);
  const [gqaGroupSize, setGqaGroupSize] = useState(6);
  const [temperature, setTemperature] = useState(0.85);
  const [contextK, setContextK] = useState(128);
  const [isFullViewport, setIsFullViewport] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const simResult = useMemo(
    () => simulatePageEntroKV({ gqaGroupSize, kvBudgetPct, temperature, contextK }),
    [gqaGroupSize, kvBudgetPct, temperature, contextK],
  );

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    document.body.classList.toggle("is-locked", isFullViewport);
    return () => document.body.classList.remove("is-locked");
  }, [isFullViewport]);

  useEffect(() => {
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (progress) progress.style.transform = `scaleX(${ratio})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

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
      <div className="scroll-progress" aria-hidden="true" />
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
              DeepInference is a drop-in runtime for distributed LLM serving. Remove wasted
              prefill work, reclaim GPU memory, and keep the OpenAI-compatible API your
              application already speaks.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href={CONTACT_URL}>
                Request a cluster benchmark
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#runtime">
                Explore the runtime
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <ul className="hero__assurances" aria-label="Platform highlights">
              <li><Check size={15} aria-hidden="true" />OpenAI-compatible</li>
              <li><Check size={15} aria-hidden="true" />VPC &amp; on-prem</li>
              <li><Check size={15} aria-hidden="true" />CUDA &amp; ROCm</li>
            </ul>
          </div>

          <div className="hero__instrument-wrap">
            <div className="hero__chip hero__chip--a">
              <strong>2.4×</strong>
              <span>Effective throughput</span>
            </div>
            <div className="hero__chip hero__chip--b">
              <strong>38%</strong>
              <span>KV memory reclaimed</span>
            </div>
            <OpticalHero />
          </div>
        </section>

        <div className="marquee" aria-label="Supported infrastructure">
          <div className="marquee__track">
            {[0, 1].map((group) => (
              <div
                className="marquee__group"
                key={group}
                aria-hidden={group === 1 ? true : undefined}
              >
                {MARQUEE_ITEMS.map((item) => (
                  <span className="marquee__item" key={item} translate="no">{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="metrics shell" aria-label="Platform metrics">
          {METRICS.map((metric) => (
            <article className="metric" key={metric.label}>
              <strong className="metric__value">
                {metric.value}
                <small>{metric.unit}</small>
              </strong>
              <span className="metric__label">{metric.label}</span>
              <span className="metric__note">{metric.note}</span>
            </article>
          ))}
        </div>

        <section id="runtime" className="section section--dark" aria-labelledby="runtime-title">
          <div className="shell">
            <div className="section-head reveal">
              <div className="section-head__title">
                <p className="eyebrow">
                  <span className="eyebrow__index">01</span>
                  The runtime
                </p>
                <h2 id="runtime-title">One runtime. <em>Every layer</em> working together.</h2>
              </div>
              <div className="section-head__body">
                <p>
                  DeepInference sits between your model weights and Linux, CUDA, or ROCm
                  execution. Prefill, cache, and kernel dispatch are optimized as one system
                  instead of three separate bottlenecks.
                </p>
                <p>
                  The die view is a live model of the KV page table. Switch eviction policies,
                  separate the stack, and orbit the assembly.
                </p>
              </div>
            </div>

            <div className="runtime-grid">
              <div className="arch">
                {RUNTIME_LAYERS.map((layer) => (
                  <div
                    className={`arch__layer${layer.accent ? " arch__layer--accent" : ""}`}
                    key={layer.index}
                  >
                    <span>{layer.index}</span>
                    <div>
                      <strong>{layer.title}</strong>
                      <small>{layer.detail}</small>
                    </div>
                    <span className="arch__label">{layer.label}</span>
                  </div>
                ))}
                <p className="arch__note">
                  <LockKeyhole size={16} aria-hidden="true" />
                  Your models and data stay inside your deployment boundary.
                </p>
              </div>

              <div className="lab">
                <div className="lab__stage">
                  <Suspense
                    fallback={
                      <div className="lab__loading" role="status">
                        Loading the HBM3e die model…
                      </div>
                    }
                  >
                    <ThreeKvTopologyScene
                      simResult={simResult}
                      kvBudgetPct={kvBudgetPct}
                      onKvBudgetChange={setKvBudgetPct}
                      isFullViewport={isFullViewport}
                      onToggleFullViewport={() => setIsFullViewport((value) => !value)}
                    />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="runtime-features reveal">
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

        <section id="simulator" className="section section--tinted" aria-labelledby="simulator-title">
          <div className="shell">
            <div className="section-head reveal">
              <div className="section-head__title">
                <p className="eyebrow">
                  <span className="eyebrow__index">02</span>
                  Inside the cache
                </p>
                <h2 id="simulator-title">See what <em>survives</em> the budget.</h2>
              </div>
              <div className="section-head__body">
                <p>
                  A working model of Page-EntroKV. Adjust the GQA group ratio, page budget,
                  temperature, and context window. The page tables and the die above update
                  with you.
                </p>
                <p>
                  The comparison is intentionally physical: 64 pages, 16 tokens per page, and
                  two eviction policies competing for the same memory.
                </p>
              </div>
            </div>

            <div className="sim-shell reveal">
              <div className="sim-shell__topbar">
                <div>
                  <span className="mono-label">PAGE-ENTROKV / INTERACTIVE MODEL</span>
                  <p>64 physical pages · B=16 tokens per page</p>
                </div>
                <div className="sim-shell__stats">
                  <div className="sim-shell__stat">
                    <span>Union ratio</span>
                    <strong>{simResult.naiveUor.toFixed(2)}×</strong>
                  </div>
                  <div className="sim-shell__stat">
                    <span>KV footprint</span>
                    <strong>{simResult.pageEntroGib} GiB</strong>
                  </div>
                  <div className="sim-shell__stat">
                    <span>Reclaimed</span>
                    <strong>{simResult.memorySavedGib} GiB</strong>
                  </div>
                </div>
              </div>

              <InteractivePageEntroSimulator
                simResult={simResult}
                gqaGroupSize={gqaGroupSize}
                onGqaGroupChange={setGqaGroupSize}
                kvBudgetPct={kvBudgetPct}
                onKvBudgetChange={setKvBudgetPct}
                temperature={temperature}
                onTemperatureChange={setTemperature}
                contextK={contextK}
                onContextKChange={setContextK}
              />
            </div>

            <div className="sim-quote reveal">
              <div>
                <blockquote>
                  Head-independent top-k keeps the union of every head&apos;s guesses.
                  Group pooling keeps the pages that matter.
                </blockquote>
                <cite>Page-EntroKV / research note</cite>
              </div>
              <div className="sim-quote__stats">
                <div>
                  <strong>1.00×</strong>
                  <span>Page-EntroKV UOR</span>
                </div>
                <div>
                  <strong>{simResult.jaccardDisagreement.toFixed(2)}</strong>
                  <span>Jaccard disagreement</span>
                </div>
                <div>
                  <strong>{(simResult.meanDilutionFactor * 100).toFixed(1)}%</strong>
                  <span>Mean-pool signal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="studies" className="section section--paper" aria-labelledby="studies-title">
          <div className="shell">
            <div className="section-head reveal">
              <div className="section-head__title">
                <p className="eyebrow">
                  <span className="eyebrow__index">03</span>
                  Field studies
                </p>
                <h2 id="studies-title">Five forms. <em>One system.</em></h2>
              </div>
              <div className="section-head__body">
                <p>
                  The same geometry that shapes the runtime—arcs, folds, relief, and
                  rhythm—becomes a visual language for the work inside the cluster.
                </p>
                <p>
                  Each study is a live canvas, not a still illustration. Hover to bring the
                  material forward.
                </p>
              </div>
            </div>

            <div className="studies">
              {STUDIES.map((study, index) => (
                <article
                  className="study reveal"
                  key={study.title}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <EffectCanvas
                    moduleName="minimal"
                    preset={study.preset}
                    label={study.label}
                    decorative
                  />
                  <div className="study__caption">
                    <div>
                      <strong>{study.title}</strong>
                      <span>{study.subtitle}</span>
                    </div>
                    <span className="study__index">0{index + 1}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="performance" className="section section--paper" aria-labelledby="performance-title">
          <div className="shell">
            <div className="section-head reveal">
              <div className="section-head__title">
                <p className="eyebrow">
                  <span className="eyebrow__index">04</span>
                  Performance
                </p>
                <h2 id="performance-title">Benchmark the workload <em>you actually run.</em></h2>
              </div>
              <div className="section-head__body">
                <p>
                  See time to first token, concurrent throughput, and memory reclamation under
                  your real context lengths and traffic shape. Then compare the same run, on
                  the same hardware, with DeepInference enabled.
                </p>
              </div>
            </div>

            <div className="reveal">
              <BenchmarkDashboard />
            </div>

            <div className="audit-card reveal">
              <div className="audit-card__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.dot}
                  label="Three-dimensional dot relief representing workload telemetry"
                  decorative
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
            <div className="section-head reveal">
              <div className="section-head__title">
                <p className="eyebrow">
                  <span className="eyebrow__index">05</span>
                  Deployment
                </p>
                <h2 id="deployment-title">Your infrastructure. <em>Your terms.</em></h2>
              </div>
              <div className="section-head__body">
                <p>
                  Deploy inside your security boundary, pay from measured savings, use a
                  managed control plane, or embed the runtime into your own silicon stack.
                </p>
              </div>
            </div>

            <div className="deployment-overview reveal">
              <div className="deployment-overview__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.corner}
                  label="Architectural corner rhythm representing modular cluster deployment"
                  decorative
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

            <div className="deployment-table-wrapper reveal">
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
            <p className="deployment-note">
              Final pricing depends on cluster size, support requirements, and integration scope.
            </p>
          </div>
        </section>

        <section id="developers" className="section section--dark" aria-labelledby="developers-title">
          <div className="shell developer-layout">
            <div className="developer-copy reveal">
              <p className="eyebrow">
                <span className="eyebrow__index">06</span>
                Developers
              </p>
              <h2 id="developers-title">Change the endpoint. <em>Keep the application.</em></h2>
              <p>
                Start the optimized serving engine with your existing model weights, then point
                your OpenAI-compatible client at the new runtime.
              </p>
              <ul className="developer-benefits">
                <li>
                  <Server size={18} aria-hidden="true" />
                  <span><strong>Drop-in serving</strong> across distributed GPU nodes</span>
                </li>
                <li>
                  <Layers3 size={18} aria-hidden="true" />
                  <span><strong>Long-context ready</strong> with configurable model length</span>
                </li>
                <li>
                  <Gauge size={18} aria-hidden="true" />
                  <span><strong>Observable by default</strong> for repeatable performance audits</span>
                </li>
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

            <div className="quickstart reveal">
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
                  {copyStatus === "copied"
                    ? "Quick-start commands copied to clipboard."
                    : copyStatus === "failed"
                      ? "Unable to copy. Select the commands manually."
                      : ""}
                </span>
              </div>
              <div className="api-card">
                <div>
                  <span className="mono-label">OPENAI-COMPATIBLE API</span>
                  <span className="api-card__status"><i />READY</span>
                </div>
                <code><span>base_url</span> = <strong>&quot;http://localhost:8000/v1&quot;</strong></code>
                <p>One endpoint change. No application rewrite.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--paper cta-section" aria-labelledby="cta-title">
          <div className="shell">
            <div className="cta-card reveal">
              <div className="cta-card__content">
                <p className="eyebrow">Start with your own hardware</p>
                <h2 id="cta-title">Find the capacity <em>hiding</em> in your cluster.</h2>
                <p>
                  Running production inference at scale? Get a private benchmark on your models
                  and hardware, with the configuration and raw results included.
                </p>
                <a className="button button--primary" href={CONTACT_URL}>
                  Request a private benchmark
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <span className="cta-card__note">
                  Built for teams with significant distributed inference spend.
                </span>
              </div>
              <div className="cta-card__visual">
                <EffectCanvas
                  moduleName="minimal"
                  preset={MINIMAL_PRESETS.fold}
                  label="Three-dimensional folded fan representing untapped cluster capacity"
                  decorative
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
              <a href="#simulator">Simulator</a>
              <a href="#studies">Field studies</a>
            </div>
            <div>
              <span className="mono-label">PLATFORM</span>
              <a href="#performance">Performance</a>
              <a href="#deployment">Deployment</a>
              <a href="#developers">Developers</a>
            </div>
            <div>
              <span className="mono-label">CONNECT</span>
              <a href="mailto:iambruce0012@gmail.com">Contact engineering</a>
              <a href="https://github.com/bruce12-glitch/DeepInference" target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight size={12} aria-hidden="true" />
              </a>
              <a href="https://github.com/bruce12-glitch/PageEntro-KV" target="_blank" rel="noopener noreferrer">
                Research <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="shell site-footer__bottom">
          <span>© {new Date().getFullYear()} DeepInference</span>
          <span>Infrastructure that does more with what you have.</span>
        </div>
        <div className="footer__wordmark" aria-hidden="true">DEEPINFERENCE</div>
      </footer>
    </div>
  );
}
