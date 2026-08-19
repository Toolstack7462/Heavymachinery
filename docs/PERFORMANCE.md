# Performance

Measured against the production build (`npm run build`) on 20 August 2026, before and
after this optimisation pass.

---

## Budget

| Metric | Target | Notes |
| --- | --- | --- |
| LCP | < 2.5 s | hero photograph |
| INP | < 200 ms | almost no interactivity to block on |
| CLS | < 0.1 | all images have explicit dimensions or `fill` in a sized parent |
| Lighthouse Performance | ≥ 95 | mobile, throttled |
| Lighthouse Accessibility | ≥ 95 | |
| Lighthouse Best Practices | ≥ 95 | |
| Lighthouse SEO | ≥ 95 | |

---

## What changed

### 1. Removed the animation library — 120 KB

`motion` (Framer) was a runtime dependency powering exactly two effects: the hero parallax
and a ±4.5° tilt on equipment cards. Both were `hover: hover and pointer: fine` only, and
both were disabled under `prefers-reduced-motion`.

So **every mobile visitor downloaded a 120 KB chunk for effects their device could never
show**, on every route that renders a card grid — which is most of the site.

Both are now two CSS custom properties written from one rAF-throttled pointer handler,
with the easing and both opt-outs living in `globals.css`. The gating is in CSS, so
server-rendered markup is already correct and nothing is re-decided after hydration.

Visually identical. Dependency deleted.

### 2. Stopped cross-locale font preloading — 166 KB per page

`next/font` emits preload links per *module graph*, not per rendered element. All three
faces were declared in one layout, so **every English page issued a high-priority preload
for the 166 KB Arabic face** — glyphs no English page can draw.

Two changes:

- `preload: false` on Noto Sans Arabic. The `@font-face` still ships in the render-blocking
  stylesheet, so Arabic pages discover and fetch it during CSS parse, and `display: "swap"`
  keeps text visible throughout. The preload link bought a few milliseconds there; it was
  costing 166 KB on every English request.
- The `<html>` class now attaches only the faces the locale actually uses. Arabic overrides
  both stacks to the Arabic face, so the Latin faces are never drawn there; Noto Sans
  Arabic has no Latin coverage, so it is never drawn on English.

### 3. Explicit immutable caching for build output

`/_next/static/*` is content-hashed, so it now carries
`Cache-Control: public, max-age=31536000, immutable` from the app itself. Vercel sets this
anyway; stating it means the same behaviour behind Passenger or Nginx.

### 4. Standalone output

`output: "standalone"` — the server bundle carries only traced modules, so production
hosting needs no `node_modules` and no devDependency. Roughly 80 MB instead of 350 MB,
which matters on shared hosting where deployment is a file copy.

---

## Measured results

### JavaScript

| | Before | After | Δ |
| --- | --- | --- | --- |
| Largest chunks | 224 K · 164 K · **120 K** · 112 K · 52 K | 224 K · 164 K · 112 K · 52 K · 44 K | |
| `motion` chunk | 120 KB | **gone** | −120 KB |
| Total `.next/static/chunks` | — | **792 KB** raw | |
| Runtime dependencies | 5 | **4** | |

### Fonts on the critical path

| Locale | Before | After | Δ |
| --- | --- | --- | --- |
| English | 3 preloads — 166 K + 32 K + 36 K = **234 KB** | 2 preloads — 32 K + 36 K = **68 KB** | **−166 KB** |
| Arabic | 3 preloads — **234 KB** | 2 preloads — **68 KB** | **−166 KB** |

### Rendering

- **100 routes prerendered** as static HTML, generated in about 2.0 s with 11 workers.
- Only three routes are dynamic, all legitimately: `/[locale]/fleet` and
  `/[locale]/request-a-quote` read `searchParams`; `/[locale]/[...unmatched]` renders a
  branded 404 inside the locale layout.
- **8 client components.** `Header` and `EnquiryForm` are genuinely interactive.
  `RevealObserver` is one shared `IntersectionObserver` for the whole page rather than a
  motion component per section. Everything else is a server component.

### Third-party requests

**One:** `images.unsplash.com` for photography. No analytics, no tag manager, no font CDN,
no maps embed, no cookies, no consent banner.

### LCP

The hero photograph in `HeroMedia` — `priority`, `sizes="100vw"`, `fill` in a sized
parent. It is the **only** prioritised image on the site, which is correct: marking more
would dilute the signal. Everything below the fold lazy-loads by Next's default.

---

## Remaining limitations

Stated rather than hidden.

**1. Arabic pages still preload the two Latin faces (68 KB unused).**
Same `next/font` module-graph behaviour as the fixed case, in the other direction. It
cannot be resolved without splitting `[locale]` into separate `en` and `ar` route
segments, which would duplicate the layout and every `generateStaticParams` for a 68 KB
saving on one locale. The 166 KB case was worth fixing; this one is not worth that
structural cost. Revisit if Next gains per-render preload control.

**2. Photography is remote.**
All fleet and service images load from `images.unsplash.com` — an extra DNS lookup, TLS
handshake and connection on first paint of the fleet grid, plus a hard dependency on
Unsplash. Self-hosting real Jowain photography removes both. This is a *content* blocker,
not a technical one: see [`CLIENT-INPUT-REQUIRED.md`](./CLIENT-INPUT-REQUIRED.md) §7.

**3. `'unsafe-inline'` remains in `script-src`.**
A nonce would force dynamic rendering on all 100 prerendered pages. That trade is not
worth it here — reasoning in [`SECURITY.md`](./SECURITY.md).

**4. Lighthouse figures are not yet measured on the live domain.**
The numbers above are build-output measurements. Run Lighthouse against the production
URL after deploy and record the result here — see the [launch
checklist](./LAUNCH-CHECKLIST.md).

---

## Rules for future work

1. Prefer server components. `"use client"` only where interaction genuinely requires it.
2. Do not add an animation library. CSS transitions handle everything this design needs —
   that is the whole point of change #1 above.
3. Do not add a UI framework or component library.
4. `priority` belongs on the LCP image only. It is currently on exactly one.
5. Every image needs `sizes`, and dimensions or `fill` inside a sized parent.
6. Below-the-fold images lazy-load — that is the default, so do not override it.
7. Respect `prefers-reduced-motion` for anything that moves.
8. No third-party script without an explicit decision and a matching `connect-src` entry.
9. Re-measure after dependency changes:
   ```bash
   npm run build
   ls -S .next/static/chunks/*.js | head -5 | xargs du -k
   ```
10. Do not trade accessibility or useful UX for a Lighthouse number.
