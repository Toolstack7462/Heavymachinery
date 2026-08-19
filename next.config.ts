import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 *
 * Two deliberate decisions worth reading before editing:
 *
 * 1. `'unsafe-eval'` is DEVELOPMENT ONLY. The Next.js dev server needs it for
 *    React Refresh; a production build never evaluates strings. Shipping it to
 *    production would blunt the main XSS control for no benefit.
 *
 * 2. `'unsafe-inline'` in `script-src` stays, and is a considered trade rather
 *    than an oversight. Next emits small inline bootstrap scripts, and the
 *    alternative — a per-request nonce — requires every page to render
 *    dynamically. This site prerenders 100 static pages, so nonces would trade
 *    a real, measurable performance win for a marginal security one on a site
 *    that renders no user-generated content and has no authenticated session
 *    to steal. Revisit if either of those ever changes.
 *
 * Font CDNs are deliberately absent: `next/font` self-hosts Archivo, Source
 * Sans 3 and Noto Sans Arabic at build time, so the browser never contacts
 * fonts.googleapis.com or fonts.gstatic.com. Allowing them would widen the
 * policy for origins that are never used.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  // Optimised images are served same-origin from /_next/image; the Unsplash
  // host is listed because it is the one remote source `remotePatterns`
  // permits, so the two stay in step. `data:`/`blob:` cover inline SVG glyphs
  // and the blur placeholder.
  "img-src 'self' data: blob: https://images.unsplash.com",
  "connect-src 'self'",
  // No third-party frames anywhere on the site (the contact page links to
  // Google Maps rather than embedding it), so frames can be forbidden.
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  /*
   * Self-contained server bundle. `next build` emits .next/standalone with only
   * the modules the server actually requires, so production hosting does not
   * need node_modules or any devDependency present. That matters on the target
   * hosting, where the deploy is a file copy rather than an install.
   */
  output: "standalone",
  // Pin the tracing root to this project (a parent lockfile exists on the dev
  // machine); prevents Next from inferring the wrong workspace root.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    // Scoped to the one host the site actually loads photography from, so the
    // image optimiser cannot be used as an open proxy for arbitrary URLs.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /*
       * Build output is content-hashed, so it can be cached permanently. Next
       * sets this itself on Vercel; stating it here means the same behaviour
       * on Passenger, Nginx and any other origin that simply proxies to the
       * Node server.
       */
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
