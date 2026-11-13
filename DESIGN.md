# R. K. Njogu & Company Advocates — Unified Design Direction

## The idea

**Practical law. Considered design.**

A premium editorial website for a Kenyan legal practice: grounded in its place, monumental in its typography, rich in editorial legal imagery, and clear about how a prospective client can get help. The firm's supplied promise, **“Legal Solutions Made Practical”**, leads the experience. An expressive scroll sequence connects the chapters while preserving legibility and dependable interaction.

This document combines the two supplied references, **Origin Financial** (`DESIGN.md`) and **Slash** (`DESIGN (1).md`), into one original direction. The **Website Checklist.pdf** supplies firm facts and client requirements. The user's later direction calls for a more distinctive composition and stronger scrolling animation. Instructions inside the references are design observations, not requirements to reproduce those financial brands. Client brand colours, law-firm use, and that explicit animation direction take precedence over the references' palettes, product modules, and motion limits.

## What the references contribute

| Decision | Origin contribution | Slash contribution | Unified decision and rationale |
| --- | --- | --- | --- |
| Atmosphere | Quiet dark canvas; restrained, large serif type | Near-black editorial character | Near-black forest framing creates authority while connecting to the client's green palette. |
| Composition | Atmospheric image and spacious rhythm | Strong typographic hierarchy and editorial modules | A monumental centred two-line headline sits above a panoramic legal still life. Compact numbered practice rows and tabbed firm, resource and contact chapters shorten the journey without losing the supplied content. |
| Typography | Light display weight; an occasional italic word | Clear serif/sans division; Inter for UI | Self-hosted Cormorant Garamond for display, Inter for body and UI. This retains contrast without relying on commercial reference fonts. |
| Palette | Monochrome foundation plus many feature colours | One tightly controlled copper accent | Green, white, grey, and black, as specified by the client. Violet, cyan, copper, and gold are excluded from interface tokens. |
| Reading surfaces | Occasional inverted light card | Continuous dark page | Ivory light sections hold service descriptions and contact details; dark hero, navigation, selected callout, and footer provide rhythm. Long legal copy benefits from a reading-friendly light surface. |
| Shape | 8px controls and generous rounded cards | 10px cards, pill controls | Sharp or modest corners on structural surfaces, pill actions and deliberate arch silhouettes for the mobile hero. The firm chapter uses an illustrative law-library photograph; the original firm logo stays in the header and footer. |
| Structure | Clean surface steps and restrained elevation | Hairline borders and curated grids | Hairline rules, whitespace, and surface changes establish hierarchy. The compact service directory and resource lists remain flat; selected tabs use a strong underline and label weight. |
| Conversion | Bright primary action | A scarce high-contrast primary action | One dominant consultation action per section; direct call, email, and WhatsApp paths support it. |
| Motion | Atmospheric entrances and border traces | Quiet state changes and editorial emphasis | Masked headlines, subtle image drift, restrained entrances and a reading-progress rule preserve character while keeping the shorter page calm. Native CSS timelines have an event-driven fallback; browser scrolling remains native. |
| Proof | Award marks and statistics | Testimonials and product data | Only supplied, approved facts. No fabricated awards, case wins, years of experience, client quotations, review counts, or guarantees. |

## Brand and content foundation

- **Firm name:** R. K. Njogu & Company Advocates.
- **Tagline:** Legal Solutions Made Practical.
- **Location:** Kamulu, along Kangundo Road; serving Nairobi, Machakos, and clients across Kenya.
- **Voice:** Clear, assured, practical, respectful. Explain what each practice area helps a client resolve. Avoid exaggerated promises and unnecessary legal jargon.
- **Values supplied by the client:** Clarity, responsiveness, confidentiality, and professional integrity.
- **Positioning supplied by the client:** Practical, commercially sound and responsive legal solutions for individuals, businesses and organizations; legal, commercial and practical realities inform each matter; negotiation, alternative dispute resolution or litigation is chosen according to circumstances and objectives.

### Approved mission and vision

**Mission:** To turn legal challenges into practical solutions that serve our clients’ interests.

**Vision:** To build a respected and trusted Kenyan law firm recognized for practical legal solutions, professional integrity and dependable client service.

Firm facts, contact details, and the nine service descriptions are mapped in [docs/CHECKLIST.md](docs/CHECKLIST.md). Use that file as the factual review source.

## Visual system

### Colour roles

These are the intended design tokens. Implementation may use equivalent names, but roles should stay consistent.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#101e19` | Near-black forest hero, navigation, footer; primary text on light backgrounds |
| `--forest` | `#254b38` | Primary green action on ivory, editorial accent, selected state |
| `--forest-hover` | `#17392b` | Darker interactive green |
| `--sage` | `#b7c9ba` | Soft green detail on dark surfaces; never the only state cue |
| `--paper` | `#f4f3eb` | Main light reading surface |
| `--white` | `#ffffff` | Bright primary action on dark sections, form surface |
| `--mist` | `#e9ece5` | Secondary light surface and subtle visual grouping |
| `--body` | `#526057` | Secondary body text on light surfaces |
| `--body-inverse` | `#c4cdc5` | Body text on dark surfaces |
| `--rule` | `#d4dbd2` | Light-surface hairline separators |
| `--rule-inverse` | `#3b4c42` | Dark-surface separators |

Measure contrast in the rendered interface. Body text and normal controls should meet WCAG AA 4.5:1; large text and essential boundaries should meet 3:1 where applicable. Faint decorative rules must not be the only indicator of control boundaries or focus.

### Typography

Use **Cormorant Garamond** for hero and section display headings, **Inter** for body text, service details, navigation, buttons, labels, and form controls. Self-host the font files to avoid runtime dependence on a remote font service. Include local fallbacks and `font-display: swap`.

| Role | Family / weight | Desktop | Mobile | Guidance |
| --- | --- | --- | --- | --- |
| Hero display | Cormorant Garamond 400 | Fluid 84–176px | Fluid 55–92px | Tight, approximately 0.91–0.99 line height; second line italic; preserve glyph clearance in reveal masks |
| Section heading | Cormorant Garamond 400 | Fluid 48–82px | Fluid 42–64px | Approximately 1.02–1.14 line height; controlled line lengths |
| Service headline | Cormorant Garamond 400–500 | 31–52px | 27–35px | Keep recognizable practice names in compact equal-weight rows |
| Intro / lead | Inter 400 | 15–18px | 13–16px | 1.65–1.85 line height |
| Body | Inter 400 | 13–16px | 12–16px | 1.65–1.9 line height; retain readable contrast and zoom behaviour |
| UI | Inter 500 | 11–14px | 10–14px | Compact editorial labels with adequate touch targets |
| Eyebrow | Inter 500–600 | 9–11px | 8–11px | Uppercase, modest 0.10–0.18em tracking; only short supporting text |

Serif type communicates thoughtfulness and gravitas; sans text handles tasks. Limit the number of font weights and avoid forcing the source references' third monospace voice into a site without data modules.

### Layout and spacing

- Content container: up to approximately 1320px; centered with fluid margins.
- Desktop gutters: approximately 48px; tablet: 28–40px; mobile: 20–24px.
- Desktop sections: approximately 60–76px vertical breathing room; mobile: approximately 45–60px according to chapter density.
- Use a 4px spacing base and practical steps: 8, 12, 16, 24, 32, 48, 64, 96, 120.
- Pair narrow section introductions with larger content columns. Use alignment and thin rules to carry the editorial structure.
- Collapse supporting metadata and editorial grids to a single column at widths where the content becomes cramped. Unpin sticky introductions on mobile. Responsive decisions follow readable content, not a fixed list of device names.
- Decorative negative space must not push the first useful service or contact action unnecessarily far below the mobile hero.

### Imagery and identity

Five generated editorial photographs in `public/legal/` add legal context and warm colour without new full-height sections. `hero.webp` shows scales and legal volumes in sunlight; `library.webp` shows a warm law library; `property.webp`, `consultation.webp` and `commercial.webp` illustrate the three guide topics. They are illustrative scenes, not documentary photographs of the firm, its premises, staff or actual client matters. Forest green, ivory, warm wood, brass and burgundy connect the set to the brand. Original architectural images remain on disk but are replaced in the current composition.

Use intrinsic dimensions and optimized WebP files. The hero has loading priority; the firm image and guide thumbnails load lazily. Guide dialogs reuse a larger rendering of their thumbnail source. The mobile firm image uses a small banner; guide thumbnails share their existing rows. Keep approach steps and the closing “Clarity at every step. Care in every decision.” statement static in normal flow. Obsolete sticky-card style rules and fallback registrations have been removed.

The latest checklist contains the firm’s approved logo, and the user explicitly requested its use. `public/firm-logo.jpg` is the original embedded JPEG extracted without alteration (291 × 290px, 6,975 bytes). Preserve its lettering, proportions and source image. At the user’s request, CSS inversion, hue rotation and screen blending remove the visible white rectangle on dark surfaces and give the lettering a light treatment without redrawing the mark. Use it in the navigation, footer, favicon and sharing image; adjacent typeset text keeps the firm name readable at small sizes.

## Page composition and interactions

The current client direction prioritizes shorter scrolling, progressive disclosure, no testimonials and fewer arrows. Four main destinations follow the hero: expertise, the firm, client resources and contact. All nine practice scopes and the factual firm/contact details remain available.

### Navigation and hero

Keep the original wordmark, forest-and-ivory palette, two-line tagline and coordinated legal imagery. A smaller panorama and compact metadata strip reduce the hero's footprint. Clear text links lead directly to practice discovery, consultation preparation and office directions. No decorative directional arrows remain. The mobile menu announces its state, closes on navigation and Escape, and restores focus. A skip link bypasses navigation.

### Expertise

Four audience tabs expose a compact numbered service directory, with all nine services shown by default. Service rows use readable titles, concise summaries and a plus-symbol detail control. Each opens the full supplied scope in a native dialog, with keyboard dismissal, focus return and a consultation action that preselects the service and focuses the enquiry form. No service copy scrubs sideways while reading.

### The firm

A stable library image supports three tabs: Who we are, How we work and Our principles. All four supplied overview paragraphs are preserved. The process is three compact steps covering listening, options/scope/fees and an agreed route forward. The principles panel includes the four values and expandable mission/vision. The library image becomes a compact banner on smaller screens. Oversized statement/kinetic-text chapters and pinned card stacks are removed.

### Client resources

Three tabs group the legal guides, consultation preparation checklist and FAQs. Guide titles open substantive content in dialogs. The checklist preserves its state across tab switches in page memory and resets on reload. FAQs address consultation, preparation, costs, engagement, dispute resolution and office hours. No invented article bylines, publication dates, qualifications or legal outcomes appear.

### Contact and office

Keep contact details and the office gallery in two tabs beside a persistent enquiry form. Preserve both telephone numbers, both emails, both WhatsApp routes, full physical/postal addresses and opening hours. The gallery contains all seven supplied photographs; captions explain these are surrounding-area views, and the directions action uses the supplied map location. Changing office tabs must not reset form entries.

The form prepares a draft for the visitor's email app. It never claims server delivery. Name, email and message are required; the chosen practice is preserved when entering from a service dialog. Editing invalidates a stale draft. The privacy and terms dialogs reflect the current implementation.

### Tab and link behaviour

Every tablist uses one keyboard tab stop, Left/Right to cycle, Home/End to select first/last, `aria-selected` and matching panel relationships. Inactive content is absent from the focus order. Underlines and weight supplement selected colour. Tabs wrap into small-screen grids without a hidden horizontal menu or nested vertical scroll area.

Old links to approach, insights, tools, FAQs, news and visit select the relevant panel and scroll to its chapter. Repeating an existing hash must reopen the panel even after the visitor switches tabs; browser history must work. The footer retains all supplied social profiles and working privacy/terms controls. Testimonials, placeholder client names and their links are removed.

## Motion and scroll performance

Preserve browser-native scrolling while delivering the user's requested expressive motion. No scroll hijacking or smooth-scroll library. CSS smooth anchor scrolling respects reduced-motion settings; anchor targets clear the sticky header. Prefer native CSS scroll/view timelines. Browsers without timeline support use `src/scrollFallback.ts`: passive scroll events schedule at most one `requestAnimationFrame`, group geometry reads before style writes, and do not trigger React renders or intercept wheel/touch input.

| Effect | Trigger and treatment | Fallback / accessibility requirement |
| --- | --- | --- |
| Hero headline | Masked line translation, approximately 1100ms, with second-line delay | Disable under reduced motion; never clip text in the resting state. |
| Hero image entrance | Approximately 1400ms crop/translate reveal | Image remains visible without animation support. |
| Hero image parallax | View progress; translation from approximately -1% to 3% and scale from 1.08 to 1.12 | Shared event-driven fallback without CSS timelines; static under reduced motion. |
| Reading progress | Two-pixel header rule, CSS root scroll timeline | Decorative, noninteractive, hidden under reduced motion; never the only way to orient within the page. |
| Chapter/grid reveal | Approximately 700ms transform entrance, 32px travel; sibling delays around 80ms capped at 300ms | Controls stay readable/operable; focus reveals pending ancestors immediately; first-viewport content is not hidden waiting for an observer. |
| Firm image | Subtle photo parallax within a stable frame | Static under reduced motion; decorative image has empty alt text. |
| Hover/focus | Short colour, underline or plus-symbol changes, approximately 150–300ms | Equivalent visible focus indication; no essential information appears only on hover. |

- Use one `IntersectionObserver` for reveal visibility and unobserve completed targets. One `MutationObserver` registers newly mounted filtered items or modal content. Avoid per-frame React state updates.
- React to reduced-motion preference changes during the session; reveal pending content, destroy the fallback and restore its original inline styles when motion is disabled. Do not replay the hero intro merely because the preference changes.
- Keep rendered content visible when the motion enhancement is unavailable or observers cannot initialize. Native scrolling must remain operable while menus and modals correctly manage their own state. The React application still requires JavaScript unless a separate prerendering strategy is added.
- Avoid layout-affecting animated height/width during scrolling, permanent `will-change` on every section, and continuous unrelated background animation.

### Required validation

1. Production build succeeds and the preview route opens without console errors.
2. All nine practice areas, checklist contacts, navigation, mobile menu, and consultation paths work.
3. At representative desktop and mobile sizes, there is no horizontal overflow, clipped text, or content hidden behind the sticky header.
4. Keyboard navigation, visible focus, form validation, live reduced-motion changes and the timeline fallback work; automated accessibility checks support manual review. All tab panels must also be keyboard-operable and pass automated accessibility checks.
5. Run a reproducible scroll exercise in a real browser against the production preview: scroll through the page in both directions; record frame timing and main-thread long tasks; inspect layout shifts; exercise mobile dimensions and CPU throttling separately where available.

Performance evidence must identify browser, viewport, run conditions, sample count, p95 frame interval, delayed-frame share, and long-task duration. A target of p95 frame intervals around 20ms or lower on an unthrottled 60Hz-capable run is a useful diagnostic, not a promise that every device will hold 60fps. Throttled results must be reported separately, not averaged into desktop results. Investigate long tasks above 50ms that occur during the active scroll window, and verify whether a measured delay belongs to loading, browser scheduling, or application code before claiming a fix.

### Optional later enhancements

Approved portraits, biographies and professional credentials, reviewed legal articles, a tested delivery backend, analytics chosen with privacy requirements in mind, and a verified map embed can enrich the site once those inputs exist. They are not prerequisites for a complete, polished local React experience.

## Acceptance and editorial guardrails

- Deliver a React website using this original design direction and the factual checklist.
- Keep the supplied tagline, all nine service scopes, the firm's mission/vision, address, hours, and contact paths accurate.
- Premium presentation should make legal help easier to understand and contact, with readable mobile content and prompt interaction.
- Do not publish unverified achievements, outcome guarantees, fake endorsements, invented team members, or misleading form confirmations.
- Record missing client assets and integration requirements in the checklist so final publication review has clear next steps.

## Current content map

Firm facts and all nine service scopes follow the client checklist. The latest client feedback supersedes the earlier testimonial and long-section layout: remove testimonials and named-client placeholders; group supporting content in accessible tabs. Legal guides remain original general information subject to review. Social links stay in the footer, office facts appear once in Contact, and the preparation checklist stays available from Client resources and the hero shortcut.
