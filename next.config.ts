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
