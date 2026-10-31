# DeepInference — Page-EntroKV Interactive Research Monograph & 3D GQA Telemetry Suite

**Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention**

- **Author:** Inbasekaran S. (`iambruce0012@gmail.com`)
- **Affiliation:** Department of Computer Science and Engineering, SRM Institute of Science and Technology, India
- **Paper & Empirical Logs Repository:** [bruce12-glitch/PageEntro-KV](https://github.com/bruce12-glitch/PageEntro-KV)
- **Interactive Monograph & 3D Telemetry App:** [bruce12-glitch/DeepInference](https://github.com/bruce12-glitch/DeepInference)

---

## Architectural Overview

Modern LLM inference engines such as vLLM allocate the key-value cache in physical PagedAttention tensors of shape:

```text
[N_blocks, H_KV, B=16, D_head]
```

where $r = H_Q / H_{\text{KV}}$ query heads share a single physical KV head group and $B = 16$ contiguous token slots form an indivisible hardware page.

**DeepInference** is the interactive systems monograph and hardware telemetry workbench accompanying the **Page-EntroKV** paper:

1. **Formal Structural Bounds (`experiment_1_structural_bounds_real.csv` & `paper/main.tex`)**
   - Exact $r=2$ Union Over-Retrieval identity: $\text{UOR}(S_1, S_2) = \frac{2}{2 - d_{\text{Jaccard}}(S_1, S_2)}$.
   - General-$r$ two-sided sandwich bound: $1 + \frac{1}{r}\sum_{h=2}^r d_{1,h} \le \text{UOR} \le \min\left(r, \frac{N}{k}, 1 + \sum_{h=2}^r d_{1,h}\right)$.
   - Sink-isolated Rényi-2 collision entropy $\mathcal{H}_2^{\text{sink}}(\mathbf{A}_{l,h}) = -\ln \sum_{t \ge s} (\tilde{A}_{l,h}(t))^2$ and Boltzmann group weighting $w_{l,h} = \text{softmax}(-\mathcal{H}_2^{\text{sink}}(\mathbf{A}_{l,h})/\tau_g)$.
   - Polynomial sink-suppression decay $(m/N)^{1/\tau_g}$ and $B=16$ intra-page block-max score lifting $I_{l,g}(P_b) = \max_{t \in P_b} \mathbf{A}^{\text{pooled}}_{l,g}(t)$.

2. **Interactive GQA Page-Table Simulator & 3D HBM3e Topology (`Three.js` WebGL2)**
   - Live 64-page physical PagedAttention allocation simulator comparing pre-selection Rényi-2 group pooling ($\text{UOR} \equiv 1.00\times$) against head-independent top-$k$ union bloat ($\text{UOR} > 1.0\times$) and uniform mean-pooling specialist dilution $(1-\epsilon)/r$.
   - 9-part procedural 3D HBM3e GQA silicon die (`ThreeKvTopologyScene.tsx`) with `InstancedMesh` KV page blocks, optical query-head waveguides, exploded-view stack separation, and `100vw × 100vh` fullscreen mode.

3. **Verbatim Empirical Pilot Census on `Qwen2.5-1.5B-Instruct` ($L=28, H_Q=12, H_{\text{KV}}=2, r=6, B=16$)**
   - `experiment_2_sink_masquerade.csv`: Layer-0 query-head Rényi-2 dispersion census across KV groups 0 and 1 (with explicit disclosure of empty cells at heads 1 and 3).
   - `experiment_3_niah_summary.csv`: 9 Passkey NIAH pooled-selection runs across $T \in \{958, 1474, 1990\}$ tokens $\times \{20\%, 50\%, 80\%\}$ depth (`Page-EntroKV = 1.0` vs. `Mean Pooling = 0.0`).
   - `experiment_s4_page_fill.csv`: Intra-page $B=16$ slot occupancy distribution (`slot_0 = 14.37%`, `slot_8 = 8.96%`, `slot_10 = 7.69%`).
   - `experiment_5_longbench_summary.csv`: Completed LongBench tasks (`lcc: 56.10`, `repobench-p: 44.81`, `multifieldqa_en: 44.20`, `qasper: 38.60`) with explicit disclosure of excluded harness non-completions.

---

## Local Development

```bash
# Install dependencies
npm install

# Start full-stack Express + Vite server on http://localhost:3000
npm run dev

# Type-check & build production bundle
npm run build
```

---

## Citation

```bibtex
@article{inbasekaran2026pageentrokv,
  title   = {Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention},
  author  = {Inbasekaran, S.},
  journal = {Department of Computer Science and Engineering, SRM Institute of Science and Technology},
  year    = {2026},
  url     = {https://github.com/bruce12-glitch/PageEntro-KV}
}
```
