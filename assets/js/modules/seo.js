import { siteConfig } from "../config.js";

export function initSeoRuntime() {
  document.querySelector("[data-current-year]")?.replaceChildren(String(new Date().getFullYear()));

  const canonical = document.querySelector("link[rel='canonical']");
  if (canonical && window.location.hostname !== "localhost") {
    canonical.href = new URL(window.location.pathname, siteConfig.siteUrl).toString();
  }
}
