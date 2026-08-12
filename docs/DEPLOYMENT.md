# Deployment Guide

The site is a standard Next.js 16 (App Router) app and deploys anywhere that runs
Node 20.9+ or supports Next natively. 94 routes are prerendered at build time, so
almost every request is static HTML served from cache.

## Option A — Vercel (recommended, zero-config)

1. Push this repo to GitHub (already targeted at
   `https://github.com/Toolstack7462/Heavymachinery`).
2. In Vercel: **New Project → Import** the repo. Framework auto-detected as Next.js.
3. Build command `next build`, output handled automatically. No env vars are
   required to build.
4. Add the production domain and set it in `src/config/site.ts` (`url`).
5. Deploy.

## Option B — Any Node host (self-managed)

```bash
npm ci
npm run build
npm run start      # serves on PORT (default 3000)
```

Put it behind a reverse proxy (Nginx/Caddy) terminating TLS. The app already sets
HSTS and other security headers in `next.config.ts`.

## Option C — Docker (sketch)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","run","start"]
```

## Environment variables

None are required to build or run the site. Enquiry delivery is opt-in:

```
ENQUIRY_WEBHOOK_URL=   # CRM / Zapier / Make endpoint that receives the payload
```

Set it in the host's environment settings. Adding a transactional email provider
instead means adding a branch in `src/lib/enquiry.ts` that reads its key from
`process.env`. **Never commit secrets or `.env` files** (already gitignored).

## Domain

`src/config/site.ts` → `url` is set to `https://www.jowain.net`, taken from the
company profile. Canonical URLs, `hreflang` alternates, `sitemap.xml`,
`robots.txt`, the manifest and the OG image all derive from it — change it in that
one place if the production host differs.

## Post-deploy checklist

- [ ] Confirm the deployed host matches `site.url`, else canonical/OG URLs point
      at the wrong origin.
- [ ] Submit `https://www.jowain.net/sitemap.xml` to Google Search Console and
      Bing Webmaster Tools.
- [ ] Verify `hreflang` (`en`, `ar`, `x-default`) and the Organization /
      LocalBusiness / Service / FAQPage / BreadcrumbList graphs with Google's
      Rich Results Test.
- [ ] Wire the enquiry form to a delivery target and submit a real test enquiry
      — until then leads live only in server logs.
- [ ] Confirm the published email address with the client
      (see `MISSING-INFO.md` item 1) before announcing the site.
- [ ] Check `/ar` on a real device: RTL layout, Arabic fonts, mirrored menus.
- [ ] Run Lighthouse on the deployed URL.

## Security headers

Configured in `next.config.ts`:

| Header | Value |
| --- | --- |
| Content-Security-Policy | `default-src 'self'`; scripts self + inline (Next requires it); styles self + inline + Google Fonts; images self/data/https; **`frame-src 'none'`**; `object-src 'none'`; `frame-ancestors 'none'`; `form-action 'self'` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | camera, microphone, geolocation, browsing-topics all denied |

The site embeds **no** third-party frames — the contact page links out to Google
Maps rather than embedding it — which is why `frame-src` can be `'none'`. The
image optimiser is scoped to `images.unsplash.com` only, so it cannot be used as
an open proxy. If analytics is added later, extend `script-src` and `connect-src`
deliberately rather than loosening the whole policy.
