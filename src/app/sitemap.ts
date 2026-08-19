import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { localeHref } from "@/lib/utils";
import { services } from "@/content/services";
import { equipment } from "@/content/equipment";

/** Static route paths (locale-agnostic). */
const staticPaths = [
  "/",
  "/about",
  "/services",
  "/fleet",
  "/industries",
  "/quality",
  "/clients",
  "/why-choose-us",
  "/faqs",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
  "/sitemap",
];

/** Priority by depth: home, then top-level sections, then detail pages. */
function priorityFor(path: string): number {
  if (path === "/") return 1;
  return path.slice(1).includes("/") ? 0.6 : 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * Build time, resolved once per build rather than per entry.
   *
   * The previous value was a hardcoded date, so every URL claimed the same
   * frozen `lastmod` no matter how often the content changed — a signal
   * crawlers learn to ignore. Build time is honest: a redeploy is the only way
   * content changes on a fully prerendered site.
   */
  const lastModified = new Date();

  const dynamicPaths = [
    ...services.map((service) => `/services/${service.slug}`),
    ...equipment.map((item) => `/fleet/${item.slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${localeHref(locale, path)}`,
      lastModified,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: priorityFor(path),
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${site.url}${localeHref(alt, path)}`]),
        ),
      },
    })),
  );
}
