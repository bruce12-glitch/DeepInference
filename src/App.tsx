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
import { InferenceField } from "./components/InferenceField";
import { OptimizationExplorer } from "./components/OptimizationExplorer";
import { ContactDialog } from "./components/ContactDialog";

const SOLUTIONS = [
  {
    title: "Model builders",
    tag: "FROM WEIGHTS TO WORKLOADS",
    description:
      "Bring ambitious models closer to production. Find the memory and execution constraints that stand between capability and scale.",
    topic: "Model deployment",
    icon: Cpu,
    art: "model",
  },
  {
    title: "AI platforms",
    tag: "EVERY REQUEST ADDS UP",
    description:
      "Build a better serving layer for the applications depending on you. Balance response time, concurrency, and infrastructure cost.",
    topic: "Serving infrastructure",
    icon: Workflow,
    art: "platform",
  },
  {
    title: "Enterprise AI",
    tag: "YOUR STACK. YOUR PRIORITIES.",
    description:
      "Make demanding AI workloads practical on your infrastructure, with an optimization plan shaped around your deployment constraints.",
    topic: "Enterprise inference",
    icon: Layers3,
    art: "enterprise",
  },
];
const STEPS = [
  {
    title: "Understand the workload.",
    description:
      "Start with your models, context lengths, traffic patterns, and latency targets. Identify where the system spends its time and memory.",
    deliverable: "Workload profile & baseline",
  },
  {
    title: "Find the right intervention.",
    description:
      "Evaluate cache management, prefill, scheduling, and execution changes against the bottleneck. Keep output quality in the comparison.",
    deliverable: "Optimization plan & matched evaluation",
  },
  {
    title: "Prove it on your stack.",
    description:
      "Compare the same workload on the same hardware. Review the tradeoffs with your team and agree on an integration path.",
    deliverable: "Results, tradeoffs & rollout plan",
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
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">
              <span className="small-cross" aria-hidden="true">
                ✳
              </span>{" "}
              The inference optimization company
            </p>
            <h1 id="hero-title">
              Make every
              <br />
              <em>GPU count.</em>
            </h1>
            <p className="hero__lede">
              Intelligence is moving fast.
              <br className="desktop-break" /> The infrastructure should keep
              up.
            </p>
            <p className="hero__description">
              We help AI teams rethink the cost of inference. Less wasted
              compute. Better use of memory. More room for what comes next.
            </p>
            <div className="hero__actions">
              <button
                className="button button--primary"
                onClick={() => openContact()}
              >
                Let’s talk inference{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <a className="text-link" href="#platform">
                Explore our approach <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <InferenceField />
          <div className="hero__footnote">
            <span>LESS OVERHEAD. MORE POSSIBILITY.</span>
            <span>
              Built for the teams building AI{" "}
              <ArrowDown size={13} aria-hidden="true" />
            </span>
          </div>
        </section>
        <div className="principles-band">
          <div className="shell principles-band__inner">
            <p>
              A better balance,
              <br />
              <strong>at every layer.</strong>
            </p>
            <span>
              <span className="principle-mark" aria-hidden="true">
                ↗
              </span>{" "}
              Lower latency
            </span>
            <span>
              <span className="principle-mark" aria-hidden="true">
                ▧
              </span>{" "}
              Smarter memory
            </span>
            <span>
              <span className="principle-mark" aria-hidden="true">
                ⤴
              </span>{" "}
              Greater capacity
            </span>
          </div>
        </div>
        <section
          className="section shell"
          id="platform"
          aria-labelledby="platform-title"
        >
          <div className="section-heading">
            <p className="eyebrow">01 / The opportunity</p>
            <div className="section-heading__row">
              <h2 id="platform-title">
                Good models deserve
                <br />
                <em>better infrastructure.</em>
              </h2>
              <p>
                Inference is a system of tradeoffs. We work where model behavior
                meets the realities of memory, compute, and production traffic.
              </p>
            </div>
          </div>
          <OptimizationExplorer />
        </section>
        <section
          className="section solutions-section"
          id="solutions"
          aria-labelledby="solutions-title"
        >
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">02 / Built for your ambition</p>
              <div className="section-heading__row">
                <h2 id="solutions-title">
                  Different teams.
                  <br />
                  <em>The same need to do more.</em>
                </h2>
                <p>
                  From a model’s first deployment to a platform’s next million
                  requests, efficiency changes what becomes possible.
                </p>
              </div>
            </div>
            <div className="solutions-grid">
              {SOLUTIONS.map((solution, index) => (
                <article
                  className={`solution solution--${solution.art}`}
                  key={solution.title}
                >
                  <div className="solution__top">
                    <span className="mono">0{index + 1}</span>
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
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i} style={{ "--i": i } as CSSProperties} />
                    ))}
                  </div>
                  <p className="eyebrow">{solution.tag}</p>
                  <h3>{solution.title}</h3>
                  <p className="solution__description">
                    {solution.description}
                  </p>
                  <button
                    className="text-link"
                    onClick={() => openContact(solution.topic)}
                  >
                    Let’s work together{" "}
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
            <p className="eyebrow">03 / Engineering, with evidence</p>
            <div className="section-heading__row">
              <h2 id="approach-title">
                Your workload.
                <br />
                <em>Our starting point.</em>
              </h2>
              <p>
                An optimization only matters if it helps the system you actually
                run. We start with the constraint, then measure the change.
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
          <div className="measurement-strip">
            <span className="mono">WHAT WE LOOK AT</span>
            <span>Time to first token</span>
            <span>Tokens per second</span>
            <span>Memory footprint</span>
            <span>Output quality</span>
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
              <span className="mono">RESOURCEFUL BY DESIGN</span>
            </div>
            <div className="company-copy">
              <p className="eyebrow">A belief behind the engineering</p>
              <h2 id="company-title">
                The next leap in AI
                <br />
                shouldn’t require
                <br />
                <em>the next GPU cluster.</em>
              </h2>
              <p>
                We’re building DeepInference around a simple conviction: there
                is more possibility in the infrastructure we already have.
              </p>
              <p>
                We work on the systems behind inference: how context uses
                memory, how requests share compute, and where time is lost
                between the two.
              </p>
              <button
                className="text-link"
                onClick={() => openContact("Meet DeepInference")}
              >
                Meet your next engineering partner{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
        <section
          className="section shell faq-layout"
          aria-labelledby="faq-title"
        >
          <div>
            <p className="eyebrow">A few things, answered</p>
            <h2 id="faq-title">
              Let’s get
              <br /> <em>into the details.</em>
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
              <p className="eyebrow">The next step is a conversation</p>
              <h2 id="contact-title">
                What could your
                <br />
                <em>infrastructure do better?</em>
              </h2>
              <p>
                Bring us your hardest inference problem.
                <br />
                Let’s see where better engineering can take it.
              </p>
              <button
                className="button button--primary"
                onClick={() => openContact()}
              >
                Start a conversation{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
            <span className="contact-panel__note mono">
              MODELS. MEMORY. MORE POSSIBILITY.
            </span>
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
              More intelligence.
              <br />
              Less overhead.
            </p>
          </div>
          <div className="footer__links">
            <div>
              <span className="eyebrow">Explore</span>
              <a href="#platform">Our focus</a>
              <a href="#solutions">Who we work with</a>
              <a href="#approach">Our approach</a>
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
          <span>Every bit of compute matters.</span>
        </div>
      </footer>
      <ContactDialog dialogRef={dialogRef} topic={contactTopic} />
    </div>
  );
}
