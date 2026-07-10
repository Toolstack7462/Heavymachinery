# Missing / To-Confirm Information

The site is complete and deployable, but the following items are **placeholders or
need client confirmation** before public launch. Each lists exactly where to change it.

## 🔴 Required before public launch (legal / brand)

| Item | Current placeholder | Where to set |
|---|---|---|
| Registered company name | `RASIKH Heavy Equipment & Contracting W.L.L.` (original placeholder) | `src/config/site.ts` → `name`, `fullName`, `legalName`, `logoText` |
| Real logo | Original SVG mark (`LogoMark`) | `src/components/Logo.tsx` + `src/app/icon.tsx` + `src/app/opengraph-image.tsx` |
| Production domain | `https://www.rasikh-qatar.com` | `src/config/site.ts` → `url` |
| Branded email | `info@rasikh-qatar.com` (placeholder; profile lists a gmail) | `src/config/site.ts` → `contact.email` |
| Privacy Policy & Terms | Starter templates — need legal review for Qatar | `src/app/[locale]/privacy-policy`, `.../terms` |

## 🟡 Verified but confirm for the rebrand

| Item | Value from profile | Notes |
|---|---|---|
| Phone (primary/secondary) | `+974 5000 4159` / `+974 5539 3445` | Real — confirm still current |
| Address | Zone 57, Street 509, Building 42, Doha | Real — set a precise map pin (`contact.address.mapQuery`) |
| Founded | 2013 | Used for "years in Qatar" and schema |
| CEO / leadership | Abid Ali Hazrat Said | `src/content/company.ts` — confirm name/title/photo/bio for rebrand |
| Opening hours | Sat–Thu 7:00–19:00 | `src/config/site.ts` → `contact.hours` — confirm |

## 🟢 Disabled until verified (do NOT enable with invented data)

| Item | Status | How to enable |
|---|---|---|
| Performance stats ("500+ projects / 500+ clients") | **Disabled** | Confirm real figures, then set `SHOW_STATS = true` in `src/content/company.ts` |
| Certifications (ISO/OSHAD/etc.) | **Omitted** | Add verified certificate details in `src/content/company.ts` (Safety page) |
| Project case studies | **Editable empty-state** | Add real, permissioned case studies to the Projects page |
| Testimonials / client logos | **Not present** | Add only with permission and real content |
| Equipment exact capacities / models | Verified figures only; rest "Available on request" | Fill real specs in `src/content/equipment.ts` |
| Photography | Real, license-free Unsplash stock (verified to depict machinery) | Replace with the client's **owned** equipment photos in `src/config/images.ts` |
| Social media links | Empty (hidden) | `src/config/site.ts` → `social` |

## Arabic content

- UI chrome (nav, buttons, forms) is translated (standard Arabic — safe).
- Marketing copy is a first-pass translation; a **native-speaker review** is
  recommended. Arabic pages show a "translation under review" notice.
- Page **body** content (service/equipment descriptions) currently renders in English
  on Arabic routes. Add Arabic bodies when available (see `CONTENT-EDITING.md`).

## Integrations to wire

- **Form delivery**: `src/lib/enquiry.ts` validates and logs enquiries but does not
  send email. Add a provider (e.g. Resend/SendGrid) via an env var — never hard-code keys.
- **Analytics**: none included; add a privacy-friendly analytics tag if desired.
