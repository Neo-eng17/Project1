const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initLazySections() {
  const sections = document.querySelectorAll("[data-lazy-section]");
  const revealItems = document.querySelectorAll(".reveal-item");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => entry.target.classList.add("is-visible"));
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "180px 0px", threshold: 0.05 });

  const itemObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => entry.target.classList.add("is-visible"));
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "120px 0px", threshold: prefersReducedMotion ? 0 : 0.12 });

  sections.forEach((section) => sectionObserver.observe(section));
  revealItems.forEach((item) => itemObserver.observe(item));
}

export function idle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1600 });
    return;
  }
  window.setTimeout(callback, 1);
}
