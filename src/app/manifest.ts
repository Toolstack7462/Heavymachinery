import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description: site.descriptionShort,
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1d21",
    icons: [
      { src: "/icon", sizes: "any", type: "image/png" },
    ],
  };
}
