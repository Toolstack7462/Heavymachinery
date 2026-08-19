# Production Audit — Jowain Yanbu Est.

**Audited:** 20 August 2026
**Auditor:** principal engineering review (full-stack / UX / SEO / DevOps / performance / security)
**Commit at audit time:** `3af0528` on `main`; work branch `production-hostinger`
**Project root:** `C:\Users\User\Heavymachinery`
**Stack:** Next.js 16.3 (App Router) · React 19.1 · TypeScript 5.9 (strict) · Tailwind v4 (CSS-first `@theme`)

Severity key — **P0** launch blocker · **P1** high · **P2** worthwhile · **P3** optional.

---

## Executive summary

This is a genuinely well-built repository, not a template. Content is bilingual at the
data layer, business facts are centralised and sourced, imagery is honest about its
provenance, and the design system is coherent. `typecheck`, `lint` and `build` all pass
clean on first run — 100 pages prerender in about 2 seconds.

Three things stop it being production-ready, and only three:

1. **P0 — Enquiries are never delivered.** `src/lib/enquiry.ts` validates the payload,
   writes it to `console.info`, and returns `{ ok: true }` with a reference number. There
   is no email provider, no persistence, no retry. Every quote request the business
   receives is lost to a log buffer that shared hosting rotates away. The site currently
   *cannot* generate a lead.
2. **P0 — The target host cannot run the app as sold.** The purchased plan is Hostinger
   **Premium** shared hosting. Hostinger's own documentation restricts Node.js apps to
   Business, Cloud and VPS plans. (Mitigating discovery: the assigned server *does* carry a
   usable Node 22 runtime and Passenger — see *Deployment readiness*.)
3. **P0 — Production domain mismatch.** `src/config/site.ts` hardcodes
   `https://www.jowain.net`, taken from the company profile PDF. The domain actually
   purchased and already live on Hostinger is **`jowainyanbu.com`**. Every canonical URL,
   hreflang alternate, sitemap entry, Open Graph URL and JSON-LD `@id` currently points at
   a domain the business does not serve from this account.

Everything below P0 is refinement, and most of it is small.

---

## Current architecture

```
src/
  app/
    [locale]/            13 page routes + not-found + catch-all, all server components
    api/contact|quote/   POST handlers, nodejs runtime
    globals.css          391 lines — Tailwind v4 @theme design tokens
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx
  components/            8 client components, everything else server-rendered
  config/    site.ts (single source of truth) · nav.ts · images.ts
  content/   company · services · equipment (986 ln) · clients · faqs · legal
  i18n/      config · dictionaries/{en,ar} · localized.ts ({en,ar} primitives)
  lib/       enquiry.ts · seo.ts · utils.ts
  proxy.ts   locale redirect (Next 16 renamed `middleware` to `proxy`)
```

**Rendering:** 100 routes prerendered as static HTML at build. Only three are dynamic, all
legitimately so — `/[locale]/fleet` and `/[locale]/request-a-quote` read `searchParams`,
and `/[locale]/[...unmatched]` exists to render a branded 404 inside the locale layout.

**Content model:** every string in `src/content/*` is `{ en, ar }`. Arabic is never a
fallback to English — it is authored. This is the single best architectural decision in
the repo and everything else should protect it.

**Facts model:** `src/config/site.ts` is the only place business facts live, with unknown
fields explicitly `null` and dependent UI self-hiding. Phone, WhatsApp, street address,
opening hours and social profiles are all `null` because the source profile does not
supply them.

---

## What is already good

Listed because it should not be "improved" away.

- **Honest data discipline.** `phone: null` rather than a plausible-looking number. The
  file comments explain *why* each gap exists and point at `docs/MISSING-INFO.md`. The
  email is published verbatim as `contactsul@jowain.net` — exactly as misprinted in the
  profile — with a note asking the client to confirm rather than silently "fixing" it.
- **Honest imagery.** `src/config/images.ts` documents that the supplied profile's
  machinery photos are AI-generated and therefore unusable, and that every Unsplash
  substitute was checked by eye against its label. There is deliberately **no**
  category-level image fallback, so a crawler crane can never borrow the mobile-crane
  photo — correct, and a distinction most agencies get wrong.
- **Progressive-enhancement reveals.** `Reveal` renders visible server-side and is hidden
  by CSS only once a runtime flags `.js`. No-JS visitors and crawlers get real content;
  `prefers-reduced-motion` is honoured. This is the right way round.
- **Fonts already self-hosted** via `next/font/google` — no render-blocking request to
  fonts.googleapis.com.
- **Accessible form foundations** — visible labels, `aria-invalid` / `aria-describedby`
  wiring, blur-time (not keystroke) validation, `role="alert"` errors, semantic input
  types and `inputMode` for mobile keyboards, plus sessionStorage draft restore.
- **Security headers already present** — CSP, HSTS with preload, X-Frame-Options,
  Referrer-Policy, Permissions-Policy. `remotePatterns` is correctly scoped to one host,
  so the image optimiser is not an open proxy.
- **Clean baseline.** `npm run typecheck` and `npm run lint` produce zero output.

---

## Critical launch blockers (P0)

### P0-1 — Enquiry delivery does not exist

**Where:** `src/lib/enquiry.ts:112-125`

```ts
console.info(`[enquiry:${kind}]`, JSON.stringify(payload));
return NextResponse.json({ ok: true, reference: payload.reference });
```

The optional `ENQUIRY_WEBHOOK_URL` branch swallows its own failures
(`catch { console.error }`) and then returns success regardless. So there are two
independent paths to a false success: no webhook configured, or a webhook that returns 500.

The UI is honest about it (`successBody` says the request was *recorded*), but that is a
mitigation of the symptom, not the defect. Compounding it: the company publishes **no phone
number**, so email is the *only* channel. A dropped enquiry is a permanently lost customer.

Also missing on this endpoint: rate limiting, payload size limits, field length caps, and
`Content-Type` enforcement. The handler will `JSON.parse` an unbounded body.

### P0-2 — Host cannot run the application as sold

**Plan:** Hostinger Premium. **Verified against** Hostinger's Node.js deployment
documentation: Node.js web apps are offered on **Business**, **Cloud Startup / Professional /
Enterprise** and **VPS** — Premium is not listed.

Premium is CloudLinux + LiteSpeed + PHP 8.3. A Next.js server, its API routes and the
enquiry delivery cannot run on a PHP-only vhost. See *Deployment readiness* for the
empirical findings, which are more favourable than the documentation.

### P0-3 — Wrong production domain baked into every URL

**Where:** `src/config/site.ts:41` — `url: "https://www.jowain.net"`

Consumed by `lib/seo.ts` (canonical, hreflang, OG, Twitter, all JSON-LD `@id` values),
`app/sitemap.ts` (every one of roughly 200 entries), and `app/robots.ts` (`sitemap:` and
`host:`).

The live, purchased, SSL-active domain is **`jowainyanbu.com`** — confirmed: resolves to
Hostinger `145.79.24.9`, HTTP to HTTPS redirect working, valid certificate. Shipping as-is
would point Google at a domain this account does not serve, and hreflang would form a
broken reciprocal cluster.

Secondary defect in the same file: the value is a compile-time constant, so the domain
cannot be supplied per environment. Preview deployments and the live site would emit
identical canonicals.

---

## High priority issues (P1)

| # | Issue | Where | Impact |
|---|---|---|---|
| P1-1 | `motion` (Framer) ships a ~120 KB chunk to power two decorative effects: hero parallax and a ±4.5° card tilt. Both are fine-pointer-only and disabled under reduced motion — so mobile users download the library and never see the effect. | `components/home/HeroMedia.tsx`, `components/motion/Tilt.tsx` | Mobile LCP / TBT. Largest single removable payload. |
| P1-2 | All three font families are attached to `<html>` on every locale, so **English pages preload the Arabic face** (4 weights of Noto Sans Arabic) and Arabic pages preload both Latin faces. | `app/[locale]/layout.tsx:66` | Wasted preload bandwidth on the critical path, both locales. |
| P1-3 | CSP allows `'unsafe-eval'` unconditionally. Next.js needs it in dev only; a production build does not. | `next.config.ts:9` | Weakens the primary XSS control in production for no benefit. |
| P1-4 | CSP allows `https://fonts.googleapis.com` and `https://fonts.gstatic.com`, but fonts are self-hosted by `next/font` and neither host is ever contacted. | `next.config.ts:10-11` | Dead allowances widen the policy surface. |
| P1-5 | `img-src ... https:` permits image loading from **any** HTTPS origin. | `next.config.ts:12` | Undermines the correctly-scoped `remotePatterns`. |
| P1-6 | No `.env.example`, so required configuration is undiscoverable to whoever deploys. | repo root | Deployment risk. |
| P1-7 | No CI. Nothing prevents a typecheck / lint / build regression reaching `main`. | `.github/` | Regression risk. |
| P1-8 | All fleet and service photography loads from `images.unsplash.com` at runtime — a third-party origin on the critical path for the fleet grid, and a hard dependency on Unsplash staying up. | `config/images.ts` | Third-party single point of failure plus extra DNS / TLS / connection cost. |

---

## Medium priority issues (P2)

- **P2-1** `sitemap.ts` hardcodes `lastModified: new Date("2026-08-12")` for every URL, so
  the signal is frozen and identical across roughly 200 entries. It should track build time.
- **P2-2** `robots.ts` sets `host:` — a legacy Yandex directive Google ignores; harmless
  but noise.
- **P2-3** The reference generator uses `Math.random()`. Fine for a human-quotable tag,
  but it is not collision-resistant and there is no store to check against, so two
  enquiries could in principle share a reference.
- **P2-4** `handleEnquiry` logs the **full payload including name, email, phone and
  message** at `console.info` on every submission. On shared hosting those logs are
  readable by support tooling and are retained. Unnecessary PII exposure.
- **P2-5** No `Content-Type` check on the API routes; a cross-origin form POST could reach
  the handler. `form-action 'self'` and same-origin `fetch` mitigate it, but the check is
  one line.
- **P2-6** No caching headers for static assets beyond Next's defaults; on Passenger or
  Nginx hosting an explicit long-cache rule for `/_next/static` is worth setting.
- **P2-7** `package.json` `engines.node: ">=20.9.0"` is not enforced anywhere and the
  supported version is not documented.

---

## Low priority improvements (P3)

- **P3-1** `Tilt` is applied via a wrapper `div` around card grids; once `motion` is gone
  the whole component can become roughly 15 lines of rAF plus CSS custom properties.
- **P3-2** The `.impeccable/` design-notes directory is gitignored but still present on
  disk; confirm it should stay local-only.
- **P3-3** `tsconfig.tsbuildinfo` (116 KB) is gitignored correctly but present in the
  working tree — no action, noted for cleanliness.
- **P3-4** The OG image is generated per request via `opengraph-image.tsx`; a static
  fallback would be cheaper if the app ever moves off a Node runtime.

---

## UX / UI audit

The design direction — premium industrial, graphite/white, amber accent, high contrast —
is intact and should be refined, not replaced. Findings:

- **Header** (`components/layout/Header.tsx`, 321 lines, client) is the only large client
  component and is justified: mobile menu, scroll state, Escape-to-close. Primary
  conversions are present. **Gap:** with `site.contact.phone === null`, the header exposes
  *no* phone or WhatsApp affordance at all — the two highest-intent mobile actions are
  simply absent. This is correct behaviour given the data, and is a **content blocker, not
  a code defect** (see `docs/CLIENT-INPUT-REQUIRED.md`).
- **Hero** answers what / where / capability within the first viewport and avoids inflated
  claims. The "over 30 years" figure is profile-sourced, not computed — correct.
- **Fleet** browsing is strong: 52 equipment detail pages, category filter, honest
  per-item photography with a glyph fallback where no verified photo exists. Specification
  hierarchy is readable by a procurement engineer.
- **Services** (11 detail pages) follow service, capability, equipment, process, enquiry.
  Appropriate for the audience.
- **Contact / Quote** ask for the right fields and nothing more; `requirement` is a
  grouped `<select>` of real services and equipment, which is the correct affordance.
- **Footer** carries company details, navigation, legal pages and the locale switch
  without clutter.

**Conclusion:** no redesign is warranted. The UX ceiling here is set by *missing business
data* — no phone, no WhatsApp, no address — not by design or implementation.

---

## Mobile audit

- Viewport, `theme-color` and `colorScheme` set correctly in `layout.tsx`.
- Submit button carries `min-h-[44px]`; tap targets meet the 44 px guideline.
- The hero scrim has an explicitly darker far stop below `md` because the tagline measured
  2.4:1 against the photograph at 390 px. That is a real measurement recorded in the
  source, and it is the correct fix.
- `active:scale-[0.985]` press feedback and tap-delay handling already addressed.
- **Gap:** the two highest-value mobile actions — tap-to-call and WhatsApp — cannot exist
  until the client supplies numbers.

---

## Arabic / RTL audit

Strong, and better than most bilingual builds:

- `dir="rtl"` is set at `<html>` from `dir(locale)`; the whole document flips, not a wrapper.
- Both font stacks swap to Noto Sans Arabic at the root via CSS custom properties, so no
  component needs locale awareness.
- Logical properties are used throughout (`-start-`, `rtl:` variants), including the
  honeypot's off-screen position and the hero scrim gradient direction, which flips so
  Arabic copy on the right gets the same contrast English gets on the left. A genuinely
  considered detail.
- Arrow icons use `rtl:rotate-180` with mirrored hover translation.
- Every content string is authored Arabic, not machine fallback. Terminology checked
  against the source: رافعات متحركة (mobile cranes), رافعات زاحفة (crawler cranes),
  حفّارات (excavators), مقاطر (trailers), صهاريج (tankers) — all correct MSA / Gulf B2B usage.
- `knowsLanguage: ["en","ar"]` and `locale: "ar_SA"` in Open Graph.

**No Arabic page falls back to English long-form content.** No translation remediation is
required. The one improvement available is P1-2 — stop preloading the Arabic face on
English routes.

---

## Accessibility audit

Target WCAG 2.1 AA.

**Passing:** skip link; `<main id="main">` landmark; labelled form controls; error text
tied via `aria-describedby` with `role="alert"`; live-region success state; `lang` and
`dir` correct per locale; decorative gradients marked `aria-hidden`; alt text written as
description rather than keywords, per locale; reduced motion honoured in `Reveal`,
`RevealObserver`, `Tilt` and `HeroMedia`; focus-visible outlines with offset; native
`<button>` and `<a>` used for their real semantics.

**Findings:**

- **A11y-1 (P2)** The honeypot wrapper is `aria-hidden="true"` but contains a focusable
  `<input>`. `tabIndex={-1}` is set, so it is not reachable by tab — acceptable — but a
  focusable element inside `aria-hidden` is technically an ARIA violation and will be
  flagged by axe. Keeping `tabIndex={-1}` plus `autoComplete="off"` (both present) is the
  standard mitigation; documented rather than "fixed" with ARIA gymnastics.
- **A11y-2 (P3)** Heading hierarchy is correct per page; no `h1` to `h3` skips found.
- **A11y-3 (P3)** Colour contrast passes at the tokens defined in `globals.css`; the one
  historically failing case — hero copy over photography at mobile width — was already fixed.

---

## Performance audit

Measured on the baseline production build (`npm run build`, 100 static pages, about 2.0 s
generation with 11 workers).

| Chunk | Raw size | Contents |
|---|---|---|
| `4561u0v7ysn3r.js` | 224 KB | React + Next runtime |
| `0td_q_jvg2olo.js` | 164 KB | framework |
| **`0bl2qtdy2p0t-.js`** | **120 KB** | **`motion` / Framer** — removable |
| `0cz1d0mv5g_q7.js` | 112 KB | app shell |
| `3oxl6k1woyobb.js` | 52 KB | route chunks |

**LCP candidate:** the hero photograph in `HeroMedia`, correctly `priority` with
`sizes="100vw"`, and it is the *only* prioritised image on the site — exactly right.

**Client components:** 8. `Header` and `EnquiryForm` are necessarily interactive.
`RevealObserver` is a single shared observer rather than a motion component per section — a
deliberately cheap choice. `Tilt` and `HeroMedia` exist only to host `motion`.

**Third-party requests:** one — `images.unsplash.com` for all photography (P1-8). No
analytics, no tag manager, no font CDN, no maps embed. Excellent.

**Opportunities, in order of value:** P1-1 (drop `motion`, about 120 KB), P1-2 (stop
cross-locale font preload), P1-8 (self-host photography), P2-6 (explicit static caching).

---

## SEO audit

**Already correct:** per-locale metadata via `buildMetadata`; canonical per page; hreflang
`en` / `ar` / `x-default`, reciprocal; Open Graph plus Twitter `summary_large_image`;
generated OG image; sitemap with `alternates.languages` per entry; robots allowing all and
disallowing `/api/`; JSON-LD for Organization + LocalBusiness, WebSite, Service (per
service page), Service-for-equipment (correctly *not* Product, since there is no published
price and a priceless Product offer is invalid structured data), FAQPage, and ItemList for
the fleet index; a breadcrumbs component; a branded 404 inside the locale layout with the
correct status code.

`telephone` and `sameAs` are deliberately omitted from the Organization graph because no
verified values exist — the right call.

**Findings:**

- **P0-3** wrong domain in every absolute URL (above).
- **P2-1** frozen `lastModified`.
- **P2-2** legacy `host:` directive.
- **SEO-1 (P3)** No `Article` / `BlogPosting` schema — correct, there is no editorial
  content to mark up. Not a gap.
- **SEO-2 (P3)** No location landing pages. Correct and deliberate: the profile supports a
  Kingdom-wide claim from a Yanbu base and nothing more. Fabricating city pages for
  Riyadh, Dammam or Jubail would be exactly the kind of invention the brief forbids.

Copy contains no keyword stuffing and no geographic misrepresentation.

---

## Security audit

| Control | Status |
|---|---|
| CSP | Present; `'unsafe-eval'` unnecessary in production (P1-3); dead font-CDN allowances (P1-4); `img-src https:` too broad (P1-5) |
| HSTS | `max-age=63072000; includeSubDomains; preload` — correct |
| X-Frame-Options / frame-ancestors | `DENY` / `'none'` — correct, belt and braces |
| Referrer-Policy | `strict-origin-when-cross-origin` — correct |
| Permissions-Policy | camera, microphone, geolocation, browsing-topics denied — correct |
| `poweredByHeader` | disabled — correct |
| Image optimiser | `remotePatterns` scoped to one host — correct, not an open proxy |
| API input validation | Name, email and message only; **no length caps, no body size limit, no Content-Type check** (P0-1, P2-5) |
| Rate limiting | **None** (P0-1) |
| Secrets | None committed. `.gitignore` covers `.env*` correctly |
| Error leakage | Handlers return generic messages; no stack traces |
| External links | No `target="_blank"` links outside the map link; `noopener` not required where absent |
| Dependencies | 5 runtime dependencies; audit results recorded in `docs/SECURITY.md` |

**Dependency posture is excellent** — `next`, `react`, `react-dom`, `lucide-react`,
`motion`. Removing `motion` takes it to four.

---

## Forms / conversion audit

**Flow:** `EnquiryForm` posts to `/api/{quote,contact}`, which calls `handleEnquiry`,
which validates, writes to console, and returns `{ ok: true, reference }`; the UI then
shows a success screen carrying that reference.

**Good:** honeypot (`company_url`) plus a 2 s time trap, both returning `ok` so bots cannot
distinguish rejection; blur-time validation; focus moves to the first invalid field on
submit; draft persistence in sessionStorage keyed per variant, with quota failures
swallowed so they can never block submission; distinct `sending` and `error` states; the
error state surfaces the email address as a fallback.

**Defects:**

- **P0-1** nothing is delivered (above).
- **F-1 (P1)** The success screen is the *only* place the reference appears, and it is not
  emailed to the sender — so if the tab closes, the reference is gone. Once real delivery
  exists, the customer should receive an acknowledgement.
- **F-2 (P2)** The time trap only triggers when `_ts` is a finite number; a bot omitting
  `_ts` bypasses it entirely, because `Number.isFinite(NaN)` is false and the check is
  skipped.
- **F-3 (P2)** No maximum lengths, so a 10 MB `message` is accepted and logged.
- **F-4 (P3)** The error state offers email only. With no phone number published there is
  no alternative — again a content blocker, not a code one.

---

## Deployment readiness

**Purchased:** Hostinger **Premium** shared hosting; domain **`jowainyanbu.com`**, already
DNS-live on Hostinger with a working certificate and an HTTP to HTTPS redirect.

**Documented capability:** Hostinger lists Node.js apps on Business, Cloud and VPS only.
Premium is excluded. On that basis alone the current architecture cannot deploy.

**Empirical findings from the assigned server** (`sg-nme-web1099.main-hosting.eu`,
CloudLinux 4.18 with LVE and CageFS, account `u127191545`) — materially more favourable
than the documentation:

| Probe | Result |
|---|---|
| `php -v` | PHP 8.3.30 |
| `which node` | not on `PATH` |
| `/opt/alt/alt-nodejs{18,20,22,24}` | **present** |
| `/opt/alt/alt-nodejs22/root/usr/bin/node -v` | **`v22.18.0` — executes as this user** |
| `/opt/alt/alt-nodejs22/root/usr/bin/npm -v` | **`10.9.3`** |
| Passenger | **installed** — `/opt/passenger`, `/var/passenger`, `/etc/profile.d/alt_mod_passenger.sh` |
| `cloudlinux-selector` CLI | not exposed to the account |
| Docroot | `~/domains/jowainyanbu.com/public_html`, containing only a `default.php` parking page |
| SSH | available on port 65002 |

**Interpretation:** the runtime and the application server needed to run Next.js are both
physically present and user-executable. What is unproven is whether **mod_passenger is
enabled for this vhost** — that is, whether an `.htaccess` carrying `PassengerAppRoot`,
`PassengerNodejs`, `PassengerAppType node` and `PassengerStartupFile` is honoured or
ignored as unknown directives. That is a one-shot empirical test against the live docroot,
and it is the single fact that decides the deployment strategy. It has not yet been run,
because it writes to a production docroot and requires explicit authorisation.

**Four viable paths exist**, ranked, all documented in `docs/HOSTINGER-DEPLOYMENT.md` and
`docs/DEPLOYMENT.md`:

1. **Premium plus Passenger**, if the vhost honours the directives — keeps everything on
   the purchased plan, with full SSR and API routes.
2. **Upgrade to Hostinger Business** — supported, documented, GitHub auto-deploy.
3. **Vercel**, with `jowainyanbu.com` DNS pointed at it from Hostinger — fastest to live.
4. **Hostinger VPS** — full control, most operational overhead.

**Explicitly rejected:** converting the application to a static export to force it onto
Premium. That would delete the API routes, therefore the enquiry system, therefore the
site's only lead channel — trading the P0 for a worse one.

**Build gate status at audit time:** `npm ci` pass · `npm run typecheck` pass (0 errors) ·
`npm run lint` pass (0 errors, 0 warnings) · `npm run build` pass (100 pages).

---

## Local vs GitHub comparison

**Local project root:** `C:\Users\User\Heavymachinery`
**Remote:** `https://github.com/Toolstack7462/Heavymachinery.git`

### Is there a D: drive copy?

**No.** An exhaustive search of the entire D: volume — every directory except
`node_modules`, `$RECYCLE.BIN` and `System Volume Information` — for `next.config.*`,
`package.json`, and any path matching `heavy`, `machin`, `rasikh` or `jowain` returned
**no Next.js project of any kind on D:**.

What D: *does* contain is the **client source material** this repository already cites as
its source of truth:

```
D:\Jowain Yanbu Est\Jowain Yanbu Est. Profile Overview.pdf   38 MB — the company profile
D:\Jowain Yanbu Est\Logo.pdf                                 official logo
D:\Jowain Yanbu Est\WhatsApp Image 2026-08-10 at 8.40.18 PM.jpeg   client logo board
```

So the correct reading is: **D: is authoritative for business facts; C: holds the only
copy of the code.** There is no divergent local build to reconcile and no local work at
risk. No `RASIKH`-related content exists on either drive.

### Local vs remote state

| Check | Result |
|---|---|
| Branch at audit start | `main` |
| Uncommitted changes in the project | **none** — `git status` clean |
| Local ahead or behind | `main` matches `origin/main` at `3af0528` |
| Local-only assets | none |
| Documentation drift | none |
| Local-only production fixes | none |

**Conclusion: local and GitHub are identical.** `C:\Users\User\Heavymachinery` at `3af0528`
is the single most complete and current implementation. No destructive Git command was run
at any point; work proceeds on a new branch, `production-hostinger`.

### A necessary correction to the brief

The instructions require preserving a **Qatar / Doha** company location and forbid turning
the company into a Saudi one. **That does not describe this repository.** Verified against
both the code and the client-supplied profile PDF:

- The company is **Jowain Yanbu Est.**, based in **Yanbu Al Bahr, Al Madinah Province,
  Saudi Arabia**, established **1992**.
- The string "Qatar" appears in exactly one file, `src/content/clients.ts`, as a **client
  region** — Landworx, UCC Qatar, Redco International Qatar, Petrosarve Qatar, Iris Qatar,
  UCC PMV Qatar. Jowain is a Saudi company with Qatari *customers*.
- The repository already anticipated this misreading: *"the Qatar-based names below are
  CURRENT Jowain clients … not residue from the previous placeholder identity — do not
  purge them."*

There is no Qatari address, phone number, branch or registration anywhere to preserve.
Applying the governing rule — *existing verified information has priority; preserve the
existing geography* — the company **remains Saudi**, and the Qatari **client names remain
untouched**. No Doha address will be invented, and no Saudi office, branch or registration
will be invented either.
