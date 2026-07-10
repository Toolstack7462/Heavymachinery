# Deployment Guide

The site is a standard Next.js 15 (App Router) app and deploys anywhere that runs
Node 20.9+ or supports Next natively.

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

None are required to build or run the current site. When you wire up form delivery,
add (for example) `RESEND_API_KEY` in your host's env settings and read it in
`src/lib/enquiry.ts`. **Never commit secrets or `.env` files** (already gitignored).

## Post-deploy checklist

- [ ] Set the real `url` (domain) in `src/config/site.ts` and redeploy so canonical
      URLs, `sitemap.xml`, `robots.txt` and OG images use the correct host.
- [ ] Submit `https://<domain>/sitemap.xml` to Google Search Console.
- [ ] Verify `hreflang` and structured data with Google's Rich Results Test.
- [ ] Confirm phone/WhatsApp links open correctly on a real device.
- [ ] Wire the enquiry form to an email/CRM provider and test end-to-end.
- [ ] Replace placeholder brand name/logo/email (see `MISSING-INFO.md`).
- [ ] Run Lighthouse on the deployed URL (local static build already passes core checks).

## Security headers

Configured in `next.config.ts`: Content-Security-Policy, HSTS, X-Content-Type-Options,
X-Frame-Options, Referrer-Policy, Permissions-Policy. If you add third-party scripts
(analytics, maps), extend `script-src` / `connect-src` / `frame-src` in the CSP.
