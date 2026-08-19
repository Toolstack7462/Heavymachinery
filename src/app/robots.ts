import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    // `host:` is a legacy Yandex directive that Google ignores; the canonical
    // host is already asserted by the canonical tags and the redirect rules.

  };
}
