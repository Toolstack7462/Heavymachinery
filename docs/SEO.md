# SEO

What is implemented, where it lives, and the lines this project does not cross.

---

## The one variable that controls everything

`SITE_URL` drives every absolute URL: canonical tags, hreflang alternates, `metadataBase`,
Open Graph and Twitter URLs, all 90 sitemap entries, the `Sitemap:` line in `robots.txt`,
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

90 `<loc>` entries: 14 static paths plus 5 services plus 26 equipment pages, each in
both locales, every entry carrying `alternates.languages` (so 270 `jowainyanbu.com`
occurrences in the file overall — 90 locations plus 180 hreflang alternates).

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
| `Service` | each of the 5 service pages |
| `Service` (for equipment) | each of the 26 fleet pages |
| `FAQPage` | `/faqs` |
| `ItemList` | `/fleet` |
| `BreadcrumbList` | via `components/Breadcrumbs.tsx` |

The sitemap also carries **22 `<image:image>` entries**, one per equipment page
that has a verified photograph. Machinery imagery is a real entry point for a
rental business, and a photo that exists only inside a `/_next/image` URL is not
discovered as reliably. Pages still rendering the engineered panel are skipped
rather than declared with an empty image.

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

## Submission and verification

### Already done, no account required

**IndexNow** submits to Bing, Yandex, Seznam and Naver in one POST. Ownership is
proved by a key file at the site root, so **`public/<key>.txt` must not be
deleted or renamed** — the engines re-check it.

```bash
npm run seo:indexnow          # reads sitemap.xml, verifies the key file, submits
npm run seo:indexnow -- --dry # print what would be sent
```

Last run: 90 URLs, HTTP 202 (accepted). Re-run it after any deploy that adds or
changes pages. Google does **not** participate in IndexNow.

### Needs the site owner once: Google Search Console

Verification tokens are read from the environment, so nothing secret is
committed and the tag does not render until a token exists:

```
GOOGLE_SITE_VERIFICATION=<content value from Google>
BING_SITE_VERIFICATION=<content value from Bing>     # optional
```

Steps:

1. <https://search.google.com/search-console> → **Add property** → **URL prefix**
   → `https://jowainyanbu.com` (non-www, the canonical host).
2. Choose **HTML tag**. Google shows
   `<meta name="google-site-verification" content="XXXX" />` — copy only the
   `content` value.
3. Set `GOOGLE_SITE_VERIFICATION` to that value in the hosting environment
   (`~/app/.env` on Passenger) and **redeploy**. The value is baked into the
   prerendered HTML, so a restart alone is not enough.
4. Confirm it is live: `curl -s https://jowainyanbu.com/en | grep google-site-verification`
5. Back in Search Console, click **Verify**.
6. **Sitemaps** → submit `sitemap.xml`.
7. Check **International Targeting** for hreflang errors after a few days.

The URL-prefix property covers the canonical host. Because www 301s to non-www,
a separate www property is not needed.

## After launch

1. Search Console property and sitemap: see *Submission and verification* above.
2. Test structured data — <https://search.google.com/test/rich-results>.
3. Canonical host: **resolved.** non-www is canonical and www 301s to it,
   verified live including deep links with query strings.
4. Bing: already covered by IndexNow. Bing Webmaster Tools is optional and can
   import from Search Console if a dashboard is wanted.

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
