# Launch checklist

Work top to bottom. Anything marked **BLOCKER** must be green before the site goes live.

Status as of 20 August 2026: ☑ = done and verified · ☐ = outstanding · ⚠ = needs a client
decision.

---

## Pre-flight — code

- [x] `npm ci` succeeds
- [x] `npm run typecheck` — 0 errors
- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npm test` — 33/33 passing
- [x] `npm run build` — 100 pages prerendered
- [x] `npm audit` — 0 vulnerabilities
- [x] Standalone server boots and serves every route
- [x] Work committed on a branch (`production-hostinger`); no destructive git commands run

## Domain

- [x] Domain purchased and DNS live — `jowainyanbu.com` → Hostinger
- [x] HTTPS enabled, valid certificate
- [x] HTTP → HTTPS redirect working
- [ ] ⚠ **BLOCKER — canonical host decided: www or non-www**, with the other 301ing to it
      (currently non-www is canonical and serving)
- [ ] ⚠ **BLOCKER — `jowainyanbu.com` vs `www.jowain.net` confirmed** (the profile prints
      the latter; the former is what was bought). See
      [`CLIENT-INPUT-REQUIRED.md`](./CLIENT-INPUT-REQUIRED.md) §3
- [ ] `SITE_URL` set to the confirmed canonical host **and the site rebuilt** — absolute
      URLs are baked into prerendered HTML
- [x] Canonical URLs verified in the build output
- [x] hreflang `en` / `ar` / `x-default` reciprocal and correct

## Hosting — DEPLOYED

- [x] Hosting path chosen and proven. Hostinger documents Node.js as Business/Cloud/VPS
      only, but the assigned server carries Node 22 and Passenger, and the vhost **does**
      honour Passenger directives. Verified live: `PASSENGER_OK node=v22.18.0`
- [x] **Application deployed and serving `https://jowainyanbu.com`**
- [x] `NODE_ENV=production`, Node 22.18.0
- [x] `SITE_URL` set in `~/app/.env` (mode 600)
- [x] Previous release retained at `~/app-previous` for rollback
- [ ] Process auto-restart after a server reboot confirmed (Passenger starts on first
      request, so this is expected to be automatic — verify after the next reboot)
- [ ] Rollback path exercised once end-to-end

## Email — BLOCKER

- [ ] Branded inbox created
- [ ] Resend account created
- [ ] Sending domain added in Resend and showing **Verified**
- [ ] **SPF** record added at the DNS host
- [ ] **DKIM** records added at the DNS host
- [ ] **DMARC** record added (start `p=none`, tighten later)
- [ ] `RESEND_API_KEY`, `EMAIL_FROM`, `ENQUIRY_TO_EMAIL` set in the platform
- [ ] **Live end-to-end test: submit the contact form, confirm the email arrives**
- [ ] **Live end-to-end test: submit the quote form, confirm the email arrives**
- [ ] Reply-To works — replying from the inbox reaches the customer
- [ ] Enquiry mail does not land in spam (check Gmail and Outlook)
- [x] Failure path verified: unconfigured → 503, never a fake success
- [x] Rate limit verified: 6th submission → 429 with `Retry-After`

> Until this section is green the site **cannot generate a lead**. It is the single most
> important block on this page.

## Search

- [x] `sitemap.xml` accessible and correct (90 URLs, both locales)
- [x] `robots.txt` accessible, allows crawl, disallows `/api/`
- [x] Structured data present — Organization + LocalBusiness, WebSite, Service, FAQPage,
      ItemList, BreadcrumbList
- [ ] Structured data validated at <https://search.google.com/test/rich-results>
- [ ] Google Search Console property verified
- [ ] Sitemap submitted
- [ ] International targeting report shows the en/ar pair with no errors
- [ ] Bing Webmaster Tools (optional — imports from Search Console)

## Business information

- [x] Company name — Jowain Yanbu Est.
- [x] Location — Yanbu Al Bahr, Al Madinah Province, **Saudi Arabia**, established 1992
- [x] Legal pages present (privacy policy, terms)
- [ ] ⚠ Published email confirmed — profile prints `Contactsul@jowain.net` as one string;
      published verbatim pending confirmation ([`MISSING-INFO.md`](./MISSING-INFO.md) §1)
- [ ] ⚠ Telephone number supplied — **no tap-to-call anywhere until this exists**
- [ ] ⚠ WhatsApp number supplied — **no WhatsApp button until this exists**
- [ ] Street address supplied (only the city is known)
- [ ] Opening hours supplied (hours row hides while `null`)
- [ ] Logo approved
- [ ] Social profiles supplied (footer icons hide while empty)
- [ ] Fleet photography supplied (currently licensed Unsplash imagery)

> Phone and WhatsApp are the two highest-intent actions for a contractor on a phone at a
> job site. Their absence is the largest remaining conversion gap, and it is a content
> gap, not a code one.

## QA — run against the LIVE domain, not localhost

### Routes

- [ ] `/` redirects to a locale
- [ ] `/en` · `/ar`
- [ ] `/en/services` · `/ar/services`
- [ ] `/en/fleet` · `/ar/fleet`
- [ ] An equipment detail page, both locales
- [ ] A service detail page, both locales
- [ ] `/en/contact` · `/ar/contact`
- [ ] `/en/request-a-quote` · `/ar/request-a-quote`
- [ ] `/sitemap.xml` · `/robots.txt`
- [ ] A deliberately invalid URL returns a branded 404 **with a 404 status**

*(All 23 routes verified **live** on `https://jowainyanbu.com` — every one 200 except the
deliberately invalid URL, which correctly returns 404.)*

### Behaviour

- [ ] No console errors
- [ ] No hydration errors
- [ ] No 404 assets, no missing images
- [ ] Arabic renders RTL, English LTR
- [ ] Mobile menu opens, closes, traps focus, closes on Escape
- [ ] Locale switcher preserves the current path
- [ ] Both forms submit and deliver
- [ ] `tel:` links work — *once a number exists*
- [ ] WhatsApp link works — *once a number exists*
- [ ] Skip link works
- [ ] Keyboard-only navigation reaches every interactive element with a visible focus ring

### Responsive — 360 · 390 · 768 · 1024 · 1440 px

- [ ] No horizontal scroll at any width
- [ ] Hero copy legible over the photograph at 360 px (the scrim has a darker mobile stop
      specifically for this)
- [ ] Fleet grid readable and tappable
- [ ] Form inputs comfortable one-handed; correct mobile keyboard per field
- [ ] Tap targets ≥ 44 px

### Infrastructure

- [x] SSL valid on the live domain, HTTP → HTTPS redirect working
- [x] Security headers verified live: `X-Frame-Options: DENY`, `X-Content-Type-Options`,
      HSTS, `Referrer-Policy`, `Permissions-Policy`
- [x] No `unsafe-eval` in production
- [ ] ⚠ **CSP is not delivered by this host** — LiteSpeed truncates the header and strips
      the meta tag. Application-side implementation is correct and works on Vercel / VPS /
      Docker. Assessed and documented in [`SECURITY.md`](./SECURITY.md#-known-host-limitation--the-live-host-does-not-deliver-a-csp)
- [ ] No mixed content
- [ ] Security headers present on the live domain —
      `curl -sI https://<domain>/en | grep -i "content-security\|strict-transport\|x-frame"`
- [ ] CSP contains **no** `unsafe-eval` in production
- [ ] Lighthouse mobile: Performance ≥ 95 · Accessibility ≥ 95 · Best Practices ≥ 95 ·
      SEO ≥ 95 — record results in [`PERFORMANCE.md`](./PERFORMANCE.md)
- [ ] Core Web Vitals: LCP < 2.5 s · INP < 200 ms · CLS < 0.1

## Post-launch

- [ ] Rotate the Hostinger SSH password (it was shared in plaintext during this engagement)
- [ ] Confirm the first real enquiry arrives
- [ ] Watch the server log for `[enquiry:*] ... failed` lines in week one
- [ ] Re-run Lighthouse a week after launch
- [ ] Confirm Search Console shows pages indexed

---

## Sign-off

The project is **production-ready only when every BLOCKER above is green.**

At the time of writing the code is ready — build, typecheck, lint, tests and audit all
pass, and the enquiry pipeline is implemented and tested. What is outstanding is
**configuration and client-supplied values**, not engineering: the hosting decision, the
canonical domain, and the Resend credentials.
