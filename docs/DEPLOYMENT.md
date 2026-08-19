# Deployment

Next.js 16 App Router. 100 routes prerender to static HTML, but the app **still needs a
Node runtime** for the API routes (`/api/contact`, `/api/quote`), the locale proxy, and
three dynamic routes.

> **For this project specifically, read [`HOSTINGER-DEPLOYMENT.md`](./HOSTINGER-DEPLOYMENT.md)
> first** — it documents the actual account, the actual constraint, and the recommended
> path. This file is the general reference for each hosting shape.

---

## Requirements

| | |
| --- | --- |
| Node.js | **22.x** recommended; `>=20.9.0` required |
| Build | `npm ci && npm run build` |
| Start | `npm start`, or `node server.js` from the standalone output |
| Environment | `SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `ENQUIRY_TO_EMAIL` — see [`ENVIRONMENT.md`](./ENVIRONMENT.md) |
| Persistent process | **required** |

**`SITE_URL` must be set at build time.** Absolute URLs are baked into prerendered HTML.

`output: "standalone"` is enabled: `next build` emits `.next/standalone` containing the
server and only the modules it traced — no `node_modules`, no devDependencies. Roughly
80 MB instead of 350 MB.

```bash
npm ci
SITE_URL=https://your-domain.com npm run build:deploy

node .next/standalone/server.js     # listens on PORT, default 3000
```

`build:deploy` = `next build` followed by `scripts/package-standalone.mjs`, which copies
`public/` and `.next/static/` into the bundle (both sit outside the standalone trace by
design) and then verifies known assets resolve.

> **Never assemble the bundle by hand.** `next build` already creates
> `.next/standalone/public`, so `cp -r public .next/standalone/public` *nests* it as
> `public/public/` — the server then 404s the company logo and all 25 partner logos while
> every route still returns 200. That shipped to production once. Use
> `npm run build:deploy`, which copies directory *contents* and then verifies known assets
> resolve, failing the build if they do not.


---

## A. cPanel / CloudLinux with Passenger

Applies to Hostinger shared hosting and most cPanel hosts with a Node.js selector.

**First establish that Passenger is enabled for the vhost** — see
[`HOSTINGER-DEPLOYMENT.md`](./HOSTINGER-DEPLOYMENT.md) Option A, step 1. If it is not, this
route is unavailable and no amount of configuration will fix it.

1. Build **locally** (shared hosting often has no SSH `npm`), then upload the contents of
   `.next/standalone/` — with `.next/static` and `public` copied in — to `~/app/`.

2. Point the docroot at it:

   ```apache
   # ~/domains/<domain>/public_html/.htaccess
   PassengerAppRoot "/home/<user>/app"
   PassengerBaseURI "/"
   PassengerNodejs "/opt/alt/alt-nodejs22/root/usr/bin/node"
   PassengerAppType node
   PassengerStartupFile server.js
   PassengerAppEnv production
   PassengerFriendlyErrorPages off
   ```

3. Secrets go in `~/app/.env`, `chmod 600` — **not** in `.htaccess`, which lives inside
   the web root.

4. Restart: `mkdir -p ~/app/tmp && touch ~/app/tmp/restart.txt`

**Logs:** `~/.logs/`, plus the domain error log in the panel. Set
`PassengerFriendlyErrorPages on` temporarily to diagnose a startup crash, then turn it
back off.

If the panel exposes a Node.js application UI instead (Hostinger Business, most cPanel
hosts), prefer it: application root, Node 22, build `npm run build`, start `npm start`,
environment variables in the panel, and a Restart button.

---

## B. VPS / Linux server

```bash
# Node 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm i -g pm2

# app
git clone https://github.com/Toolstack7462/Heavymachinery.git /var/www/jowain
cd /var/www/jowain
npm ci
cp .env.example .env && $EDITOR .env      # fill in, then: chmod 600 .env
npm run build
```

`ecosystem.config.js`:

```js
module.exports = {
  apps: [{
    name: "jowain",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    cwd: "/var/www/jowain",
    instances: 1,          // in-memory rate limiting assumes one process
    env: { NODE_ENV: "production", PORT: 3000 },
  }],
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup          # run the command it prints
```

> Keep `instances: 1`, or use a shared store for rate limiting. Cluster mode gives each
> worker its own counter — see [`SECURITY.md`](./SECURITY.md).

Nginx:

```nginx
server {
  listen 80;
  server_name your-domain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

`X-Forwarded-For` matters: it is how the rate limiter identifies a client. Without it every
visitor shares one bucket.

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com   # SSL + auto-renew
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable
```

Do **not** expose port 3000 publicly — the app has no TLS of its own and the security
headers assume HTTPS.

---

## C. Docker

`Dockerfile` and `.dockerignore` are in the repository: multi-stage, Alpine, standalone
output, non-root user, health check.

```bash
docker build --build-arg SITE_URL=https://your-domain.com -t jowain .
docker run -d --name jowain -p 3000:3000 --env-file .env --restart unless-stopped jowain
```

`SITE_URL` is a **build** argument because it is baked into the prerendered HTML. The mail
variables are runtime-only. Put a TLS-terminating reverse proxy in front.

---

## D. Vercel

1. Import the repository at <https://vercel.com/new>. Next.js is auto-detected.
2. Add all four environment variables (Production scope).
3. Add the domain; Vercel prints the DNS records to set at your registrar.
4. Deploy.

Redeploy after changing `SITE_URL` — it is a build-time value.

**One caveat:** the rate limiter is in-process, so on Vercel the limit is per instance
rather than global. Acceptable for this endpoint; reasoning in
[`SECURITY.md`](./SECURITY.md).

---

## What will not work

**Static-only hosting** — plain PHP shared hosting, S3 or GitHub Pages without a Node
runtime.

`next export` would produce HTML, but it would remove:

- `/api/contact` and `/api/quote` — **the site's only lead channel**
- the locale-redirect proxy — `/` would no longer route to `/en` or `/ar`
- `searchParams` on `/fleet` and `/request-a-quote`
- the correct 404 status on unmatched URLs
- the dynamically generated Open Graph image

Converting to a static export to fit a plan that cannot run Node trades one P0 for a worse
one. If a static host is genuinely required, that is an architecture decision to take
deliberately — with the forms re-pointed at an external endpoint — not a deployment
workaround.

---

## Post-deploy verification

```bash
D=https://your-domain.com
for p in / /en /ar /en/fleet /ar/fleet /en/contact /sitemap.xml /robots.txt /en/nope; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -L $D$p)" "$p"
done
# expect 200 everywhere except /en/nope → 404

curl -sI $D/en | grep -i "content-security\|strict-transport\|x-frame"

curl -i -X POST $D/api/contact -H "Content-Type: application/json" \
  -d "{\"name\":\"Deploy test\",\"email\":\"you@example.com\",\"message\":\"test\",\"_ts\":$(( $(date +%s000) - 30000 ))}"
# 200 = delivered · 503 = mail vars missing · 502 = provider rejected
```

Then work through [`LAUNCH-CHECKLIST.md`](./LAUNCH-CHECKLIST.md).
