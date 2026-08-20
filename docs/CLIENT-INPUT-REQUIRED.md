# Client input required

Everything technical is done. These are the values only the client can supply.

Each row says exactly where the value goes and what happens until it arrives. **Nothing
here is filled with a plausible substitute** — a fabricated phone number or address on a
real company's website is worse than an absent one.

For business *facts* still open (phone, address, hours, logo), the authoritative list is
[`MISSING-INFO.md`](./MISSING-INFO.md). This file covers what the **deployment** needs.

**Resolved 20 August 2026:** the published email is `contact@jowainyanbu.com` and the
canonical domain is `jowainyanbu.com`. Both were open questions; neither is any longer.

---

## Blocking — the site cannot go live without these

### 1. Resend API key and a verified sending domain

**Why it blocks:** without it `/api/contact` and `/api/quote` return **503** and the
forms show their email fallback. This is deliberate — the endpoint refuses to report a
false success — but it means the forms do not deliver.

**What to do:**

1. Create an account at <https://resend.com> (free tier covers this site's volume).
2. **Domains → Add Domain** → `jowainyanbu.com`.
3. Resend prints DKIM and SPF records. Add them in **Hostinger → Domains → DNS Zone**.
4. Wait for the domain to show **Verified** (usually minutes).
5. **API Keys → Create** with *Sending access* only. Copy it once — it is not shown again.

**Where it goes:** environment variables in the hosting platform, never in the repository.

```
RESEND_API_KEY=re_...
EMAIL_FROM=Jowain Yanbu Est. <noreply@jowainyanbu.com>
ENQUIRY_TO_EMAIL=<the inbox that should receive enquiries>
```

> `EMAIL_FROM` must be on the verified domain. It is never the customer's address — that
> would fail SPF/DKIM and land in spam. The customer's address is set as `Reply-To`
> automatically, so replying from the inbox reaches them directly.

### 2. Which inbox should receive enquiries

`ENQUIRY_TO_EMAIL`. Can be more than one, comma-separated. The published address is
`contact@jowainyanbu.com` (confirmed 20 August 2026), and using it here as well is the
obvious default, but the destination does not have to match the published address.

### 3. www vs non-www — RESOLVED in part

**Domain: confirmed as `jowainyanbu.com`** (20 August 2026). The `www.jowain.net` printed
in the company profile PDF is superseded and no longer appears anywhere on the site.

Still open: **www vs non-www.** Pick one and 301 the other to it, or search engines index
two copies of the site. Non-www is what currently serves.

**Where it goes:** the `SITE_URL` environment variable. One value controls canonical tags,
hreflang, sitemap, robots, Open Graph and all structured data.

### 4. Hosting decision

Hostinger **Premium does not officially support Node.js** — Node.js apps require Business,
Cloud or VPS. The assigned server *does* carry a working Node 22 runtime and Passenger, so
Premium may work in practice; that requires one live test. Full analysis and all four
options are in [`HOSTINGER-DEPLOYMENT.md`](./HOSTINGER-DEPLOYMENT.md).

---

## Non-blocking — the site works without these

### 5. Telephone and WhatsApp numbers

The single highest-value improvement available. The company publishes no number, so the
site currently has **no tap-to-call and no WhatsApp button** — the two highest-intent
actions for a contractor browsing on a phone at a job site. Every dependent UI element
hides itself while the values are `null`.

**Where:** `src/config/site.ts` → `contact.phone`, `contact.phoneE164`, `contact.whatsapp`.
Setting them switches the affordances on across the header, footer, contact page and
error states. No other change needed. See `MISSING-INFO.md` §2.

### 6. Street address and opening hours

Only the city (Yanbu Al Bahr) is known. `contact.address` and `contact.hours` accept the
rest; the hours row hides while `null`. Adding a street address also enriches the
`LocalBusiness` structured data.

### 7. Fleet photography

All machinery images are currently licensed Unsplash photographs, chosen because the
supplied profile's machinery images are AI-generated and unusable on a real company's
site. Real Jowain photography would be a significant credibility upgrade and would remove
the site's only third-party runtime dependency.

**Where:** `src/config/images.ts` — swap the `id` values in one place. See
`CONTENT-GUIDE.md`.

### 8. Approved logo

`public/brand/jowain-emblem*.png` is derived from the supplied `Logo.pdf`. Confirm it is
the approved mark, or supply an SVG.

### 9. Social profiles

`site.social` is empty, so the footer icons hide. Add any confirmed LinkedIn / Instagram /
Facebook / YouTube URLs; they also populate `sameAs` in the Organization structured data.

### 10. Analytics

None is installed, by design — no tracking is loaded without an explicit decision. If
analytics is wanted, say which (a privacy-friendly option such as Plausible or Umami is
recommended for a GDPR-clean B2B site) and it will be added with the correct `connect-src`
CSP entry.

---

## What will NOT be invented

Restating the rule this project has followed throughout, so a future session does not
quietly break it. None of the following will be added without a verified client source:

project counts · client counts · fleet unit counts · employee numbers · turnover ·
certifications · ISO numbers · awards · testimonials · client quotes · branch offices ·
additional addresses · registration numbers · response-time promises · price lists

The company is **Jowain Yanbu Est., Yanbu Al Bahr, Al Madinah Province, Saudi Arabia,
established 1992**. That is the verified geography and it does not change. The Qatari
names in `src/content/clients.ts` are **customers**, not company locations.
