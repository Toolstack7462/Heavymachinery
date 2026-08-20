import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { localeHref } from "@/lib/utils";
import { services } from "@/content/services";
import { equipment } from "@/content/equipment";
import { equipmentImage, photoSrc } from "@/config/images";

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

  /*
   * Image sitemap entries for equipment pages.
   *
   * Google will not discover a photograph that only exists inside a
   * client-optimised `/_next/image` URL as reliably as one declared here, and
   * for a rental business the machinery photographs are a real entry point:
   * someone searching for a crawler crane may well arrive through Images. Only
   * pages that actually have a verified photograph get an entry; the ones still
   * rendering the engineered panel are skipped rather than declared empty.
   */
  const imagesFor = (path: string): string[] => {
    const slug = path.startsWith("/fleet/") ? path.slice("/fleet/".length) : null;
    if (!slug) return [];
    const photo = equipmentImage(slug);
    return photo ? [photoSrc(photo.id)] : [];
  };

  return [...staticPaths, ...dynamicPaths].flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${localeHref(locale, path)}`,
      images: imagesFor(path),
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
