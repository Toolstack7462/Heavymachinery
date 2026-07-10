# RASIKH — Heavy Equipment & Contracting (Qatar)

A premium, production-ready corporate website for a Qatar heavy-equipment rental &
contracting business. Built with **Next.js 15 (App Router), TypeScript, Tailwind CSS v4**.

> **Brand note:** `RASIKH` (Arabic *rāsikh* — "solid / firmly established") is an
> **original placeholder brand**. The real registered name, logo and some details
> are meant to be swapped in via central config. See
> [`docs/MISSING-INFO.md`](docs/MISSING-INFO.md). Contact details on the site are
> **real and verified** from the supplied company profile.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /en
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

Requires Node 20.9+ (built and tested on Node 24).

---

## What's included

**Pages** (all bilingual EN / AR with RTL): Home, About, Leadership, Services (+ 6
service detail pages), Fleet catalogue (filterable) + 20 equipment detail pages,
Industries, Projects, Safety & Quality, Why Choose Us, FAQs, Insights (+ 3 articles),
Contact, Request a Quote, Privacy Policy, Terms, HTML Sitemap, and a custom 404.

**SEO & technical**
- Per-page metadata, canonical + `hreflang` alternates (en/ar/x-default)
- Structured data: Organization + LocalBusiness, WebSite, Service, Product,
  FAQPage, Article, BreadcrumbList
- `sitemap.xml` (88 URLs, locale alternates), `robots.txt`, web manifest
- Generated favicon and Open Graph image (no external assets)
- Security headers (CSP, HSTS, X-Frame-Options, etc.) via `next.config.ts`
- Accessible forms with honeypot + time-trap spam protection
- WhatsApp + click-to-call CTAs throughout; floating WhatsApp button
- Responsive, mobile-first; respects `prefers-reduced-motion`

**Design system** — Industrial amber (`#F5A623`) on white/graphite. Lexend (headings)
+ Source Sans 3 (body). Tokens live in `src/app/globals.css`.

---

## Editing content (no code required for most changes)

Everything the client edits lives in a few well-commented files:

| What | File |
|------|------|
| Brand name, contact, address, social, domain | `src/config/site.ts` |
| Services | `src/content/services.ts` |
| Fleet / equipment | `src/content/equipment.ts` |
| About, leadership, vision/mission, why-us, industries, safety, values, stats | `src/content/company.ts` |
| FAQs | `src/content/faqs.ts` |
| Insights / blog | `src/content/insights.ts` |
| UI labels & Arabic translations | `src/i18n/dictionaries/{en,ar}.ts` |
| Navigation | `src/config/nav.ts` |
| Design tokens (colors, fonts) | `src/app/globals.css` |

Full guide: [`docs/CONTENT-EDITING.md`](docs/CONTENT-EDITING.md).

---

## Documentation

- [`docs/COMPETITOR-AUDIT.md`](docs/COMPETITOR-AUDIT.md) — market research & findings
- [`docs/MISSING-INFO.md`](docs/MISSING-INFO.md) — what the client must supply
- [`docs/CONTENT-EDITING.md`](docs/CONTENT-EDITING.md) — how to edit content
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — how to deploy
- [`docs/QA-RESULTS.md`](docs/QA-RESULTS.md) — test & QA results

---

## Honesty & integrity notes

This site was built to **never display invented facts**. Unverifiable material is
disabled or clearly marked editable:
- Performance stats ("500+ projects/clients") are **disabled** (`SHOW_STATS = false`).
- No fake testimonials, client logos, certifications or project case studies.
- Equipment specs use **only** capacities stated in the source profile; everything
  else is "Available on request".
- Arabic marketing copy shows a "translation under review" notice.

## License / ownership

Delivered for the client. Replace placeholder brand assets before public launch.
