export function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.classList.toggle("active", open);
    nav.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("active")), { passive: true });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

export function createModalController(modal, closeSelectors = []) {
  if (!modal) return null;

  const closeButtons = closeSelectors.flatMap((selector) => [...modal.querySelectorAll(selector)]);

  const open = () => {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => modal.querySelector("input, button")?.focus());
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  closeButtons.forEach((button) => button.addEventListener("click", close));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) close();
  });

  return { open, close };
}

export function setStatus(element, message, type = "neutral") {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = type;
}
