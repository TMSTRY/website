import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Branded OG image for news posts: obsidian background, scanlines,
 * glitch-offset title, TMSTRY wordmark. 1200x630.
 * Usage: /api/og?title=...&tag=...&date=...
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "TMSTRY").slice(0, 120);
  const tag = (searchParams.get("tag") ?? "TRANSMISSION").slice(0, 40).toUpperCase();
  const date = (searchParams.get("date") ?? "").slice(0, 20);

  const titleSize = title.length > 70 ? 52 : title.length > 40 ? 62 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050608",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)",
          }}
        />
        {/* soft blue glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(79,195,247,0.10), transparent 70%)",
          }}
        />
        {/* corner crosshairs */}
        <div style={{ position: "absolute", top: 28, left: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ position: "absolute", top: 28, right: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ position: "absolute", bottom: 28, left: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>
        <div style={{ position: "absolute", bottom: 28, right: 32, color: "rgba(79,195,247,0.5)", fontSize: 28 }}>+</div>

        {/* header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#e8eaed", fontSize: 34, fontWeight: 800, letterSpacing: "0.45em" }}>
              TMSTRY
            </div>
            <div style={{ color: "rgba(136,146,160,0.7)", fontSize: 15, letterSpacing: "0.35em", marginTop: 8 }}>
              HUMAN // SIGNAL // AI
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#4fc3f7" }} />
            <div style={{ color: "rgba(79,195,247,0.8)", fontSize: 18, letterSpacing: "0.3em" }}>
              {tag}
              {date ? `  //  ${date}` : ""}
            </div>
          </div>
        </div>

        {/* title with chromatic offset */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: -3,
              top: -2,
              color: "rgba(224,64,251,0.55)",
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.12,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              position: "absolute",
              left: 3,
              top: 2,
              color: "rgba(79,195,247,0.55)",
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.12,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#e8eaed",
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.12,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        {/* footer strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              height: 4,
              width: 320,
              background: "linear-gradient(90deg, #4fc3f7, #e040fb)",
            }}
          />
          <div style={{ color: "rgba(136,146,160,0.6)", fontSize: 17, letterSpacing: "0.25em" }}>
            tmstry.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
