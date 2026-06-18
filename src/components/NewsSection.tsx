import { client } from "@/sanity/lib/client";
import { latestPostsQuery, postsCountQuery } from "@/sanity/lib/queries";
import NewsList from "./NewsList";
import HoverSwapText from "./HoverSwapText";

export default async function NewsSection() {
  // Tag-based ISR: the homepage is statically rendered / edge-cached and only
  // rebuilt when the Sanity webhook hits /api/revalidate (revalidateTag).
  const [posts, total] = await Promise.all([
    client
      .fetch(latestPostsQuery, {}, { next: { tags: ["newsPost"] } })
      .catch(() => []),
    client
      .fetch<number>(postsCountQuery, {}, { next: { tags: ["newsPost"] } })
      .catch(() => 0),
  ]);

  return (
    <section id="news" className="py-24 md:py-36 px-6 md:px-12 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,195,247,0.025) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "rgba(79,195,247,0.4)" }} />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ letterSpacing: "0.4em", color: "rgba(79,195,247,0.8)" }}
            >
              <HoverSwapText text="News & Updates" alt="Gossip" tone="pink" altClassName="text-sm" />
            </span>
          </div>
          <h2
            className="font-display font-bold text-soft-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
          >
            Latest
          </h2>
        </div>

        <NewsList posts={posts} viewAllHref={total > posts.length ? "/news" : undefined} />

      </div>
    </section>
  );
}
