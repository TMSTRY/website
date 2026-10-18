import { NextResponse } from "next/server";

export interface YTVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

/**
 * The channel's latest long-form videos, newest first.
 *
 * YouTube's RSS feed returns 404 for this channel (seen 18/10/2026, also for
 * other channels), so the source is the channel's /videos page: its embedded
 * ytInitialData lists the uploads, newest first, and Shorts live on their own
 * tab, so none are in it. Scheduled premieres are skipped. The RSS feed stays
 * as a fallback in case it comes back. Same approach as tmstry-lab's
 * /api/latest-video.
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? "UCtxAcT-Bgi5Q9O-jsptkeOw";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  // European IPs are sent to a cookie-consent page first; this is its "reject all" answer
  Cookie: "SOCS=CAI",
};
const UPCOMING = /upcoming|premiere|scheduled|waiting/i;
const VIDEO_ID = /^[\w-]{6,20}$/;

type Listed = { id: string; title: string; published: string };

/** "1d ago", "5 hours ago", "2 weeks ago" → an approximate ISO date (now minus the age), or "". */
function approxDate(age: string | null): string {
  if (!age) return "";
  const m = /(\d+)\s*(s|sec|second|m|min|minute|h|hr|hour|d|day|w|wk|week|mo|month|y|yr|year)s?\b/i.exec(age);
  if (!m) return "";
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const ms = unit.startsWith("mo") ? 30 * 864e5
    : unit === "m" || unit.startsWith("min") ? 6e4
    : unit.startsWith("s") ? 1e3
    : unit.startsWith("h") ? 36e5
    : unit.startsWith("d") ? 864e5
    : unit.startsWith("w") ? 7 * 864e5
    : 365 * 864e5;
  return new Date(Date.now() - n * ms).toISOString();
}

/** The object assigned to `var <name> = {...}` in a page's scripts. */
function embeddedJson(html: string, name: string): unknown {
  const start = html.indexOf(`var ${name} = `);
  if (start < 0) return null;
  const from = html.indexOf("{", start);
  // walk the braces to find the end of the object (strings may contain braces)
  let depth = 0, inStr = false, esc = false;
  for (let i = from; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) {
      try { return JSON.parse(html.slice(from, i + 1)); } catch { return null; }
    }
  }
  return null;
}

type Lockup = {
  contentId?: string;
  metadata?: { lockupMetadataViewModel?: {
    title?: { content?: string };
    metadata?: { contentMetadataViewModel?: { metadataRows?: { metadataParts?: { text?: { content?: string } }[] }[] } };
  } };
  contentImage?: { thumbnailViewModel?: { overlays?: { thumbnailBottomOverlayViewModel?: { badges?: { thumbnailBadgeViewModel?: { text?: string } }[] } }[] } };
};
type LegacyRenderer = {
  videoId?: string;
  title?: { runs?: { text?: string }[] };
  publishedTimeText?: { simpleText?: string };
  upcomingEventData?: unknown;
};

/** The JSON in `<script id="<id>" type="application/json">`, a form YouTube now and then serves instead. */
function jsonScript(html: string, id: string): unknown {
  const m = new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`).exec(html);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

/** The uploads on the channel's /videos tab, in page order (newest first). */
async function fromChannelPage(): Promise<Listed[]> {
  const res = await fetch(`https://www.youtube.com/channel/${CHANNEL_ID}/videos`, { headers: HEADERS, cache: "no-store" });
  if (!res.ok) return [];
  const html = await res.text();
  const data = embeddedJson(html, "ytInitialData") ?? jsonScript(html, "yt-initial-data");
  const found: Listed[] = [];
  const seen = new Set<string>();
  const add = (v: Listed) => {
    if (!VIDEO_ID.test(v.id) || seen.has(v.id)) return;
    seen.add(v.id);
    found.push(v);
  };
  const walk = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    const rec = o as Record<string, unknown>;
    const lockup = rec.lockupViewModel as Lockup | undefined;
    const legacy = rec.videoRenderer as LegacyRenderer | undefined;
    if (lockup?.contentId) {
      const md = lockup.metadata?.lockupMetadataViewModel;
      const parts = (md?.metadata?.contentMetadataViewModel?.metadataRows ?? [])
        .flatMap((r) => r.metadataParts ?? []).map((p) => p.text?.content ?? "").filter(Boolean);
      const badges = (lockup.contentImage?.thumbnailViewModel?.overlays ?? [])
        .flatMap((ov) => ov.thumbnailBottomOverlayViewModel?.badges ?? [])
        .map((b) => b.thumbnailBadgeViewModel?.text ?? "");
      // a scheduled premiere is listed first but is not out yet
      if (![...badges, ...parts].some((p) => UPCOMING.test(p))) {
        add({ id: lockup.contentId, title: md?.title?.content ?? "", published: approxDate(parts.find((p) => /ago/i.test(p)) ?? null) });
      }
      return;
    }
    if (legacy?.videoId) {
      if (!legacy.upcomingEventData) {
        add({ id: legacy.videoId, title: legacy.title?.runs?.[0]?.text ?? "", published: approxDate(legacy.publishedTimeText?.simpleText ?? null) });
      }
      return;
    }
    for (const v of Object.values(rec)) walk(v);
  };
  walk(data);
  return found;
}

/** The RSS feed's latest ~15 uploads, Shorts left out (their link points to /shorts/). */
async function fromRss(): Promise<Listed[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { cache: "no-store" });
  if (!res.ok) return [];
  const xml = await res.text();
  const found: Listed[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1];
    if (/<link[^>]*href="https:\/\/www\.youtube\.com\/shorts\//.test(block)) continue;
    const id = (/<yt:videoId>(.*?)<\/yt:videoId>/.exec(block))?.[1] ?? "";
    const title = (/<title>(.*?)<\/title>/.exec(block))?.[1] ?? "";
    const published = (/<published>(.*?)<\/published>/.exec(block))?.[1] ?? "";
    if (!VIDEO_ID.test(id)) continue;
    found.push({
      id,
      title: title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      published,
    });
  }
  return found;
}

export async function GET(req: Request) {
  // ?limit=N (1–15): VideoSection uses 4, the Signal Room asks for 15
  const limit = Math.min(
    15,
    Math.max(1, parseInt(new URL(req.url).searchParams.get("limit") ?? "4", 10) || 4)
  );
  try {
    let list = await fromChannelPage().catch(() => [] as Listed[]);
    if (!list.length) list = await fromRss().catch(() => [] as Listed[]);
    if (!list.length) return NextResponse.json({ error: "no videos found" }, { status: 502 });

    const entries: YTVideo[] = list.slice(0, limit).map((v) => ({
      ...v,
      title: v.title || "TMSTRY",
      thumbnail: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${v.id}`,
    }));
    // fresh within 15 minutes; a quiet site still answers at once from the
    // CDN's stale copy while it refreshes in the background
    return NextResponse.json(entries, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
