# R. K. Njogu & Company Advocates — Unified Design Direction

## The idea

**Practical law. Considered design.**

A premium editorial website for a Kenyan legal practice: grounded in its place, generous in its typography, precise in its navigation, and clear about how a prospective client can get help. The firm's supplied promise, **“Legal Solutions Made Practical”**, leads the experience. Quality comes from art direction, legibility, complete information, and dependable interaction.

This document combines the two supplied references, **Origin Financial** (`DESIGN.md`) and **Slash** (`DESIGN (1).md`), into one original direction. The **Website Checklist.pdf** supplies firm facts and client requirements. Instructions inside the references are design observations, not requirements to reproduce those financial brands. Client brand colours and law-firm use take precedence over the references' palettes, product modules, and marketing examples.

## What the references contribute

| Decision | Origin contribution | Slash contribution | Unified decision and rationale |
| --- | --- | --- | --- |
| Atmosphere | Quiet dark canvas; restrained, large serif type | Near-black editorial character | Near-black forest framing creates authority while connecting to the client's green palette. |
| Composition | Atmospheric image and spacious rhythm | Split hero with a strong left headline | A left-aligned display headline balances a substantial architectural artwork on the right; supporting sections use asymmetric editorial layouts. |
| Typography | Light display weight; an occasional italic word | Clear serif/sans division; Inter for UI | Self-hosted Cormorant Garamond for display, Inter for body and UI. This retains contrast without relying on commercial reference fonts. |
| Palette | Monochrome foundation plus many feature colours | One tightly controlled copper accent | Green, white, grey, and black, as specified by the client. Violet, cyan, copper, and gold are excluded from interface tokens. |
| Reading surfaces | Occasional inverted light card | Continuous dark page | Ivory light sections hold service descriptions and contact details; dark hero, navigation, selected callout, and footer provide rhythm. Long legal copy benefits from a reading-friendly light surface. |
| Shape | 8px controls and generous rounded cards | 10px cards, pill controls | Mostly sharp or modest 2–10px corners. Pills are reserved for genuine category/status labels. Large rounded fintech feature tiles would weaken the editorial direction. |
| Structure | Clean surface steps and restrained elevation | Hairline borders and curated grids | Hairline rules, whitespace, and surface changes establish hierarchy. Ordinary content cards have no decorative shadows. |
| Conversion | Bright primary action | A scarce high-contrast primary action | One dominant consultation action per section; direct call, email, and WhatsApp paths support it. |
| Motion | Restrained transitions; no parallax | Quiet interaction and content emphasis | Native scrolling, short state transitions, and small one-time viewport reveals. The reference's long 2.5-second hero reveal is shortened to protect responsiveness. |
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
| `--ink` | `#11211b` | Near-black forest hero, navigation, footer; primary text on light backgrounds |
| `--forest` | `#214b39` | Primary green action on ivory, editorial accent, selected state |
| `--forest-hover` | `#17392b` | Darker interactive green |
| `--sage` | `#b7c9ba` | Soft green detail on dark surfaces; never the only state cue |
| `--paper` | `#f7f6f0` | Main light reading surface |
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
| Hero display | Cormorant Garamond 400 | Fluid 68–104px | Fluid 46–62px | 0.96–1.05 line height; restrained italic emphasis; avoid clipped ascenders/descenders |
| Section heading | Cormorant Garamond 400 | 44–64px | 36–44px | 1.02–1.12 line height; controlled line lengths |
| Service headline | Cormorant Garamond 400–500 | 28–36px | 27–32px | Keep recognizable practice names |
| Intro / lead | Inter 400 | 17–19px | 16–18px | 1.65–1.8 line height |
| Body | Inter 400 | 15–16px | 15–16px | 1.65–1.8 line height; readable measure around 60–70 characters |
| UI | Inter 500 | 13–15px | 13–15px | Plain labels and adequate touch targets |
| Eyebrow | Inter 500–600 | 10–12px | 10–12px | Uppercase, modest 0.12–0.18em tracking; only short supporting text |

Serif type communicates thoughtfulness and gravitas; sans text handles tasks. Limit the number of font weights and avoid forcing the source references' third monospace voice into a site without data modules.

### Layout and spacing

- Content container: approximately 1200–1240px; centered with fluid margins.
- Desktop gutters: 48–64px; tablet: 28–40px; mobile: 20–24px.
- Desktop sections: approximately 96–140px vertical breathing room; mobile: 64–84px.
- Use a 4px spacing base and practical steps: 8, 12, 16, 24, 32, 48, 64, 96, 120.
- Pair narrow section introductions with larger content columns. Use alignment and thin rules to carry the editorial structure.
- Collapse grids and the split hero to a single column at widths where the content becomes cramped. Responsive decisions follow readable content, not a fixed list of device names.
- Decorative negative space must not push the first useful service or contact action unnecessarily far below the mobile hero.

### Imagery and identity

The hero uses original local architectural artwork: considered light, stone, an arch or threshold, quiet planting, and a forest-toned scene. It is visual atmosphere rather than a photograph of the firm's premises. Do not label it as the actual office or imply it depicts a courthouse, staff, or clients.

Avoid gavels, scales-of-justice stock photography, generic handshakes, invented advocate portraits, financial dashboards, and awards. Actual office photography and approved advocate portraits can replace supporting artwork later. Use intrinsic image dimensions, suitable compression, and responsive loading. Reserve eager/high-priority loading for the hero artwork; defer below-fold imagery.

The uploaded checklist does not include a high-resolution logo asset. A typographic firm wordmark and an original, clearly provisional monogram may support the current build. Replace these when the client supplies its approved logo; do not present a placeholder as an established identity.

## Page composition and interactions

### Navigation

A compact dark navigation band holds the wordmark, anchors to the firm's overview, practice areas, approach or insights, and contact, plus a restrained consultation action. Maintain a visible focus state. A mobile disclosure menu must announce its expanded state, close after navigation, support keyboard operation, and avoid blocking document scrolling accidentally. Include a skip-to-main link.

### Hero

Use a balanced split composition. The left column includes a short location or practice eyebrow, the supplied tagline as the central message, a concise description grounded in the checklist, and a clear consultation CTA. The right column holds the architectural artwork with a careful crop and a small factual location caption if appropriate.

Use an ivory filled action on the dark canvas and a quieter secondary text or outline link to practice areas. Do not add fictitious review stars or outcomes. Support the hero with only verifiable details such as the office location and service area.

### Firm overview

An ivory editorial band introduces the firm using the supplied description. Present mission and vision without turning the content into large generic cards. Values can appear as concise labelled principles tied to practical client needs.

### Practice areas

All **nine** supplied practice areas must remain discoverable. Use rows or a disciplined grid rather than oversized colour tiles. Each item pairs a number or restrained icon, the recognizable practice title, and useful explanatory copy. A service-selection or disclosure interaction should work with keyboard and touch, retain focus sensibly, and keep its active state understandable without colour alone.

Avoid inventing additional specialisms or replacing the client's personal injury and general advisory services with more fashionable labels. Concise display labels may be used where the full title and supplied scope remain accessible.

### Approach

Explain an understandable progression such as an initial conversation, assessing the legal and practical context, and agreeing the appropriate route forward. These are editorial explanations, not promises of a fixed response time, free consultation, guaranteed resolution, or a particular legal result. Reflect the client's stated use of negotiation, ADR, and litigation.

### Insights and reviews

The checklist provides no article copy or testimonial quotations. Do not fabricate attributed articles, dates, bylines, quotations, or client outcomes. If an insights area is included, publish only general educational content clearly labelled for review, with a general-information notice and no claim that it was written or endorsed by a named advocate. Prefer a useful topic-led enquiry path over empty article cards.

A genuine Google Business link can offer an external route to reviews. Listed organizations in the checklist are possible future testimonial sources; their names are not permission to publish endorsements or client logos.

### Contact

Present the complete office address, both telephone numbers, both email addresses, opening hours, map/Google Business route, and WhatsApp options. Preserve Kenyan local display numbers while links use international `+254` formatting.

Keep a consultation form short: name, contact information, practice area if helpful, and a brief message. Provide persistent labels, appropriate autocomplete, client-side validation, clear error messages, and accessible status feedback. Invite an initial outline; discourage sending sensitive documents before agreeing a secure channel.

**Current integration boundary:** no server email provider or form endpoint has been supplied. A form may prepare a `mailto:` draft or open a chosen WhatsApp conversation, but its CTA and feedback must describe that action accurately. Never display “message sent” without a confirmed backend response. A secure server integration requires separate configuration and tested delivery.

### Footer

A dark footer closes the page with the wordmark, full contact routes, practice/location navigation, the supplied social links, office hours where useful, and a concise general-information notice. Do not ship dead privacy/terms links. Any drafted privacy content must describe the actual site's data handling and remain subject to client review before publication.

## Motion and scroll performance

Preserve browser-native scrolling. No scroll hijacking, smooth-scroll library, parallax transforms, continuous background animation, or large sticky blur layer. CSS smooth anchor scrolling is optional and must respect reduced-motion settings. Ensure anchor targets clear any sticky header.

- Hover/focus state transitions: roughly 150–220ms; only colour, opacity, or transform when useful.
- Section reveal: one-time translate transition around 350–600ms, with a small 12–24px movement. Text stays fully opaque so contrast remains readable throughout the transition.
- Use one `IntersectionObserver` for reveal visibility, unobserve completed targets, and avoid per-frame React state updates.
- Show content immediately when JavaScript is unavailable or reduced motion is requested.
- No layout-affecting animated height/width during scrolling. Avoid indefinite `will-change` on every section.

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
