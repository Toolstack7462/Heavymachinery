# Content editing guide

Almost everything on the site can be changed without touching page code. Content
lives in typed, commented files under `src/config/` and `src/content/`. After an
edit, run `npm run build` — TypeScript will catch a missing translation or a
broken reference before it reaches the site.

**Golden rule:** every piece of body copy is a bilingual pair
`{ en: "…", ar: "…" }`. If you add English you must add Arabic, or the build
fails. That is intentional: it is what stops the Arabic site drifting into
English.

---

## 1. Brand, location, contact — `src/config/site.ts`

```ts
name: "Jowain Yanbu Est.",
positioning: "Heavy Equipment Rental & Transportation",
tagline: "Reliable Equipment. Dependable Transportation.",
url: "https://www.jowain.net",
foundedYear: 1992,

contact: {
  phone: null,        // ← set to a verified number to reintroduce call CTAs
  whatsapp: null,
  email: "contactsul@jowain.net",
  address: { city: "Yanbu Al Bahr", region: "Al Madinah Province", … },
  hours: null,        // ← set to show an opening-hours row
},
social: { linkedin: "", instagram: "", … },  // fill to show footer icons
```

Anything `null` or `""` hides its UI instead of rendering an empty row. Filling a
value is all that is needed to bring the corresponding element back.

## 2. Equipment catalogue — `src/content/equipment.ts`

Each entry drives a card on `/fleet` and its own `/fleet/<slug>` page.

```ts
{
  slug: "mobile-cranes",
  name: { en: "Certified Mobile Cranes", ar: "رافعات متحركة معتمدة" },
  category: "heavy-lifting",          // one of five category keys
  summary: { en: "…", ar: "…" },      // card line
  description: { en: "…", ar: "…" },  // detail page paragraph
  applications: { en: ["…"], ar: ["…"] },
  specs: craneSpecs({ en: "20 T – 1200 T", ar: "20 – 1200 طن" }),
  icon: "crane",
}
```

Spec rows come from shared, pre-translated helpers so the same vocabulary is not
retranslated per item:

- `craneSpecs(range)` — capacity range + operator + model-on-request
- `operatedSpecs(type)` — type + operator + model-on-request
- `transportSpecs(type)` — type + driver + Kingdom-wide coverage

**Do not invent figures.** The only tonnages in the source are the three crane
ranges; everything else must stay "Available on request" until the client
confirms real numbers.

To add an equipment type: append an object, and (optionally) add a photograph in
`src/config/images.ts` → `equipmentImages` keyed by the same slug. With no
photograph the card renders the navy panel and glyph, which is correct — never
point it at a photo of a different machine.

## 3. Services — `src/content/services.ts`

Five service groups mirroring the equipment categories. Each has `title`,
`tagline`, `summary`, `body` (paragraphs), `features` (bulleted list) and
`relatedEquipment` (equipment slugs to cross-link).

## 4. Company statements — `src/content/company.ts`

- `overview` — About page paragraphs
- `vision`, `mission` — About page panels
- `coreValues` — three values (Quality & Reliability, Integrity &
  Professionalism, Customer Commitment)
- `whyChooseUs` — three verified reasons
- `fleetHighlights` — readiness and coverage
- `industries` — the four sectors
- `qualityPhilosophy`, `qualityPractice`, `qualityCommitments` — Quality page

## 5. Clients — `src/content/clients.ts`

- `clientLogos` — the 25 marks. `width`/`height` are the file's real pixel size;
  `scale` is an optical nudge (wide-thin marks get `< 1`, near-square marks get
  `> 1`) so the wall reads evenly.
- `directClients` — the named client list from the profile.

To add a mark: drop the file in `public/clients/<slug>.png`, then add an entry
with its real dimensions. Never recolour or redraw a client's logo.

## 6. FAQs — `src/content/faqs.ts`

Answers are restricted to documented facts. Do **not** add rates, minimum hire
periods, delivery charges, insurance terms or response-time promises — none of
those are documented, and publishing them commits the company to terms it never
agreed.

## 7. Legal pages — `src/content/legal.ts`

Section arrays for the privacy policy and terms of use, both bilingual.

## 8. UI chrome and section headings — `src/i18n/dictionaries/`

`en.ts` is the canonical shape; `ar.ts` must satisfy the same type. Navigation
labels, buttons, form labels, section titles and page leads live here.

## 9. Photography — `src/config/images.ts`

```ts
hero:      { id: "<unsplash id>", alt: "…", altAr: "…" },
equipmentImages: { "<equipment slug>": { id, alt, altAr } },
```

Alt text is written as a description of what is in the frame, in both languages.
When Jowain supplies its own photographs, replace these entries (or swap in local
files under `public/`) and the whole site updates from one place.

## 10. Navigation — `src/config/nav.ts`

`getPrimaryNav()` builds the header (six top-level items so the menu fits from
1024px up) and `getFooterNav()` builds the footer columns. Equipment and service
children are generated from the content files, so adding a service adds its link
automatically.

---

## Checklist before publishing an edit

```bash
npm run typecheck   # catches a missing ar/en half
npm run lint
npm run build       # catches broken links to slugs that no longer exist
```

Then confirm the Arabic route renders the change: `/ar/<page>`, not just `/en/`.
