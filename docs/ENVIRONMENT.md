# Environment variables

Four variables. One is secret. Copy [`.env.example`](../.env.example) to `.env.local` for
development, or enter them in the hosting platform for production.

`.gitignore` already excludes `.env`, `.env.local` and every `.env.*.local`. **Never commit
a filled-in file.**

---

## Reference

| Variable | Required | Secret | Needed at | Default |
| --- | :---: | :---: | --- | --- |
| `SITE_URL` | ✅ | — | **build** and run | `https://jowainyanbu.com` |
| `RESEND_API_KEY` | ✅ | ✅ | run | none — forms 503 without it |
| `EMAIL_FROM` | ✅ | — | run | none — forms 503 without it |
| `ENQUIRY_TO_EMAIL` | ✅ | — | run | none — forms 503 without it |
| `NEXT_PUBLIC_SITE_URL` | — | — | build and run | alias for `SITE_URL` |
| `NODE_ENV` | — | — | run | set by the platform |
| `PORT` | — | — | run | `3000` |

---

## `SITE_URL`

The canonical origin, with protocol and **no trailing slash**.

```
SITE_URL=https://jowainyanbu.com
```

One variable controls every absolute URL the site emits:

- `<link rel="canonical">` on every page
- `hreflang` alternates for `en`, `ar` and `x-default`
- `metadataBase`
- Open Graph and Twitter card URLs
- every entry in `sitemap.xml` (about 270 URLs)
- the `Sitemap:` line in `robots.txt`
- every JSON-LD `@id`, plus `url` and `logo` in the Organization graph

**It is required at build time, not just run time.** The site prerenders 100 pages, and
those absolute URLs are baked into the HTML. Building without it and setting it later
leaves the fallback domain in the output. If you change it, rebuild.

Implemented by `resolveSiteUrl()` in `src/config/site.ts`, which tolerates a bare hostname
or a trailing slash and normalises to an origin. An unparseable value falls back rather
than throwing a build error on a malformed `metadataBase`.

> Pick www or non-www and stay on it. The other must 301 to it, or the site is indexed
> twice.

## `RESEND_API_KEY` — secret

Sending key from <https://resend.com> → **API Keys**. Grant *Sending access* only.

Read server-side exclusively, in a `runtime = "nodejs"` route handler. It never reaches the
browser and never appears in a response body — delivery failures return a generic message
while the diagnostic goes to the server log.

## `EMAIL_FROM`

The envelope sender. **Must be on a domain verified in Resend**, or every send is rejected.

```
EMAIL_FROM=Jowain Yanbu Est. <website@jowainyanbu.com>
```

It is never the customer's address — that would fail SPF and DKIM and land in spam. The
customer's address is set as `Reply-To` automatically, so replying from the inbox reaches
them directly.

Addresses containing a newline are rejected outright by `readMailConfig()`; that is a
header-injection guard, not a formatting nicety.

## `ENQUIRY_TO_EMAIL`

Where enquiries are delivered. Comma-separate for several recipients:

```
ENQUIRY_TO_EMAIL=sales@jowainyanbu.com, ops@jowainyanbu.com
```

Independent of the address *published* on the site — that comes from
`site.contact.email`.

---

## Behaviour when unset

| Missing | Result |
| --- | --- |
| `SITE_URL` | Builds and runs; absolute URLs use `https://jowainyanbu.com` |
| Any of the three mail variables | `/api/contact` and `/api/quote` return **503**; the form shows its error state with the email fallback |

The endpoint **never returns a fake success**. That is the contract the whole enquiry
rewrite exists to establish — see `src/lib/enquiry.ts`.

---

## Setting them per platform

**Local development** — create `.env.local` (already gitignored):

```bash
cp .env.example .env.local
```

**Vercel** — Project → Settings → Environment Variables. Set all four for *Production*
(and *Preview* if preview builds should send). Redeploy after changing `SITE_URL`.

**Hostinger Business / Cloud** — hPanel → Node.js dashboard → Environment Variables.

**Hostinger Premium + Passenger** — put them in `~/app/.env` and `chmod 600` it. Do **not**
use `SetEnv` in `.htaccess` for the API key: `.htaccess` lives inside the web root.

**VPS with PM2** — an `ecosystem.config.js` `env` block, or an `EnvironmentFile=` in the
systemd unit. See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

**Docker** — `--build-arg SITE_URL=…` at build time (it is baked into the HTML), and
`--env-file` at run time for the mail variables.

---

## Rotating the API key

1. Create a new key in Resend.
2. Update `RESEND_API_KEY` in the platform.
3. Restart or redeploy.
4. Submit a test enquiry and confirm it arrives.
5. Revoke the old key.

If a key is ever exposed — pasted into a chat, committed, or logged — revoke it first and
investigate afterwards. Revocation is instant and free.
