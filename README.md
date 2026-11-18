# R. K. Njogu & Company Advocates

A responsive React and TypeScript website built from the client's website checklist and the combined design references. Forest green and ivory frame an original Lady Justice centerpiece, pill navigation, a compact practice directory and nine pre-rendered service pages. Tailored preparation and WhatsApp enquiries support the consultation workflow. Testimonials are removed at the client’s request.

## Develop

Use Node.js 24 (validated with 24.22.1) and npm. From the project directory:

```sh
npm ci --no-audit
npm run dev
```

The Vite development server uses port 5173. Work in this existing checkout; cloud tasks are already isolated and do not need a separate Git worktree.

## Build and verify

```sh
npm run build
npm run preview
```

In another terminal, with the production preview running on port 4173:

```sh
npm run test:browser
```

For onboarding or a clean checkout, run `node /workspace/rk-njogu-advocates/scripts/browser-check.mjs` from `/workspace/scratch` to keep generated reports outside the checkout; running the npm script from the project also refreshes tracked `docs/PERFORMANCE.md`.

The browser harness uses the environment's `/usr/bin/chromium`. On another machine, set `CHROMIUM_EXECUTABLE` to an installed Chromium binary. Set `BASE_URL` if testing a different server. The harness runs functional and automated accessibility checks, verifies actual reveal motion and reading progress, exercises keyboard visibility and live reduced-motion changes, measures native wheel scrolling at desktop/mobile sizes and with 4× CPU slowdown, and saves JSON and screenshots in ignored `artifacts/`. Its exit code reports failures.

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for measured results and their limits. Headless cloud measurements are regression evidence; they do not establish physical-device frame rates or field Core Web Vitals.

## Content and design

- [DESIGN.md](DESIGN.md) combines both uploaded style references into one original design direction and explains decisions where the references conflict.
- [docs/CHECKLIST.md](docs/CHECKLIST.md) maps every supplied client requirement and records outstanding publication inputs.
- `src/data.ts` contains firm facts, nine practice areas, FAQs and original educational guides. `src/serviceData.ts` adds the nine service-specific introductions, preparation lists and meeting questions.
- `src/App.tsx` contains the service discovery, dialogs, consultation flow and page composition.
- `src/ServicePage.tsx` renders each service guide; `scripts/prerender.mjs` emits real HTML pages and a sitemap during the build.
- `src/PreparationChecklist.tsx` and `src/WhatsAppEnquiry.tsx` share the tailored preparation and consultation flow between home and service pages.
- `src/Tabs.tsx` provides accessible tabs with roving focus, arrow keys and Home/End support.
- `src/styles.css` and `src/editorial.css` provide the visual foundation; `src/refinements.css` defines the compact chapters, service directory, tabs and responsive refinements.
- `src/useScrollMotion.ts` manages entrances, newly mounted tab content, keyboard focus and live motion preferences. Hero and firm photography retain subtle image drift; large kinetic-type sections and the sticky approach sequence have been removed. Reduced motion disables the remaining effects.
- `src/scrollFallback.ts` supports browsers without CSS scroll timelines. Passive scroll events schedule a single animation frame, with geometry reads grouped before style writes. Scrolling stays native; no animation library, wheel interception or scroll-driven React render loop is used.
- `public/legal/` contains the original Lady Justice illustration in two WebP sizes, plus the law library and guide imagery. The library and guide images load lazily. The imagery is illustrative. The original still life and architectural assets remain available.

`public/firm-logo.jpg` preserves the logo embedded in the latest client checklist, used at the user’s request. The original 291 × 290px JPEG is unchanged; it appears in the header, footer, favicon and sharing image. CSS screen blending removes its visible white background on green surfaces and presents the lettering in a light colour.

`public/kamulu/` contains all seven user-supplied approach photographs, preserved as JPEGs. A manual gallery and map-directions link appear in Contact → Find the office; images describe the surrounding area without claiming to identify the office building.

Decorative directional arrow controls have been removed. Service details use a plus symbol; other editorial/contact actions use underlined text.

The form prepares a WhatsApp enquiry addressed to the firm’s supplied mobile number. The visitor reviews the name, selected service, brief message and optional preferred time, then continues to WhatsApp and taps Send. Receipt, availability and fees are confirmed by the firm in the chat. The website cannot observe sending, delivery or reading and never claims a confirmed receipt or booking. Editing any field or changing the selected matter invalidates the old review. A copy fallback and direct telephone contacts remain available. Enquiry data stays in page memory until the visitor follows the WhatsApp link; no backend or API credentials are needed.

## Before public launch

Review the educational guides, privacy notice and website terms with the firm. Testimonials and client-name placeholders have been removed. Add approved team biographies or office photography only when supplied. Automatic delivery receipts would require a separately configured WhatsApp Business API and authenticated backend; the current GitHub Pages flow uses WhatsApp click-to-chat.

The GitHub Pages target is `https://alitrial2025.github.io/rk-njogu-advocates/`. The canonical and social image URLs point there. Verify the map pin and public holiday hours. If moving to a custom domain, update the canonical/social metadata and the build base.

## GitHub Pages deployment

The Pages workflow builds and deploys pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** as the source if it is not already configured. The workflow uses the repository's built-in Actions credentials; no token is stored in project files.

For an equivalent local Pages build:

```sh
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run preview
```

Test the repository path with:

```sh
BASE_URL=http://127.0.0.1:4173/rk-njogu-advocates/ npm run test:browser
```

After deployment, the workflow runs Chromium browser, accessibility and scroll checks against the public site and uploads screenshots and reports as a workflow artifact. It verifies the deployed build revision matches the commit being released, so a cached older page cannot count as successful verification.

The browser harness can also run against the public URL by changing `BASE_URL`. Set `EXPECTED_COMMIT` to the full deployed SHA to require the same revision check. This exercises the real hosted assets, navigation, WhatsApp enquiry review and scrolling. Save fresh evidence for each deployed version; a successful local build alone does not prove publication.

## Compact content structure

- **Expertise:** four audience tabs, with all nine services in the default compact directory; each opens its full scope and consultation action.
- **The firm:** Who we are, How we work, and Our principles. Mission and vision expand within principles.
- **Client resources:** legal guides, a five-item consultation checklist, and common questions about preparation, fees and engagement.
- **Contact:** contact details and office gallery tabs beside the persistent enquiry form. The seven supplied location photographs and every contact route remain available.
- **Footer:** social profiles, concise navigation and working privacy/terms dialogs.

Legacy links to `#approach`, `#insights`, `#tools`, `#faq`, `#news` and `#visit` select the corresponding tab and navigate to its chapter. Checklist selections survive tab changes in page memory and reset on reload. Office-tab changes preserve the enquiry form. The browser suite checks each panel, keyboard operation, repeated links, browser Back, WhatsApp enquiry review, the hero and four editorial photographs, native scrolling past the approach closing statement, motion and compact page-height budgets.

Next client content: approved advocate biographies, portraits and professional credentials. These would add valuable personal context; none are invented. All factual content remains mapped in docs/CHECKLIST.md.

## Dedicated service pages

`npm run build` type-checks, builds the browser bundle, then uses React server rendering to emit the homepage and one HTML document per service. The temporary `.prerender/` bundle is removed after generation. No server runtime is required on GitHub Pages.

Service paths are `services/<practice-id>/`, including `services/land-property/`, `services/family-law/` and `services/employment-labour/`. Each supports direct loads, reloads and ordinary browser history, with a service-specific title, description, canonical/social URL, Service/Breadcrumb structured data, complete service scope, practical context and tailored preparation. `dist/sitemap.xml` lists the homepage and all nine service pages. The homepage itself is pre-rendered so crawlers can discover its ordinary service links without executing JavaScript. The interactive controls hydrate in the browser. A static `404.html` provides a return path for unavailable URLs.

The preparation selector and WhatsApp practice selector share the selected matter. Each matter keeps its own completion state while the visitor changes tabs or matters on the same page; switching service URLs or reloading starts a fresh checklist. Service pages and the homepage use the same reviewed guidance. Keep documents ready for a consultation; the checklist does not upload them or include them in the WhatsApp enquiry.

The existing Pages build flag remains required: `GITHUB_PAGES=true npm run build` and `GITHUB_PAGES=true npm run preview`. Browser checks cover all nine pages with JavaScript disabled and enabled, metadata, sitemap, mobile layouts, hydration, checklist state and an intercepted WhatsApp handoff. Test messages are never sent to the firm.
