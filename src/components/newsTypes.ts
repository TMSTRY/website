import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  _type: "image";
  asset: { _ref: string };
};

// Body can be rich text (Portable Text) or — for legacy posts — a plain string
export type PostBody = string | PortableTextBlock[];

export type Post = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  body: PostBody;
  image?: SanityImage;
  youtubeUrl?: string;
  likes?: number;
  slug?: string;
};

export const HASHTAG_ONLY = /^(#[\w]+\s*)+$/;

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

// Flatten a single Portable Text block to its text
export function blockText(block: unknown): string {
  const b = block as { _type?: string; children?: { text?: unknown }[] };
  if (b?._type !== "block" || !Array.isArray(b.children)) return "";
  return b.children.map((c) => (typeof c.text === "string" ? c.text : "")).join("");
}

// Plain-text version of a body (rich text or legacy string)
export function bodyToPlainText(body: PostBody): string {
  if (typeof body === "string") return body;
  if (!Array.isArray(body)) return "";
  return body.map(blockText).join("\n\n");
}

// Unique hashtags from a body
export function extractHashtags(body: PostBody): string[] {
  const matches = bodyToPlainText(body).match(/#[\w]+/g) ?? [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

// Absolute URL for a post permalink
export function postUrl(slug?: string): string {
  return slug ? `https://tmstry.com/news/${slug}` : "https://tmstry.com/news";
}
