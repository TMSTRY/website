import { NextResponse } from "next/server";

export interface YTVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? "UCtxAcT-Bgi5Q9O-jsptkeOw";

export async function GET() {
  if (!CHANNEL_ID) {
    return NextResponse.json({ error: "YOUTUBE_CHANNEL_ID not set" }, { status: 500 });
  }

  try {
    const rss = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );

    if (!rss.ok) {
      throw new Error(`RSS fetch failed: ${rss.status}`);
    }

    const xml = await rss.text();

    // Parse entries with regex — no xml lib needed
    const entries: YTVideo[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && entries.length < 4) {
      const block = match[1];

      const id     = (/<yt:videoId>(.*?)<\/yt:videoId>/.exec(block))?.[1] ?? "";
      const title  = (/<title>(.*?)<\/title>/.exec(block))?.[1] ?? "";
      const published = (/<published>(.*?)<\/published>/.exec(block))?.[1] ?? "";

      if (!id) continue;

      entries.push({
        id,
        title: title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        published,
        thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
      });
    }

    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
