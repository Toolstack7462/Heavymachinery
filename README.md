# Jowain Yanbu Est. — corporate website

Bilingual (English / Arabic) marketing site for **Jowain Yanbu Est.**, a heavy
equipment rental and transportation business established in **1992** in **Yanbu
Al Bahr, Kingdom of Saudi Arabia**.

- Positioning: *Heavy Equipment Rental & Transportation*
- Tagline: *Reliable Equipment. Dependable Transportation.*
- Production domain: **`https://jowainyanbu.com`** — set via the `SITE_URL` environment
  variable, which controls every absolute URL the site emits. The company profile PDF
  prints a different domain (`www.jowain.net`); see `docs/CLIENT-INPUT-REQUIRED.md` §3.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router + Turbopack, React 19, TypeScript strict) |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens in `src/app/globals.css` |
| Motion | **No animation library.** CSS custom properties + one rAF handler for hero parallax and card tilt; CSS + IntersectionObserver for section reveals |
| Icons | `lucide-react` plus hand-authored equipment glyphs in `src/components/Icon.tsx` |
| i18n | `/[locale]` routing (`en`, `ar`), full RTL, bilingual content objects |
| Fonts | Archivo (display), Source Sans 3 (body), Noto Sans Arabic (Arabic) via `next/font` |

## Commands

```bash
npm ci             # install exactly what the lockfile pins
npm run dev        # http://localhost:3000 → redirects to /en
npm run build      # production build (100 prerendered routes)
npm start          # serve the build
npm run typecheck  # tsc --noEmit, strict
npm run lint       # eslint . (flat config; `next lint` is gone in Next 16)
npm test           # node --test — 33 tests, no test framework
```

> **Keep the site prerendered.** Every page is static HTML. Reaching for a
> request-time API (`headers()`, `cookies()`) in a shared boundary — the locale
> layout, or `not-found.tsx` — turns the entire tree dynamic. That is why the
> 404 reads its locale from `<html lang>` on the client instead of from a
> request header.

## Project shape

```
src/
  app/
    [locale]/            home, about, fleet, services, industries, quality,
                         clients, why-choose-us, contact, request-a-quote,
                         faqs, sitemap, privacy-policy, terms
    api/{quote,contact}  enquiry endpoints — validated, rate limited, Resend delivery
    icon.png             favicon generated from the official logo
    apple-icon.png       iOS icon
    opengraph-image.tsx  social card, inlines the official emblem
    manifest.ts robots.ts sitemap.ts
  components/
    blocks/              PageHero, Cards, CtaBand, ContactInfo, ClientWall
    forms/EnquiryForm    accessible, spam-protected enquiry form
    home/                Hero + HeroMedia (client parallax island)
    layout/              Header, Footer, LocaleSwitcher
    motion/              Reveal (server) + RevealObserver (client) + Tilt
  config/
    site.ts              ← single source of truth: brand, location, contact
    images.ts            every photograph reference and its alt text
    nav.ts               primary + footer navigation
  content/               company, equipment, services, clients, faqs, legal
  i18n/                  dictionaries (en/ar) + localized helpers
  lib/                   seo.ts, enquiry.ts + enquiry-core.ts, utils.ts
  proxy.ts               locale routing (Next 16's rename of `middleware.ts`)
public/
  brand/                 emblem PNGs extracted from the supplied Logo.pdf
  clients/               25 client marks sliced from the supplied client board
```

## Editing content

Everything a non-developer usually needs to change lives in two folders:

- **Brand, address, email** → `src/config/site.ts`
- **Copy** → `src/content/*.ts` and `src/i18n/dictionaries/*.ts`

Body copy is stored as `{ en, ar }` pairs, so a change must be made in both
languages or TypeScript will complain. See `docs/CONTENT-GUIDE.md`.

## Content integrity rules

This site is deliberately conservative about what it claims, because a heavy
equipment buyer treats the website as a specification document:

1. **The company profile is the only source of factual claims.** The only
   capacity figures published anywhere are the three ranges it states — mobile
   cranes 20–1200 T, rough terrain 25–120 T, crawler 55–3200 T. Every other
   specification reads "Available on request".
2. **No invented numbers.** No project counts, client counts, fleet unit counts,
   staff numbers, turnover, certifications, awards or testimonials appear,
   because none are documented. The experience claim is "over 30 years", the
   profile's own wording.
3. **No fabricated contact routes.** The profile supplies no telephone or
   WhatsApp number, so `site.contact.phone` is `null` and every click-to-call
   and WhatsApp affordance is absent rather than guessed.
4. **No mislabelled machinery.** A photograph is only used for the equipment
   type it actually shows; there is no category-level fallback image. Equipment
   without a verified photograph renders an information panel carrying its
   capacity range or type, so the card still tells the buyer something true.
5. **Guidance, not claims.** The "what to tell us for a fast quote" checklist on
   each equipment page lists facts the *customer* holds. It makes a thin page
   useful without asserting anything about Jowain's fleet, terms or lead times.
6. **Client logos keep their own trademarks.** They are sliced from artwork the
   client supplied, never recoloured into the Jowain palette, never redrawn, and
   never sourced from the web.
7. **No promises the company has not made.** There is no response-time claim
   anywhere, because none is documented. Instead each enquiry returns a
   quotable reference (`JY-XXXXXX`) so the sender has something concrete to
   follow up with.

Open questions for the client are tracked in `docs/MISSING-INFO.md`.

## Enquiry delivery

**A 200 from `/api/contact` or `/api/quote` means the enquiry reached the sales inbox.**
Nothing weaker. The company publishes no telephone number, so email is the only channel a
customer has — a false success is a permanently lost customer.

- `src/lib/enquiry-core.ts` — validation, spam filtering (honeypot + time trap), rate
  limiting, email rendering, Resend delivery. Imports nothing from Next, so it is
  unit-tested directly by `tests/enquiry.test.ts`.
- `src/lib/enquiry.ts` — the Next adapter: status-code mapping and PII-free logging.

Status codes: `200` delivered · `415` wrong content type · `413` too large · `422` invalid
input · `429` rate limited · `502` provider failed · `503` not configured. It never returns
a fake success, and the form UI shows the email fallback when delivery fails.

Requires three environment variables — see `docs/ENVIRONMENT.md`:

```
RESEND_API_KEY=      # secret; server-side only, never NEXT_PUBLIC_
EMAIL_FROM=          # must be on a Resend-verified domain
ENQUIRY_TO_EMAIL=    # destination inbox, comma-separated for several
```

Without them both endpoints return **503** and the forms surface their email fallback.

## Deployment

Target host is **Hostinger**. Note that **Hostinger Premium does not officially support
Node.js** — Node apps need Business, Cloud or VPS — so read
**`docs/HOSTINGER-DEPLOYMENT.md`** before deploying. The app is a Next.js server and must
not be converted to a static export: that would delete the API routes, and with them the
only lead channel.

`output: "standalone"` is enabled, so production hosting needs no `node_modules`.
`SITE_URL` must be set **at build time** — absolute URLs are baked into the prerendered
HTML.

Security headers (CSP, HSTS, frame and referrer policy) are in `next.config.ts`;
`unsafe-eval` is development-only, and the image optimiser is scoped to the single
photography host it uses.

## Documentation

| File | What it covers |
| --- | --- |
| `CLAUDE.md` | Rules for AI sessions: business facts, geography, performance budget |
| `docs/PRODUCTION-AUDIT.md` | Full audit with P0–P3 severities |
| `docs/ARCHITECTURE.md` | File map, request flow, conventions |
| `docs/DEPLOYMENT.md` | cPanel/Passenger, VPS, Docker, Vercel |
| `docs/HOSTINGER-DEPLOYMENT.md` | The actual account, the actual constraint, the exact steps |
| `docs/ENVIRONMENT.md` | Every environment variable |
| `docs/SECURITY.md` | Headers, CSP decisions, enquiry hardening |
| `docs/PERFORMANCE.md` | Budget, measurements, remaining limitations |
| `docs/SEO.md` | Metadata, structured data, and the lines not crossed |
| `docs/CONTENT-GUIDE.md` | Editing copy without touching page code |
| `docs/MISSING-INFO.md` | Business facts still to confirm |
| `docs/CLIENT-INPUT-REQUIRED.md` | What is blocked and why |
| `docs/LAUNCH-CHECKLIST.md` | Everything that must be green before launch |
