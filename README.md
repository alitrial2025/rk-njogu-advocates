# R. K. Njogu & Company Advocates

A responsive React and TypeScript website built from the client's website checklist and the combined design references. The visual system pairs forest green and ivory, monumental editorial typography, original architectural imagery, and a scroll-driven reading experience.

## Develop

Use Node.js 24 (validated with 24.19.0) and npm. From the project directory:

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

The browser harness uses the environment's `/usr/bin/chromium`. On another machine, set `CHROMIUM_EXECUTABLE` to an installed Chromium binary. Set `BASE_URL` if testing a different server. The harness runs functional and automated accessibility checks, verifies actual reveal motion and reading progress, exercises keyboard visibility and live reduced-motion changes, measures native wheel scrolling at desktop/mobile sizes and with 4× CPU slowdown, and saves JSON and screenshots in ignored `artifacts/`. Its exit code reports failures.

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for measured results and their limits. Headless cloud measurements are regression evidence; they do not establish physical-device frame rates or field Core Web Vitals.

## Content and design

- [DESIGN.md](DESIGN.md) combines both uploaded style references into one original design direction and explains decisions where the references conflict.
- [docs/CHECKLIST.md](docs/CHECKLIST.md) maps every supplied client requirement and records outstanding publication inputs.
- `src/data.ts` contains firm facts, nine practice areas, FAQs and original educational guides.
- `src/App.tsx` contains the service discovery, dialogs, consultation flow and page composition.
- `src/styles.css` contains the base interface, form, dialog and responsive styles; `src/editorial.css` defines the chapter layouts and visual direction.
- `src/useScrollMotion.ts` progressively enhances section entrances, observes new filtered content, and handles keyboard focus and motion preferences. `src/motion.css` defines masked hero entrances, native scroll timelines for the photograph and text, and SVG stroke drawing. Scrolling stays native; no animation library or scroll-driven React render loop is required. Browsers without scroll timelines retain readable content and section entrances.
- `public/threshold.webp` is an original generated architectural image used for atmosphere. It does not depict the firm's premises. The current wordmark is provisional because the checklist contains no logo asset.

The form prepares an email draft. It does not send enquiries, persist form values, or claim delivery. Visitors review and send the draft through their email application; direct telephone, both WhatsApp numbers and both email addresses are also available. Editing the form invalidates an old draft. No credentials or backend service are required for this workflow.

## Before public launch

Obtain the approved logo and review the educational guides, privacy notice and website terms with the firm. Testimonials remain unpublished because the checklist marks them TBA. Add approved team biographies or office photography only when supplied. Configure and test a delivery service if a server-backed form is wanted.

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

The browser harness can also run against the public URL by changing `BASE_URL`. Set `EXPECTED_COMMIT` to the full deployed SHA to require the same revision check. This exercises the real hosted assets, navigation, contact drafting and scrolling. Save fresh evidence for each deployed version; a successful local build alone does not prove publication.
