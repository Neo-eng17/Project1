import { isSupabaseConfigured, siteConfig } from "../config.js";

let clientPromise;

export async function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Update assets/js/config.js with your project URL and anon key.");
  }

  if (!clientPromise) {
    clientPromise = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm")
      .then(({ createClient }) => createClient(siteConfig.supabase.url, siteConfig.supabase.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storage: window.localStorage
        }
      }));
  }

  return clientPromise;
}

export function getRedirectUrl(path) {
  return new URL(path, window.location.origin).toString();
}

export function rememberCurrentRoute() {
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.sessionStorage.setItem("mk-return-to", current);
}

export function consumeReturnRoute(fallback = "/dashboard/") {
  const stored = window.sessionStorage.getItem("mk-return-to");
  window.sessionStorage.removeItem("mk-return-to");
  return stored || fallback;
}
