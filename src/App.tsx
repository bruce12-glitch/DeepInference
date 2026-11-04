import { useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Cpu,
  Layers3,
  Workflow,
} from "lucide-react";
import { Brand } from "./components/Brand";
import { SiteHeader } from "./components/SiteHeader";
import { RuntimeAtlas } from "./components/RuntimeAtlas";
import { CacheLab } from "./components/CacheLab";
import { ServingStudy } from "./components/ServingStudy";
import { ContactDialog } from "./components/ContactDialog";

const SOLUTIONS = [
  {
    title: "Faster responses",
    tag: "Latency optimization",
    description:
      "Find where requests wait, then tune prompt processing and scheduling to improve response times at your target load.",
    topic: "Latency optimization",
    action: "Discuss response times",
    icon: Cpu,
    art: "model",
  },
  {
    title: "More serving capacity",
    tag: "Throughput optimization",
    description:
      "Tune batching and execution to serve more requests on your existing GPUs while meeting your latency targets.",
    topic: "Throughput optimization",
    action: "Discuss serving capacity",
    icon: Workflow,
    art: "platform",
  },
  {
    title: "Room for longer context",
    tag: "GPU memory optimization",
    description:
      "Reduce cache pressure so your deployment can handle longer prompts or more concurrent sessions. Measure the effect on output quality as you go.",
    topic: "GPU memory optimization",
    action: "Discuss memory constraints",
    icon: Layers3,
    art: "enterprise",
  },
] as const;
const STEPS = [
  {
    title: "Scope your deployment",
    description:
      "Share your models, hardware, traffic patterns, and performance goals. We agree on what to measure and profile your current deployment.",
    deliverable: "Performance baseline",
  },
  {
    title: "Run a focused pilot",
    description:
      "Test changes aimed at your bottleneck on the same hardware with the same workload. Compare serving performance and output quality against the baseline.",
    deliverable: "Measured results and tradeoffs",
  },
  {
    title: "Plan the rollout",
    description:
      "Review the results with your engineering team and decide which changes to adopt. Map out integration and what to monitor in production.",
    deliverable: "Integration and monitoring plan",
  },
];
const FAQS = [
  {
    question: "Who is DeepInference for?",
    answer:
      "AI companies, model builders, and infrastructure teams operating demanding inference workloads. A useful first conversation starts with the model you serve, the hardware you use, and the constraint you want to change.",
  },
  {
    question: "Do we need to replace our serving stack?",
    answer:
      "The starting point is your existing stack. We scope changes after reviewing your serving engine, model architecture, hardware, and operational requirements. Integration requirements are part of that assessment.",
  },
  {
    question: "How do you evaluate an optimization?",
    answer:
      "We propose a matched comparison: the same model, hardware, precision, request mix, and concurrency. The evaluation should track latency, throughput, memory use, and output quality together. Success criteria are agreed before a pilot.",
  },
  {
    question: "Can we work within our own infrastructure?",
    answer:
      "Tell us about your VPC, on-premise environment, and data access requirements when we scope the work. The deployment boundary, access, and telemetry requirements are agreed before any evaluation.",
  },
];

export default function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [contactTopic, setContactTopic] = useState("Inference optimization");
  const openContact = (topic = "Inference optimization") => {
    setContactTopic(topic);
    dialogRef.current?.showModal();
  };
  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader onContact={() => openContact()} />
      <main id="main-content" tabIndex={-1}>
        <section
          className="hero system-hero shell"
          aria-labelledby="hero-title"
        >
          <div className="hero__copy">
            <p className="eyebrow system-kicker">
              <span aria-hidden="true" /> Inference optimization for AI teams
            </p>
            <h1 id="hero-title">
              Make every
              <br />
              <em>GPU count.</em>
            </h1>
            <p className="hero__description">
              DeepInference helps AI companies serve models faster, fit more
              context in memory, and get more capacity from the GPUs they
              already run.
            </p>
            <div className="hero__actions">
              <button
                className="button button--primary"
                onClick={() => openContact()}
              >
                Talk to the team{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <a className="text-link" href="#solutions">
                Explore solutions <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <RuntimeAtlas />
        </section>

        <section
          className="section solutions-section"
          id="solutions"
          aria-labelledby="solutions-title"
        >
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Solutions</p>
              <div className="section-heading__row">
                <h2 id="solutions-title">
                  Better performance on
                  <br /> <em>your serving stack.</em>
                </h2>
                <p>
                  For model builders, AI platforms, and enterprise teams running
                  inference in production. Start with the constraint that limits
                  your deployment today.
                </p>
              </div>
            </div>
            <div className="solutions-grid">
              {SOLUTIONS.map((solution) => (
                <article
                  className={`solution solution--${solution.art}`}
                  key={solution.title}
                >
                  <div className="solution__top">
                    <span className="eyebrow">{solution.tag}</span>
                    <solution.icon
                      size={21}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={`solution-art solution-art--${solution.art}`}
                    aria-hidden="true"
                  >
                    <ServingStudy kind={solution.art} />
                  </div>
                  <h3>{solution.title}</h3>
                  <p className="solution__description">
                    {solution.description}
                  </p>
                  <button
                    className="text-link"
                    onClick={() => openContact(solution.topic)}
                  >
                    {solution.action}{" "}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="section shell approach"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="section-heading">
            <p className="eyebrow">How we work</p>
            <div className="section-heading__row">
              <h2 id="approach-title">
                From bottleneck
                <br /> <em>to rollout.</em>
              </h2>
              <p>
                Work with DeepInference to define a success metric, test the
                changes on your stack, and decide what belongs in production.
              </p>
            </div>
          </div>
          <div className="steps">
            {STEPS.map((step, index) => (
              <article className="step" key={step.title}>
                <span className="step__number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="step__deliverable">
                  <Check size={15} aria-hidden="true" />
                  {step.deliverable}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="company-section"
          id="company"
          aria-labelledby="company-title"
        >
          <div className="shell company-layout">
            <div className="company-art" aria-hidden="true">
              <svg viewBox="0 0 320 320">
                <g fill="none" stroke="currentColor" strokeWidth="1.25">
                  {Array.from({ length: 21 }, (_, i) => (
                    <ellipse
                      key={i}
                      cx="160"
                      cy="160"
                      rx={32 + i * 5.4}
                      ry={124 - i * 4.1}
                      transform={`rotate(${i * 5 - 50} 160 160)`}
                    />
                  ))}
                </g>
                <circle cx="160" cy="160" r="7" fill="currentColor" />
              </svg>
            </div>
            <div className="company-copy">
              <p className="eyebrow">Company</p>
              <h2 id="company-title">
                Meet DeepInference.
              </h2>
              <p>
                We’re an inference optimization company for AI teams. We work
                with the people who build and operate model serving systems to
                make production inference faster and more efficient.
              </p>
              <p>
                We start with the models, hardware, and infrastructure you
                already use. Your team gets a clear view of what limits
                performance and which changes are worth deploying.
              </p>
              <button
                className="button button--primary company-copy__cta"
                onClick={() => openContact("An inference pilot")}
              >
                Talk to the team <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
        <section
          className="section shell faq-layout"
          aria-labelledby="faq-title"
        >
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title">
              Before we
              <br /> <em>work together.</em>
            </h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq) => (
              <details className="faq" key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={19} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          className="shell resource-section"
          id="platform"
          aria-labelledby="platform-title"
        >
          <details className="resource-disclosure">
            <summary>
              <span className="resource-disclosure__copy">
                <span className="eyebrow">Engineering resource</span>
                <span id="platform-title">KV cache calculator</span>
                <span>Estimate GPU memory for your model and workload.</span>
              </span>
              <ChevronDown size={22} aria-hidden="true" />
            </summary>
            <div className="resource-disclosure__body">
              <CacheLab />
            </div>
          </details>
        </section>
        <section
          className="contact-section shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-panel">
            <div className="contact-panel__art" aria-hidden="true">
              {Array.from({ length: 22 }, (_, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
            <div className="contact-panel__copy">
              <p className="eyebrow">Get in touch</p>
              <h2 id="contact-title">
                Let’s talk about
                <br /> <em>your deployment.</em>
              </h2>
              <p>
                Tell us what you’re serving, what it runs on, and where you
                want to improve. We’ll start there.
              </p>
              <button
                className="button button--primary"
                onClick={() => openContact()}
              >
                Start a conversation{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer shell">
        <div className="footer__main">
          <div>
            <a href="#top" aria-label="DeepInference home">
              <Brand />
            </a>
            <p>
              Inference optimization for AI teams.
            </p>
          </div>
          <div className="footer__links">
            <div>
              <span className="eyebrow">Explore</span>
              <a href="#solutions">Solutions</a>
              <a href="#approach">How we work</a>
              <a href="#company">Company</a>
              <a href="#platform">KV cache calculator</a>
            </div>
            <div>
              <span className="eyebrow">Get in touch</span>
              <button onClick={() => openContact()}>
                Talk to the team <ArrowUpRight size={14} aria-hidden="true" />
              </button>
              <a href="mailto:iambruce0012@gmail.com">
                Email us <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/bruce12-glitch/DeepInference"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} DeepInference</span>
          <a href="#top">
            Back to top{" "}
            <ArrowRight size={13} className="arrow-up" aria-hidden="true" />
          </a>
        </div>
      </footer>
      <ContactDialog dialogRef={dialogRef} topic={contactTopic} />
    </div>
  );
}
