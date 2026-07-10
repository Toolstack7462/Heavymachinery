# Competitor & Market Audit — Qatar / GCC Heavy Equipment Rental

Independent research into how heavy-equipment rental and contracting companies in
Qatar, the wider GCC and leading international markets present themselves online —
and the concrete decisions that shaped this build.

> Method: reviewed the common patterns of heavy-equipment rental, plant-hire,
> crane-hire and contracting websites (Qatar/GCC regional players and large
> international rental brands such as national equipment-rental chains). Findings
> are generalised patterns, not claims about any single named competitor.

---

## 1. What competitors get RIGHT (adopted or improved here)

| Strength observed | How this site implements it |
|---|---|
| Clear fleet/category taxonomy | Fleet split into 4 categories (Earthmoving, Lifting, Transport, Power) with a filterable catalogue and 20 individual equipment pages |
| Prominent phone / "get a quote" | Sticky header CTA, floating WhatsApp, click-to-call everywhere, dedicated quote page with equipment pre-fill |
| Operated vs. bare rental clarity | Stated explicitly per machine and in an FAQ + an Insights article |
| Local/GCC positioning | "Qatar" reinforced in metadata, hero, LocalBusiness schema, `ar_QA` OG locale |
| Service breadth (single source) | Six services + "single-source partner" messaging |

## 2. Common competitor WEAKNESSES (deliberately avoided)

| Weakness observed | Our fix |
|---|---|
| **Slow, heavy pages** (large unoptimised hero images, jQuery/older stacks) | Next.js SSG, ~102 kB shared JS, AVIF/WebP config, `font-display: swap`, no render-blocking libraries |
| **Weak/absent structured data** | Full JSON-LD graph (Org/LocalBusiness/Service/Product/FAQ/Article/Breadcrumb) |
| **No Arabic or broken RTL** | True locale routing with mirrored RTL layout, logical CSS properties, `hreflang` |
| **Thin equipment pages** (a photo + a phone number) | Each machine has description, applications, spec table, related items, schema |
| **Poor mobile menus / tiny tap targets** | 44px+ targets, accessible slide-in drawer with accordions, `touch-action` friendly |
| **PDF-only company profile, no real site** | A complete, indexable, editable website |
| **Fabricated trust signals** (stock "clients", vague ISO badges) | Nothing invented; stats/certs disabled until verified |
| **Placeholder-only form labels, no spam control** | Visible labels, inline validation, aria-live, honeypot + time-trap |
| **No sitemap / weak internal linking** | XML + HTML sitemaps, cross-links between services ↔ equipment ↔ industries |

## 3. SEO gaps commonly seen (and closed here)

- Missing `hreflang` for bilingual sites → **implemented** (en/ar/x-default).
- Duplicate/missing canonical tags → **canonical per page**.
- No `LocalBusiness` NAP consistency → **single source of truth** in `site.ts`
  feeds header, footer, contact page and schema identically.
- Generic titles ("Home", "Services") → **descriptive, keyword-aware, localised**
  titles and descriptions per page.
- No FAQ rich-result eligibility → **FAQPage schema**.

## 4. Speed / performance posture

- Static generation for all content pages (SSG); only forms/search-param pages are
  dynamic.
- System-font fallback via `next/font` with `swap` to avoid FOIT and layout shift.
- Reserved aspect ratios on media tiles to protect CLS.
- No client-side data fetching on content pages; minimal JS islands (header, forms,
  floating CTA, locale switcher).

## 5. Conversion-focused structure (the "Enterprise Gateway" pattern)

Chosen for B2B plant hire: path-driven navigation (by service, by equipment,
by industry), trust signals surfaced early, and a single dominant CTA
("Request a Quote") supported by phone/WhatsApp on every screen — with a
low-friction quote form that can pre-select a specific machine.

## 6. Recommendations for the next iteration (post-launch)

1. Replace icon placeholders with **real equipment photography** (biggest visual win).
2. Add **verified** stats/case studies/certifications (then flip `SHOW_STATS`).
3. Native-speaker review of Arabic copy; translate page bodies (currently EN fallback).
4. Wire the form to an email/CRM provider (see `src/lib/enquiry.ts`).
5. Add analytics (privacy-friendly) and Google Business Profile for local SEO.
6. Acquire the real domain and a branded email; set both in `site.ts`.
