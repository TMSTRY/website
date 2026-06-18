import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { newPostsQuery } from "@/sanity/lib/queries";
import NewsList from "@/components/NewsList";
import HoverSwapText from "@/components/HoverSwapText";

export const metadata: Metadata = {
  title: "News — TMSTRY",
  description: "All news, releases and updates from TMSTRY.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "News — TMSTRY",
    description: "All news, releases and updates from TMSTRY.",
    url: "https://tmstry.com/news",
    type: "website",
  },
};

export default async function NewsArchivePage() {
  const posts = await client
    .fetch(newPostsQuery, {}, { next: { tags: ["newsPost"] } })
    .catch(() => []);

  return (
    <main className="relative min-h-screen bg-obsidian px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-7xl mx-auto relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-16">
          <Link
            href="/"
            className="font-display font-bold text-soft-white tracking-widest text-sm"
            style={{ letterSpacing: "0.35em" }}
          >
            TMSTRY
          </Link>
          <Link
            href="/"
            className="text-silver/50 hover:text-soft-white text-[10px] tracking-widest uppercase transition-colors duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            ← Back
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "rgba(79,195,247,0.4)" }} />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ letterSpacing: "0.4em", color: "rgba(79,195,247,0.8)" }}
            >
              <HoverSwapText text="News & Updates" alt="Gossip" tone="pink" altClassName="text-sm" />
            </span>
          </div>
          <h1
            className="font-display font-bold text-soft-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
          >
            Archive
          </h1>
        </div>

        <NewsList posts={posts} pageSize={8} />
      </div>
    </main>
  );
}
