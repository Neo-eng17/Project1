# MK Writers Production Landing Page

Production-oriented static frontend with lazy modules, SEO metadata, Supabase authentication, protected pages, and database setup.

## Structure

- `index.html` - semantic landing page, auth modal, lead modal, schema markup.
- `assets/css/styles.css` - mobile-first responsive CSS with CLS-safe media boxes and reduced-motion support.
- `assets/js/app.js` - small deferred entry point.
- `assets/js/modules/` - lazy loading, UI, lead capture, Supabase auth, SEO helpers.
- `auth/` - OAuth callback and password reset pages.
- `dashboard/` - protected member dashboard shell.
- `supabase/schema.sql` - profiles table, role-ready metadata, RLS, auth trigger.
- `tools/optimize-images.mjs` - AVIF/WebP/blur placeholder generation.
- `robots.txt` and `sitemap.xml` - crawl control and sitemap.

## Supabase Setup

1. Create a Supabase project.
2. In `Authentication > URL Configuration`, set:
   - Site URL: `https://mkwriters.co.ke`
   - Redirect URLs:
     - `https://mkwriters.co.ke/auth/callback.html`
     - `https://mkwriters.co.ke/auth/reset.html`
     - local development equivalents if needed.
3. Enable Email auth and email confirmations.
4. Enable Google provider in `Authentication > Providers`.
5. Run `supabase/schema.sql` in the Supabase SQL editor.
6. Update `assets/js/config.js` with your Supabase project URL and anon key.

Supabase handles password hashing, JWT lifecycle, email verification, OAuth exchange, and secure session refresh. For HTTP-only cookie sessions, move auth exchange into a server-rendered or edge layer such as Supabase Edge Functions, Next.js middleware, or Cloudflare Workers.

## Performance Strategy

- JavaScript is loaded as `type="module"`, which defers execution by default.
- Supabase and EmailJS are imported only when auth or lead capture needs them.
- Scroll animation uses Intersection Observer and transform-only transitions.
- Below-the-fold sections use `content-visibility: auto`.
- Images include explicit dimensions, lazy loading, and async decoding to reduce CLS and main-thread cost.
- Fonts use preconnect, preload, and `display=swap`.
- The hero image is preloaded because it is the likely LCP asset.

## Image Optimization

Install dependencies once:

```bash
npm install
```

Generate AVIF, WebP, and blur placeholders:

```bash
npm run optimize:images
```

After optimized files exist, you can replace important `<img>` tags with `<picture>` sources from `assets/images/optimized/`.

## Security Notes

- Validate and sanitize all user-generated content server-side before storing it.
- Keep Supabase RLS enabled on every public table.
- Add rate limiting at the edge for form endpoints and future API routes.
- Use CSP headers in production, for example allowing only your domain, Supabase, fonts, and EmailJS/CDN endpoints you actively use.
- Keep service-role keys out of browser code. Only the anon key belongs in frontend config.
