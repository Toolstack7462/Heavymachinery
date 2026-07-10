import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.fullName;

/** Default social share image (brand lockup + tagline on graphite). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1a1d21",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        {/* subtle top accent */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ width: 22, height: 54, background: "#f9c14e" }} />
          <div style={{ width: 22, height: 82, background: "#f7ac2a" }} />
          <div style={{ width: 22, height: 110, background: "#f5a623" }} />
          <span
            style={{
              marginLeft: 24,
              color: "#ffffff",
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            {site.logoText}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#f5a623", fontSize: 30, fontWeight: 700 }}>
            Heavy Equipment Rental & Contracting · Qatar
          </span>
          <span
            style={{
              color: "#ffffff",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              marginTop: 16,
              maxWidth: 900,
            }}
          >
            {site.tagline}.
          </span>
          <span style={{ color: "#98a2b0", fontSize: 28, marginTop: 20 }}>
            {site.contact.phonePrimary}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
