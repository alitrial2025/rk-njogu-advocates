# Browser and scroll validation

Measured 2026-10-11T16:14:04.169Z using Chromium 154.0.8037.57 against http://127.0.0.1:4173/rk-njogu-advocates/.

## What was exercised

The production preview was tested at 1440 × 1000 and 390 × 844 CSS pixels, with additional horizontal-overflow checks at 320, 768 and 1024 CSS pixels. Native wheel input moved the full document down and back up. requestAnimationFrame intervals were sampled throughout each traversal; an idle baseline was collected separately in the same browser session. A mobile-sized repeat used Chrome DevTools 4× CPU slowdown. A separate mobile browser overrides JavaScript scroll-timeline feature detection to exercise the production fallback; its native-wheel traversal appears as the fallback-mobile profile. PerformanceObserver recorded tasks over 50ms and layout shifts during traversal.

| Profile | Idle median ms | Scroll mean ms | Scroll p95 ms | Scroll max ms | Intervals > 1.5× idle | Long tasks / longest | Scroll-window CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| desktop | 16.7 | 16.73 | 16.8 | 33.4 | 0.38% | 0 / 0ms | 0 |
| mobile | 16.7 | 16.71 | 16.7 | 33.3 | 0.25% | 0 / 0ms | 0 |
| mobile-cpu-4x | 16.7 | 16.75 | 16.8 | 33.3 | 0.51% | 0 / 0ms | 0 |
| fallback-mobile | 16.7 | 16.71 | 16.8 | 33.3 | 0.25% | 0 / 0ms | 0 |

A delayed interval is greater than 1.5 times that profile's measured idle median. This flags missed presentation opportunities; it does not identify their cause. The JSON report also includes a derived skipped-frame estimate and the raw timing samples. CLS uses the largest session window, with up to one second between shifts and a maximum five-second window.

No profile crossed the harness warning thresholds (p95 > 2× idle, delayed intervals > 10%, a task > 200ms, or CLS > 0.1).

## Functional and accessibility checks

60 checks passed; 0 failed. 0 automated WCAG A/AA violations were reported by axe across desktop, mobile, open practice dialogs and the open mobile menu. Checks cover section links, all four practice filters and pressed states, mobile menu state/Escape/link activation, practice-dialog dismissal and focus return, consultation selection and contact keyboard focus, substantive legal guides, expandable FAQ, horizontal overflow, visible intermediate section entrance frames, native reading-progress response to wheel scrolling where supported, measured artwork translation/rotation/scale and decorative text rows moving in opposite directions, readable mobile sticky cards before each handoff, a maximum of four interface arrows, visible and unobscured keyboard focus, complete reveals after full traversal, reduced-motion preference at page load and during a visit, and contact email-draft preparation. Contact checks verify native required-field validation, RFC 6068 mailto encoding, removal of stale drafts after edits, and absence of a claim that a backend delivered the message. The forced unsupported-timeline browser verifies actual fallback artwork/text movement, full-page accessibility, restoration of original inline motion styles under reduced motion, absence of new motion styles after scrolling with that preference, and motion resumption when the preference changes back. Screenshots are captured after full scroll traversal so section reveals have been exercised.

## Limits and reproduction

These measurements come from a cloud execution environment running headless Chromium. They are useful regression evidence, not physical-phone performance, touch-scroll validation, a guarantee of frame rate, or field Core Web Vitals. CPU slowdown simulates constrained main-thread execution; it does not emulate a complete mobile device or slow network. Forced feature detection exercises the fallback in Chromium and does not constitute a physical Safari or Firefox device test. Automated accessibility does not replace manual assistive-technology testing.

Run `npm run build`, start `npm run preview -- --host 0.0.0.0`, then run `BASE_URL=http://127.0.0.1:4173 node scripts/browser-check.mjs`. Use `CHROMIUM_EXECUTABLE` to select another installed Chromium binary.

Evidence: [JSON report](../artifacts/browser-report.json), [desktop screenshot](../artifacts/desktop.png), [mobile screenshot](../artifacts/mobile.png), [reduced-motion screenshot](../artifacts/mobile-reduced-motion.png).
