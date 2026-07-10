import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { localeHref } from "@/lib/utils";
import { services } from "@/content/services";
import { equipment } from "@/content/equipment";
import { insights } from "@/content/insights";

/** Static route paths (locale-agnostic). */
const staticPaths = [
  "/",
  "/about",
  "/leadership",
  "/services",
  "/fleet",
  "/industries",
  "/projects",
  "/safety-quality",
  "/why-choose-us",
  "/faqs",
  "/insights",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
  "/sitemap",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicPaths = [
    ...services.map((s) => `/services/${s.slug}`),
    ...equipment.map((e) => `/fleet/${e.slug}`),
    ...insights.map((i) => `/insights/${i.slug}`),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${localeHref(locale, path)}`,
      lastModified: new Date("2025-01-01"),
      changeFrequency:
        path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.includes("/") && path.length > 1 ? 0.7 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${site.url}${localeHref(l, path)}`]),
        ),
      },
    })),
  );
}
