import { siteConfig } from "../config.js";
import { createModalController, setStatus } from "./ui.js";
import { consumeReturnRoute, getRedirectUrl, getSupabase, rememberCurrentRoute } from "./supabaseClient.js";

export function initAuthModal() {
  const modal = document.querySelector("[data-auth-modal]");
  const controller = createModalController(modal, ["[data-auth-close]"]);
  if (!modal || !controller) return;

  document.querySelectorAll("[data-auth-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      rememberCurrentRoute();
      controller.open();
    });
  });

  initTabs(modal);
  initForms(modal, controller);
  updateAuthButtons();
}

function initTabs(root) {
  const tabs = root.querySelectorAll("[data-auth-tab]");
  const forms = root.querySelectorAll("[data-auth-form]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.authTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      forms.forEach((form) => form.classList.toggle("active", form.dataset.authForm === target));
    });
  });
}

function initForms(root, controller) {
  const status = root.querySelector("[data-auth-status]");
  const googleButton = root.querySelector("[data-google-login]");

  googleButton?.addEventListener("click", async () => {
    try {
      rememberCurrentRoute();
      setBusy(googleButton, true);
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(siteConfig.supabase.redirectPath),
          queryParams: { access_type: "offline", prompt: "consent" }
        }
      });
      if (error) throw error;
    } catch (error) {
      setStatus(status, error.message, "error");
      setBusy(googleButton, false);
    }
  });

  root.querySelector("[data-auth-form='signin']")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const data = new FormData(form);

    try {
      setBusy(button, true);
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizeEmail(data.get("email")),
        password: String(data.get("password"))
      });
      if (error) throw error;
      setStatus(status, "Login successful. Redirecting...", "success");
      controller.close();
      window.location.assign(consumeReturnRoute("/dashboard/"));
    } catch (error) {
      setStatus(status, error.message, "error");
    } finally {
      setBusy(button, false);
    }
  });

  root.querySelector("[data-auth-form='signup']")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const data = new FormData(form);

    try {
      setBusy(button, true);
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signUp({
        email: sanitizeEmail(data.get("email")),
        password: String(data.get("password")),
        options: {
          emailRedirectTo: getRedirectUrl(siteConfig.supabase.redirectPath),
          data: { full_name: sanitizeText(data.get("fullName")) }
        }
      });
      if (error) throw error;
      setStatus(status, "Account created. Check your email to verify your account.", "success");
      form.reset();
    } catch (error) {
      setStatus(status, error.message, "error");
    } finally {
      setBusy(button, false);
    }
  });

  root.querySelector("[data-auth-form='forgot']")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type='submit']");
    const data = new FormData(form);

    try {
      setBusy(button, true);
      const supabase = await getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizeEmail(data.get("email")), {
        redirectTo: getRedirectUrl(siteConfig.supabase.resetPath)
      });
      if (error) throw error;
      setStatus(status, "Password reset link sent. Check your inbox.", "success");
      form.reset();
    } catch (error) {
      setStatus(status, error.message, "error");
    } finally {
      setBusy(button, false);
    }
  });
}

export async function updateAuthButtons() {
  try {
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getSession();
    document.querySelectorAll("[data-auth-open]").forEach((button) => {
      button.textContent = data.session ? "Dashboard" : button.textContent;
      if (data.session) {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.assign("/dashboard/");
        }, { once: true });
      }
    });
  } catch {
    // The public landing page remains usable before Supabase credentials are added.
  }
}

export async function protectRoute() {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    rememberCurrentRoute();
    window.location.replace("/");
    return null;
  }
  return { supabase, session: data.session };
}

export async function handleOAuthCallback() {
  const supabase = await getSupabase();
  await supabase.auth.getSession();
  window.location.replace(consumeReturnRoute("/dashboard/"));
}

export async function initResetPasswordPage() {
  const form = document.querySelector("[data-reset-form]");
  const status = document.querySelector("[data-reset-status]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const password = String(new FormData(form).get("password"));

    try {
      setBusy(button, true);
      const supabase = await getSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus(status, "Password updated. Redirecting to your dashboard...", "success");
      window.setTimeout(() => window.location.assign("/dashboard/"), 800);
    } catch (error) {
      setStatus(status, error.message, "error");
    } finally {
      setBusy(button, false);
    }
  });
}

export async function initDashboard() {
  const protectedContext = await protectRoute();
  if (!protectedContext) return;
  const { supabase, session } = protectedContext;
  const emailTarget = document.querySelector("[data-user-email]");
  if (emailTarget) emailTarget.textContent = session.user.email || "Member";

  document.querySelector("[data-logout]")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  });
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
  button.textContent = busy ? "Please wait..." : button.dataset.originalText;
}
