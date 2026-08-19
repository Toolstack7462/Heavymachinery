# Hostinger deployment

Written against the **actual account**, not generic advice. Everything in *Findings* was
verified over SSH on 20 August 2026.

---

## Hostinger plan

| | |
| --- | --- |
| Provider | Hostinger |
| Plan | **Premium** shared hosting |
| Server | `sg-nme-web1099.main-hosting.eu` |
| Platform | CloudLinux 4.18 + LVE + CageFS, LiteSpeed |
| Account | `u127191545` |
| SSH | port **65002** (available) |
| Domain | **`jowainyanbu.com`** — DNS live, SSL active, HTTP→HTTPS working |
| Docroot | `~/domains/jowainyanbu.com/public_html` |

---

## The central problem

**Hostinger's documentation states that Node.js applications are available on Business,
Cloud Startup / Professional / Enterprise and VPS plans. Premium is not listed.**

This application is a Next.js server. It needs a Node runtime for its API routes
(`/api/contact`, `/api/quote`), the locale-redirect proxy, and on-demand rendering of the
three dynamic routes. On a PHP-only vhost, none of that runs.

### Findings — the server is better equipped than the docs suggest

| Probe | Result |
| --- | --- |
| `php -v` | PHP 8.3.30 |
| `which node` | not on `PATH` |
| `/opt/alt/alt-nodejs{18,20,22,24}` | **present** |
| `/opt/alt/alt-nodejs22/root/usr/bin/node -v` | **`v22.18.0`, executes as this user** |
| `/opt/alt/alt-nodejs22/root/usr/bin/npm -v` | **`10.9.3`** |
| Passenger | **installed** — `/opt/passenger`, `/var/passenger`, `/etc/profile.d/alt_mod_passenger.sh` |
| `cloudlinux-selector` CLI | not exposed to the account |
| hPanel "Node.js app" UI | not available on Premium |

So the runtime and the application server are both physically present and user-executable.
**What is unproven is whether `mod_passenger` is enabled for this vhost** — whether an
`.htaccess` carrying Passenger directives is honoured, or silently ignored.

That is a single empirical test (Option A, step 1). It decides everything.

---

## Options, ranked

### A. Premium + Passenger — test this first

Costs nothing to try and keeps the purchased plan. **Requires a live test.**

1. **Prove Passenger is active.** Upload a two-file probe and request the domain:

   ```bash
   ssh -p 65002 u127191545@145.79.24.9

   mkdir -p ~/nodetest
   cat > ~/nodetest/app.js <<'EOF'
   const http = require("http");
   http.createServer((req, res) => {
     res.writeHead(200, { "Content-Type": "text/plain" });
     res.end("PASSENGER_OK " + process.version + "\n");
   }).listen(process.env.PORT || 3000);
   EOF

   cd ~/domains/jowainyanbu.com/public_html
   cp default.php ~/default.php.bak
   cat > .htaccess <<'EOF'
   PassengerAppRoot "/home/u127191545/nodetest"
   PassengerBaseURI "/"
   PassengerNodejs "/opt/alt/alt-nodejs22/root/usr/bin/node"
   PassengerAppType node
   PassengerStartupFile app.js
   EOF
   ```

   Then `curl -s https://jowainyanbu.com/`.

   - Prints `PASSENGER_OK v22.18.0` → **Passenger works. Continue to step 2.**
   - Still shows the parking page, or a 500 → **Passenger is not enabled. Go to Option B.**

   Clean up either way: `rm ~/domains/jowainyanbu.com/public_html/.htaccess`

2. **Build locally and upload.** There is no SSH `npm`, so build on your machine:

   ```bash
   npm ci
   SITE_URL=https://jowainyanbu.com npm run build:deploy
   ```

   `output: "standalone"` is already enabled, so `.next/standalone` contains the server
   and only the modules it actually needs — no `node_modules` install on the server.
   `build:deploy` runs the build and then `scripts/package-standalone.mjs`, which copies
   `public/` and `.next/static/` into the bundle and verifies they resolve.

> **Never assemble the bundle by hand.** `next build` already creates
> `.next/standalone/public`, so `cp -r public .next/standalone/public` *nests* it as
> `public/public/` — the server then 404s the company logo and all 25 partner logos while
> every route still returns 200. That shipped to production once. Use
> `npm run build:deploy`, which copies directory *contents* and then verifies known assets
> resolve, failing the build if they do not.

   Upload the contents of `.next/standalone/` to `~/app/` (SFTP on port 65002, or
   hPanel → File Manager).

3. **Point the docroot at it:**

   ```apache
   # ~/domains/jowainyanbu.com/public_html/.htaccess
   PassengerAppRoot "/home/u127191545/app"
   PassengerBaseURI "/"
   PassengerNodejs "/opt/alt/alt-nodejs22/root/usr/bin/node"
   PassengerAppType node
   PassengerStartupFile server.js
   PassengerAppEnv production
   PassengerFriendlyErrorPages off

   SetEnv SITE_URL https://jowainyanbu.com
   SetEnv NODE_ENV production
   ```

   Secrets do **not** go in `.htaccess` — see *Environment variables* below.

4. **Restart:** `mkdir -p ~/app/tmp && touch ~/app/tmp/restart.txt`

**Limitation to accept:** with no SSH `npm`, every deploy is a local build plus an upload.
That is workable but manual. It also means Hostinger's GitHub auto-deploy is unavailable
on this plan.

### B. Upgrade to Hostinger Business — the supported path

If Option A fails, this is the smallest change that makes everything work as designed.

- Node.js 18/20/22/24, chosen in hPanel
- **GitHub integration with automatic builds on every push**
- Environment variables in the hPanel Node.js dashboard
- `npm ci` and `npm run build` run automatically on deploy
- Up to 5 Node apps
- Same domain, same DNS, same SSL, same billing account

Configuration once upgraded:

| Setting | Value |
| --- | --- |
| Application root | `domains/jowainyanbu.com/public_html` (or a repo subdirectory) |
| Node version | **22.x** |
| Framework | Next.js (or *Other* with entry file `server.js` for a standalone build) |
| Build command | `npm run build` |
| Start command | `npm start` |
| Environment | `SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `ENQUIRY_TO_EMAIL`, `NODE_ENV=production` |

### C. Vercel, domain stays at Hostinger — fastest to live

Keeps the Premium plan for email and anything else. Point DNS at Vercel:

1. Import the GitHub repository at <https://vercel.com/new>.
2. Add the four environment variables (Production scope).
3. Add the domain `jowainyanbu.com` in Vercel → it prints the DNS targets.
4. In **Hostinger → Domains → DNS Zone**, set:
   - `A` record `@` → the IP Vercel gives you
   - `CNAME` `www` → `cname.vercel-dns.com`
5. SSL provisions automatically.

Fastest, best performance, zero server administration. Trade-off: two providers.

### D. Hostinger VPS — most control

Node LTS + PM2 + Nginx + Certbot. Full instructions in
[`DEPLOYMENT.md`](./DEPLOYMENT.md#c-vps--linux-server).

---

## Runtime requirements

| | |
| --- | --- |
| Node.js | **22.x** (18.x is the floor; `package.json` requires `>=20.9.0`) |
| Build command | `npm ci && npm run build` |
| Start command | `npm start`, or `node server.js` from a standalone build |
| Listens on | `PORT` (defaults to 3000); Passenger and most panels inject this |
| Persistent process | **required** — this is a server, not static files |
| Disk | roughly 350 MB with `node_modules`; roughly 80 MB standalone |

---

## Environment variables

Set these in the platform, never in the repository. Full reference:
[`ENVIRONMENT.md`](./ENVIRONMENT.md).

| Variable | Required | Notes |
| --- | --- | --- |
| `SITE_URL` | **yes** | `https://jowainyanbu.com` — no trailing slash. Baked into prerendered HTML, so it must be present **at build time**, not only at run time. |
| `RESEND_API_KEY` | **yes** | Secret. Forms return 503 without it. |
| `EMAIL_FROM` | **yes** | Must be on a Resend-verified domain. |
| `ENQUIRY_TO_EMAIL` | **yes** | Destination inbox; comma-separate for several. |
| `NODE_ENV` | recommended | `production` |

**On Passenger (Option A)** put secrets in `~/app/.env` (chmod `600`), not in `.htaccess` —
`.htaccess` sits inside the web root and `SetEnv` values are easy to leak through a
misconfiguration. Next reads `.env` from the application root automatically.

```bash
chmod 600 ~/app/.env
```

---

## Domain configuration

- Canonical host: **`jowainyanbu.com`** — confirm www vs non-www before launch and 301 the
  loser to the winner. Do not let both index.
- `SITE_URL` must match the canonical host exactly. It drives canonical tags, hreflang,
  `sitemap.xml`, `robots.txt`, Open Graph URLs and every JSON-LD `@id`.
- The published email address is on a *different* domain (`contactsul@jowain.net`). That is
  deliberate and taken from the company profile — see `MISSING-INFO.md` §1.

## DNS

Currently resolving to Hostinger (`145.79.24.9`, `145.79.29.0`, plus IPv6). Change only for
Option C, and only the records Vercel specifies.

Add Resend's DKIM and SPF records in **Hostinger → Domains → DNS Zone** regardless of which
option is chosen — enquiry email needs them.

## SSL

Already active and valid. HTTP redirects to HTTPS. Nothing to do for Options A, B or D;
Option C provisions a new certificate automatically.

Verify no mixed content after deploying: the CSP includes `upgrade-insecure-requests`, and
`img-src` is limited to `'self'`, `data:`, `blob:` and `images.unsplash.com`.

## Email delivery

Provider **Resend**, called server-side only — the API key is never sent to the browser.
The endpoint returns 502 or 503 on failure rather than a fake success, and the UI then
shows the email fallback. See [`SECURITY.md`](./SECURITY.md) and
[`CLIENT-INPUT-REQUIRED.md`](./CLIENT-INPUT-REQUIRED.md) §1.

Test after deploy:

```bash
curl -i -X POST https://jowainyanbu.com/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Deploy test\",\"email\":\"you@example.com\",\"message\":\"test\",\"_ts\":$(( $(date +%s000) - 30000 ))}"
```

`200` with a `reference` means it reached the inbox. `503` means the mail variables are
missing; `502` means the provider rejected it — check that the domain is verified and that
`EMAIL_FROM` is on it.

## Logs

- **Passenger (A):** `~/.logs/` and hPanel → Files → Error Log. Passenger writes startup
  failures to the domain error log.
- **hPanel Node.js (B):** the Node.js dashboard has a log viewer.
- **Vercel (C):** Deployments → Runtime Logs.
- **VPS (D):** `pm2 logs jowain`.

Enquiry logging is intentionally minimal in production: reference plus outcome, never the
name, email, phone or message body. Shared-host logs are readable and retained.

## Restart procedure

| Option | Command |
| --- | --- |
| A — Passenger | `touch ~/app/tmp/restart.txt` |
| B — hPanel | Node.js dashboard → **Restart** |
| C — Vercel | Redeploy (there is no process to restart) |
| D — VPS | `pm2 restart jowain` |

## Updating the website later

1. Make the change and commit it.
2. `npm run typecheck && npm run lint && npm test && npm run build` — all four must pass.
3. Deploy:
   - **A:** `npm run build:deploy`, re-upload `.next/standalone`, then
     `touch ~/app/tmp/restart.txt`
   - **B / C:** `git push` — the platform builds and deploys automatically
   - **D:** `git pull && npm ci && npm run build && pm2 restart jowain`

Most content edits are single-file: see [`CONTENT-GUIDE.md`](./CONTENT-GUIDE.md).

## Rollback

| Option | How |
| --- | --- |
| A | Keep the previous upload as `~/app-previous`. Roll back by swapping `PassengerAppRoot` and touching `restart.txt`. |
| B | hPanel Node.js → Deployments → redeploy an earlier commit. |
| C | Vercel → Deployments → **Promote to Production** on the last good build. Instant. |
| D | `git checkout <last-good-sha> && npm ci && npm run build && pm2 restart jowain` |

Git is the safety net in every case: every deploy corresponds to a commit.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Parking page still served after adding `.htaccess` | `mod_passenger` not enabled for the vhost | Option A is unavailable — go to Option B or C |
| 500 from Passenger | Startup crash | Set `PassengerFriendlyErrorPages on` **temporarily**, read `~/.logs/`, turn it back off |
| Forms return 503 | Mail variables missing or unreadable | Check `~/app/.env` exists, is `chmod 600`, and has all three values |
| Forms return 502 | Provider rejected the send | Domain not verified in Resend, or `EMAIL_FROM` is not on the verified domain |
| Canonical URLs show the wrong domain | `SITE_URL` absent **at build time** | Rebuild with `SITE_URL` set — it is baked into prerendered HTML |
| Arabic pages render left-to-right | Stale build | Rebuild; `dir="rtl"` is server-rendered from the locale |
| CSS, images or JS 404 while pages still return 200 | `public/` or `.next/static` missing from the bundle, usually nested as `public/public/` | Rebuild with `npm run build:deploy`; it verifies assets and refuses to produce a broken bundle |
| Rate limit fires too readily | All visitors sharing one proxy IP | Raise the limit in `src/lib/enquiry.ts` (`new RateLimiter(5, ...)`) |
