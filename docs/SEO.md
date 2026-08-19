# SEO

What is implemented, where it lives, and the lines this project does not cross.

---

## The one variable that controls everything

`SITE_URL` drives every absolute URL: canonical tags, hreflang alternates, `metadataBase`,
Open Graph and Twitter URLs, all ~270 sitemap entries, the `Sitemap:` line in `robots.txt`,
and every JSON-LD `@id`.

**It is required at build time.** Absolute URLs are baked into 100 prerendered pages, so
setting it only at run time leaves the fallback domain in the output. Change it → rebuild.

See [`ENVIRONMENT.md`](./ENVIRONMENT.md#site_url).

---

## Metadata

`buildMetadata()` in `src/lib/seo.ts` generates per-page metadata. Every page calls it.

- **Titles** — home gets `Jowain Yanbu Est. — {positioning}`; interior pages get
  `{Page} | Jowain Yanbu Est.`
- **Descriptions** — hand-written per page in `seoText`, per locale. Source-backed; no
  keyword stuffing.
- **Canonical** — absolute, self-referencing, per locale.
- **hreflang** — `en`, `ar` and `x-default`, reciprocal across the pair. `x-default` points
  at English.
- **Open Graph** — `type`, `siteName`, `title`, `description`, `url`, `locale`
  (`ar_SA` / `en_US`), `images`.
- **Twitter** — `summary_large_image`.
- **Robots** — `index, follow`, with a `noindex` switch available per page.

The OG image is generated at `/opengraph-image` from `src/app/opengraph-image.tsx`.

## Sitemap — `src/app/sitemap.ts`

~270 URLs: 14 static paths plus 11 services plus 52 equipment pages, each in both locales,
every entry carrying `alternates.languages`.

`lastModified` is **build time**, resolved once per build. It was previously a hardcoded
date, so every URL claimed the same frozen `lastmod` — a signal crawlers learn to ignore.
On a fully prerendered site a redeploy is the only way content changes, so build time is
the honest value.

Priority is by depth: home `1.0`, top-level sections `0.8`, detail pages `0.6`.

## Robots — `src/app/robots.ts`

Allows everything, disallows `/api/`, points at the sitemap. The legacy `host:` directive
was removed — Google ignores it, and the canonical host is already asserted by the
canonical tags and the redirect rules.

## Structured data — `src/lib/seo.ts`

| Schema | Where |
| --- | --- |
| `Organization` + `LocalBusiness` | every page, via the layout |
| `WebSite` | every page |
| `Service` | each of the 11 service pages |
| `Service` (for equipment) | each of the 52 fleet pages |
| `FAQPage` | `/faqs` |
| `ItemList` | `/fleet` |
| `BreadcrumbList` | via `components/Breadcrumbs.tsx` |

Two deliberate decisions:

**Equipment pages use `Service`, not `Product`.** There is no published price, and a
`Product` with an `Offer` and no price is invalid structured data. Renting a crane is a
service.

**`telephone` and `sameAs` are omitted.** No verified phone number or social profile
exists. An incomplete graph beats a fabricated one — and Google cross-checks these against
other sources. They populate automatically once `site.contact.phone` and `site.social` are
filled in.

---

## What this project will not do

These are not oversights. They are the rules the content follows.

**No fabricated location pages.** The verified profile supports a Kingdom-wide claim from a
Yanbu Al Bahr base and nothing more. Landing pages for Riyadh, Dammam or Jubail would rank
for a while and misrepresent the business — and the first customer to ask about the
"Dammam branch" ends the relationship.

**No invented facts for SEO.** No project counts, client counts, fleet unit counts,
certifications, ISO numbers, awards, testimonials or response-time promises. Structured
data is a machine-readable factual claim; a fabricated one is a lie with a schema
attached.

**No geographic misrepresentation.** The company is in **Saudi Arabia** — Yanbu Al Bahr, Al
Madinah Province, established 1992. Qatari names in `src/content/clients.ts` are
**customers**, not offices. Do not convert them into locations, and do not invent a Qatari
address.

**No keyword stuffing.** Copy is written for procurement managers and site engineers who
already know what a crawler crane is.

---

## GCC search, done honestly

The audience includes Gulf contractors. What is legitimately available:

- **Arabic as a first-class locale** — not a translation layer. Every string in
  `src/content/*` is an authored `{ en, ar }` pair; the build fails if one is missing. Full
  RTL, `ar_SA` Open Graph locale, `knowsLanguage: ["en","ar"]`.
- **Correct terminology** — رافعات متحركة, رافعات زاحفة, حفّارات, مقاطر, صهاريج. A Gulf
  contractor searching in Arabic finds the right page.
- **Real capability language** — crane capacities, equipment categories and service
  descriptions taken from the profile.
- **Kingdom-wide coverage**, because the profile states it.

What is *not* available: Saudi offices, Saudi registrations, or any city page the profile
does not support.

---

## After launch

1. Verify the property in **Google Search Console** (DNS TXT via Hostinger is easiest).
2. Submit `https://<domain>/sitemap.xml`.
3. Confirm the international targeting report shows the `en`/`ar` pair with no errors.
4. Test structured data — <https://search.google.com/test/rich-results>.
5. Confirm the canonical host: one of www / non-www, with the other 301ing to it.
6. Optionally add **Bing Webmaster Tools** (imports directly from Search Console).

### Verifying a deploy

```bash
curl -s https://<domain>/en/fleet | grep -o '<link rel="canonical"[^>]*>'
curl -s https://<domain>/en/fleet | grep -o '<link[^>]*alternate[^>]*>'
curl -s https://<domain>/sitemap.xml | grep -c "<loc>"
curl -s https://<domain>/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" https://<domain>/en/no-such-page   # expect 404
```

All five were verified against the production build before deploy; re-run them against the
live domain.
