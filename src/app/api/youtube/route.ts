import { NextResponse } from "next/server";

export interface YTVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? "UCtxAcT-Bgi5Q9O-jsptkeOw";

/** Check if a video is a YouTube Short.
 *  youtube.com/shorts/ID returns 200 for Shorts,
 *  redirects (3xx) to /watch?v= for regular videos. */
async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://www.youtube.com/shorts/${videoId}`,
      {
        method: "HEAD",
        redirect: "manual",          // don't follow redirect — we need the status code
        next: { revalidate: 86400 }, // cache 24h per video
      }
    );
    // 200 = is a Short, 3xx = regular video (redirects to /watch)
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const rss = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );

    if (!rss.ok) throw new Error(`RSS fetch failed: ${rss.status}`);

    const xml = await rss.text();

    // Parse all entries from RSS (grab more so we have enough after filtering Shorts)
    const raw: { id: string; title: string; published: string }[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && raw.length < 15) {
      const block = match[1];
      const id        = (/<yt:videoId>(.*?)<\/yt:videoId>/.exec(block))?.[1] ?? "";
      const title     = (/<title>(.*?)<\/title>/.exec(block))?.[1] ?? "";
      const published = (/<published>(.*?)<\/published>/.exec(block))?.[1] ?? "";
      if (!id) continue;
      raw.push({
        id,
        title: title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        published,
      });
    }

    // Check each video in parallel — filter out Shorts
    const shortChecks = await Promise.all(raw.map((v) => isShort(v.id)));
    const longForm = raw.filter((_, i) => !shortChecks[i]);

    // Return first 4 long-form videos (featured = index 0, grid = 1–3)
    const entries: YTVideo[] = longForm.slice(0, 4).map((v) => ({
      ...v,
      thumbnail: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${v.id}`,
    }));

    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
