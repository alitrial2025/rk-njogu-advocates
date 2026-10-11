import { useEffect } from "react";

const revealSelector = "[data-reveal], [data-reveal-group] > *";
const interactiveSelector =
  "a[href], button, input, select, textarea, summary, [tabindex]";

/** Progressive enhancement: native scrolling, one observer, no render loop. */
export function useScrollMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const registered = new Set<HTMLElement>();
    const statementWords = new Set<HTMLElement>();
    let intersection: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => {
      element.classList.add("is-visible");
      element.classList.remove("motion-pending");
      intersection?.unobserve(element);
    };

    const register = () => {
      document
        .querySelectorAll<HTMLElement>(".statement")
        .forEach((section) => {
          const words =
            section.querySelectorAll<HTMLElement>(".statement-word");
          words.forEach((word, index) => {
            if (statementWords.has(word)) return;
            statementWords.add(word);
            // Spread each wipe across the middle of the section's view timeline.
            const start = 20 + (index / Math.max(words.length, 1)) * 44;
            word.style.setProperty("--word-start", `${start.toFixed(2)}%`);
            word.style.setProperty("--word-end", `${(start + 12).toFixed(2)}%`);
          });
        });

      document
        .querySelectorAll<HTMLElement>(revealSelector)
        .forEach((element) => {
          if (registered.has(element)) return;
          registered.add(element);
          const group = element.parentElement?.matches("[data-reveal-group]")
            ? element.parentElement
            : null;
          const index = group
            ? Array.prototype.indexOf.call(group.children, element)
            : 0;
          element.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 80, 300)}ms`,
          );
          if (
            element.matches(interactiveSelector) ||
            element.querySelector(interactiveSelector)
          ) {
            element.classList.add("motion-has-controls");
          }

          // The first viewport is immediately readable; only later content enters.
          const bounds = element.getBoundingClientRect();
          const onScreen =
            bounds.bottom > 0 && bounds.top < window.innerHeight + 24;
          if (
            !intersection ||
            preference.matches ||
            onScreen ||
            element.classList.contains("is-visible")
          ) {
            reveal(element);
            return;
          }

          // Observe before adding the pending class: failed enhancement never hides text.
          intersection.observe(element);
          element.classList.add("motion-pending");
        });
    };

    const configure = () => {
      intersection?.disconnect();
      intersection = null;
      document.body.classList.remove("motion-ready");

      if (preference.matches || !("IntersectionObserver" in window)) {
        registered.forEach(reveal);
        register();
        return;
      }

      intersection = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          });
        },
        { threshold: 0.01, rootMargin: "0px 0px 24px 0px" },
      );

      // Re-register still-pending nodes after a preference change without replaying
      // content the reader has already seen.
      registered.forEach((element) => {
        if (!element.classList.contains("is-visible"))
          intersection?.observe(element);
      });
      register();
      document.body.classList.add("motion-ready");
    };

    const focusContent = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      let ancestor = event.target.closest<HTMLElement>(".motion-pending");
      while (ancestor) {
        reveal(ancestor);
        ancestor =
          ancestor.parentElement?.closest<HTMLElement>(".motion-pending") ??
          null;
      }
    };

    configure();
    const changes = new MutationObserver(register);
    changes.observe(document.body, { childList: true, subtree: true });
    preference.addEventListener("change", configure);
    document.addEventListener("focusin", focusContent);

    return () => {
      intersection?.disconnect();
      changes.disconnect();
      preference.removeEventListener("change", configure);
      document.removeEventListener("focusin", focusContent);
      document.body.classList.remove("motion-ready");
      registered.forEach((element) => {
        element.classList.remove(
          "motion-pending",
          "is-visible",
          "motion-has-controls",
        );
        element.style.removeProperty("--reveal-delay");
      });
      statementWords.forEach((word) => {
        word.style.removeProperty("--word-start");
        word.style.removeProperty("--word-end");
      });
    };
  }, []);
}
