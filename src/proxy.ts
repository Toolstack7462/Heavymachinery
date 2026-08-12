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
