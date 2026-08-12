import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.fullName} — ${site.positioning}`,
    short_name: site.logoText,
    description: `Heavy equipment rental and transportation solutions across the Kingdom of Saudi Arabia since ${site.foundedYear}.`,
    start_url: `/${site.defaultLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14203a",
    lang: site.defaultLocale,
    dir: "ltr",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      {
        src: "/brand/jowain-emblem-512.png",
        sizes: "531x516",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
