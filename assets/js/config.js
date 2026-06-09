export const siteConfig = {
  siteUrl: "https://mkwriters.co.ke",
  siteName: "MK Writers",
  emailJs: {
    publicKey: "_0eZp1hDuK5hhUGB9",
    serviceId: "service_1mxwm31",
    templateId: "template_6hujzum"
  },
  ebookLinks: {
    "Digital Marketing": "https://example.com/digital-marketing.pdf",
    "Web Development": "https://example.com/web-development.pdf",
    "Graphic Design": "https://example.com/graphic-design.pdf",
    "Academic Writing": "https://example.com/academic-writing.pdf"
  },
  supabase: {
    url: "https://YOUR_PROJECT_REF.supabase.co",
    anonKey: "YOUR_SUPABASE_ANON_KEY",
    redirectPath: "/auth/callback.html",
    resetPath: "/auth/reset.html"
  }
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = siteConfig.supabase;
  return url.startsWith("https://") && !url.includes("YOUR_PROJECT_REF") && anonKey !== "YOUR_SUPABASE_ANON_KEY";
};
