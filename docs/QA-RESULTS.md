# QA & Test Results

Environment: Windows 11, Node 24, Next.js 15.5, production build + `next start`.

## Automated checks

| Check | Command | Result |
|---|---|---|
| TypeScript | `tsc --noEmit` | ✅ Pass — 0 errors |
| Lint | `eslint` (via `next build`) | ✅ Pass — 0 warnings after cleanup |
| Production build | `next build` | ✅ Success — 98 static pages generated |
| Bundle size | — | ✅ ~102 kB shared First-Load JS |

## Route verification (prod server)

| Test | Expected | Result |
|---|---|---|
| `/` | 307 → `/en` (locale middleware) | ✅ |
| `/en` | 200, `<html lang="en" dir="ltr">`, branded title | ✅ |
| `/ar` | 200, `<html lang="ar" dir="rtl">` (RTL) | ✅ |
| `/en/fleet` | Equipment cards render | ✅ |
| `/en/services/lifting-crane-services` | 200 | ✅ |
| `/en/fleet/mobile-cranes` | Product JSON-LD + verified "50 T · 65 T · 100 T" | ✅ |
| `/en/does-not-exist` | 404 status + styled 404 page | ✅ |
| `robots.txt` | Correct rules + sitemap + host | ✅ |
| `sitemap.xml` | 88 URLs with locale alternates | ✅ |

## Structured data

Org + LocalBusiness, WebSite, Service, Product, FAQPage, Article, BreadcrumbList all
emit valid JSON-LD. Verify with Google Rich Results Test after deploying to the real
domain.

## Forms & spam protection

| Test | Result |
|---|---|
| Honeypot filled (`company_url`) | ✅ Returns `ok:true`, no delivery (bot silently trapped) |
| Time-trap (submit < 2s) | ✅ Silently accepted, not delivered |
| Valid submission | ✅ `ok:true` |
| Invalid email | ✅ `422` |
| Client-side validation | ✅ Inline errors, focus moves to first invalid field, `aria-live` status |

## Accessibility (manual + guidelines)

- ✅ Visible, on-brand focus rings (`:focus-visible`)
- ✅ Semantic landmarks, skip-to-content link, sequential headings
- ✅ Labels on every field; required marked; errors via `role="alert"` / `aria-live`
- ✅ Icon-only buttons have `aria-label`; decorative icons `aria-hidden`
- ✅ Touch targets ≥ 44px; mobile drawer keyboard-operable
- ✅ `prefers-reduced-motion` respected
- ✅ Color not the sole signal; amber-on-graphite CTA meets contrast
- ✅ Breadcrumbs mirror correctly in RTL

## Responsive

- ✅ Verified layouts at 375 / 768 / 1024 / 1440 breakpoints (mobile-first)
- ✅ No horizontal scroll; wide tables/grids reflow
- ✅ Mega-menu collapses to accessible slide-in drawer on mobile

## Known non-blocking items

- **`metadataBase` build warning (×4):** emitted for structural not-found pages during
  static generation. All real content pages set `metadataBase` and use absolute OG
  URLs, so social sharing is unaffected. Resolves fully once deployed with the real
  domain.
- **Arabic body copy:** UI is translated; long-form page bodies render EN on AR routes
  pending native translation (notice shown). See `MISSING-INFO.md`.
- **Equipment imagery:** icon placeholders used pending real photography.

## Recommended pre-launch (external tools)

- Lighthouse / PageSpeed Insights on the deployed URL
- Google Rich Results Test (structured data)
- axe DevTools / WAVE (accessibility)
- Real-device check of tel:/wa.me links
