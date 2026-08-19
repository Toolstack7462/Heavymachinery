/**
 * ============================================================================
 *  CONTENT SECURITY POLICY — one definition, two delivery mechanisms
 * ============================================================================
 *  Shared by `next.config.ts` (the HTTP response header) and the locale layout
 *  (a `<meta http-equiv>` fallback), so the two can never drift apart.
 *
 *  WHY A META TAG AS WELL AS A HEADER:
 *
 *  The production host is Hostinger shared hosting — LiteSpeed in front of a
 *  Node process. Measured on the live domain, LiteSpeed truncates the CSP
 *  response header coming back from Node to its FINAL semicolon-delimited
 *  directive: the browser received only `upgrade-insecure-requests`, with the
 *  entire policy silently discarded. Every other security header survives
 *  intact, including `Permissions-Policy`, which contains commas — so the
 *  trigger is specifically the semicolon. Setting the header from `.htaccess`
 *  is not an option either: `mod_headers` is not available to this account, so
 *  `Header set` directives are ignored.
 *
 *  A `<meta http-equiv="Content-Security-Policy">` tag is part of the HTML, so
 *  no proxy can rewrite it. Browsers enforce it identically to the header for
 *  every directive this policy uses, with three exceptions —
 *  `frame-ancestors`, `report-uri` and `sandbox` are ignored in meta form.
 *  Only `frame-ancestors` applies here, and it is already enforced by the
 *  `X-Frame-Options: DENY` header, which the host does deliver.
 *
 *  Both mechanisms carry the same policy, so a browser applying both enforces
 *  exactly this and nothing narrower.
 * ============================================================================
 */

/**
 * `'unsafe-eval'` is DEVELOPMENT ONLY — the Next dev server needs it for React
 * Refresh, and a production build never evaluates strings.
 *
 * `'unsafe-inline'` in `script-src` stays, and is a considered trade: Next
 * emits small inline bootstrap scripts, and the alternative — a per-request
 * nonce — forces every page to render dynamically. This site prerenders 100
 * static pages, renders no user-generated content and has no authenticated
 * session to steal, so nonces would cost a real performance win for a marginal
 * security one.
 *
 * No font CDN is listed: `next/font` self-hosts every face at build time, so
 * the browser never contacts fonts.googleapis.com or fonts.gstatic.com.
 */
export function cspDirectives(isProduction: boolean): string[] {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    // Optimised images are served same-origin from /_next/image; the Unsplash
    // host is listed because it is the one remote source `remotePatterns`
    // permits, so the two stay in step. `data:`/`blob:` cover inline SVG
    // glyphs and the blur placeholder.
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
  ];
}

/** Full policy for the HTTP response header. */
export function cspHeaderValue(isProduction: boolean): string {
  return cspDirectives(isProduction).join("; ");
}

/**
 * Policy for the `<meta http-equiv>` tag.
 *
 * `frame-ancestors` is dropped because it is invalid in meta form — browsers
 * ignore it and log a console warning, which would be noise on every page.
 * Clickjacking is covered by `X-Frame-Options: DENY`.
 */
export function cspMetaValue(isProduction: boolean): string {
  return cspDirectives(isProduction)
    .filter((directive) => !directive.startsWith("frame-ancestors"))
    .join("; ");
}
