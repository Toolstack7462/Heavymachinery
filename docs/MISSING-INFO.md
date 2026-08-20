# Missing / to-confirm information

The site is complete and deployable. The items below are the **only** facts still
open — everything else on the site traces to the client-supplied company profile
(*Jowain Yanbu Est. Profile Overview*, August 2026) or the official `Logo.pdf`.

Nothing here is filled with a plausible substitute. Each row says exactly where to
put the real value once the client confirms it.

---

## 🔴 Confirm before launch

### 1. The published email address — RESOLVED

The profile's contact line read as one unbroken string, `Contactsul@jowain.net`, and was
published verbatim rather than silently "corrected" while the reading was uncertain.

**Confirmed by the client on 20 August 2026: the address is `contact@jowainyanbu.com`.**
It now sits on the same domain the site is served from, which is also what makes SPF and
DKIM straightforward for enquiry delivery. `www.jowain.net` no longer appears anywhere on
the site; the footer, contact page and social card all derive the displayed website from
`site.url`.

**Where:** `src/config/site.ts` → `contact.email` and the derived `contact.website`.

### 2. Telephone / WhatsApp number

The profile supplies **no** telephone or WhatsApp number. Consequently:

- `site.contact.phone`, `phoneE164` and `whatsapp` are `null`
- there is **no** click-to-call, no WhatsApp button, no floating call CTA
- the schema graph omits `telephone` rather than asserting one
- the enquiry form treats phone as an optional field the *visitor* may supply

**Where:** `src/config/site.ts` → `contact.phone` / `phoneE164` / `whatsapp`.
Adding values there is the only change needed; the UI has no hard-coded numbers,
but the header, footer, contact panel and CTA bands were built without a call
affordance, so re-adding one is a deliberate design change rather than a
configuration flip.

### 3. Legal review of the website terms

`src/content/legal.ts` holds a plain-language privacy policy and website terms,
scoped to what the site actually does (collects enquiry form fields; sets no
tracking cookies) and governed by the laws of the Kingdom of Saudi Arabia. They
should be reviewed by the client's counsel before launch.

---

## 🟡 Would materially improve the site

### 4. Vector or high-resolution logo

The supplied `Logo.pdf` contains a single **178 × 173 px raster image** — not
vector artwork. The emblem was extracted with its transparency intact and is used
at 42–64px in the header, footer and favicon, where it stays crisp, paired with a
typographic wordmark.

An `.ai`, `.eps`, `.svg` or `.cdr` original (or a ≥1000px PNG) would allow larger
display on the hero and share cards.

**Where:** replace `public/brand/jowain-emblem.png`,
`public/brand/jowain-emblem-512.png`, `src/app/icon.png`,
`src/app/apple-icon.png`; dimensions are declared in `src/config/images.ts`
(`brand.emblemWidth/Height`).

### 5. Jowain's own equipment photography

No client photography was supplied. The company profile's machinery images are
AI-generated (impossible crane geometry, synthetic stock handshakes) and are
therefore **not used** — publishing them would put fabricated equipment on a real
company's site.

The site currently uses six licensed Unsplash photographs, each visually verified
against the equipment type it illustrates. The other twenty show an information
panel carrying that item's capacity range or type instead — deliberately built so
the catalogue reads as specified rather than empty. Real photographs of Jowain's
own cranes, trailers, tankers and site power would still be a significant
upgrade: **one frame per equipment group would improve twenty pages.**

**Where:** `src/config/images.ts` → `equipmentImages` (keyed by equipment slug),
`images` (hero and section bands).

### 6. One client mark cannot be identified

The supplied "Our Valued Clients" board contains a Saudi government emblem whose
inner ring of Arabic text is not legible at the supplied resolution. Rather than
guess the organisation, it carries a neutral accessible description ("a Kingdom of
Saudi Arabia government organisation").

**Where:** `src/content/clients.ts` → the `kingdom-of-saudi-arabia` entry.

Higher-resolution or vector client marks would also sharpen the whole wall: the
current marks are sliced from a WhatsApp-compressed JPEG at roughly 100–185px
wide, which is adequate at the rendered size but not generous.

### 7. Client list reconciliation (not an error)

Two client sources were supplied and both are published:

- the **logo board** — 25 marks, shown on `/clients` and the homepage
- the **profile's printed list** — Kabbani, TCC, Abraak International (Saudi
  Arabia); Landworx, UCC Qatar, Redco International Qatar, Petrosarve Qatar, Iris
  Qatar, UCC PMV Qatar (Qatar)

> **Note for future audits:** those Qatar-based names are current Jowain clients
> from the 2026 profile. They are **not** residue from the previous placeholder
> identity and must not be purged.

Confirm whether both lists should stay public, and whether "Petrosarve" is spelled
as intended (published exactly as printed).

---

## 🟢 Deliberately absent — do not add without a verified source

| Item | Status |
| --- | --- |
| Project counts, client counts, fleet unit counts | Not published — no figure exists in any source |
| Employee numbers, turnover, market share | Not published |
| ISO or other certifications | Not published — add only with certificate numbers |
| Awards | Not published |
| Testimonials / case studies | Not published — need named, permissioned sources |
| Exact models, tonnages, lift heights, payloads, kVA ratings | Only the three crane ranges from the profile are stated; everything else reads "Available on request" |
| Opening hours | Not supplied — the hours row is absent, not guessed |
| Social profiles | None supplied — footer icons hide while `site.social` is empty |
| Official Arabic registered name | Not supplied — the Arabic site keeps the Latin "Jowain Yanbu Est." rather than inventing an Arabic legal entity name |
| Street address | Profile gives the city only; the contact page links to Maps for Yanbu Al Bahr instead of pinning an unverified building |

## Enquiry delivery

`src/lib/enquiry.ts` validates each submission, assigns a quotable reference
(`JY-XXXXXX`) and logs it, but sends no email until a delivery target is
configured (`ENQUIRY_WEBHOOK_URL`, or a provider branch added in that file). The
success screen states the request was **recorded** and shows the reference; it
never claims an email was delivered.

**Set this up before launch.** Until then every lead exists only in server logs,
and combined with the unconfirmed email address above that means the site has no
verified inbound channel at all. This is the highest-risk item on this page.

### Response time

No response-time commitment appears anywhere on the site, because none is
documented. If the client will commit to one ("we reply within one working day"),
it belongs beside the submit button and in the success state — it is the single
most reassuring sentence the site could add, and the only thing missing from the
enquiry flow that code cannot supply.
