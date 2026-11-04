# DeepInference

**Make every GPU count.**

**Website:** [Open the DeepInference website](https://deepinference-inference.coolgoose68.chatgpt.site) *(private preview; ChatGPT sign-in required)*.

DeepInference is building inference optimization for AI companies, model builders, and infrastructure teams. The company website presents its optimization services, pilot process, and contact experience. The KV cache calculator is available as a secondary engineering resource.

## Run locally

```bash
npm ci
npm run dev
```

The Express/Vite development server defaults to `http://localhost:3000`. Set `PORT` or pass `npm run dev -- --port 4173` to select a port.

```bash
npx tsc --noEmit
npm run build
npm run preview
```

`dist/` is the static production website. It can be hosted at the root of a domain or a project subpath; Vite uses a relative asset base. `.openai/hosting.json` identifies the private Sites preview. The retained Express server is optional for the marketing site.

## Website structure

- `src/App.tsx`: company positioning, audiences, evaluation process, FAQs, and contact entry points.
- `src/components/RuntimeAtlas.tsx`: interactive SVG introducing latency, GPU memory, and throughput optimization.
- `src/components/CacheLab.tsx`: analytical KV memory estimator with a matched multi-head reference.
- `src/components/ContactDialog.tsx`: validated introduction form with an editable email draft and clipboard fallback.
- `src/components/SiteHeader.tsx`: desktop navigation and a mobile menu with Escape dismissal.
- `src/index.css` and `src/styles/system-study.css`: editorial palette, responsive layout, and technical figure styles.
- `public/brand/wordmark.svg` and `monogram.svg`: original replacement brand assets.
- `public/brand/og-startup.svg`: editable source for the 1200 × 630 social image.

## Contact behavior

The form prepares a draft addressed to `iambruce0012@gmail.com`, the contact address already used by this project. Details remain in browser memory until the visitor opens their email app or copies the introduction. The website does not submit leads, send email, save form entries, or claim a message was delivered. Configure a real lead service before introducing a server-side submission flow.

## Content boundaries

The site describes DeepInference's focus and proposed engagement process. It does not advertise unverified customer relationships, fixed savings, published package availability, supported hardware matrices, or guaranteed integrations. The KV cache calculator uses a theoretical memory estimate.

Earlier research simulators, telemetry components, effect bundles, and the optional Gemini routes are retained as source. They are not mounted by the company landing page. The marketing website does not need a Gemini API key. This redesign does not validate the legacy API endpoints or their model identifiers.

See [the design review and verification notes](docs/design-review.md) for scope, reference provenance, and QA coverage.
