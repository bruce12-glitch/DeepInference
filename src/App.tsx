/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import {
  EXPERIMENT_2_SINK_MASQUERADE,
  EXPERIMENT_3_NIAH_SWEEP,
  EXPERIMENT_5_LONGBENCH,
  EXPERIMENT_S4_PAGE_FILL,
  MASTER_12_TOKENS,
  simulatePageEntroKV,
} from "./data/deepInferenceData";
import { ThreeKvTopologyScene } from "./components/ThreeKvTopologyScene";
import { InteractivePageEntroSimulator } from "./components/InteractivePageEntroSimulator";
import { GeminiResearchStudio } from "./components/GeminiResearchStudio";
import { BlueprintCrosshair } from "./components/TelemetryIcons";

export default function App() {
  // Default to r = 6 (Qwen2.5-1.5B-Instruct pilot: L=28, H_Q=12, H_KV=2, r=6)
  const [gqaGroupSize, setGqaGroupSize] = useState<number>(6);
  const [kvBudgetPct, setKvBudgetPct] = useState<number>(25);
  const [temperature, setTemperature] = useState<number>(0.45);
  const [contextK, setContextK] = useState<number>(64);
  const [isFullViewport3D, setIsFullViewport3D] = useState<boolean>(false);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  const simResult = useMemo(
    () =>
      simulatePageEntroKV({
        gqaGroupSize,
        kvBudgetPct,
        temperature,
        contextK,
      }),
    [gqaGroupSize, kvBudgetPct, temperature, contextK]
  );

  const bibtexEntry = `@article{inbasekaran2026pageentrokv,
  title   = {Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention},
  author  = {Inbasekaran, S.},
  journal = {Department of Computer Science and Engineering, SRM Institute of Science and Technology},
  year    = {2026},
  url     = {https://github.com/bruce12-glitch/PageEntro-KV}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard?.writeText(bibtexEntry);
    setCopiedBibtex(true);
    window.setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#E3DACC] selection:text-[#141413]">
      {/* =====================================================================
          TOP EDITORIAL HEADER BAR (Solid #FAF9F5, 1px #D1CFC5 Hairline, Left-Aligned Grid)
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5] border-b border-[#D1CFC5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#monograph-top"
              className="flex items-center gap-2.5 text-left whitespace-nowrap"
            >
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D97757] inline-block shrink-0" />
              <span className="font-semibold tracking-[-0.025em] text-[15px] text-[#141413]">
                DeepInference
              </span>
              <span className="text-[#D1CFC5]">/</span>
              <span className="type-utility-mono text-[#5E5D59] whitespace-nowrap">
                Page-EntroKV
              </span>
            </a>
          </div>

          <nav
            aria-label="Monograph sections"
            className="hidden xl:flex items-center gap-5 type-utility text-[#5E5D59] shrink-0"
          >
            <a
              href="#sec-formulation"
              className="hover:text-[#141413] transition-colors whitespace-nowrap"
            >
              01 · Bounds & Theory
            </a>
            <a
              href="#sec-topology"
              className="hover:text-[#141413] transition-colors whitespace-nowrap"
            >
              02 · 3D HBM3e & Page Table
            </a>
            <a
              href="#sec-pilot-logs"
              className="hover:text-[#141413] transition-colors whitespace-nowrap"
            >
              03 · Empirical Pilot Logs
            </a>
            <a
              href="#sec-gemini-lab"
              className="hover:text-[#141413] transition-colors whitespace-nowrap"
            >
              04 · Verification Lab
            </a>
            <a
              href="#sec-reproducibility"
              className="hover:text-[#141413] transition-colors whitespace-nowrap"
            >
              05 · Reproducibility
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://github.com/bruce12-glitch/PageEntro-KV"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[8px] border border-[#D1CFC5] bg-[#F0EEE6] hover:bg-[#E3DACC] type-utility-mono text-[#141413] transition-colors whitespace-nowrap"
            >
              PageEntro-KV ↗
            </a>
            <a
              href="https://github.com/bruce12-glitch/DeepInference"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-[8px] bg-[#141413] text-[#FAF9F5] hover:bg-[#D97757] hover:text-[#141413] type-utility-mono transition-colors whitespace-nowrap"
            >
              DeepInference ↗
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================================
          HERO MONOGRAPH MASTHEAD (Strict 12-Column Left-Aligned Anthropic Layout)
         ===================================================================== */}
      <main id="monograph-top" className="max-w-[1400px] mx-auto px-6 md:px-10">
        <section className="py-14 md:py-20 border-b border-[#D1CFC5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (Cols 1–4): Author, Affiliation, Pilot Hardware & Integrity Metadata */}
            <div className="lg:col-span-4 space-y-6 text-left lg:border-r lg:border-[#D1CFC5] lg:pr-8">
              <div className="space-y-1.5">
                <div className="type-utility-mono uppercase text-[#D97757]">
                  RESEARCH MONOGRAPH · SYSTEMS & GQA INFERENCE
                </div>
                <div className="type-utility text-[#5E5D59]">
                  Hardware-Aligned KV-Cache Eviction
                </div>
              </div>

              <div className="pt-4 border-t border-[#D1CFC5] space-y-2">
                <div className="type-utility-mono text-[#5E5D59] uppercase">
                  AUTHOR & AFFILIATION
                </div>
                <div className="text-base font-medium text-[#141413] tracking-[-0.02em]">
                  Inbasekaran S.
                </div>
                <div className="text-xs text-[#5E5D59] leading-relaxed">
                  Department of Computer Science and Engineering
                  <br />
                  SRM Institute of Science and Technology, India
                </div>
                <div className="type-utility-mono text-[#141413] pt-0.5">
                  iambruce0012@gmail.com
                </div>
              </div>

              <div className="pt-4 border-t border-[#D1CFC5] space-y-2.5">
                <div className="type-utility-mono text-[#5E5D59] uppercase">
                  PILOT MODEL & TENSOR GEOMETRY
                </div>
                <dl className="grid grid-cols-2 gap-y-2 gap-x-4 type-utility">
                  <dt className="text-[#5E5D59]">Backbone</dt>
                  <dd className="font-mono-tabular text-[#141413] text-right">
                    Qwen2.5-1.5B-Instruct
                  </dd>
                  <dt className="text-[#5E5D59]">Layers / Heads</dt>
                  <dd className="font-mono-tabular text-[#141413] text-right">
                    L=28, H_Q=12, H_KV=2
                  </dd>
                  <dt className="text-[#5E5D59]">GQA Group Ratio</dt>
                  <dd className="font-mono-tabular text-[#141413] text-right">
                    r = H_Q / H_KV = 6
                  </dd>
                  <dt className="text-[#5E5D59]">Page Block Size</dt>
                  <dd className="font-mono-tabular text-[#141413] text-right">
                    B = 16 tokens/page
                  </dd>
                  <dt className="text-[#5E5D59]">Physical Tensor</dt>
                  <dd className="font-mono-tabular text-[#141413] text-right">
                    [N_blocks, H_KV, B, D]
                  </dd>
                </dl>
              </div>

              <div className="p-4 rounded-[10px] bg-[#F0EEE6] border border-[#D1CFC5] space-y-1.5">
                <div className="type-utility-mono text-[#141413] uppercase">
                  Artifact Verification Rule
                </div>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Every equation, table cell, and disclosure on this page maps
                  1:1 to{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    paper/main.tex
                  </span>{" "}
                  and{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    artifacts/logs/*.csv
                  </span>{" "}
                  in{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    bruce12-glitch/PageEntro-KV
                  </span>
                  . Empty log cells and harness non-completions are explicitly
                  disclosed and excluded rather than zeroed.
                </p>
              </div>
            </div>

            {/* Right Column (Cols 5–12): Editorial Display Title, Abstract & Verbatim Summary Metrics */}
            <div className="lg:col-span-8 space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#F0EEE6] border border-[#D1CFC5] type-utility-mono text-[#141413]">
                  <span>PHYSICAL PAGEDATTENTION ALIGNMENT</span>
                  <span className="text-[#D1CFC5]">·</span>
                  <span>UOR ≡ 1.00 BY CONSTRUCTION</span>
                </div>

                <h1 className="type-display-hero text-[#141413]">
                  Page-EntroKV:{" "}
                  <span className="font-editorial-serif">
                    Hardware-Aligned, Entropy-Weighted
                  </span>{" "}
                  KV-Cache Eviction under Grouped-Query Attention
                </h1>
              </div>

              <div className="space-y-4 text-[17px] leading-[1.62] text-[#141413] max-w-[68ch]">
                <p>
                  Modern LLM serving engines such as vLLM store the key-value
                  cache in physical PagedAttention tensors of shape{" "}
                  <code className="font-mono-tabular text-[15px] bg-[#F0EEE6] px-1.5 py-0.5 rounded border border-[#D1CFC5]">
                    [N_blocks, H_KV, B, D_head]
                  </code>
                  , where{" "}
                  <span className="font-mono-tabular">r = H_Q / H_KV</span>{" "}
                  query heads share a single physical KV head group and{" "}
                  <span className="font-mono-tabular">B = 16</span> contiguous
                  token slots form an indivisible hardware page.
                </p>
                <p className="text-[#5E5D59] text-[16px]">
                  Existing eviction algorithms violate this physical layout in
                  two ways: (1){" "}
                  <strong className="text-[#141413] font-medium">
                    head-independent top-k selection
                  </strong>{" "}
                  chooses different token subsets per query head, forcing the
                  shared KV buffer to retain their union{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    ∪_h S_h
                  </span>{" "}
                  and inflating physical memory by the{" "}
                  <strong className="text-[#141413] font-medium">
                    Union Over-Retrieval Ratio (UOR &gt; 1)
                  </strong>
                  ; (2){" "}
                  <strong className="text-[#141413] font-medium">
                    uniform mean pooling
                  </strong>{" "}
                  across the group dilutes a sharp specialist retrieval head’s
                  attention spike by{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    (1 - ε) / r
                  </span>{" "}
                  when the remaining <span className="font-mono-tabular">r - 1</span>{" "}
                  heads are diffuse.
                </p>
                <p className="text-[#5E5D59] text-[16px]">
                  <strong className="text-[#141413] font-medium">
                    Page-EntroKV
                  </strong>{" "}
                  resolves both mismatches by computing{" "}
                  <strong className="text-[#141413] font-medium">
                    sink-isolated Rényi-2 collision entropy
                  </strong>{" "}
                  on each query head, weighting heads via a Boltzmann distribution{" "}
                  <span className="font-mono-tabular text-[#141413]">
                    w_l,h = softmax(-H₂^sink / τ_g)
                  </span>{" "}
                  before selection, and lifting pooled token scores to{" "}
                  <span className="font-mono-tabular text-[#141413]">B = 16</span>{" "}
                  physical pages via block-max pooling.
                </p>
              </div>

              {/* 4-Cell Verbatim Architectural Summary Strip */}
              <div className="exposed-grid-light grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-5 bg-[#F0EEE6] text-left space-y-1.5">
                  <div className="type-utility-mono text-[#5E5D59]">
                    EXACT r=2 IDENTITY
                  </div>
                  <div className="font-mono-tabular text-xl font-semibold text-[#141413]">
                    2 / (2 - d_J)
                  </div>
                  <p className="type-utility text-[#5E5D59]">
                    Closed-form UOR as a function of Jaccard disagreement d_J
                  </p>
                </div>

                <div className="p-5 bg-[#F0EEE6] text-left space-y-1.5">
                  <div className="type-utility-mono text-[#5E5D59]">
                    MEAN-POOL DILUTION
                  </div>
                  <div className="font-mono-tabular text-xl font-semibold text-[#141413]">
                    (1 - ε) / r
                  </div>
                  <p className="type-utility text-[#5E5D59]">
                    6× specialist attenuation at r=6; 0/9 NIAH recall under mean pool
                  </p>
                </div>

                <div className="p-5 bg-[#F0EEE6] text-left space-y-1.5">
                  <div className="type-utility-mono text-[#5E5D59]">
                    NIAH PASSKEY SWEEP
                  </div>
                  <div className="font-mono-tabular text-xl font-semibold text-[#788C5D]">
                    9 / 9 (1.00)
                  </div>
                  <p className="type-utility text-[#5E5D59]">
                    Page-EntroKV recall across T ∈ {"{958, 1474, 1990}"} × 3 depths
                  </p>
                </div>

                <div className="p-5 bg-[#F0EEE6] text-left space-y-1.5">
                  <div className="type-utility-mono text-[#5E5D59]">
                    B=16 SLOT-0 MASS
                  </div>
                  <div className="font-mono-tabular text-xl font-semibold text-[#D97757]">
                    14.37%
                  </div>
                  <p className="type-utility text-[#5E5D59]">
                    2.30× uniform (6.25%) at page boundary slot 0 (experiment_s4)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 01: STRUCTURAL BOUNDS & MATHEMATICAL FORMULATION
            (Strict 12-Column Left-Aligned Monograph Grid)
           ===================================================================== */}
        <section
          id="sec-formulation"
          className="py-16 md:py-20 border-b border-[#D1CFC5]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Rail (Cols 1–4) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <div className="type-utility-mono text-[#D97757] uppercase">
                01 · FORMALISM & STRUCTURAL BOUNDS
              </div>
              <h2 className="type-heading-xl text-[#141413]">
                Why GQA & PagedAttention Break Naive Eviction
              </h2>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Derived in{" "}
                <span className="font-mono-tabular text-[#141413]">
                  paper/main.tex
                </span>{" "}
                and verified numerically in{" "}
                <span className="font-mono-tabular text-[#141413]">
                  artifacts/logs/experiment_1_structural_bounds_real.csv
                </span>
                .
              </p>
              <div className="p-4 rounded-[10px] bg-[#F0EEE6] border border-[#D1CFC5] space-y-2">
                <div className="type-utility-mono text-[#141413] uppercase">
                  Three Structural Guarantees
                </div>
                <ul className="space-y-1.5 text-xs text-[#5E5D59] leading-relaxed">
                  <li>
                    <strong className="text-[#141413]">1. Pre-Selection Consensus:</strong>{" "}
                    Pooling head scores before top-k guarantees{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      UOR = 1.00
                    </span>
                    .
                  </li>
                  <li>
                    <strong className="text-[#141413]">2. Sink Suppression:</strong>{" "}
                    Diffuse head weight decays polynomially as{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      N^(-1/τ_g)
                    </span>
                    .
                  </li>
                  <li>
                    <strong className="text-[#141413]">3. Block-Max Lifting:</strong>{" "}
                    Preserves single-token passkeys inside{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      B = 16
                    </span>{" "}
                    physical pages.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Content (Cols 5–12) */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="exposed-grid-light grid-cols-1 md:grid-cols-2">
                {/* Card 1: Exact r=2 UOR Identity & General-r Sandwich Bound */}
                <div className="p-6 bg-[#FAF9F5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="type-utility-mono text-[#D97757]">
                      PROPOSITION 1 · UNION OVER-RETRIEVAL
                    </span>
                    <span className="badge-telemetry badge-telemetry--warning">
                      experiment_1
                    </span>
                  </div>
                  <h3 className="type-heading-md text-[#141413]">
                    Exact r=2 Identity & General-r Sandwich Bound
                  </h3>
                  <p className="text-sm text-[#5E5D59] leading-relaxed">
                    When each query head <span className="font-mono-tabular">h ∈ g</span>{" "}
                    independently selects <span className="font-mono-tabular">|S_h| = k</span>{" "}
                    pages, the shared KV head must retain{" "}
                    <span className="font-mono-tabular">∪_{"{h=1..r}"} S_h</span>.
                    For <span className="font-mono-tabular">r = 2</span> with
                    Jaccard distance{" "}
                    <span className="font-mono-tabular">
                      d_J = 1 - |S₁ ∩ S₂| / |S₁ ∪ S₂|
                    </span>
                    :
                  </p>
                  <div className="p-3.5 rounded-[8px] bg-[#F0EEE6] border border-[#D1CFC5] font-mono-tabular text-xs text-[#141413] space-y-1.5">
                    <div>r = 2 Exact Identity:</div>
                    <div className="text-sm font-semibold">
                      UOR(S₁, S₂) = |S₁ ∪ S₂| / k = 2 / (2 - d_Jaccard)
                    </div>
                    <div className="pt-1 text-[#5E5D59]">
                      General r ≥ 2 Sandwich Bound:
                    </div>
                    <div>
                      1 + (1/r) ∑_{"{h=2..r}"} d_{"{1,h}"} ≤ UOR ≤ min(r, N/k, 1 + ∑_{"{h=2..r}"} d_{"{1,h}"})
                    </div>
                  </div>
                </div>

                {/* Card 2: Sink-Isolated Rényi-2 Collision Entropy */}
                <div className="p-6 bg-[#FAF9F5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="type-utility-mono text-[#788C5D]">
                      DEFINITION 2 · SINK ISOLATION
                    </span>
                    <span className="badge-telemetry badge-telemetry--optimal">
                      O(N) Exact
                    </span>
                  </div>
                  <h3 className="type-heading-md text-[#141413]">
                    Sink-Isolated Rényi-2 Collision Entropy
                  </h3>
                  <p className="text-sm text-[#5E5D59] leading-relaxed">
                    Initial sink tokens <span className="font-mono-tabular">S_sink = {"{0, ..., s-1}"}</span>{" "}
                    absorb disproportionate attention mass on diffuse heads,
                    allowing them to masquerade as low-entropy heads. Isolating{" "}
                    <span className="font-mono-tabular">S_sink</span> and
                    renormalizing over contextual tokens{" "}
                    <span className="font-mono-tabular">t ≥ s</span> yields:
                  </p>
                  <div className="p-3.5 rounded-[8px] bg-[#F0EEE6] border border-[#D1CFC5] font-mono-tabular text-xs text-[#141413] space-y-1.5">
                    <div>Ã_l,h(t) = A_l,h(t) / (∑_{"{u ≥ s}"} A_l,h(u) + ε)</div>
                    <div className="text-sm font-semibold">
                      H₂^sink(A_l,h) = -ln ∑_{"{t ≥ s}"} (Ã_l,h(t))²
                    </div>
                    <div className="pt-1 text-[#5E5D59]">
                      Boltzmann Group Weighting:
                    </div>
                    <div>
                      w_l,h = exp(-H₂^sink / τ_g) / ∑_{"{j ∈ g}"} exp(-H₂^sink(A_l,j) / τ_g)
                    </div>
                  </div>
                </div>

                {/* Card 3: Sink-Suppression Power-Law Decay */}
                <div className="p-6 bg-[#FAF9F5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="type-utility-mono text-[#D97757]">
                      PROPOSITION 2 · SINK SUPPRESSION
                    </span>
                    <span className="badge-telemetry badge-telemetry--active">
                      N^(-1/τ_g)
                    </span>
                  </div>
                  <h3 className="type-heading-md text-[#141413]">
                    Polynomial Suppression of Diffuse Heads
                  </h3>
                  <p className="text-sm text-[#5E5D59] leading-relaxed">
                    A diffuse head spreading post-sink attention uniformly over{" "}
                    <span className="font-mono-tabular">N</span> tokens has{" "}
                    <span className="font-mono-tabular">H₂^sink = ln N</span>,
                    whereas a specialist head focusing mass on{" "}
                    <span className="font-mono-tabular">m ≪ N</span> tokens has{" "}
                    <span className="font-mono-tabular">H₂^sink = ln m</span>.
                    Under Boltzmann weighting:
                  </p>
                  <div className="p-3.5 rounded-[8px] bg-[#F0EEE6] border border-[#D1CFC5] font-mono-tabular text-xs text-[#141413] space-y-1.5">
                    <div className="text-sm font-semibold">
                      w_diffuse / w_specialist = exp(-(ln N - ln m) / τ_g) = (m / N)^(1 / τ_g)
                    </div>
                    <div className="text-[#5E5D59]">
                      As context N grows, diffuse head interference decays at
                      rate O(N^(-1/τ_g)) without manual head pruning thresholds.
                    </div>
                  </div>
                </div>

                {/* Card 4: Hardware-Aligned B=16 Block-Max Page Mapping */}
                <div className="p-6 bg-[#FAF9F5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="type-utility-mono text-[#788C5D]">
                      DEFINITION 3 · PAGEDATTENTION LIFTING
                    </span>
                    <span className="badge-telemetry badge-telemetry--optimal">
                      B = 16 Slots
                    </span>
                  </div>
                  <h3 className="type-heading-md text-[#141413]">
                    Intra-Page Block-Max Score Aggregation
                  </h3>
                  <p className="text-sm text-[#5E5D59] leading-relaxed">
                    Because PagedAttention allocates and evicts whole blocks of{" "}
                    <span className="font-mono-tabular">B = 16</span> tokens,
                    averaging across a 16-token page dilutes a single needle
                    token by <span className="font-mono-tabular">1/16</span>.
                    Page-EntroKV scores physical page{" "}
                    <span className="font-mono-tabular">P_b</span> via block-max
                    pooling:
                  </p>
                  <div className="p-3.5 rounded-[8px] bg-[#F0EEE6] border border-[#D1CFC5] font-mono-tabular text-xs text-[#141413] space-y-1.5">
                    <div>A^pooled_l,g(t) = ∑_{"{h ∈ g}"} w_l,h · A_l,h(t)</div>
                    <div className="text-sm font-semibold">
                      I_l,g(P_b) = max_{"{t ∈ P_b}"} A^pooled_l,g(t)
                    </div>
                    <div className="text-[#5E5D59]">
                      Retains top-k whole pages P_b per KV group g, preserving
                      contiguous HBM coalescing and UOR ≡ 1.00.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 02: INTERACTIVE GQA PAGE-TABLE WORKBENCH & 3D HBM3e TOPOLOGY
           ===================================================================== */}
        <section
          id="sec-topology"
          className="py-16 md:py-20 border-b border-[#D1CFC5] space-y-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-2">
              <div className="type-utility-mono text-[#D97757] uppercase">
                02 · INTERACTIVE HARDWARE TOPOLOGY
              </div>
              <h2 className="type-heading-xl text-[#141413]">
                HBM3e PagedAttention Bank & Group Pooling Simulator
              </h2>
            </div>
            <div className="lg:col-span-8 text-left">
              <p className="text-sm text-[#5E5D59] leading-relaxed max-w-[68ch]">
                Inspect how pre-selection Rényi-2 pooling eliminates Union
                Over-Retrieval across 64 physical PagedAttention blocks (
                <span className="font-mono-tabular text-[#141413]">B = 16</span>{" "}
                tokens/page). Both the 2D page-table matrix and the 3D HBM3e
                silicon die below are driven by the same deterministic Boltzmann
                weights seeded from{" "}
                <span className="font-mono-tabular text-[#141413]">
                  experiment_2_sink_masquerade.csv
                </span>{" "}
                and{" "}
                <span className="font-mono-tabular text-[#141413]">
                  experiment_s4_page_fill.csv
                </span>
                .
              </p>
            </div>
          </div>

          {/* 2D Interactive Page-Table Simulator */}
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

          {/* 3D WebGL HBM3e GQA Die Inspector */}
          <div className="space-y-3 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="type-utility-mono text-[#5E5D59]">
                FIG 2.2 · THREE.JS PBR HARDWARE TOPOLOGY ([N_blocks=64, H_KV=2, B=16, D_head])
              </div>
              <div className="type-utility text-[#5E5D59]">
                Drag to orbit · Scroll to zoom · Press{" "}
                <kbd className="font-mono-tabular px-1.5 py-0.5 rounded bg-[#F0EEE6] border border-[#D1CFC5] text-[#141413]">
                  H
                </kbd>{" "}
                to collapse HUD dock
              </div>
            </div>

            <ThreeKvTopologyScene
              simResult={simResult}
              kvBudgetPct={kvBudgetPct}
              onKvBudgetChange={setKvBudgetPct}
              gqaGroupSize={gqaGroupSize}
              onGqaGroupChange={setGqaGroupSize}
              isFullViewport={isFullViewport3D}
              onToggleFullViewport={() =>
                setIsFullViewport3D((prev) => !prev)
              }
            />
          </div>
        </section>

        {/* =====================================================================
            SECTION 03: VERBATIM EMPIRICAL PILOT LOGS (Qwen2.5-1.5B-Instruct)
            (All 4 Empirical CSV Tables + Integrity Rules Disclosure)
           ===================================================================== */}
        <section
          id="sec-pilot-logs"
          className="py-16 md:py-20 border-b border-[#D1CFC5] space-y-16"
        >
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="type-utility-mono text-[#D97757] uppercase">
                03 · VERBATIM EMPIRICAL LOGS
              </div>
              <h2 className="type-heading-xl text-[#141413]">
                Pilot Evaluation on Qwen2.5-1.5B-Instruct
              </h2>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                All tables below reproduce the exact numbers committed to{" "}
                <span className="font-mono-tabular text-[#141413]">
                  artifacts/logs/*.csv
                </span>{" "}
                in{" "}
                <span className="font-mono-tabular text-[#141413]">
                  bruce12-glitch/PageEntro-KV
                </span>
                .
              </p>
            </div>

            <div className="lg:col-span-8 text-left space-y-4">
              <div className="p-5 rounded-[12px] bg-[#F0EEE6] border border-[#D1CFC5] space-y-2">
                <div className="type-utility-mono text-[#141413] uppercase">
                  Repository Integrity Rules (Quoted from README.md & paper/main.tex)
                </div>
                <p className="text-sm text-[#5E5D59] leading-relaxed">
                  “Claims follow tables. Aggregates are recomputable. Empty cells
                  are excluded, not zeroed. Faulted LongBench subsets are
                  excluded, not reported as 0.00 accuracy. No 2240-row,
                  tau/alpha, strict-retention or PUR numbers are claimed because
                  no such rows exist in the supplied logs.”
                </p>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              EXPERIMENT 2: Layer-0 Sink Masquerade & Head Dispersion Census
             ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="type-utility-mono text-[#5E5D59]">
                ARTIFACT 1 · experiment_2_sink_masquerade.csv
              </div>
              <h3 className="type-heading-md text-[#141413]">
                Layer-0 Query-Head Rényi-2 Dispersion Census
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Evaluates all 12 query heads in Layer 0 of{" "}
                <span className="font-mono-tabular text-[#141413]">
                  Qwen2.5-1.5B-Instruct
                </span>{" "}
                (<span className="font-mono-tabular text-[#141413]">H_Q=12, H_KV=2, r=6</span>).
                In Layer 0, initial sink mass is minimal (
                <span className="font-mono-tabular text-[#141413]">
                  &lt; 0.7%
                </span>
                , so{" "}
                <span className="font-mono-tabular text-[#141413]">
                  |H₂^raw - H₂^isolated| &lt; 0.02 nats
                </span>
                ), while contextual dispersion already separates sharp
                specialist heads (Heads 5, 6, 10 at{" "}
                <span className="font-mono-tabular text-[#141413]">
                  3.38–3.49 nats
                </span>
                ) from diffuse heads (Heads 0, 4, 9 at{" "}
                <span className="font-mono-tabular text-[#141413]">
                  4.03–4.47 nats
                </span>
                ).
              </p>
              <div className="type-utility text-[#5E5D59] p-3 rounded-[8px] bg-[#F0EEE6] border border-[#D1CFC5]">
                <strong className="text-[#141413]">Disclosure:</strong> Heads 1
                and 3 are empty in{" "}
                <span className="font-mono-tabular text-[#141413]">
                  experiment_2_sink_masquerade.csv
                </span>{" "}
                and are explicitly marked as excluded rather than zero-filled.
              </div>
            </div>

            <div className="lg:col-span-8 overflow-x-auto">
              <div className="border border-[#D1CFC5] rounded-[12px] overflow-hidden bg-[#FAF9F5]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F0EEE6] border-b border-[#D1CFC5] type-utility-mono text-[#5E5D59]">
                      <th className="py-3 px-4">Layer</th>
                      <th className="py-3 px-4">Q-Head</th>
                      <th className="py-3 px-4">KV Group</th>
                      <th className="py-3 px-4 text-right">Sink Mass</th>
                      <th className="py-3 px-4 text-right">H₂ Raw (nats)</th>
                      <th className="py-3 px-4 text-right">H₂ Isolated (nats)</th>
                      <th className="py-3 px-4 text-right">Δ (nats)</th>
                      <th className="py-3 px-4">Empirical Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D1CFC5] text-xs">
                    {EXPERIMENT_2_SINK_MASQUERADE.map((row) => {
                      const isExcluded = row.h2Isolated === null;
                      return (
                        <tr
                          key={row.head}
                          className={
                            isExcluded
                              ? "bg-[#F0EEE6]/60 text-[#5E5D59]"
                              : "hover:bg-[#F0EEE6]/50"
                          }
                        >
                          <td className="py-2.5 px-4 font-mono-tabular">
                            {row.layer}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular font-medium text-[#141413]">
                            Head {row.head}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular">
                            g = {row.group}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular text-right">
                            {row.sinkMass !== null
                              ? row.sinkMass.toFixed(6)
                              : "—"}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular text-right">
                            {row.h2Raw !== null ? row.h2Raw.toFixed(6) : "—"}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular text-right font-semibold text-[#141413]">
                            {row.h2Isolated !== null
                              ? row.h2Isolated.toFixed(6)
                              : "—"}
                          </td>
                          <td className="py-2.5 px-4 font-mono-tabular text-right">
                            {row.deltaNats !== null
                              ? row.deltaNats.toFixed(6)
                              : "—"}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={
                                isExcluded
                                  ? "type-utility text-[#5E5D59]"
                                  : row.h2Isolated! < 3.5
                                  ? "badge-telemetry badge-telemetry--optimal"
                                  : "type-utility text-[#141413]"
                              }
                            >
                              {row.headType}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              EXPERIMENT 3 & EXPERIMENT S4 SIDE-BY-SIDE (12-Column Aligned)
             ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-4">
              <div className="type-utility-mono text-[#5E5D59]">
                ARTIFACTS 2 & 3 · experiment_3 & experiment_s4
              </div>
              <h3 className="type-heading-md text-[#141413]">
                Passkey NIAH Recall & Intra-Page Slot Occupancy
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                <strong className="text-[#141413]">Experiment 3 (NIAH):</strong>{" "}
                Tests pooled token selection across 9 configurations (
                <span className="font-mono-tabular text-[#141413]">
                  T ∈ {"{958, 1474, 1990}"}
                </span>{" "}
                tokens × needle depths{" "}
                <span className="font-mono-tabular text-[#141413]">
                  {"{20%, 50%, 80%}"}
                </span>
                ). Uniform mean pooling fails on all 9 runs (
                <span className="font-mono-tabular text-[#141413]">0.0</span>)
                due to <span className="font-mono-tabular">1/r</span> dilution,
                whereas Page-EntroKV recovers the exact passkey in all 9 runs (
                <span className="font-mono-tabular text-[#141413]">1.0</span>).
              </p>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                <strong className="text-[#141413]">
                  Experiment S4 (B=16 Page Fill):
                </strong>{" "}
                Measures relative attention share across the 16 intra-page token
                offsets. Slot 0 captures{" "}
                <span className="font-mono-tabular text-[#141413]">14.37%</span>{" "}
                (2.30× the{" "}
                <span className="font-mono-tabular text-[#141413]">6.25%</span>{" "}
                uniform baseline), slot 8 captures{" "}
                <span className="font-mono-tabular text-[#141413]">8.96%</span>,
                and slot 10 captures{" "}
                <span className="font-mono-tabular text-[#141413]">7.69%</span>,
                directly motivating{" "}
                <span className="font-mono-tabular text-[#141413]">
                  max_{"{t ∈ P_b}"}
                </span>{" "}
                block-max aggregation.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experiment 3 Table */}
              <div className="border border-[#D1CFC5] rounded-[12px] overflow-hidden bg-[#FAF9F5] flex flex-col justify-between">
                <div>
                  <div className="p-4 bg-[#F0EEE6] border-b border-[#D1CFC5] flex items-center justify-between">
                    <span className="type-utility-mono text-[#141413]">
                      experiment_3_niah_summary.csv
                    </span>
                    <span className="badge-telemetry badge-telemetry--optimal">
                      9 / 9 Recall
                    </span>
                  </div>
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#D1CFC5] bg-[#FAF9F5] type-utility-mono text-[#5E5D59]">
                        <th className="py-2.5 px-4">Context T</th>
                        <th className="py-2.5 px-4 text-right">Depth</th>
                        <th className="py-2.5 px-4 text-right">Page-EntroKV</th>
                        <th className="py-2.5 px-4 text-right">Mean Pool</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D1CFC5] text-xs font-mono-tabular">
                      {EXPERIMENT_3_NIAH_SWEEP.map((r, i) => (
                        <tr key={i} className="hover:bg-[#F0EEE6]/50">
                          <td className="py-2.5 px-4 text-[#141413]">
                            {r.contextT} tok
                          </td>
                          <td className="py-2.5 px-4 text-right text-[#5E5D59]">
                            {r.depthPct}%
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-[#788C5D]">
                            {r.pageEntroKvRecall.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-4 text-right text-[#D4883A]">
                            {r.meanPoolingRecall.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-[#F0EEE6] border-t border-[#D1CFC5] type-utility text-[#5E5D59]">
                  Aggregate Recall: Page-EntroKV ={" "}
                  <span className="font-mono-tabular text-[#141413] font-semibold">
                    1.00 (9/9)
                  </span>{" "}
                  vs. Uniform Mean Pooling ={" "}
                  <span className="font-mono-tabular text-[#141413] font-semibold">
                    0.00 (0/9)
                  </span>
                </div>
              </div>

              {/* Experiment S4 Table */}
              <div className="border border-[#D1CFC5] rounded-[12px] overflow-hidden bg-[#FAF9F5]">
                <div className="p-4 bg-[#F0EEE6] border-b border-[#D1CFC5] flex items-center justify-between">
                  <span className="type-utility-mono text-[#141413]">
                    experiment_s4_page_fill.csv (B=16)
                  </span>
                  <span className="type-utility-mono text-[#5E5D59]">
                    Uniform = 6.25%
                  </span>
                </div>
                <div className="p-4 space-y-2 max-h-[380px] overflow-y-auto">
                  {EXPERIMENT_S4_PAGE_FILL.map((slot) => {
                    const isPeak = slot.relativePct > 7.0;
                    return (
                      <div
                        key={slot.slotOffset}
                        className="grid grid-cols-12 items-center gap-2 text-xs font-mono-tabular"
                      >
                        <div className="col-span-3 text-[#5E5D59]">
                          slot_{slot.slotOffset.toString().padStart(2, "0")}
                        </div>
                        <div className="col-span-6 h-2 rounded-full bg-[#E3DACC] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isPeak ? "bg-[#D97757]" : "bg-[#788C5D]"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (slot.relativePct / 15) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <div
                          className={`col-span-3 text-right ${
                            isPeak
                              ? "font-semibold text-[#141413]"
                              : "text-[#5E5D59]"
                          }`}
                        >
                          {slot.relativePct.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------------------------
              EXPERIMENT 5: LongBench Summary & Harness Non-Completion Disclosure
             ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="type-utility-mono text-[#5E5D59]">
                ARTIFACT 4 · experiment_5_longbench_summary.csv
              </div>
              <h3 className="type-heading-md text-[#141413]">
                LongBench Pilot Subset & Non-Completion Disclosure
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Reports the 4 completed LongBench tasks on{" "}
                <span className="font-mono-tabular text-[#141413]">
                  Qwen2.5-1.5B-Instruct
                </span>{" "}
                alongside the explicit disclosure of 11 tasks that recorded{" "}
                <span className="font-mono-tabular text-[#141413]">0.0</span>{" "}
                due to evaluation harness non-completion and are excluded from
                the aggregate rather than falsified or averaged in as zeroes.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="border border-[#D1CFC5] rounded-[12px] overflow-hidden bg-[#FAF9F5]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F0EEE6] border-b border-[#D1CFC5] type-utility-mono text-[#5E5D59]">
                      <th className="py-3 px-4">LongBench Task</th>
                      <th className="py-3 px-4">Evaluation Domain</th>
                      <th className="py-3 px-4 text-right">Primary Score</th>
                      <th className="py-3 px-4">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D1CFC5] text-xs">
                    {EXPERIMENT_5_LONGBENCH.map((item) => (
                      <tr key={item.task} className="hover:bg-[#F0EEE6]/50">
                        <td className="py-3 px-4 font-mono-tabular font-medium text-[#141413]">
                          {item.task}
                        </td>
                        <td className="py-3 px-4 text-[#5E5D59]">
                          {item.domain}
                        </td>
                        <td className="py-3 px-4 font-mono-tabular text-right font-semibold text-[#141413]">
                          {item.score !== null ? item.score.toFixed(2) : "Excluded"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={
                              item.score !== null
                                ? "badge-telemetry badge-telemetry--optimal"
                                : "badge-telemetry badge-telemetry--warning"
                            }
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 04: SERVER-SIDE GEMINI RESEARCH & VERIFICATION LAB
           ===================================================================== */}
        <section
          id="sec-gemini-lab"
          className="py-16 md:py-20 border-b border-[#D1CFC5] space-y-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-2">
              <div className="type-utility-mono text-[#D97757] uppercase">
                04 · INTERACTIVE VERIFICATION SUITE
              </div>
              <h2 className="type-heading-xl text-[#141413]">
                Symbolic Proof, Search Grounding & Diagram Synthesis
              </h2>
            </div>
            <div className="lg:col-span-8 text-left">
              <p className="text-sm text-[#5E5D59] leading-relaxed max-w-[68ch]">
                Verify the closed-form UOR identities and Rényi-2 sink
                suppression bounds using server-side{" "}
                <span className="font-mono-tabular text-[#141413]">
                  gemini-4-argon
                </span>{" "}
                (<span className="font-mono-tabular text-[#141413]">ThinkingLevel.HIGH</span>),
                query live vLLM PagedAttention documentation via{" "}
                <span className="font-mono-tabular text-[#141413]">
                  gemini-3.8-flash
                </span>{" "}
                search grounding, or synthesize custom architectural figures.
              </p>
            </div>
          </div>

          <GeminiResearchStudio
            gqaGroupSize={gqaGroupSize}
            kvBudgetPct={kvBudgetPct}
            temperature={temperature}
          />
        </section>

        {/* =====================================================================
            SECTION 05: REPRODUCIBILITY PROTOCOL, CITATION & 12-TOKEN SYSTEM
           ===================================================================== */}
        <section
          id="sec-reproducibility"
          className="py-16 md:py-20 space-y-16"
        >
          {/* Reproducibility & BibTeX */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="type-utility-mono text-[#D97757] uppercase">
                05 · REPRODUCIBILITY & CITATION
              </div>
              <h2 className="type-heading-xl text-[#141413]">
                Artifact Layout & Build Verification
              </h2>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Clone{" "}
                <span className="font-mono-tabular text-[#141413]">
                  bruce12-glitch/PageEntro-KV
                </span>{" "}
                to inspect the raw CSV logs, audit scripts, and{" "}
                <span className="font-mono-tabular text-[#141413]">
                  paper/main.tex
                </span>{" "}
                manuscript source.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Repo Tree & Commands */}
              <div className="card-dark-terminal space-y-3">
                <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-2.5">
                  <span className="type-utility-mono text-[#A6A49B]">
                    REPOSITORY TREE & BUILD
                  </span>
                  <span className="type-utility-mono text-[#788C5D]">
                    VERIFIED
                  </span>
                </div>
                <pre className="font-mono-tabular text-xs text-[#FAF9F5] leading-relaxed overflow-x-auto">
{`PageEntro-KV/
├── paper/
│   └── main.tex
├── artifacts/
│   ├── logs/
│   │   ├── experiment_1_structural_bounds_real.csv
│   │   ├── experiment_2_sink_masquerade.csv
│   │   ├── experiment_3_niah_summary.csv
│   │   ├── experiment_s4_page_fill.csv
│   │   └── experiment_5_longbench_summary.csv
│   └── figures/
└── scripts/
    └── generate_figures.py

# Regenerate figures & compile PDF:
python3 scripts/generate_figures.py
cd paper && pdflatex main.tex && pdflatex main.tex`}
                </pre>
              </div>

              {/* BibTeX Citation Card */}
              <div className="card-dark-terminal flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-2.5">
                    <span className="type-utility-mono text-[#A6A49B]">
                      BIBTEX CITATION
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBibtex}
                      className="px-2.5 py-1 rounded-[6px] bg-[#141413] border border-[#2E2E2B] hover:border-[#D97757] type-utility-mono text-[#FAF9F5] transition-colors cursor-pointer"
                    >
                      {copiedBibtex ? "Copied ✓" : "Copy BibTeX"}
                    </button>
                  </div>
                  <pre className="font-mono-tabular text-xs text-[#FAF9F5] whitespace-pre-wrap leading-relaxed">
                    {bibtexEntry}
                  </pre>
                </div>

                <div className="pt-3 border-t border-[#2E2E2B] flex items-center justify-between type-utility-mono text-[#A6A49B]">
                  <span>License: Apache-2.0 / MIT</span>
                  <span>SRM IST · 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* 12-Token Mineral & Telemetry Design System Specification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-12 border-t border-[#D1CFC5]">
            <div className="lg:col-span-4 text-left space-y-3">
              <div className="type-utility-mono text-[#5E5D59] uppercase">
                ARCHITECTURAL COLOR & CONTRAST GUARDRAILS
              </div>
              <h3 className="type-heading-md text-[#141413]">
                DeepInference 12-Token Mineral & Telemetry Palette
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Every surface, hairline border, and telemetry indicator in this
                application is constrained to the verified 12-token specification
                with WCAG AA/AAA contrast guardrails.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="relative">
                <BlueprintCrosshair position="top-left" />
                <BlueprintCrosshair position="top-right" />
                <BlueprintCrosshair position="bottom-left" />
                <BlueprintCrosshair position="bottom-right" />
                <div className="exposed-grid-light grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {MASTER_12_TOKENS.map((t) => (
                    <div
                      key={t.yamlKey}
                      className="p-4 bg-[#FAF9F5] flex flex-col justify-between gap-3 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="type-utility-mono text-[#5E5D59]">
                          {t.yamlKey}
                        </span>
                        <span
                          className="w-5 h-5 rounded-[4px] border border-[#141413]/20 shrink-0"
                          style={{ backgroundColor: t.hex }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#141413]">
                          {t.name}
                        </div>
                        <div className="type-utility-mono text-[#D97757] mt-0.5">
                          {t.hex}
                        </div>
                      </div>
                      <div className="type-utility text-[#5E5D59]">
                        {t.contrastGuardrail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          EDITORIAL FOOTER
         ===================================================================== */}
      <footer className="border-t border-[#D1CFC5] bg-[#F0EEE6] py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 type-utility text-[#5E5D59]">
          <div>
            <span className="text-[#141413] font-medium">DeepInference</span> ·
            Page-EntroKV Research Monograph · Inbasekaran S. (SRM Institute of
            Science and Technology)
          </div>
          <div className="flex items-center gap-6 font-mono-tabular">
            <a
              href="https://github.com/bruce12-glitch/PageEntro-KV"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141413] transition-colors"
            >
              github.com/bruce12-glitch/PageEntro-KV
            </a>
            <a
              href="https://github.com/bruce12-glitch/DeepInference"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#141413] transition-colors"
            >
              github.com/bruce12-glitch/DeepInference
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
