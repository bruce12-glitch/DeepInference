import React, { useState } from "react";
import { GqaSimulationResult } from "../data/deepInferenceData";
import {
  BlueprintCrosshair,
  FragWarningIcon,
  KvOptimalIcon,
  TelemetryPacketIcon,
} from "./TelemetryIcons";

interface InteractivePageEntroSimulatorProps {
  simResult: GqaSimulationResult;
  gqaGroupSize: number;
  onGqaGroupChange: (val: number) => void;
  kvBudgetPct: number;
  onKvBudgetChange: (val: number) => void;
  temperature: number;
  onTemperatureChange: (val: number) => void;
  contextK: number;
  onContextKChange: (val: number) => void;
}

export function InteractivePageEntroSimulator({
  simResult,
  gqaGroupSize,
  onGqaGroupChange,
  kvBudgetPct,
  onKvBudgetChange,
  temperature,
  onTemperatureChange,
  contextK,
  onContextKChange,
}: InteractivePageEntroSimulatorProps) {
  const [selectedPageId, setSelectedPageId] = useState<number>(0);
  const inspectedPage =
    simResult.pageStates.find((p) => p.pageId === selectedPageId) ??
    simResult.pageStates[0];

  const sinkCount = simResult.pageStates.filter(
    (p) => p.pageEntroState === "sink"
  ).length;
  const compressedCount = simResult.pageStates.filter(
    (p) => p.pageEntroState === "compressed"
  ).length;
  const unionBloatCount = simResult.pageStates.filter(
    (p) => p.naiveState === "fragmented-union"
  ).length;

  return (
    <div className="relative">
      <BlueprintCrosshair position="top-left" />
      <BlueprintCrosshair position="top-right" />
      <BlueprintCrosshair position="bottom-left" />
      <BlueprintCrosshair position="bottom-right" />

      {/* Outer Exposed 1px Grid Container */}
      <div className="exposed-grid-light grid-cols-1 lg:grid-cols-12">
        {/* Left Control Column (4 cols) */}
        <div className="lg:col-span-4 p-6 md:p-8 bg-[#F0EEE6] flex flex-col justify-between gap-6 text-left">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="type-utility-mono text-[#5E5D59] uppercase mb-1.5">
                  PHYSICAL TENSOR [N_blocks, H_KV, B=16, D_head]
                </div>
                <h3 className="type-heading-md text-[#141413]">
                  Pre-Selection Rényi-2 Group Pooling Parameters
                </h3>
              </div>
              <TelemetryPacketIcon />
            </div>

            <p className="text-sm text-[#5E5D59] leading-relaxed">
              In Grouped-Query Attention,{" "}
              <span className="font-mono-tabular text-[#141413]">
                r = H_Q / H_KV = {gqaGroupSize}
              </span>{" "}
              query heads share a single physical KV tensor. Head-independent
              top-k eviction forces the engine to retain the union{" "}
              <span className="font-mono-tabular text-[#141413]">
                ∪ S_h
              </span>{" "}
              (<span className="font-mono-tabular text-[#141413]">UOR &gt; 1.0</span>),
              whereas uniform mean pooling dilutes a specialist retrieval head by{" "}
              <span className="font-mono-tabular text-[#141413]">
                (1 - ε)/r = 1/{gqaGroupSize} ({(simResult.meanDilutionFactor * 100).toFixed(1)}%)
              </span>
              .
            </p>

            {/* Control 1: GQA Group Ratio r = H_Q / H_KV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between type-utility">
                <span className="text-[#5E5D59]">
                  GQA Group Ratio (r = H_Q / H_KV)
                </span>
                <span className="font-mono-tabular text-[#141413]">
                  r = {gqaGroupSize} {gqaGroupSize === 6 ? "(Qwen2.5-1.5B Pilot)" : gqaGroupSize === 2 ? "(Exact Identity)" : ""}
                </span>
              </div>
              <div className="grid grid-cols-4 p-1 rounded-[10px] bg-[#FAF9F5] border border-[#D1CFC5] gap-1">
                {[2, 4, 6, 8].map((rVal) => (
                  <button
                    key={rVal}
                    type="button"
                    onClick={() => onGqaGroupChange(rVal)}
                    className={`py-1.5 px-2 rounded-[7px] type-utility-mono transition-colors whitespace-nowrap cursor-pointer ${
                      gqaGroupSize === rVal
                        ? "bg-[#E3DACC] text-[#141413] border border-[#141413]/30 font-semibold"
                        : "text-[#5E5D59] hover:text-[#141413]"
                    }`}
                  >
                    r={rVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Target KV Page Budget */}
            <div className="space-y-2">
              <div className="flex items-center justify-between type-utility">
                <label htmlFor="sim-kv-budget" className="text-[#5E5D59]">
                  Physical Page Budget Fraction (k / N_blocks)
                </label>
                <span className="font-mono-tabular text-[#141413]">
                  {kvBudgetPct}%
                </span>
              </div>
              <input
                id="sim-kv-budget"
                type="range"
                min={10}
                max={50}
                step={5}
                value={kvBudgetPct}
                onChange={(e) => onKvBudgetChange(Number(e.target.value))}
                className="telemetry-slider"
              />
              <div className="flex justify-between type-utility-mono text-[#5E5D59]">
                <span>10% (k=6)</span>
                <span>25% (k=16)</span>
                <span>50% (k=32)</span>
              </div>
            </div>

            {/* Control 3: Sink-Isolated Entropy Temperature tau_g */}
            <div className="space-y-2">
              <div className="flex items-center justify-between type-utility">
                <label htmlFor="sim-temp-slider" className="text-[#5E5D59]">
                  Boltzmann Temperature (τ_g)
                </label>
                <span className="font-mono-tabular text-[#141413]">
                  τ_g = {temperature.toFixed(2)}
                </span>
              </div>
              <input
                id="sim-temp-slider"
                type="range"
                min={0.15}
                max={1.8}
                step={0.05}
                value={temperature}
                onChange={(e) => onTemperatureChange(Number(e.target.value))}
                className="telemetry-slider"
              />
              <div className="flex justify-between type-utility-mono text-[#5E5D59]">
                <span>0.15 (Specialist Lock)</span>
                <span>1.00</span>
                <span>1.80 (Near-Uniform)</span>
              </div>
            </div>

            {/* Control 4: Sequence Context Length */}
            <div className="space-y-2">
              <div className="flex items-center justify-between type-utility">
                <label htmlFor="sim-ctx-slider" className="text-[#5E5D59]">
                  Evaluated Context Window
                </label>
                <span className="font-mono-tabular text-[#141413]">
                  {contextK}K tokens
                </span>
              </div>
              <input
                id="sim-ctx-slider"
                type="range"
                min={32}
                max={256}
                step={32}
                value={contextK}
                onChange={(e) => onContextKChange(Number(e.target.value))}
                className="telemetry-slider"
              />
              <div className="flex justify-between type-utility-mono text-[#5E5D59]">
                <span>32K</span>
                <span>128K</span>
                <span>256K</span>
              </div>
            </div>
          </div>

          {/* Verbatim Mathematical Equation Box from paper/main.tex */}
          <div className="p-4 rounded-[12px] bg-[#FAF9F5] border border-[#D1CFC5] space-y-2 text-left">
            <div className="type-utility text-[#141413] uppercase">
              Formal Equations (paper/main.tex §3)
            </div>
            <div className="font-mono-tabular text-xs text-[#5E5D59] leading-relaxed space-y-1">
              <div>H₂^sink(A_l,h) = -ln ∑_t (Ã_l,h(t))²</div>
              <div>w_l,h = softmax(-H₂^sink(A_l,h) / {temperature.toFixed(2)})</div>
              <div>I_l,g(P_b) = max_{"{t ∈ P_b}"} ∑_{"{h ∈ g}"} w_l,h · A_l,h(t)</div>
            </div>
          </div>
        </div>

        {/* Right Comparison & Page-Table Allocation Matrix (8 cols) */}
        <div className="lg:col-span-8 p-6 md:p-8 bg-[#FAF9F5] flex flex-col justify-between gap-6 text-left">
          {/* Top KPI Comparison Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-elevated">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-telemetry badge-telemetry--optimal">
                  UOR = 1.00× (Pre-Pooled)
                </span>
                <KvOptimalIcon />
              </div>
              <div className="font-mono-tabular text-2xl font-semibold text-[#141413]">
                {sinkCount + compressedCount} / 64 Pages
              </div>
              <div className="type-utility text-[#5E5D59] mt-1">
                Page-EntroKV Retained ({simResult.pageEntroGib} GiB · d_Jaccard ={" "}
                {simResult.jaccardDisagreement})
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-telemetry badge-telemetry--warning">
                  UOR = {simResult.naiveUor}× (Union Bloat)
                </span>
                <FragWarningIcon />
              </div>
              <div className="font-mono-tabular text-2xl font-semibold text-[#141413]">
                {sinkCount + compressedCount + unionBloatCount} / 64 Pages
              </div>
              <div className="type-utility text-[#5E5D59] mt-1">
                Head-Indep Union (+{unionBloatCount} Extra Pages ·{" "}
                {simResult.naiveGib} GiB)
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-telemetry badge-telemetry--active">
                  Dilution = 1/{gqaGroupSize}
                </span>
                <TelemetryPacketIcon />
              </div>
              <div className="font-mono-tabular text-2xl font-semibold text-[#141413]">
                {(simResult.meanDilutionFactor * 100).toFixed(1)}% Signal
              </div>
              <div className="type-utility text-[#5E5D59] mt-1">
                Uniform Mean-Pooling Specialist Attenuation (1-ε)/r
              </div>
            </div>
          </div>

          {/* Dual 64-Page Hardware Page-Table Allocation Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grid A: Page-EntroKV */}
            <div className="p-5 rounded-[14px] bg-[#F0EEE6] border border-[#D1CFC5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="type-heading-md text-base text-[#141413]">
                    Page-EntroKV Physical Page Table
                  </h4>
                  <p className="type-utility text-[#5E5D59]">
                    Pre-selection Rényi-2 group pooling + block-max (B=16)
                  </p>
                </div>
                <span className="type-utility-mono text-[#141413]">
                  UOR = 1.00×
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1.5 pt-1">
                {simResult.pageStates.map((p) => {
                  const isSelected = p.pageId === selectedPageId;
                  let bgClass =
                    "bg-[#E3DACC] border border-dashed border-[#D1CFC5]";
                  if (p.pageEntroState === "sink") {
                    bgClass = "bg-[#D97757] border border-[#141413]/40";
                  } else if (p.pageEntroState === "compressed") {
                    bgClass = "bg-[#788C5D] border border-[#141413]/30";
                  }

                  return (
                    <button
                      key={`pe-${p.pageId}`}
                      type="button"
                      onClick={() => setSelectedPageId(p.pageId)}
                      title={`Page ${p.addressHex} — I_l,g(P_b): ${p.entropyScore} — Slot 0 share: ${p.slot0SharePct}%`}
                      className={`h-7 rounded-[4px] transition-colors cursor-pointer flex items-center justify-center font-mono-tabular text-[10px] ${bgClass} ${
                        isSelected
                          ? "ring-2 ring-[#141413]"
                          : "hover:border-[#141413]"
                      } ${
                        p.pageEntroState === "evicted"
                          ? "text-[#5E5D59]"
                          : "text-[#141413] font-semibold"
                      }`}
                    >
                      {p.pageId}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid B: Naive Head-Independent Top-K */}
            <div className="p-5 rounded-[14px] bg-[#F0EEE6] border border-[#D1CFC5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="type-heading-md text-base text-[#141413]">
                    Head-Independent Top-K Union
                  </h4>
                  <p className="type-utility text-[#5E5D59]">
                    Post-selection union across r={gqaGroupSize} heads
                  </p>
                </div>
                <span className="type-utility-mono text-[#141413]">
                  UOR = {simResult.naiveUor}×
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1.5 pt-1">
                {simResult.pageStates.map((p) => {
                  const isSelected = p.pageId === selectedPageId;
                  let bgClass =
                    "bg-[#E3DACC] border border-dashed border-[#D1CFC5]";
                  if (p.naiveState === "sink") {
                    bgClass = "bg-[#D97757] border border-[#141413]/40";
                  } else if (p.naiveState === "compressed") {
                    bgClass = "bg-[#788C5D] border border-[#141413]/30";
                  } else if (p.naiveState === "fragmented-union") {
                    bgClass = "hatch-fragmented border border-[#D4883A]";
                  }

                  return (
                    <button
                      key={`naive-${p.pageId}`}
                      type="button"
                      onClick={() => setSelectedPageId(p.pageId)}
                      title={`Page ${p.addressHex} — State: ${p.naiveState}`}
                      className={`h-7 rounded-[4px] transition-colors cursor-pointer flex items-center justify-center font-mono-tabular text-[10px] ${bgClass} ${
                        isSelected
                          ? "ring-2 ring-[#141413]"
                          : "hover:border-[#141413]"
                      } ${
                        p.naiveState === "evicted"
                          ? "text-[#5E5D59]"
                          : "text-[#141413] font-semibold"
                      }`}
                    >
                      {p.pageId}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend + Inspected Page Telemetry Strip */}
          <div className="p-4 rounded-[12px] bg-[#F0EEE6] border border-[#D1CFC5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 type-utility text-[#141413]">
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px] bg-[#D97757] border border-[#141413]/30" />
                Protected Boundary / Sink ({sinkCount})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px] bg-[#788C5D] border border-[#141413]/25" />
                Retained KV Page ({compressedCount})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-[2px] hatch-fragmented border border-[#D4883A]" />
                Union Over-Retrieval Bloat (+{unionBloatCount})
              </span>
              <span className="inline-flex items-center gap-2 text-[#5E5D59]">
                <span className="w-3 h-3 rounded-[2px] bg-[#E3DACC] border border-dashed border-[#D1CFC5]" />
                Evicted Page Slot
              </span>
            </div>

            <div className="type-utility-mono text-[#141413] bg-[#FAF9F5] px-3 py-1.5 rounded-[8px] border border-[#D1CFC5] shrink-0">
              {inspectedPage.addressHex} · I_l,g(P_b) ={" "}
              {inspectedPage.entropyScore.toFixed(3)} · State:{" "}
              <span className="font-semibold uppercase">
                {inspectedPage.pageEntroState}
              </span>
            </div>
          </div>

          {/* Verbatim Layer-0 Query Head Rényi-2 Collision Entropy Weights (from experiment_2_sink_masquerade.csv) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between type-utility">
              <span className="text-[#141413]">
                Layer-0 Query-Head Boltzmann Weights w_l,h (Seeded from experiment_2_sink_masquerade.csv)
              </span>
              <span className="text-[#5E5D59] font-mono-tabular">
                ∑ w_l,h = 1.0000 across r={gqaGroupSize} heads
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {simResult.headEntropies.map((h) => (
                <div
                  key={h.headIdx}
                  className="p-2.5 rounded-[10px] bg-[#F0EEE6] border border-[#D1CFC5] flex flex-col justify-between text-left"
                >
                  <div className="flex items-center justify-between type-utility-mono">
                    <span className="text-[#5E5D59]">Head {h.headIdx}</span>
                    <span className="text-[#141413] font-semibold">
                      {(h.weight * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="my-2 w-full h-1.5 rounded-full bg-[#E3DACC] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D97757]"
                      style={{
                        width: `${Math.min(100, Math.max(12, h.weight * gqaGroupSize * 55))}%`,
                      }}
                    />
                  </div>
                  <div className="type-utility-mono text-[10px] text-[#5E5D59]">
                    H₂^sink = {h.renyi2Entropy.toFixed(3)} nats
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
