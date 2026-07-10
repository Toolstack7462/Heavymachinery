# Content Editing Guide

You can update almost everything without touching page code. All content lives in
typed, commented files under `src/config/` and `src/content/`. After editing, run
`npm run build` to catch any mistakes.

---

## 1. Rebrand in one place

Open **`src/config/site.ts`** and edit:

```ts
name: "RASIKH",                       // short brand
fullName: "RASIKH Heavy Equipment ...",
legalName: "... W.L.L.",
url: "https://www.yourdomain.com",     // production domain
contact: {
  phonePrimary: "+974 ...",
  phonePrimaryE164: "+974...",         // no spaces — used by tel:/WhatsApp
  whatsappNumber: "974...",            // no + — used by wa.me
  email: "info@yourdomain.com",
  address: { line1: "...", city: "Doha", mapQuery: "precise pin here" },
  hours: "...",
},
social: { linkedin: "https://...", instagram: "", ... },  // empty = hidden
```

The header, footer, contact page, WhatsApp/phone links, metadata and structured data
all update automatically.

The logo is SVG in **`src/components/Logo.tsx`** (`LogoMark`). To use a real logo,
replace the SVG paths there. The favicon and social image regenerate from
`src/app/icon.tsx` and `src/app/opengraph-image.tsx`.

---

## 2. Services — `src/content/services.ts`

Each service is an object. Add one by appending to the `services` array:

```ts
{
  slug: "site-clearance",             // becomes /services/site-clearance
  title: "Site Clearance",
  tagline: "…",
  summary: "…",                       // shown on cards
  body: ["Paragraph 1", "Paragraph 2"],
  features: ["…", "…"],               // "what's included" list
  relatedEquipment: ["excavators"],   // slugs from equipment.ts
  icon: "excavator",                  // see icon keys below
}
```

## 3. Fleet / equipment — `src/content/equipment.ts`

Same idea. `category` must be one of `earthmoving | lifting | transportation | power`.
Fill `specs` with **verified** values only; use `"Available on request"` otherwise.

## 4. Company info — `src/content/company.ts`

- `SHOW_STATS` — flip to `true` only after confirming real figures.
- `values`, `whyChooseUs`, `industries`, `leadership`, `safetyCommitments`,
  `visionMission` — plain arrays/objects, edit freely.
- Add certifications here when you have verified details.

## 5. FAQs — `src/content/faqs.ts`

Array of `{ question, answer }`. These also power the FAQ rich-result schema.

## 6. Insights / blog — `src/content/insights.ts`

Each article has a `body` of blocks: `{ type: "p" | "h2", text }` or
`{ type: "ul", items: [...] }`.

## 7. UI labels & Arabic — `src/i18n/dictionaries/{en,ar}.ts`

Button text, form labels, section titles. `ar.ts` mirrors `en.ts`. To translate a
page **body** into Arabic later, the cleanest approach is to make the relevant
content field locale-aware (ask your developer) — the scaffolding is ready.

## 8. Navigation — `src/config/nav.ts`

Controls the header mega-menu and footer columns.

## 9. Design tokens — `src/app/globals.css`

Brand colors (`--color-brand-*`), ink/graphite scale, radii, shadows and fonts.
Change the accent by editing `--color-brand-500` (and hover `-600`).

---

### Icon keys

Equipment/service glyphs: `excavator, dozer, loader, grader, roller, crane,
telehandler, forklift, trailer, truck, demolition, contracting, power`.
UI/value icons (Lucide): `shield, clock, medal, handshake, map, gauge, tag,
calendar, users, layers, building, road, factory, tree, wrench, leaf, clipboard,
phone, mail, mapPin, globe, check, star`.

> Never use emoji as icons — add a new SVG glyph in `src/components/Icon.tsx` if you
> need one that isn't listed.
