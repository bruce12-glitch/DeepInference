# Startup website redesign

Reviewed on 1 November 2026. Starting source: `413cb51` on `main`.

## REA findings and design decisions

The authorized source and the rendered starting page were inspected. This was a single-page React/Vite site with in-page navigation, not a multi-route application. The existing page mixed a commercial runtime pitch with Page-EntroKV equations, a physical page-table simulator, WebGL telemetry, an illustrative benchmark dashboard, and an install command for a package not established by this repository.

The redesign presents DeepInference as an inference optimization company. The narrative runs from the customer problem to optimization areas, audiences, a proposed evaluation process, the company belief, FAQs, and a conversation. Latency, memory use, capacity, and output quality are discussed without invented benchmark results. No AI-company logos are used to imply customers or partnerships.

## References and assets

| Reference or asset | Use and provenance |
| --- | --- |
| User-selected Anthropic Design skill | Warm cream `#faf9f5`, charcoal `#141413`, quiet borders, restrained controls, generous spacing, accessible secondary text. This is an inspired direction, not an official Anthropic specification or affiliation. |
| [UX Pilot Labs](https://uxpilot.ai/labs) | Public catalog inspected in search and in the browser. Optical Motion Lab was inspected as a visual reference. |
| [Optical Motion Lab](https://uxpilot.ai/labs/op-art-generator) | Observed scan/lens geometry, movement controls, presets, and product-layout previews. The rendered UI stated an account was needed for downloading/exporting. No account was created and no export was taken. No evidence established that Anthropic uses these assets. |
| `InferenceField.tsx` | Original parametric torus projected into SVG, arranged with flow and memory studies on terracotta, blue, and sage panels. Pausable CSS movement. No copied UX Pilot renderer, export, or proprietary Anthropic artwork. |
| Solution illustrations and company illustration | Original CSS geometry and inline SVG. No remote asset requests. |
| `og-startup.svg` / `og-cover.png` | Original social artwork using the site title and the same parametric geometry. PNG rendered from the SVG. |
| Brand component | Original uppercase DeepInference wordmark with a separate DI monogram for compact icons. The previous four-square mark is replaced. |
| Fonts and icons | Google Fonts stylesheet (Inter, Source Serif 4, JetBrains Mono), system fallbacks, and existing `lucide-react`. No commercial Anthropic fonts were copied. |
| Existing `public/effects` bundles and notices | Retained unchanged as legacy source assets. They are not imported or mounted on the new landing page. |

## Component and behavior map

| Page region | Interaction |
| --- | --- |
| Header | Anchors to focus, solutions, approach, and company; responsive menu; Escape/outside-click dismissal; closes after section navigation. |
| Hero | Original SVG artwork; play/pause; stops out of view or when the document is hidden; motion preference listener. |
| Optimization explorer | Three ARIA tabs and panels; pointer selection; arrow keys and Home/End; roving keyboard focus. |
| Audience cards | Contextual conversation entry points for model builders, AI platforms, and enterprise inference. |
| FAQs | Native keyboard-operable details/summary disclosures. |
| Contact dialog | Native modal focus containment, Escape dismissal, focus restoration, required-field validation, editable email draft, and clipboard fallback. Preparing a draft performs no network submission. |

Only the page UI, repository source, and public reference pages were examined. No private inference runtime, production GPU integration, customer deployment, or backend performance was inferred from the marketing page. Legacy Gemini endpoints were not exercised. The new page calls no application APIs.

## Verification

Browser checks use the managed preview and temporary same-origin iframe viewports. Widths refer to the iframe border box; classic scrollbars reduce the inner content width by 15px. The temporary QA page is excluded from the delivered source.

- Desktop: rendered hero, selected explorer panels, form validation, draft generation, edit preservation, Escape, and focus restoration inspected.
- Mobile: rendered hero and audience cards inspected at 390px. Menu open/close and section navigation exercised. The 320px layout was corrected and rechecked for horizontal overflow.
- TypeScript compilation and the production build are required before delivery.
- Reduced motion is implemented using CSS and `matchMedia`, with a disabled animation control when the preference is active. System-level preference emulation and screen-reader testing are outside this browser session's exposed controls.
- The email draft recipient and URI are checked without sending an email. Opening a mail client and actual delivery remain visitor actions.

Additional measured viewport results and the final build outcome are recorded below after final QA.

| Viewport frame | Inner width | Document scroll width | Result |
| --- | ---: | ---: | --- |
| 320px | 305px | 305px | No horizontal overflow after repair; hero inspected |
| 390px | 375px | 375px | No horizontal overflow; menu, cards, and modal inspected |
| 768px | 753px | 753px | No horizontal overflow; hero and audience cards inspected |
| 1440px | 1425px | 1425px | No horizontal overflow across the page DOM |

Keyboard checks covered tab arrow navigation and Home, required-field focus, dialog Escape, and restoration to the opener. Native FAQ disclosure was exercised. The temporary viewport harness was removed before packaging. TypeScript compilation passed. The final production build is run by the packaging workflow and must succeed before publication.

Computed text contrast examples: charcoal on cream 17.50:1, secondary text on cream 5.90:1, terracotta on cream 5.36:1, and solution/company/contact body text 5.87:1 or higher for the tested pairs. These checks do not establish a full WCAG conformance audit.

## Identity refinement

The current [Anthropic homepage](https://www.anthropic.com/) was inspected in the browser. Computed styles showed the page background `rgb(250, 249, 245)`, text `rgb(20, 20, 19)`, and a custom serif/sans typographic pairing. The rendered page combined an uppercase wordmark, large editorial type, and a collage of graphic studies. Its proprietary fonts, logo, and collage assets were not copied.

[Anthropic's published artifact brand guide](https://github.com/anthropics/skills/blob/main/skills/brand-guidelines/SKILL.md) independently documents the cream, charcoal, warm gray, orange, blue, and green palette. That guide's Poppins/Lora artifact typography is distinct from the site's custom fonts. Source Serif 4 is used here as an available alternative for the web headings, paired with Inter for interface text.

The refinement replaces the ornamental oversized rust italic heading with charcoal roman serif type. Color is concentrated in original ink illustrations on `#d97757` terracotta, `#b7c9d8` blue, and `#b8c19f` sage. Cream `#faf9f5` and warm gray `#f0eee6` / `#e8e6dc` carry the rest of the layout. All audience cards now share the same neutral body surface. The wordmark, SVG and PNG favicons, Apple touch icon, and both social-image formats use the new identity.

Sampled updated contrast: charcoal/cream 17.50:1; secondary text/cream 5.99:1; deep terracotta/cream 5.77:1; contact text/orange 4.97:1. Ink on blue and sage is 10.85:1 and 9.80:1 respectively. Responsive checks were repeated after the font and artwork changes.
