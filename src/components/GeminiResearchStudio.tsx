import React, { useState } from "react";
import {
  BlueprintCrosshair,
  KvOptimalIcon,
  TelemetryPacketIcon,
} from "./TelemetryIcons";

type StudioTab = "thinking" | "search" | "image" | "video";

const ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
  "21:9",
] as const;

const IMAGE_SIZES = ["1K", "2K", "4K"] as const;

export function GeminiResearchStudio({
  gqaGroupSize,
  kvBudgetPct,
  temperature,
}: {
  gqaGroupSize: number;
  kvBudgetPct: number;
  temperature: number;
}) {
  const [activeTab, setActiveTab] = useState<StudioTab>("thinking");

  // 1. High Thinking State (gemini-4-argon + ThinkingLevel.HIGH)
  const [thinkPrompt, setThinkPrompt] = useState<string>(
    "Derive the exact r=2 identity UOR = 2 / (2 - d_Jaccard) and the general-r two-sided sandwich bound for head-independent KV eviction under Grouped-Query Attention, then show why Page-EntroKV pre-selection Rényi-2 pooling guarantees UOR = 1.00."
  );
  const [thinkLoading, setThinkLoading] = useState<boolean>(false);
  const [thinkResult, setThinkResult] = useState<{
    thoughts: string | null;
    text: string;
    error?: string;
  } | null>(null);

  // 2. Search Grounding State (gemini-3.8-flash + googleSearch)
  const [searchQuery, setSearchQuery] = useState<string>(
    "vLLM PagedAttention physical KV tensor layout [N_blocks, H_KV, B=16, D_head] and Qwen2.5-1.5B-Instruct GQA architecture specifications"
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
    error?: string;
  } | null>(null);

  // 3. Image Generation State (gemini-3-pro-image-preview & gemini-nano-banana-2.1)
  const [imagePrompt, setImagePrompt] = useState<string>(
    "Technical isometric architectural blueprint of a PagedAttention HBM3e KV-cache memory bank with B=16 token slots and r=6 Grouped-Query Attention waveguides in warm terracotta and sage olive on a dark graphite substrate"
  );
  const [imageModel, setImageModel] = useState<
    "gemini-3-pro-image-preview" | "gemini-nano-banana-2.1"
  >("gemini-3-pro-image-preview");
  const [imageSize, setImageSize] = useState<(typeof IMAGE_SIZES)[number]>("2K");
  const [aspectRatio, setAspectRatio] =
    useState<(typeof ASPECT_RATIOS)[number]>("16:9");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageResult, setImageResult] = useState<{
    imageUrl?: string;
    caption?: string;
    error?: string;
  } | null>(null);

  // 4. Video Generation State (gemini-omni-1.1-flash via Interactions API)
  const [videoPrompt, setVideoPrompt] = useState<string>(
    "Technical schematic animation of 6 query heads in a GQA group pooling attention weights via Boltzmann Rényi-2 collision entropy into a shared 16-slot PagedAttention HBM block on dark obsidian."
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<"16:9" | "9:16">(
    "16:9"
  );
  const [videoDuration, setVideoDuration] = useState<"5s" | "10s">("5s");
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [videoResult, setVideoResult] = useState<{
    videoUrl?: string;
    error?: string;
  } | null>(null);

  const handleRunThinking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thinkPrompt.trim()) return;
    setThinkLoading(true);
    setThinkResult(null);
    try {
      const res = await fetch("/api/gemini/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: thinkPrompt,
          contextConfig: { gqaGroupSize, kvBudgetPct, temperature },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThinkResult({
          thoughts: null,
          text: "",
          error: data.error || "Request failed.",
        });
      } else {
        setThinkResult({
          thoughts: data.thoughts,
          text: data.text,
        });
      }
    } catch (err: unknown) {
      setThinkResult({
        thoughts: null,
        text: "",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setThinkLoading(false);
    }
  };

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSearchResult({
          text: "",
          sources: [],
          error: data.error || "Search request failed.",
        });
      } else {
        setSearchResult({
          text: data.text,
          sources: data.sources || [],
        });
      }
    } catch (err: unknown) {
      setSearchResult({
        text: "",
        sources: [],
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    setImageResult(null);
    try {
      const res = await fetch("/api/gemini/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          model: imageModel,
          imageSize,
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImageResult({ error: data.error || "Image synthesis failed." });
      } else {
        setImageResult({
          imageUrl: data.imageUrl,
          caption: data.caption,
        });
      }
    } catch (err: unknown) {
      setImageResult({
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;
    setVideoLoading(true);
    setVideoResult(null);
    try {
      const res = await fetch("/api/gemini/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          duration: videoDuration,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVideoResult({ error: data.error || "Video synthesis failed." });
      } else {
        setVideoResult({ videoUrl: data.videoUrl });
      }
    } catch (err: unknown) {
      setVideoResult({
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="relative">
      <BlueprintCrosshair position="top-left" />
      <BlueprintCrosshair position="top-right" />
      <BlueprintCrosshair position="bottom-left" />
      <BlueprintCrosshair position="bottom-right" />

      <div className="exposed-grid-light grid-cols-1 lg:grid-cols-12">
        {/* Left Navigation & Mode Selector (4 cols) */}
        <div className="lg:col-span-4 p-6 md:p-8 bg-[#F0EEE6] flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono-tabular text-xs text-[#5E5D59] mb-1">
                  04 · SERVER-SIDE GEMINI RESEARCH LAB
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-[#141413]">
                  Multimodal Inference & Synthesis Suite
                </h3>
              </div>
              <KvOptimalIcon />
            </div>

            <p className="text-sm text-[#5E5D59] leading-relaxed">
              Execute deep mathematical proofs with{" "}
              <span className="font-mono-tabular text-[#141413]">
                gemini-4-argon
              </span>{" "}
              (High Thinking), verify live LLM serving benchmarks with Google
              Search Grounding (
              <span className="font-mono-tabular text-[#141413]">
                gemini-3.8-flash
              </span>
              ), or synthesize custom die diagrams & telemetry videos.
            </p>

            {/* Vertical Segmented Mode Switcher */}
            <div className="space-y-2">
              {(
                [
                  [
                    "thinking",
                    "High-Thinking Kernel Architect",
                    "gemini-4-argon · ThinkingLevel.HIGH",
                  ],
                  [
                    "search",
                    "Live Search Grounding Bench",
                    "gemini-3.8-flash · googleSearch",
                  ],
                  [
                    "image",
                    "Studio Die & Wafer Image Synth",
                    "gemini-3-pro-image-preview · 1K/2K/4K",
                  ],
                  [
                    "video",
                    "Text-to-Video Packet Animator",
                    "gemini-omni-1.1-flash · Interactions API",
                  ],
                ] as const
              ).map(([tabId, title, subtitle]) => {
                const isActive = activeTab === tabId;
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setActiveTab(tabId)}
                    className={`w-full text-left p-3.5 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#E3DACC] border-[#141413] text-[#141413]"
                        : "bg-[#FAF9F5] border-[#D1CFC5] text-[#5E5D59] hover:bg-[#E3DACC]/60 hover:text-[#141413]"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-[#141413]">
                        {title}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-[#5E5D59] mt-0.5">
                        {subtitle}
                      </div>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isActive ? "bg-[#D97757]" : "bg-[#D1CFC5]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-[16px] bg-[#FAF9F5] border border-[#D1CFC5] text-xs text-[#5E5D59] space-y-1">
            <div className="font-medium text-[#141413]">
              Active Telemetry Context Injected
            </div>
            <div className="font-mono-tabular">
              GQA Ratio: {gqaGroupSize}:1 · KV Budget: {kvBudgetPct}% · τ_g:{" "}
              {temperature.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Right Active Tool Workspace (8 cols) */}
        <div className="lg:col-span-8 p-6 md:p-8 bg-[#FAF9F5] flex flex-col justify-between">
          {/* TAB 1: HIGH THINKING MODE (gemini-4-argon) */}
          {activeTab === "thinking" && (
            <form onSubmit={handleRunThinking} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-medium text-[#141413]">
                    High-Thinking GQA Proof & Kernel Synthesizer
                  </h4>
                  <p className="text-xs text-[#5E5D59]">
                    Powered by{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      gemini-4-argon
                    </span>{" "}
                    with{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      thinkingLevel: ThinkingLevel.HIGH
                    </span>
                  </p>
                </div>
                <span className="badge-telemetry badge-telemetry--active">
                  ThinkingLevel.HIGH
                </span>
              </div>

              {/* Preset Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Prove UOR = 2 / (2 - d_Jaccard) at r=2 and the general-r sandwich bound",
                  "Derive the sink-suppression power law N^(-1 / tau_g) under Rényi-2 weighting",
                  "Show why uniform mean pooling dilutes a specialist head by (1 - eps) / r",
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setThinkPrompt(sample)}
                    className="px-3 py-1.5 rounded-full type-utility bg-[#F0EEE6] hover:bg-[#E3DACC] border border-[#D1CFC5] text-[#141413] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <div>
                <label
                  htmlFor="think-prompt-input"
                  className="block text-xs font-medium text-[#5E5D59] mb-1.5"
                >
                  Complex Architecture / Mathematical Query
                </label>
                <textarea
                  id="think-prompt-input"
                  rows={3}
                  value={thinkPrompt}
                  onChange={(e) => setThinkPrompt(e.target.value)}
                  className="w-full p-3.5 rounded-[14px] bg-[#F0EEE6] border border-[#D1CFC5] focus:border-[#141413] outline-none text-sm text-[#141413]"
                  placeholder="Ask a complex GQA mathematical or systems architecture question..."
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-xs text-[#5E5D59]">
                  Endpoint: POST /api/gemini/think
                </span>
                <button
                  type="submit"
                  disabled={thinkLoading}
                  className="px-5 py-2.5 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#D97757] hover:text-[#141413] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {thinkLoading
                    ? "Reasoning (ThinkingLevel.HIGH)..."
                    : "Run High-Thinking Analysis"}
                </button>
              </div>

              {/* Output Terminal */}
              <div className="card-dark-terminal space-y-4 min-h-[240px]">
                <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-3">
                  <span className="font-mono-tabular text-xs text-[#A6A49B]">
                    GEMINI-4-ARGON · REASONING TRACE & DERIVATION
                  </span>
                  <span className="font-mono-tabular text-xs text-[#788C5D]">
                    UOR_BOUND_VERIFIER
                  </span>
                </div>

                {thinkLoading && (
                  <div className="py-10 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Executing deep chain-of-thought reasoning on gemini-4-argon...
                  </div>
                )}

                {!thinkLoading && thinkResult?.error && (
                  <div className="p-4 rounded-[12px] bg-[#141413] border border-[#D4883A] space-y-2">
                    <div className="text-xs font-medium text-[#D4883A]">
                      API Notice: {thinkResult.error}
                    </div>
                    <p className="text-xs text-[#A6A49B]">
                      To execute live{" "}
                      <span className="font-mono-tabular text-[#FAF9F5]">
                        gemini-4-argon
                      </span>{" "}
                      calls, configure a billing-enabled API key in{" "}
                      <strong className="text-[#FAF9F5]">
                        Settings &gt; Secrets
                      </strong>
                      . Below is the verified reference derivation from the
                      Page-EntroKV monograph:
                    </p>
                    <pre className="font-mono-tabular text-xs text-[#FAF9F5] whitespace-pre-wrap leading-relaxed pt-2 border-t border-[#2E2E2B]">
                      {`Theorem 1 (Unit Over-Retrieval Elimination):
Let a GQA group contain G query heads sharing physical KV buffer K_g, V_g partitioned into P pages of size B.
1. Under head-independent selection S_h = TopK(Score^(h), k), the physical engine must retain S_union = ∪_{h=1..G} S_h, yielding UOR = |S_union| / k ∈ [1, min(G, P/k)].
2. Page-EntroKV computes sink-isolated Rényi-2 collision entropy H_{2,sink}^(h) = -ln ∑_{j ∉ Sink} (α̃_j^(h))^2, assigning head weight w_h = softmax(-H_{2,sink}^(h) / τ_g).
3. By pooling page scores BEFORE top-k eviction: S_PageEntro = TopK(∑_{h=1..G} w_h · Score_page^(h), k), all G heads index the exact same k physical pages, proving UOR ≡ 1.00 by construction.`}
                    </pre>
                  </div>
                )}

                {!thinkLoading && thinkResult && !thinkResult.error && (
                  <div className="space-y-4">
                    {thinkResult.thoughts && (
                      <details className="p-3 rounded-[12px] bg-[#141413] border border-[#2E2E2B]">
                        <summary className="font-mono-tabular text-xs text-[#D97757] cursor-pointer">
                          Inspect Chain-of-Thought Reasoning Trace
                        </summary>
                        <pre className="mt-2 font-mono-tabular text-xs text-[#A6A49B] whitespace-pre-wrap leading-relaxed">
                          {thinkResult.thoughts}
                        </pre>
                      </details>
                    )}
                    <div className="font-mono-tabular text-xs text-[#FAF9F5] whitespace-pre-wrap leading-relaxed">
                      {thinkResult.text}
                    </div>
                  </div>
                )}

                {!thinkLoading && !thinkResult && (
                  <div className="font-mono-tabular text-xs text-[#A6A49B] leading-relaxed">
                    Ready. Submit a query above to run{" "}
                    <span className="text-[#FAF9F5]">gemini-4-argon</span> with{" "}
                    <span className="text-[#D97757]">ThinkingLevel.HIGH</span>.
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: GOOGLE SEARCH GROUNDING (gemini-3.8-flash) */}
          {activeTab === "search" && (
            <form onSubmit={handleRunSearch} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-medium text-[#141413]">
                    Live Search Grounding for LLM Serving & Hardware Specs
                  </h4>
                  <p className="text-xs text-[#5E5D59]">
                    Powered by{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      gemini-3.8-flash
                    </span>{" "}
                    with{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      googleSearch
                    </span>{" "}
                    tool grounding
                  </p>
                </div>
                <span className="badge-telemetry badge-telemetry--optimal">
                  Google Search Grounded
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Page-EntroKV S. Inbasekaran arXiv GQA KV-cache eviction",
                  "vLLM PagedAttention vs FlashInfer GQA throughput benchmarks",
                  "NVIDIA H200 vs B200 HBM3e memory bandwidth and capacity",
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setSearchQuery(sample)}
                    className="px-3 py-1.5 rounded-full text-xs bg-[#F0EEE6] hover:bg-[#E3DACC] border border-[#D1CFC5] text-[#141413] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <div>
                <label
                  htmlFor="search-query-input"
                  className="block text-xs font-medium text-[#5E5D59] mb-1.5"
                >
                  Search Grounding Query
                </label>
                <div className="flex gap-2">
                  <input
                    id="search-query-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-[#F0EEE6] border border-[#D1CFC5] focus:border-[#141413] outline-none text-sm text-[#141413]"
                    placeholder="Search recent papers, GPU specs, or inference benchmarks..."
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="px-5 py-2.5 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#D97757] hover:text-[#141413] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {searchLoading ? "Searching..." : "Search & Ground"}
                  </button>
                </div>
              </div>

              <div className="card-dark-terminal space-y-4 min-h-[240px]">
                <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-3">
                  <span className="font-mono-tabular text-xs text-[#A6A49B]">
                    GEMINI-3.8-FLASH · LIVE WEB GROUNDING SYNTHESIS
                  </span>
                  <span className="font-mono-tabular text-xs text-[#788C5D]">
                    GOOGLE_SEARCH_TOOL
                  </span>
                </div>

                {searchLoading && (
                  <div className="py-10 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Querying Google Search & synthesizing grounded citations...
                  </div>
                )}

                {!searchLoading && searchResult?.error && (
                  <div className="text-xs text-[#D4883A] font-mono-tabular">
                    Error: {searchResult.error}
                  </div>
                )}

                {!searchLoading && searchResult && !searchResult.error && (
                  <div className="space-y-4">
                    <div className="text-xs text-[#FAF9F5] whitespace-pre-wrap leading-relaxed">
                      {searchResult.text}
                    </div>

                    {searchResult.sources.length > 0 && (
                      <div className="pt-3 border-t border-[#2E2E2B] space-y-2">
                        <div className="font-mono-tabular text-[11px] text-[#A6A49B]">
                          VERIFIED GROUNDING SOURCES ({searchResult.sources.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchResult.sources.map((src, i) => (
                            <a
                              key={`${src.uri}-${i}`}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-[10px] bg-[#141413] border border-[#2E2E2B] hover:border-[#D97757] text-xs text-[#FAF9F5] transition-colors truncate max-w-xs"
                            >
                              [{i + 1}] {src.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!searchLoading && !searchResult && (
                  <div className="font-mono-tabular text-xs text-[#A6A49B]">
                    Submit a search query to retrieve live web-grounded
                    benchmarks and citations.
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: STUDIO IMAGE GENERATION (gemini-3-pro-image-preview & gemini-nano-banana-2.1) */}
          {activeTab === "image" && (
            <form onSubmit={handleGenerateImage} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-medium text-[#141413]">
                    Studio Silicon & Telemetry Visual Synthesizer
                  </h4>
                  <p className="text-xs text-[#5E5D59]">
                    Configurable resolution (1K, 2K, 4K) & 8 aspect ratios via{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      gemini-3-pro-image-preview
                    </span>{" "}
                    or{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      gemini-nano-banana-2.1
                    </span>
                  </p>
                </div>
                <TelemetryPacketIcon />
              </div>

              {/* Model, Resolution (1K/2K/4K), and Aspect Ratio Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Model Picker */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#5E5D59]">
                    Image Model Engine
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {(
                      [
                        ["gemini-3-pro-image-preview", "Gemini 3 Pro Image (Studio)"],
                        ["gemini-nano-banana-2.1", "Gemini Nano Banana 2.1"],
                      ] as const
                    ).map(([mId, label]) => (
                      <button
                        key={mId}
                        type="button"
                        onClick={() => setImageModel(mId)}
                        className={`px-3 py-2 rounded-[12px] text-xs font-medium border text-left transition-colors cursor-pointer ${
                          imageModel === mId
                            ? "bg-[#E3DACC] text-[#141413] border-[#141413]"
                            : "bg-[#F0EEE6] text-[#5E5D59] border-[#D1CFC5] hover:text-[#141413]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Size (1K, 2K, 4K) */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#5E5D59]">
                    Output Resolution Size
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {IMAGE_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setImageSize(sz)}
                        className={`py-2 px-3 rounded-[12px] font-mono-tabular text-xs font-medium border transition-colors cursor-pointer ${
                          imageSize === sz
                            ? "bg-[#E3DACC] text-[#141413] border-[#141413]"
                            : "bg-[#F0EEE6] text-[#5E5D59] border-[#D1CFC5] hover:text-[#141413]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio (8 options) */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#5E5D59]">
                    Aspect Ratio
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1.5 px-2 rounded-[10px] font-mono-tabular text-[11px] font-medium border transition-colors cursor-pointer ${
                          aspectRatio === ratio
                            ? "bg-[#E3DACC] text-[#141413] border-[#141413]"
                            : "bg-[#F0EEE6] text-[#5E5D59] border-[#D1CFC5] hover:text-[#141413]"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="img-prompt-input"
                  className="block text-xs font-medium text-[#5E5D59] mb-1.5"
                >
                  Visual Prompt Specification
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="img-prompt-input"
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-[#F0EEE6] border border-[#D1CFC5] focus:border-[#141413] outline-none text-sm text-[#141413]"
                  />
                  <button
                    type="submit"
                    disabled={imageLoading}
                    className="px-5 py-2.5 rounded-full bg-[#D97757] text-[#141413] hover:bg-[#C6613F] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {imageLoading
                      ? `Synthesizing (${imageSize} · ${aspectRatio})...`
                      : `Generate ${imageSize} Image`}
                  </button>
                </div>
              </div>

              <div className="card-dark-terminal min-h-[240px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-3 mb-4">
                  <span className="font-mono-tabular text-xs text-[#A6A49B]">
                    {imageModel.toUpperCase()} · {imageSize} · ASPECT {aspectRatio}
                  </span>
                  <span className="font-mono-tabular text-xs text-[#D97757]">
                    STUDIO_RENDER_OUT
                  </span>
                </div>

                {imageLoading && (
                  <div className="py-12 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Generating {imageSize} studio image ({aspectRatio}) with{" "}
                    {imageModel}...
                  </div>
                )}

                {!imageLoading && imageResult?.imageUrl && (
                  <div className="space-y-3">
                    <img
                      src={imageResult.imageUrl}
                      alt={imagePrompt}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-[380px] object-contain rounded-[12px] border border-[#2E2E2B] bg-[#141413]"
                    />
                    {imageResult.caption && (
                      <p className="text-xs text-[#A6A49B]">
                        {imageResult.caption}
                      </p>
                    )}
                  </div>
                )}

                {!imageLoading && imageResult?.error && (
                  <div className="p-4 rounded-[12px] bg-[#141413] border border-[#D4883A] space-y-2">
                    <div className="text-xs font-medium text-[#D4883A]">
                      API Notice: {imageResult.error}
                    </div>
                    <p className="text-xs text-[#A6A49B]">
                      Select a billing-enabled API key in{" "}
                      <strong className="text-[#FAF9F5]">
                        Settings &gt; Secrets
                      </strong>{" "}
                      to invoke{" "}
                      <span className="font-mono-tabular text-[#FAF9F5]">
                        {imageModel}
                      </span>{" "}
                      at {imageSize} ({aspectRatio}).
                    </p>
                  </div>
                )}

                {!imageLoading && !imageResult && (
                  <div className="py-8 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Configure resolution (1K / 2K / 4K) and aspect ratio above,
                    then click Generate.
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: TEXT-TO-VIDEO GENERATION (gemini-omni-1.1-flash via Interactions API) */}
          {activeTab === "video" && (
            <form onSubmit={handleGenerateVideo} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-medium text-[#141413]">
                    Omni Flash Text-to-Video Telemetry Generator
                  </h4>
                  <p className="text-xs text-[#5E5D59]">
                    Powered by{" "}
                    <span className="font-mono-tabular text-[#141413]">
                      gemini-omni-1.1-flash
                    </span>{" "}
                    via the Gemini Interactions API (
                    <span className="font-mono-tabular text-[#141413]">
                      ai.interactions.create
                    </span>
                    )
                  </p>
                </div>
                <span className="badge-telemetry badge-telemetry--active">
                  Interactions API · Video
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#5E5D59]">
                    Video Aspect Ratio
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["16:9", "16:9 Landscape"],
                        ["9:16", "9:16 Portrait"],
                      ] as const
                    ).map(([vRatio, label]) => (
                      <button
                        key={vRatio}
                        type="button"
                        onClick={() => setVideoAspectRatio(vRatio)}
                        className={`py-2 px-3 rounded-[12px] font-mono-tabular text-xs font-medium border transition-colors cursor-pointer ${
                          videoAspectRatio === vRatio
                            ? "bg-[#E3DACC] text-[#141413] border-[#141413]"
                            : "bg-[#F0EEE6] text-[#5E5D59] border-[#D1CFC5] hover:text-[#141413]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-[#5E5D59]">
                    Clip Duration
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(["5s", "10s"] as const).map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setVideoDuration(dur)}
                        className={`py-2 px-3 rounded-[12px] font-mono-tabular text-xs font-medium border transition-colors cursor-pointer ${
                          videoDuration === dur
                            ? "bg-[#E3DACC] text-[#141413] border-[#141413]"
                            : "bg-[#F0EEE6] text-[#5E5D59] border-[#D1CFC5] hover:text-[#141413]"
                        }`}
                      >
                        {dur} (720p)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="video-prompt-input"
                  className="block text-xs font-medium text-[#5E5D59] mb-1.5"
                >
                  Motion & Telemetry Scene Prompt
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="video-prompt-input"
                    type="text"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-[#F0EEE6] border border-[#D1CFC5] focus:border-[#141413] outline-none text-sm text-[#141413]"
                  />
                  <button
                    type="submit"
                    disabled={videoLoading}
                    className="px-5 py-2.5 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#D97757] hover:text-[#141413] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {videoLoading
                      ? `Rendering Video (${videoAspectRatio})...`
                      : `Generate ${videoAspectRatio} Video`}
                  </button>
                </div>
              </div>

              <div className="card-dark-terminal min-h-[240px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#2E2E2B] pb-3 mb-4">
                  <span className="font-mono-tabular text-xs text-[#A6A49B]">
                    GEMINI-OMNI-1.1-FLASH · {videoAspectRatio} · {videoDuration}
                  </span>
                  <span className="font-mono-tabular text-xs text-[#788C5D]">
                    INTERACTIONS_VIDEO
                  </span>
                </div>

                {videoLoading && (
                  <div className="py-12 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Synthesizing {videoAspectRatio} video clip via
                    ai.interactions.create (gemini-omni-1.1-flash)...
                  </div>
                )}

                {!videoLoading && videoResult?.videoUrl && (
                  <video
                    src={videoResult.videoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full max-h-[380px] rounded-[12px] border border-[#2E2E2B] bg-[#141413]"
                  />
                )}

                {!videoLoading && videoResult?.error && (
                  <div className="p-4 rounded-[12px] bg-[#141413] border border-[#D4883A] space-y-2">
                    <div className="text-xs font-medium text-[#D4883A]">
                      API Notice: {videoResult.error}
                    </div>
                    <p className="text-xs text-[#A6A49B]">
                      Video generation with{" "}
                      <span className="font-mono-tabular text-[#FAF9F5]">
                        gemini-omni-1.1-flash
                      </span>{" "}
                      requires a billing-enabled API key in{" "}
                      <strong className="text-[#FAF9F5]">
                        Settings &gt; Secrets
                      </strong>
                      .
                    </p>
                  </div>
                )}

                {!videoLoading && !videoResult && (
                  <div className="py-8 text-center font-mono-tabular text-xs text-[#A6A49B]">
                    Choose 16:9 (landscape) or 9:16 (portrait) and click
                    Generate Video.
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
