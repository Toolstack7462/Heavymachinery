# Jowain Yanbu Est. — corporate website

Bilingual (English / Arabic) marketing site for **Jowain Yanbu Est.**, a heavy
equipment rental and transportation business established in **1992** in **Yanbu
Al Bahr, Kingdom of Saudi Arabia**.

- Positioning: *Heavy Equipment Rental & Transportation*
- Tagline: *Reliable Equipment. Dependable Transportation.*
- Production domain: `https://www.jowain.net`

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router + Turbopack, React 19, TypeScript strict) |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens in `src/app/globals.css` |
| Motion | `motion` (Motion for React v13) for hero parallax + card tilt; CSS + IntersectionObserver for section reveals |
| Icons | `lucide-react` plus hand-authored equipment glyphs in `src/components/Icon.tsx` |
| i18n | `/[locale]` routing (`en`, `ar`), full RTL, bilingual content objects |
| Fonts | Archivo (display), Source Sans 3 (body), Noto Sans Arabic (Arabic) via `next/font` |

## Commands

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en
npm run build      # production build (94 prerendered routes)
npm start          # serve the build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint . (flat config; `next lint` is gone in Next 16)
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
    api/{quote,contact}  enquiry endpoints (validated, provider-agnostic)
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
  lib/                   seo.ts, enquiry.ts, utils.ts
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
languages or TypeScript will complain. See `docs/CONTENT-EDITING.md`.

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

`src/lib/enquiry.ts` validates submissions, blocks bots (honeypot + time-trap)
and logs the payload server-side. Email/CRM delivery is opt-in through
environment variables set on the host — never committed:

```
ENQUIRY_WEBHOOK_URL=   # CRM, Zapier or Make endpoint
```

Until a delivery target is configured the UI says the request was *recorded*,
and never claims an email was sent.

## Deployment

See `docs/DEPLOYMENT.md`. Security headers (CSP, HSTS, frame and referrer
policy) are defined in `next.config.ts`; the image optimiser is scoped to the
single photography host it uses.
