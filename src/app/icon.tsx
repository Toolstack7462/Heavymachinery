import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated favicon — amber ascending blades on graphite (matches LogoMark). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1a1d21",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 4,
          padding: 12,
          borderRadius: 12,
        }}
      >
        <div style={{ width: 8, height: 20, background: "#f9c14e" }} />
        <div style={{ width: 8, height: 30, background: "#f7ac2a" }} />
        <div style={{ width: 8, height: 40, background: "#f5a623" }} />
      </div>
    ),
    { ...size },
  );
}
