import type { NextConfig } from "next";
import { cspHeaderValue } from "./src/lib/csp";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Security headers.
 *
 * The CSP itself lives in `src/lib/csp.ts`, shared with the locale layout,
 * which also emits it as a `<meta http-equiv>` tag. That duplication is
 * deliberate: the production host (LiteSpeed on Hostinger shared hosting)
 * truncates the semicolon-delimited CSP response header down to its final
 * directive, so the header alone does not survive to the browser. See the
 * comment block in src/lib/csp.ts for the measurement and the reasoning.
 */
const ContentSecurityPolicy = cspHeaderValue(isProduction);

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
    /*
     * No remotePatterns at all. Photography is self-hosted, so the optimiser
     * has no reason to fetch a remote URL, and with the list empty it cannot be
     * used as an open proxy for arbitrary origins under this domain.
     */
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
      /*
       * HTML must revalidate on every request.
       *
       * Next marks fully prerendered routes `s-maxage=31536000`, which is
       * correct on a platform that purges its edge cache on deploy. This site
       * runs behind LiteSpeed, which purges nothing: measured on production,
       * `/en` came back with `Age: 4908` and a one-year shared TTL, still
       * pointing at a CSS chunk that the current build no longer contains. The
       * result is a page that loads completely unstyled after a deploy, and
       * stays that way until the cache expires — a year later.
       *
       * `max-age=0, must-revalidate` keeps the response cacheable but forces a
       * conditional request, so the ETag does the work and a deploy takes
       * effect immediately. Hashed build output above is exempt, because its
       * URL changes whenever its content does.
       */
      {
        source: "/((?!_next/static|_next/image).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
