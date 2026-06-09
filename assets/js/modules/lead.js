import { siteConfig } from "../config.js";
import { idle } from "./lazy.js";
import { createModalController, setStatus } from "./ui.js";

let emailJsPromise;

export function initLeadCapture() {
  const modal = document.querySelector("#leadModal");
  const controller = createModalController(modal, ["[data-modal-close]"]);
  const form = document.querySelector("[data-lead-form]");
  const skillInput = document.querySelector("[data-skill-input]");
  const status = document.querySelector("[data-lead-status]");

  if (!modal || !controller || !form || !skillInput) return;

  document.querySelectorAll("[data-lead-open]").forEach((button) => {
    button.addEventListener("click", () => {
      skillInput.value = button.dataset.skill || "";
      setStatus(status, "", "neutral");
      controller.open();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    const data = new FormData(form);
    const skill = sanitizeText(data.get("skill")) || "Digital Marketing";

    try {
      setBusy(submit, true);
      const emailjs = await loadEmailJs();
      await emailjs.send(siteConfig.emailJs.serviceId, siteConfig.emailJs.templateId, {
        name: sanitizeText(data.get("name")),
        email: sanitizeEmail(data.get("email")),
        ebook: skill,
        ebook_link: siteConfig.ebookLinks[skill] || siteConfig.ebookLinks["Digital Marketing"]
      });
      form.reset();
      setStatus(status, "Success. Please check your inbox and spam folder.", "success");
    } catch (error) {
      setStatus(status, error.message || "We could not send the eBook. Please try again.", "error");
    } finally {
      setBusy(submit, false);
    }
  });
}

export function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  const status = document.querySelector("[data-newsletter-status]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = sanitizeEmail(new FormData(form).get("email"));
    if (!email) {
      setStatus(status, "Enter a valid email address.", "error");
      return;
    }
    setStatus(status, "Thanks. Newsletter backend can now be connected to Supabase Edge Functions.", "success");
    form.reset();
  });
}

function loadEmailJs() {
  if (!emailJsPromise) {
    emailJsPromise = new Promise((resolve, reject) => {
      idle(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        script.async = true;
        script.onload = () => {
          window.emailjs.init(siteConfig.emailJs.publicKey);
          resolve(window.emailjs);
        };
        script.onerror = () => reject(new Error("Email service failed to load."));
        document.head.append(script);
      });
    });
  }
  return emailJsPromise;
}

function sanitizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeText(value) {
  return String(value || "").trim().replace(/[<>]/g, "");
}

function setBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.dataset.originalText ||= button.textContent;
  button.textContent = busy ? "Sending..." : button.dataset.originalText;
}
