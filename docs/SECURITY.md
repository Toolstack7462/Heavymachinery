# Security

Posture, decisions, and the things deliberately *not* done. Findings and severities are in
[`PRODUCTION-AUDIT.md`](./PRODUCTION-AUDIT.md).

---

## Headers

Set in `next.config.ts` for every route.

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | see below |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `X-Powered-By` | removed (`poweredByHeader: false`) |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';        ← 'unsafe-eval' in development only
style-src 'self' 'unsafe-inline';
font-src 'self';
img-src 'self' data: blob: https://images.unsplash.com;
connect-src 'self';
frame-src 'none'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none';
upgrade-insecure-requests
```

Three decisions worth understanding before editing it:

**`'unsafe-eval'` is development-only.** The Next dev server needs it for React Refresh; a
production build never evaluates strings. It is gated on `NODE_ENV`, so the production
policy does not carry it. Verified on the built server — the emitted header contains no
`unsafe-eval`.

**`'unsafe-inline'` in `script-src` stays, deliberately.** Next emits small inline
bootstrap scripts. The alternative is a per-request nonce, which forces every page to
render dynamically — trading a measurable performance loss across 100 prerendered pages
for a marginal security gain on a site that renders no user-generated content and has no
authenticated session to steal. Revisit if either changes.

**Font CDNs are absent on purpose.** `next/font` self-hosts all three faces at build time,
so the browser never contacts `fonts.googleapis.com` or `fonts.gstatic.com`. The previous
policy allowed both for origins that were never used.

`img-src` is scoped to the single host `remotePatterns` permits, so the CSP and the image
optimiser cannot drift apart.

### ⚠ Known host limitation — the CDN truncates the CSP header

**Measured against production.** Two separate layers sit in front of the Node app:
LiteSpeed on the origin, and **Hostinger's own CDN** (`Server: hcdn`,
`x-hcdn-cache-status`). Together they mean the CSP *header* does not survive:

| Delivery mechanism | Result |
| --- | --- |
| HTTP response header | **Truncated** to its final directive — the browser receives only `upgrade-insecure-requests`. Confirmed at the origin itself, so this is the origin server, not the CDN. |
| `Header set` in `.htaccess` | **Ignored** — `mod_headers` is not available to this account (a test header never appeared). |
| `<meta http-equiv="Content-Security-Policy">` | **Delivered correctly by the origin.** Verified by requesting the origin directly and bypassing the CDN: the meta tag is present in the 202,517-byte response. |

> **Correction.** An earlier revision of this document stated that the host also strips the
> meta tag. That was wrong: the page being measured was a CDN cache HIT predating the
> release that added the tag. Always bypass the CDN before concluding anything about what
> the server emits — see the cache note below.

**Net effect:** the policy reaches the browser through the meta tag, minus `frame-ancestors`
(invalid in meta form), which `X-Frame-Options: DENY` covers and which the host does deliver.

**Residual risk.** CSP is defence-in-depth against XSS. This site renders no user-generated
content, has no authentication, session or cookies, loads no third-party scripts, and
accepts input through one endpoint that never reflects it into HTML — so the attacks CSP
mitigates have no delivery path here. The surviving headers (`X-Frame-Options`,
`X-Content-Type-Options`, HSTS, `Referrer-Policy`, `Permissions-Policy`) cover clickjacking,
MIME sniffing and transport.

### ⚠ The CDN caches HTML and does not purge on deploy

Hostinger's CDN honoured Next's `s-maxage=31536000` on prerendered routes and pinned a
one-year copy of every page. After a deploy it kept serving HTML that referenced build
chunks the new release no longer contained — an unstyled site — while a request with a
cache-buster returned the correct page, which is what made it invisible to status checks.

The origin now sends `public, max-age=0, must-revalidate` for HTML (hashed
`/_next/static` output keeps `immutable`), so this cannot recur. **An existing stale entry
must still be purged once, in hPanel → Performance / CDN → Purge cache** — the CDN ignores
client `Cache-Control: no-cache`, and it cannot be purged over SSH.

When diagnosing anything about response headers on this site, bypass the CDN first:

```bash
ssh -p 65002 <user>@<host> 'curl -sk -H "Host: jowainyanbu.com" https://127.0.0.1/en -D - -o /dev/null'
```

---

## Enquiry endpoint

`/api/contact` and `/api/quote`, both `runtime = "nodejs"`. Logic in
`src/lib/enquiry-core.ts`; Next adapter in `src/lib/enquiry.ts`.

### Request handling, in order

1. **Content-Type** must be `application/json` → otherwise `415`. Removes the simplest
   cross-origin form-post shape.
2. **Body size** capped at 64 KB by `Content-Length` *and* by measuring the read, since the
   header is advisory → `413`.
3. **JSON shape** must be a plain object, not an array or scalar → `400`.
4. **Rate limit** before any work that costs money → `429` with `Retry-After`.
5. **Honeypot** (`company_url`) → `200 {ok:true}`, so a bot learns nothing.
6. **Time trap**, minimum 2 s since form mount → `200 {ok:true}`.
7. **Field validation** → `422` with a message the visitor can act on.
8. **Delivery** → `200` on success, `502` on provider failure, `503` if unconfigured.

### Input hardening

- Every field passes through `clean()`, which strips Unicode control characters (`\p{Cc}`)
  and caps length. CR and LF are removed there, which is what makes `Reply-To` and the
  subject line safe to build from user input — **header injection cannot survive the
  parse**. Covered by tests.
- Field caps: name 120, email 254 (RFC 5321), company 160, phone 40, location 160,
  duration 80, message 5000, body 64 KB.
- Over-long input is truncated rather than rejected — a real customer who pastes a long
  specification should not lose their enquiry.
- HTML email interpolation goes through `escapeHtml()`. Tested against a script tag and an
  `onerror` payload.
- `readMailConfig()` rejects `EMAIL_FROM` or `ENQUIRY_TO_EMAIL` containing a newline.

### Rate limiting

Fixed window, **5 submissions per IP per 10 minutes**, shared across both endpoints.
Client identified from the left-most `x-forwarded-for` entry, falling back to
`x-real-ip`, `cf-connecting-ip`, then `unknown`.

**Stated limitation:** the counter is in-process. That is exact on Passenger, PM2, systemd
and Docker — the deployment targets that apply here. On a serverless platform each
instance keeps its own counter, so the effective limit is per instance. For a contact form
that sends mail rather than mutating data, and which is already behind a honeypot and a
time trap, that ceiling is acceptable. If it ever needs to be exact, back `RateLimiter`
with Redis behind the same interface; nothing else changes.

`x-forwarded-for` is spoofable in principle, which is why it only ever gates a contact
form and never an authorisation decision.

### Failure behaviour

A failure is never reported as success. This is the defect the rewrite exists to remove —
the previous implementation logged the enquiry to `console.info` and returned
`{ ok: true }` regardless.

- Response bodies carry a generic message. No stack traces, no provider detail, no
  configuration state.
- The diagnostic — provider status and a 300-character excerpt — goes to the server log
  only.
- The UI distinguishes 422 (fix your input), 429 (wait), and 5xx (use the email fallback).

### Logging and PII

In production the log line is `[enquiry:quote] JY-8QK3R2 delivered <id>` — reference and
outcome only. Name, email, phone and the message body are **not** logged. Shared-host logs
are readable by support tooling and are retained; the reference is enough to trace a
specific enquiry through the provider's dashboard. Full payloads are logged in development
only.

---

## Secrets

- No secret is committed. `.gitignore` covers `.env`, `.env.local` and `.env.*.local`.
- `RESEND_API_KEY` is read server-side only, in a Node runtime handler. It cannot reach the
  browser: there is no `NEXT_PUBLIC_` variable carrying it, and it never appears in a
  response.
- On Passenger, secrets belong in `~/app/.env` with mode `600` — **not** in `.htaccess`,
  which sits inside the web root.
- Rotation procedure: [`ENVIRONMENT.md`](./ENVIRONMENT.md#rotating-the-api-key).

> **Operational note.** SSH credentials for the Hostinger account were shared in plaintext
> during this engagement. They are not recorded in this repository or in any document here,
> and **the account password should be rotated in hPanel.**

---

## Dependencies

Four runtime packages: `next`, `react`, `react-dom`, `lucide-react`.

```
npm audit            → 0 vulnerabilities
npm audit --omit=dev → 0 vulnerabilities
```

`motion` (Framer) was removed during this pass — it existed for two decorative effects and
cost a 120 KB chunk. Fewer dependencies is a security property, not only a performance one.

No major-version upgrades were forced. Keep it that way: check the changelog before
bumping a major, and re-run `npm test && npm run build`.

---

## Image optimiser

`remotePatterns` allows exactly one host, `images.unsplash.com`. Without that scope the
Next image endpoint is an open proxy that will fetch and re-serve arbitrary URLs under
your domain. Do not widen it to a wildcard.

## External links

No `target="_blank"` links exist outside the Google Maps link, so `rel="noopener
noreferrer"` is not currently needed anywhere. **If you add an outbound link that opens in
a new tab, add `rel="noopener noreferrer"`** — without it the opened page can reach back
through `window.opener`.

## Not implemented, and why

| | |
| --- | --- |
| **CAPTCHA** | The honeypot and time trap cost nothing and add no friction. A CAPTCHA would tax every legitimate contractor to stop spam that is not currently arriving. Add one only if spam actually materialises. |
| **Analytics / tag manager** | Nothing is loaded without an explicit decision. Adding any requires a `connect-src` entry. |
| **Cookies** | None are set. No consent banner is needed, which is also a UX win. |
| **Auth** | The site has no accounts, no admin area and no database. There is no session to steal. |

---

## Verifying after deploy

```bash
# headers, including CSP without unsafe-eval
curl -sI https://jowainyanbu.com/en | grep -i "content-security\|strict-transport\|x-frame"

# forms reject bad input rather than silently accepting it
curl -i -X POST https://jowainyanbu.com/api/contact \
  -H "Content-Type: application/json" -d '{"name":"x","email":"bad","message":"y"}'
# expect 422

# and are not an open relay for oversized payloads
curl -i -X POST https://jowainyanbu.com/api/contact \
  -H "Content-Type: text/plain" -d 'x'
# expect 415
```

Then run the site through <https://securityheaders.com> and
<https://www.ssllabs.com/ssltest/>.
