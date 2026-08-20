import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

/**
 * Next's generated metadata routes have no file extension, so without this list
 * the locale redirect below would send `/opengraph-image` to
 * `/en/opengraph-image` — and every social card would 404.
 */
const METADATA_ROUTES = new Set([
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
]);

/**
 * Locale routing (Next 16 renamed this file convention from `middleware` to
 * `proxy`): every page path is prefixed with a supported locale, and
 * un-prefixed paths redirect to the visitor's preferred one. API routes, Next
 * internals, metadata routes and static files pass through untouched.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Canonical host: non-www, permanently.
   *
   * Both www.jowainyanbu.com and jowainyanbu.com resolved and returned 200
   * independently, so the same 92 pages were reachable on two hosts and could
   * be indexed twice. The canonical tags already pointed at the non-www host;
   * this makes the server agree with them.
   *
   * 301, not the 307 that `NextResponse.redirect` defaults to: this is a
   * permanent canonicalisation and search engines should consolidate on it.
   * The path and query string are preserved, so deep links and campaign
   * parameters survive the hop.
   */
  const host = request.headers.get("host") ?? "";
  if (host.toLowerCase().startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico" ||
    METADATA_ROUTES.has(pathname) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Prefer a matching Accept-Language, else the default locale.
  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept.toLowerCase().startsWith("ar") ? "ar" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
