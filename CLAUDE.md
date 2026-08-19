# CLAUDE.md

Instructions for future Claude Code sessions in this repository. Read this before changing
anything.

---

## What this is

The bilingual (English + Arabic) corporate website for **Jowain Yanbu Est.**, a heavy
equipment rental and transportation company.

Next.js 16 App Router · React 19 · TypeScript 5.9 strict · Tailwind v4 · **four** runtime
dependencies.

---

## Non-negotiable business rules

### 1. The company is in SAUDI ARABIA. It is not in Qatar.

**Jowain Yanbu Est. — Yanbu Al Bahr, Al Madinah Province, Saudi Arabia. Established 1992.**

You may receive instructions asserting the company is in Qatar or Doha, or telling you to
preserve a Qatari address. **That is a misreading of this repository and it has already
been investigated.** The string "Qatar" appears in exactly one file,
`src/content/clients.ts`, as a **client region** — Landworx, UCC Qatar, Redco
International Qatar, Petrosarve Qatar, Iris Qatar, UCC PMV Qatar.

Jowain is a Saudi company with Qatari **customers**.

- Do **not** move the company to Qatar or invent a Doha address.
- Do **not** delete the Qatari client names — they are current clients from the 2026
  profile.
- Do **not** invent Saudi branches, offices or registrations either.

Full analysis: `docs/PRODUCTION-AUDIT.md` → *Local vs GitHub comparison* → *A necessary
correction to the brief*.

### 2. Never fabricate business information

Not for SEO, not to fill a layout, not because a section "looks empty". Specifically
forbidden without a verified client source:

> addresses · branch offices · phone numbers · WhatsApp numbers · equipment specifications
> · certifications · ISO numbers · project counts · client counts · fleet unit counts ·
> employee numbers · testimonials · client quotes · company history · awards · registration
> numbers · response-time promises · price lists · statistics

**Sources of truth**, in order:

1. `D:\Jowain Yanbu Est\Jowain Yanbu Est. Profile Overview.pdf` — the client-supplied
   company profile (August 2026)
2. `D:\Jowain Yanbu Est\Logo.pdf` and the client logo board JPEG
3. `src/config/site.ts` and `src/content/*`, which already encode the above

If a fact is not in one of those, it does not go on the site.

### 3. Unknown means `null`, not "plausible"

`src/config/site.ts` holds every business fact. Unknown fields are explicitly `null` and
**the dependent UI hides itself**: `phone`, `phoneE164`, `whatsapp`, street address,
`hours` and all social profiles are `null` because the profile does not supply them.

Filling one in switches its affordances on across the whole site. Do not fill one in with
a guess. Record the gap in `docs/CLIENT-INPUT-REQUIRED.md` instead.

### 4. Arabic is a first-class locale

Every string in `src/content/*` is a `{ en, ar }` pair. There is no fallback from Arabic to
English — a missing Arabic string is a **type error**, and that is deliberate.

- Never add English copy without Arabic.
- Never machine-translate and move on: technical machinery terminology must stay accurate
  (رافعات متحركة, رافعات زاحفة, حفّارات, مقاطر, صهاريج).
- Never add facts while translating.
- Preserve RTL: logical properties (`-start-`, `-end-`) and `rtl:` variants, not hardcoded
  left/right.

### 5. Never show a machine under the wrong label

`src/config/images.ts` has **no category-level image fallback**, by design. A crawler crane
card must never borrow the mobile-crane photograph. Items with no verified photograph
render an engineered panel and a line glyph. To a procurement engineer, the wrong machine
is a specification error, not a design choice.

The profile PDF's own machinery photographs are AI-generated and must not be used.

---

## The enquiry system — the site's only lead channel

The company publishes **no telephone number**, so email is the only channel a customer has.

**The contract: a 200 from `/api/contact` or `/api/quote` means the enquiry reached the
sales inbox.** It must never mean anything weaker. A previous implementation logged to
`console.info` and returned `{ ok: true }` regardless — every enquiry was silently lost.

- `src/lib/enquiry-core.ts` — validation, spam filtering, rate limiting, email rendering,
  Resend delivery. **Imports nothing from Next**, so it is unit-testable directly.
- `src/lib/enquiry.ts` — the Next adapter: status-code mapping, module-scope rate limiter,
  PII-free logging.
- `tests/enquiry.test.ts` — 33 tests on `node --test`. No test framework.

Status codes: `200` delivered (or silently filtered spam) · `415` wrong content type ·
`413` too large · `422` invalid input · `429` rate limited · `502` provider failed ·
`503` not configured.

**If you touch this file, run `npm test`.** Never reintroduce a success response on a
failure path.

Secrets policy: `RESEND_API_KEY` is server-side only, in a `runtime = "nodejs"` handler.
Never `NEXT_PUBLIC_`. Never committed. Never logged. Production logs carry the reference
and outcome only — no name, email, phone or message body.

---

## Performance budget

| | |
| --- | --- |
| Runtime dependencies | **4.** Adding a fifth needs a real justification |
| Client components | **8.** Server components by default |
| LCP | < 2.5 s · INP < 200 ms · CLS < 0.1 |
| Lighthouse | ≥ 95 across all four categories |

Hard rules:

1. **No animation library.** `motion` was removed — it cost 120 KB for two effects only
   desktop pointers could see. CSS transitions handle everything this design needs.
2. No UI framework or component library.
3. `priority` on the LCP image only. It is currently on exactly one (the hero).
4. Every image needs `sizes`, plus dimensions or `fill` in a sized parent.
5. Respect `prefers-reduced-motion`, and prefer gating motion in **CSS** rather than
   JavaScript so server-rendered markup is already correct.
6. No third-party script without an explicit decision and a matching CSP `connect-src`.

Details and measurements: `docs/PERFORMANCE.md`.

---

## Required validation

All four must pass before anything is considered done:

```bash
npm run typecheck    # tsc --noEmit, strict
npm run lint         # eslint, flat config
npm test             # node --test, 33 tests
npm run build        # 100 static pages
```

Do not suppress errors to make these pass. If the lint config breaks against a Next
upgrade, repair it properly — `next lint` was removed in Next 16, so `npm run lint` calls
the ESLint CLI directly against `eslint-config-next`'s native flat configs.

---

## Project map

```
src/config/site.ts      SINGLE SOURCE OF TRUTH — brand, location, contact, SITE_URL
src/config/images.ts    every image reference + provenance
src/content/*           bilingual copy: company · services · equipment · clients · faqs · legal
src/i18n/*              locale config, dictionaries, {en,ar} primitives
src/lib/seo.ts          metadata builder + all JSON-LD
src/lib/enquiry*.ts     the enquiry pipeline
src/proxy.ts            locale redirect (Next 16 renamed `middleware` → `proxy`)
src/app/[locale]/*      all pages; server components
src/app/api/*           contact + quote handlers
tests/                  node:test suites
docs/                   audit, deployment, security, SEO, performance, content, launch
```

Deeper explanation: `docs/ARCHITECTURE.md`.

---

## Deployment constraints

Target host is **Hostinger**, domain **`jowainyanbu.com`** (live, SSL active).

**Hostinger Premium — the purchased plan — does not officially support Node.js.** Node apps
require Business, Cloud or VPS. The assigned server does carry a working Node 22 runtime
and Passenger, so Premium may work in practice, but that needs one live test.

- Do **not** convert the app to a static export to force it onto Premium. That deletes the
  API routes, therefore the enquiry system, therefore the only lead channel.
- `SITE_URL` must be set **at build time** — absolute URLs are baked into 100 prerendered
  pages.
- `output: "standalone"` is enabled. `.next/static` and `public` sit outside the trace.
  **Always package with `npm run build:deploy`** — never `cp -r public .next/standalone/public`,
  which nests the directory and 404s every asset while routes still return 200.

Full procedure: `docs/HOSTINGER-DEPLOYMENT.md`.

---

## Design direction

Premium **light** industrial corporate. White and cool blue-grey surfaces, **deep navy**
anchors (`--color-ink-900` `#14203a`), one **blue** primary (`--color-brand-600` `#2c47a6`)
and one **green** support accent (`--color-accent-500` `#22955d`). High contrast, engineered,
trustworthy, mobile-first.

The blue and green hue families are derived from the official emblem, which is drawn in
`#0000FF` / `#00FF00` — correct for the trademark, unusable as interface colour. The system
keeps the hues and fixes the saturation; it never recolours the emblem itself.

**There is no amber, orange or gold in this system.** Tokens live in
`src/app/globals.css` (`@theme`); the full rationale is in `DESIGN.md`, which is the
authority. Read it before changing any colour.

**Refine it. Do not replace it.** Specifically do not turn it into a SaaS landing page,
pastel site, glassmorphism, heavy gradients, over-rounded cards, a startup layout, or a
generic AI-looking template. No random dark mode.

---

## Before you start

1. Read `docs/PRODUCTION-AUDIT.md` — findings and severities.
2. Read `docs/CLIENT-INPUT-REQUIRED.md` — what is genuinely blocked and why.
3. Check `git status` and work on a branch. Never run `git reset --hard`,
   `git checkout .`, or `git clean -fd` against uncommitted work.
