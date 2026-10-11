/** Scroll-timeline fallback. One scheduled frame per native scroll event, with
 * layout reads grouped before writes and no React rendering or wheel handling. */
export function startScrollFallback() {
  type MotionElement = HTMLElement | SVGElement;
  const originals = new Map<MotionElement, Map<string, string>>();
  let frame = 0;
  let sections: Element[] = [];
  let elements: {
    parent: Element;
    element: MotionElement;
    kind: string;
    index: number;
    count: number;
  }[] = [];
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const range = (value: number, start: number, end: number) =>
    clamp((value - start) / (end - start));

  const write = (element: MotionElement, property: string, value: string) => {
    let values = originals.get(element);
    if (!values) {
      values = new Map();
      originals.set(element, values);
    }
    if (!values.has(property))
      values.set(property, element.style.getPropertyValue(property));
    element.style.setProperty(property, value);
  };

  const render = () => {
    frame = 0;
    const height = window.innerHeight;
    const width = window.innerWidth;
    // Finish every geometry read before updating any animated style.
    const bounds = new Map(
      sections.map((section) => [section, section.getBoundingClientRect()]),
    );
    const documentProgress = clamp(
      window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - height),
    );
    elements.forEach(({ parent, element, kind, index, count }) => {
      const rect = bounds.get(parent)!;
      const progress = clamp((height - rect.top) / (height + rect.height));
      if (
        kind !== "progress" &&
        (rect.bottom < -height || rect.top > height * 2)
      )
        return;
      if (kind === "progress")
        write(element, "transform", `scaleX(${documentProgress})`);
      if (kind === "hero") {
        const amount = clamp(-rect.top / Math.max(1, rect.height));
        write(
          element,
          "transform",
          `translate3d(0,${-1 + amount * 4}%,0) scale(${1.08 + amount * 0.04})`,
        );
      }
      if (kind === "word") {
        const amount = range(
          progress,
          0.2 + (index / count) * 0.44,
          0.32 + (index / count) * 0.44,
        );
        // CSS custom property feeds the existing duplicate decorative text layer.
        write(element, "--fallback-word-inset", `${100 * (1 - amount)}%`);
      }
      if (kind === "frame") {
        const amount = range(progress, 0.12, 0.88);
        const entering = range(amount, 0, 0.42);
        const leaving = range(amount, 0.42, 1);
        write(
          element,
          "transform",
          `translate3d(0,${90 * (1 - entering) - 35 * leaving}px,0) rotate(${-5 * (1 - entering) + 2 * leaving}deg) scale(${0.88 + 0.12 * entering - 0.03 * leaving})`,
        );
      }
      if (kind === "photo") {
        write(
          element,
          "transform",
          `translate3d(0,${-4 + 8 * range(progress, 0.1, 0.9)}%,0) scale(1.14)`,
        );
      }
      if (kind === "orbit")
        write(
          element,
          "transform",
          `rotate(${-35 + 90 * range(progress, 0.1, 0.9)}deg)`,
        );
      if (kind === "letter") {
        const amount = range(progress, 0.1, 0.9);
        const entering = range(amount, 0, 0.5);
        const leaving = range(amount, 0.5, 1);
        const x = index
          ? 35 * (1 - entering) - 22 * leaving
          : -24 * (1 - entering) + 24 * leaving;
        const y = index
          ? 45 * (1 - entering) - 25 * leaving
          : -20 * (1 - entering) + 15 * leaving;
        write(element, "transform", `translate3d(${x}px,${y}px,0)`);
      }
      if (kind === "kinetic")
        write(
          element,
          "transform",
          `translate3d(${(index % 2 ? 1 : -1) * (0.15 - 0.3 * progress) * width}px,0,0)`,
        );
      if (kind === "practice") {
        const amount = parent.matches(":focus-within")
          ? 1
          : range(progress, 0, 0.32);
        write(
          element,
          "transform",
          `translate3d(${(index % 2 ? 65 : -65) * (1 - amount)}px,${60 * (1 - amount)}px,0)`,
        );
      }
      if (kind === "insight") {
        const amount = range(progress, 0.1, 0.8);
        const entering = range(amount, 0, 0.4);
        const leaving = range(amount, 0.4, 1);
        write(
          element,
          "transform",
          `translate3d(0,${75 * (1 - entering) - 28 * leaving}px,0) rotate(${-3 * (1 - entering) + 3 * leaving}deg) scale(${0.9 + 0.1 * entering + 0.02 * leaving})`,
        );
      }
      if (kind === "graphic") {
        const amount = range(progress, 0, 0.55);
        write(
          element,
          "transform",
          `translate3d(${-22 * (1 - amount)}px,${30 - 38 * amount}px,0) rotate(${-18 + 30 * amount}deg) scale(${0.85 + 0.21 * amount})`,
        );
      }
      if (kind === "trace")
        write(
          element,
          "stroke-dashoffset",
          String(1 - range(progress, 0.05, 0.48)),
        );
    });
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const refresh = () => {
    elements = [];
    const add = (parents: string, children: string, kind: string) => {
      document.querySelectorAll(parents).forEach((parent, parentIndex) => {
        const matches = parent.querySelectorAll<MotionElement>(children);
        matches.forEach((element, index) =>
          elements.push({
            parent,
            element,
            kind,
            index: kind === "practice" ? parentIndex : index,
            count: matches.length,
          }),
        );
      });
    };
    add(".site-header", ".reading-progress", "progress");
    add(".hero", ".hero-art img", "hero");
    add(".statement", ".statement-word", "word");
    add(".about", ".about-art", "frame");
    add(".about", ".about-photo", "photo");
    add(".about", ".about-orbit svg", "orbit");
    add(".about", ".about-orbit > span", "letter");
    add(".kinetic-band", ".kinetic-line", "kinetic");
    add(
      ".practice-card",
      ":scope > .card-top, :scope > .practice-description, :scope > .practice-link",
      "practice",
    );
    add(".insight-card", ".insight-art", "insight");
    add(".approach-step", ".step-illustration svg", "graphic");
    add(".approach-step", ".step-trace", "trace");
    sections = [...new Set(elements.map((item) => item.parent))];
    schedule();
  };

  document.body.classList.add("motion-fallback");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("focusin", schedule);
  refresh();
  return {
    refresh,
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.body.classList.remove("motion-fallback");
      originals.forEach((values, element) =>
        values.forEach((value, property) => {
          if (value) element.style.setProperty(property, value);
          else element.style.removeProperty(property);
        }),
      );
    },
  };
}
