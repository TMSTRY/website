import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Branded OG image for news posts: obsidian background, scanlines,
 * glitch-offset title, TMSTRY wordmark. 1200x630.
 * Usage: /api/og?title=...&tag=...&date=...
 * Kept deliberately conservative CSS-wise — satori (the renderer) only
 * supports a subset of CSS and fails silently on unsupported shorthands.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "TMSTRY").slice(0, 120);
  const tag = (searchParams.get("tag") ?? "TRANSMISSION").slice(0, 40).toUpperCase();
  const date = (searchParams.get("date") ?? "").slice(0, 20);

  const titleSize = title.length > 70 ? 52 : title.length > 40 ? 62 : 76;
  const abs = { position: "absolute" as const };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050608",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(79,195,247,0.10), transparent 70%)",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* corner crosshairs */}
        <div style={{ ...abs, top: 24, left: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ ...abs, top: 24, right: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ ...abs, bottom: 24, left: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ ...abs, bottom: 24, right: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>

        {/* header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#e8eaed", fontSize: 34, fontWeight: 800, letterSpacing: 14 }}>TMSTRY</div>
            <div style={{ color: "rgba(136,146,160,0.7)", fontSize: 15, letterSpacing: 5, marginTop: 8 }}>
              HUMAN // SIGNAL // AI
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#4fc3f7", marginRight: 12 }} />
            <div style={{ color: "rgba(79,195,247,0.8)", fontSize: 18, letterSpacing: 5 }}>
              {date ? `${tag}  //  ${date}` : tag}
            </div>
          </div>
        </div>

        {/* title with chromatic offset */}
        <div style={{ display: "flex", position: "relative", width: "100%" }}>
          <div
            style={{
              ...abs, left: -3, top: -2,
              color: "rgba(224,64,251,0.5)",
              fontSize: titleSize, fontWeight: 800, lineHeight: 1.12,
              width: 1000, display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              ...abs, left: 3, top: 2,
              color: "rgba(79,195,247,0.5)",
              fontSize: titleSize, fontWeight: 800, lineHeight: 1.12,
              width: 1000, display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#e8eaed",
              fontSize: titleSize, fontWeight: 800, lineHeight: 1.12,
              width: 1000, display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* footer strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              height: 4, width: 320,
              backgroundImage: "linear-gradient(90deg, #4fc3f7, #e040fb)",
            }}
          />
          <div style={{ color: "rgba(136,146,160,0.6)", fontSize: 17, letterSpacing: 4 }}>tmstry.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
