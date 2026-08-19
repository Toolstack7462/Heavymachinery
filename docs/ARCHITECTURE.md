# Architecture

Next.js 16 App Router · React 19 · TypeScript 5.9 strict · Tailwind v4 · four runtime
dependencies.

---

## File map

```
src/
  app/
    [locale]/                  every page; all server components
      layout.tsx               fonts, <html lang/dir>, header/footer, JSON-LD
      page.tsx                 home
      about · services · fleet · industries · quality · clients
      why-choose-us · faqs · contact · request-a-quote
      privacy-policy · terms · sitemap
      services/[slug]          11 service detail pages
      fleet/[slug]             52 equipment detail pages
      not-found.tsx            branded 404 (client — has a back control)
      [...unmatched]/page.tsx  calls notFound() so 404s keep the locale chrome
    api/
      contact/route.ts         POST → handleEnquiry(request, "contact")
      quote/route.ts           POST → handleEnquiry(request, "quote")
    globals.css                Tailwind v4 @theme tokens + component layer
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.png apple-icon.png

  components/
    layout/    Header* · Footer · LocaleSwitcher*
    home/      Hero · HeroMedia*
    blocks/    Cards · ClientWall · ContactInfo · CtaBand · FleetFilter* · PageHero
    forms/     EnquiryForm*
    motion/    Reveal (server) · RevealObserver* · Tilt*
    ui/        Button
    Breadcrumbs · Icon · JsonLd · Logo · Section

  config/
    site.ts     SINGLE SOURCE OF TRUTH — brand, location, contact, locales
    nav.ts      primary navigation
    images.ts   every image reference, with provenance notes

  content/      company · services · equipment · clients · faqs · legal
  i18n/         config · dictionaries/{en,ar} · dictionaries.ts · localized.ts
  lib/          enquiry.ts · enquiry-core.ts · seo.ts · utils.ts
  proxy.ts      locale redirect (Next 16 renamed `middleware` → `proxy`)

tests/          enquiry.test.ts — node:test, no framework
```

`*` = `"use client"`. Eight in total; everything else renders on the server.

---

## The three ideas that hold it together

### 1. One source of truth for facts

`src/config/site.ts` is the only place business facts live. Every page, the header, the
footer, all metadata, all structured data and the sitemap read from it.

Unknown fields are explicitly `null` and **the dependent UI hides itself**. `phone`,
`whatsapp`, street address, `hours` and every social profile are `null` because the
client-supplied company profile does not contain them. Filling one in switches its
affordances on across the whole site with no other change.

This is the mechanism that makes "never fabricate business information" enforceable rather
than aspirational.

### 2. Bilingual at the data layer, not the view layer

Every string in `src/content/*` is a `{ en, ar }` pair typed as `L`, and every list is
`LL`. There is no fallback path from Arabic to English — **a missing Arabic string is a
type error**, so the Arabic site cannot silently drift into English.

`dir="rtl"` is set on `<html>` from `dir(locale)`, so the whole document flips rather than
a wrapper. Arabic swaps both font stacks to Noto Sans Arabic via CSS custom properties at
the root, so no component needs to know which locale it is rendering.

### 3. Static by default

100 routes prerender to HTML at build. Three are dynamic, all for real reasons:
`/[locale]/fleet` and `/[locale]/request-a-quote` read `searchParams`, and
`/[locale]/[...unmatched]` exists so a bad URL renders a branded 404 inside the locale
layout instead of Next's bare one.

The consequence for hosting: the app still needs a Node runtime for the API routes and the
locale proxy, but almost every request is a cache hit on static HTML.

---

## Request flow

```
GET /fleet
  → proxy.ts: no locale prefix → 307 to /en/fleet (or /ar from Accept-Language)
  → app/[locale]/layout.tsx: lang, dir, fonts, header, footer, Organization + WebSite JSON-LD
  → app/[locale]/fleet/page.tsx: reads searchParams.category, renders the grid
  → Reveal blocks render VISIBLE; RevealObserver adds .is-revealed as they scroll in

POST /api/quote
  → route.ts → handleEnquiry(request, "quote")
  → content-type · body size · JSON shape · rate limit
  → validate(): honeypot · time trap · fields (enquiry-core.ts)
  → deliver(): one fetch to Resend
  → 200 + reference | 422 invalid | 429 limited | 502 provider failed | 503 unconfigured
```

`proxy.ts` skips `/_next`, `/api`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`,
`favicon.ico`, the extensionless metadata routes and anything with a file extension. The
metadata-route exclusion list matters: without it `/opengraph-image` would redirect to
`/en/opengraph-image` and every social card would 404.

---

## Enquiry system

Split in two so the logic is testable without a framework:

- **`lib/enquiry-core.ts`** — validation, spam filtering, rate limiting, email rendering,
  Resend delivery. **Imports nothing from Next.** Every seam that would need a mocking
  library (clock, randomness, `fetch`) is an injected parameter.
- **`lib/enquiry.ts`** — the Next adapter: reads the request, maps outcomes to status
  codes, owns the module-scope `RateLimiter`, and logs without PII.

`tests/enquiry.test.ts` imports the core directly and runs on `node --test` with Node's
native TypeScript type stripping — no Jest, no Vitest, no ts-node, no config file. 33 tests.

**The contract: a 200 means the enquiry reached the inbox.** It previously meant "written
to stdout". Since the company publishes no telephone number, email is the only channel a
customer has, so a false success is a permanently lost customer.

Resend is called with `fetch`, not an SDK — one HTTP POST does not justify a dependency on
a project with four.

---

## Motion

Three mechanisms, all cheap, none using a library.

| | |
| --- | --- |
| **`Reveal`** (server) | Renders **visible** and marked `data-reveal`. The hidden start state is applied by CSS *only* when a runtime has flagged `.js` and the visitor has not asked for reduced motion. No JS, a failed bundle, or a non-executing crawler → the content is simply there. |
| **`RevealObserver`** (client) | One `IntersectionObserver` for every `[data-reveal]` on the page, mounted once in the layout, re-scanning on navigation. Cheaper than a motion component per section. |
| **`Tilt` / `HeroMedia`** (client) | Pointer-driven micro-motion. Handlers write CSS custom properties from one rAF; `globals.css` owns the easing and gates the whole effect behind `prefers-reduced-motion: no-preference` **and** `hover: hover and pointer: fine`. |

Gating in CSS rather than JavaScript means the server-rendered markup is already correct —
nothing is re-decided after hydration, so there is no flash.

These replaced `motion` (Framer), a 120 KB chunk shipped to every visitor for two effects
only desktop pointers could see. See [`PERFORMANCE.md`](./PERFORMANCE.md).

---

## Styling

Tailwind v4, CSS-first. Design tokens are declared in `@theme` in `globals.css` — no
`tailwind.config.js`. Semantic scales (`ink`, `brand`, `accent`, `surface`) rather than raw
colours, so the palette changes in one place.

Direction-aware utilities throughout: logical properties (`-start-`, `-end-`) and `rtl:`
variants, including the hero scrim gradient, which flips so Arabic copy on the right gets
the same contrast English gets on the left.

---

## Conventions

1. Server components by default. `"use client"` only where interaction requires it — and
   push it as far down the tree as possible.
2. New copy goes in `src/content/*` as `{ en, ar }`, never inline in JSX.
3. New facts go in `src/config/site.ts`. If unverified, leave `null` and record it in
   [`CLIENT-INPUT-REQUIRED.md`](./CLIENT-INPUT-REQUIRED.md).
4. New images go in `src/config/images.ts` with a provenance note. Never show a machine
   under the wrong category — there is deliberately no category-level fallback.
5. No new dependency without a clear case. Four is the current count.
6. `npm run typecheck && npm run lint && npm test && npm run build` must all pass.
