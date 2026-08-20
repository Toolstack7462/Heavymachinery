import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.fullName} — ${site.positioning}`;

/**
 * Social share image: the official emblem plus the wordmark on deep navy.
 * The emblem is read from disk at build time and inlined, so the generated PNG
 * carries the real brand mark rather than a drawn approximation.
 */
export default async function OgImage() {
  const emblem = await readFile(
    join(process.cwd(), "public", "brand", "jowain-emblem-512.png"),
  );
  const emblemSrc = `data:image/png;base64,${emblem.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#14203a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblemSrc} width={104} height={101} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              {site.logoText}
            </span>
            <span
              style={{
                color: "#8d99b3",
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: 4,
                marginTop: 4,
              }}
            >
              {site.logoSubText}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 72, height: 5, background: "#41b478" }} />
          <span
            style={{
              color: "#ffffff",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.08,
              marginTop: 28,
              maxWidth: 880,
            }}
          >
            {site.positioning}
          </span>
          <span
            style={{
              color: "#73d09b",
              fontSize: 28,
              fontWeight: 600,
              marginTop: 20,
            }}
          >
            {site.tagline}
          </span>
        </div>

        <span style={{ color: "#b8c2d6", fontSize: 24 }}>
          {`Est. ${site.foundedYear}  ·  ${site.contact.address.city}, ${site.contact.address.country}  ·  ${site.contact.website}`}
        </span>
      </div>
    ),
    { ...size },
  );
}
