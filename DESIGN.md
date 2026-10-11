# R. K. Njogu & Company Advocates — Unified Design Direction

## The idea

**Practical law. Considered design.**

A premium editorial website for a Kenyan legal practice: grounded in its place, monumental in its typography, architectural in its imagery, and clear about how a prospective client can get help. The firm's supplied promise, **“Legal Solutions Made Practical”**, leads the experience. An expressive scroll sequence connects the chapters while preserving legibility and dependable interaction.

This document combines the two supplied references, **Origin Financial** (`DESIGN.md`) and **Slash** (`DESIGN (1).md`), into one original direction. The **Website Checklist.pdf** supplies firm facts and client requirements. The user's later direction calls for a more distinctive composition and stronger scrolling animation. Instructions inside the references are design observations, not requirements to reproduce those financial brands. Client brand colours, law-firm use, and that explicit animation direction take precedence over the references' palettes, product modules, and motion limits.

## What the references contribute

| Decision | Origin contribution | Slash contribution | Unified decision and rationale |
| --- | --- | --- | --- |
| Atmosphere | Quiet dark canvas; restrained, large serif type | Near-black editorial character | Near-black forest framing creates authority while connecting to the client's green palette. |
| Composition | Atmospheric image and spacious rhythm | Strong typographic hierarchy and editorial modules | A monumental centred two-line headline sits above a panoramic architectural image. Asymmetric practice rows, a large arch monogram, a sticky approach introduction, and offset guide tiles make each chapter distinct. |
| Typography | Light display weight; an occasional italic word | Clear serif/sans division; Inter for UI | Self-hosted Cormorant Garamond for display, Inter for body and UI. This retains contrast without relying on commercial reference fonts. |
| Palette | Monochrome foundation plus many feature colours | One tightly controlled copper accent | Green, white, grey, and black, as specified by the client. Violet, cyan, copper, and gold are excluded from interface tokens. |
| Reading surfaces | Occasional inverted light card | Continuous dark page | Ivory light sections hold service descriptions and contact details; dark hero, navigation, selected callout, and footer provide rhythm. Long legal copy benefits from a reading-friendly light surface. |
| Shape | 8px controls and generous rounded cards | 10px cards, pill controls | Sharp or modest corners on structural surfaces, pill actions and filters, and deliberate arch silhouettes for the mobile image, firm artwork, and guide illustrations. Curves become an architectural motif rather than a generic card treatment. |
| Structure | Clean surface steps and restrained elevation | Hairline borders and curated grids | Hairline rules, whitespace, and surface changes establish hierarchy. Ordinary content cards have no decorative shadows. |
| Conversion | Bright primary action | A scarce high-contrast primary action | One dominant consultation action per section; direct call, email, and WhatsApp paths support it. |
| Motion | Atmospheric entrances and border traces | Quiet state changes and editorial emphasis | The user's stronger-animation direction adds masked headline entrances, native CSS image parallax, a sequential statement colour wipe, staggered chapter entrances, SVG stroke traces, and a reading-progress rule. Browser-native scroll and reduced-motion fallbacks remain fundamental. |
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
| Service headline | Cormorant Garamond 400–500 | 31–52px | 27–35px | Featured first row is larger; keep recognizable practice names |
| Intro / lead | Inter 400 | 15–18px | 13–16px | 1.65–1.85 line height |
| Body | Inter 400 | 13–16px | 12–16px | 1.65–1.9 line height; retain readable contrast and zoom behaviour |
| UI | Inter 500 | 11–14px | 10–14px | Compact editorial labels with adequate touch targets |
| Eyebrow | Inter 500–600 | 9–11px | 8–11px | Uppercase, modest 0.10–0.18em tracking; only short supporting text |

Serif type communicates thoughtfulness and gravitas; sans text handles tasks. Limit the number of font weights and avoid forcing the source references' third monospace voice into a site without data modules.

### Layout and spacing

- Content container: up to approximately 1320px; centered with fluid margins.
- Desktop gutters: approximately 48px; tablet: 28–40px; mobile: 20–24px.
- Desktop sections: approximately 110–135px vertical breathing room; mobile: approximately 45–85px according to chapter density.
- Use a 4px spacing base and practical steps: 8, 12, 16, 24, 32, 48, 64, 96, 120.
- Pair narrow section introductions with larger content columns. Use alignment and thin rules to carry the editorial structure.
- Collapse supporting metadata and editorial grids to a single column at widths where the content becomes cramped. Unpin sticky introductions on mobile. Responsive decisions follow readable content, not a fixed list of device names.
- Decorative negative space must not push the first useful service or contact action unnecessarily far below the mobile hero.

### Imagery and identity

The hero uses an original generated conceptual photograph, `public/threshold.webp`: a limestone colonnade with considered light, stone, quiet planting, and a forest-toned scene. It supplies atmosphere and a visual threshold, not documentary evidence of the firm's premises. Do not label it as the actual office or imply it depicts a courthouse, staff, or clients. On desktop it reads as a broad panorama; on mobile it is cropped into an arch that repeats elsewhere in the visual system.

Avoid gavels, scales-of-justice stock photography, generic handshakes, invented advocate portraits, financial dashboards, and awards. Actual office photography and approved advocate portraits can replace supporting artwork later. Use intrinsic image dimensions, suitable compression, and responsive loading. Reserve eager/high-priority loading for the hero artwork; defer below-fold imagery.

The uploaded checklist does not include a high-resolution logo asset. A typographic firm wordmark and an original, clearly provisional monogram may support the current build. Replace these when the client supplies its approved logo; do not present a placeholder as an established identity.

## Page composition and interactions

### Navigation

A compact dark navigation band holds the wordmark, anchors to the firm's overview, practice areas, approach or insights, and contact, plus a restrained consultation action. Maintain a visible focus state. A mobile disclosure menu must announce its expanded state, close after navigation, support keyboard operation, and avoid blocking document scrolling accidentally. Include a skip-to-main link.

### Hero

Use a monumental centred composition. Set the supplied tagline across two display lines: **“Legal solutions.”** and italic **“Made practical.”** The punctuation and line break create the composition while preserving the original words. A short practice/location eyebrow introduces it. Below, a three-part metadata strip balances the concise checklist-grounded description, consultation/practice actions, and factual location. The generated colonnade spans the container beneath it.

Masked headline lines enter over approximately 1.1 seconds; the image follows with a 1.4-second crop reveal. Native CSS view-timeline parallax creates a small translation and scale change as the image leaves the viewport. Do not bind these effects to a JavaScript render loop. The mobile image adopts an arch crop without changing the meaning or contact routes.

Use an ivory filled action on the dark canvas and a quieter secondary text or outline link to practice areas. Do not add fictitious review stars or outcomes. Support the hero with only verifiable details such as the office location and service area.

### Firm overview

A dark statement chapter follows the hero: **“Law can be complex. Your next step should feel clear.”** Words remain readable in a subdued green base colour while a sequential ivory colour wipe follows the section's native view timeline. This is editorial messaging, not an outcome guarantee.

A light sage/ivory firm chapter pairs the supplied description with a substantial arch panel containing an original R/K monogram and the guiding principle. Present mission and vision without turning the content into generic cards. Values appear as concise labelled principles tied to practical client needs. The arch panel may remain sticky within its chapter on desktop; it returns to normal document flow on mobile.

### Practice areas

All **nine** supplied practice areas must remain discoverable. A full-width first row establishes emphasis, followed by a two-column numbered editorial grid with hairline separators. Each item pairs a number, restrained icon, recognizable practice title, explanatory copy, and a clear route to the full scope. Category filters and service disclosures work with keyboard and touch, retain focus sensibly, and keep their active state understandable without colour alone. Staggered entrances support the sequence when new filtered items appear.

Avoid inventing additional specialisms or replacing the client's personal injury and general advisory services with more fashionable labels. Concise display labels may be used where the full title and supplied scope remain accessible.

### Approach

Explain an understandable progression such as an initial conversation, assessing the legal and practical context, and agreeing the appropriate route forward. A sticky introduction balances three vertically stacked illustrated steps on desktop. Each step pairs clear copy with a geometric line drawing whose SVG stroke traces as the card enters the viewport. On mobile the introduction is static and the steps remain in normal flow.

These are editorial explanations, not promises of a fixed response time, free consultation, guaranteed resolution, or a particular legal result. Reflect the client's stated use of negotiation, ADR, and litigation.

### Insights and reviews

The checklist provides no article copy or testimonial quotations. Do not fabricate attributed articles, dates, bylines, quotations, or client outcomes. The build includes original general educational guides, with a general-information notice and no claim that they were written or endorsed by a named advocate. The copy remains subject to legal/editorial review before publication. Three offset arch illustrations and staggered entrances create a distinctive sequence; offset spacing collapses on mobile. Opening a guide must provide real readable content rather than a dead article link.

A genuine Google Business link can offer an external route to reviews. Listed organizations in the checklist are possible future testimonial sources; their names are not permission to publish endorsements or client logos.

### Contact

Present the complete office address, both telephone numbers, both email addresses, opening hours, map/Google Business route, and WhatsApp options. Preserve Kenyan local display numbers while links use international `+254` formatting.

Keep a consultation form short: name, contact information, practice area if helpful, and a brief message. Provide persistent labels, appropriate autocomplete, client-side validation, clear error messages, and accessible status feedback. Invite an initial outline; discourage sending sensitive documents before agreeing a secure channel.

**Current integration boundary:** no server email provider or form endpoint has been supplied. A form may prepare a `mailto:` draft or open a chosen WhatsApp conversation, but its CTA and feedback must describe that action accurately. Never display “message sent” without a confirmed backend response. A secure server integration requires separate configuration and tested delivery.

### Footer

A dark footer closes the page with the wordmark, full contact routes, practice/location navigation, the supplied social links, office hours where useful, and a concise general-information notice. Do not ship dead privacy/terms links. Any drafted privacy content must describe the actual site's data handling and remain subject to client review before publication.

## Motion and scroll performance

Preserve browser-native scrolling while delivering the user's requested expressive motion. No scroll hijacking or smooth-scroll library. CSS smooth anchor scrolling respects reduced-motion settings; anchor targets clear the sticky header. Native scroll/view timelines progressively enhance supported browsers, and a readable static composition remains available elsewhere.

| Effect | Trigger and treatment | Fallback / accessibility requirement |
| --- | --- | --- |
| Hero headline | Masked line translation, approximately 1100ms, with second-line delay | Disable under reduced motion; never clip text in the resting state. |
| Hero image entrance | Approximately 1400ms crop/translate reveal | Image remains visible without animation support. |
| Hero image parallax | CSS view-timeline; small translation from approximately -1% to 3% and scale from 1.08 to 1.12 | Static crop in unsupported browsers and reduced-motion mode; no scroll handler. |
| Reading progress | Two-pixel header rule, CSS root scroll timeline | Decorative, noninteractive, hidden under reduced motion; never the only way to orient within the page. |
| Statement emphasis | Word-by-word ivory wipe over a readable green base using a section view timeline | All words remain readable before the wipe and without timeline support. |
| Chapter/grid reveal | Approximately 700ms transform entrance, 32px travel; sibling delays around 80ms capped at 300ms | Controls stay readable/operable; focus reveals pending ancestors immediately; first-viewport content is not hidden waiting for an observer. |
| Approach illustration | SVG stroke trace follows its card's view timeline | Full line drawing remains visible without motion. |
| Hover/focus | Short colour, underline or arrow changes, approximately 150–300ms | Equivalent visible focus indication; no essential information appears only on hover. |

- Use one `IntersectionObserver` for reveal visibility and unobserve completed targets. One `MutationObserver` registers newly mounted filtered items or modal content. Avoid per-frame React state updates.
- React to reduced-motion preference changes during the session; reveal pending content immediately when motion is disabled.
- Keep rendered content visible when the motion enhancement is unavailable or observers cannot initialize. Native scrolling must remain operable while menus and modals correctly manage their own state. The React application still requires JavaScript unless a separate prerendering strategy is added.
- Avoid layout-affecting animated height/width during scrolling, permanent `will-change` on every section, and continuous unrelated background animation.

### Required validation

1. Production build succeeds and the preview route opens without console errors.
2. All nine practice areas, checklist contacts, navigation, mobile menu, and consultation paths work.
3. At representative desktop and mobile sizes, there is no horizontal overflow, clipped text, or content hidden behind the sticky header.
4. Keyboard navigation, visible focus, form validation, and reduced-motion behaviour work; automated accessibility checks support manual review.
5. Run a reproducible scroll exercise in a real browser against the production preview: scroll through the page in both directions; record frame timing and main-thread long tasks; inspect layout shifts; exercise mobile dimensions and CPU throttling separately where available.

Performance evidence must identify browser, viewport, run conditions, sample count, p95 frame interval, delayed-frame share, and long-task duration. A target of p95 frame intervals around 20ms or lower on an unthrottled 60Hz-capable run is a useful diagnostic, not a promise that every device will hold 60fps. Throttled results must be reported separately, not averaged into desktop results. Investigate long tasks above 50ms that occur during the active scroll window, and verify whether a measured delay belongs to loading, browser scheduling, or application code before claiming a fix.

### Optional later enhancements

Approved portraits and biographies, genuine client testimonials, reviewed legal articles, a tested delivery backend, analytics chosen with privacy requirements in mind, and a verified map embed can enrich the site once those inputs exist. They are not prerequisites for a complete, polished local React experience.

## Acceptance and editorial guardrails

- Deliver a React website using this original design direction and the factual checklist.
- Keep the supplied tagline, all nine service scopes, the firm's mission/vision, address, hours, and contact paths accurate.
- Premium presentation should make legal help easier to understand and contact, with readable mobile content and prompt interaction.
- Do not publish unverified achievements, outcome guarantees, fake endorsements, invented team members, or misleading form confirmations.
- Record missing client assets and integration requirements in the checklist so final publication review has clear next steps.
