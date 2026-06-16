"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import PostDetail from "./PostDetail";
import { useModalChrome } from "@/hooks/useModalChrome";
import { urlFor } from "@/sanity/lib/image";
import { type Post, bodyToPlainText, formatDate } from "./newsTypes";

function PostModal({
  post,
  onClose,
  onHashtag,
}: {
  post: Post;
  onClose: () => void;
  onHashtag: (tag: string) => void;
}) {
  useModalChrome(onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
      >
        <div
          className="absolute -inset-px pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(79,195,247,0.12), transparent 60%)" }}
        />

        <div className="relative border border-white/[0.08] bg-charcoal/80 p-8 md:p-10">
          <PostDetail
            post={post}
            onClose={onClose}
            onHashtag={(tag) => { onClose(); onHashtag(tag); }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewsList({
  posts,
  viewAllHref,
  pageSize,
}: {
  posts: Post[];
  viewAllHref?: string;
  pageSize?: number;
}) {
  const [active, setActive] = useState<Post | null>(null);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize ?? Infinity);

  const filtered = activeHashtag
    ? posts.filter((p) => bodyToPlainText(p.body).toLowerCase().includes(activeHashtag))
    : posts;

  const shown = pageSize ? filtered.slice(0, visibleCount) : filtered;
  const hasMore = pageSize ? filtered.length > shown.length : false;

  // Reset paging when the filter changes
  useEffect(() => {
    setVisibleCount(pageSize ?? Infinity);
  }, [activeHashtag, pageSize]);

  if (!posts.length) {
    return (
      <p
        className="text-silver/20 text-[10px] tracking-widest uppercase py-12"
        style={{ letterSpacing: "0.25em" }}
      >
        No posts yet
      </p>
    );
  }

  return (
    <>
      {/* Active hashtag filter indicator */}
      <AnimatePresence>
        {activeHashtag && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-4 mb-8"
          >
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ color: "rgba(79,195,247,0.6)", letterSpacing: "0.3em" }}
            >
              Filtered by
            </span>
            <span
              className="text-[10px] font-mono px-3 py-1 border"
              style={{
                color: "rgba(79,195,247,0.9)",
                borderColor: "rgba(79,195,247,0.2)",
                letterSpacing: "0.1em",
              }}
            >
              {activeHashtag}
            </span>
            <button
              onClick={() => setActiveHashtag(null)}
              className="text-[9px] tracking-widest uppercase text-silver/30 hover:text-soft-white transition-colors duration-200"
              style={{ letterSpacing: "0.25em" }}
            >
              Clear ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-px">
        {shown.map((post, i) => (
          <FadeInSection key={post._id} delay={i * 0.08}>
            <motion.article
              onClick={() => setActive(post)}
              className="group relative border-t border-white/[0.06] py-7 md:py-9 cursor-pointer overflow-hidden min-h-[176px] md:min-h-[212px] flex items-center"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-glow-blue scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top z-20" />

              {/* Cinematic poster panel — fixed-height strip, vertically centred,
                  fades into the page via a mask on the image itself (no overlay) */}
              {post.image?.asset && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] sm:w-1/2 md:w-[46%] h-[140px] md:h-[184px] pointer-events-none overflow-hidden">
                  <Image
                    src={urlFor(post.image).width(1200).height(480).fit("crop").url()}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 60vw, 46vw"
                    className="object-cover object-center grayscale opacity-50 scale-[1.04] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-100"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.6) 62%, #000 86%), linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
                      WebkitMaskComposite: "source-in",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.6) 62%, #000 86%), linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)",
                      maskComposite: "intersect",
                    }}
                  />
                </div>
              )}

              {/* Content — above the poster */}
              <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-12">
                {/* Date & tag */}
                <div className="flex md:flex-col gap-3 md:gap-2 pt-1">
                  <span
                    className="text-[9px] tracking-widest uppercase"
                    style={{ letterSpacing: "0.3em", color: "rgba(79,195,247,0.6)" }}
                  >
                    {post.tag}
                  </span>
                  <span
                    className="text-[10px] tracking-widest text-silver/30 uppercase"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {formatDate(post.date)}
                  </span>
                </div>

                {/* Text */}
                <div className="pr-[42%] sm:pr-[38%] md:pr-[40%]">
                  <h3
                    className="font-display font-semibold text-soft-white mb-3 group-hover:text-white transition-colors duration-300"
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.02em" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-silver/50 text-sm leading-relaxed line-clamp-2"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {bodyToPlainText(post.body)}
                  </p>
                  {(post.likes ?? 0) > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-silver/30 text-[10px] font-mono">
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                        <path d="M7 10v12H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3zm2 0 3.5-7.5A2 2 0 0 1 15 4v4h4.5a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 18 20H9V10z" />
                      </svg>
                      {post.likes}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          </FadeInSection>
        ))}

        <div className="border-t border-white/[0.06]" />
      </div>

      {/* Load more (archive) */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + (pageSize ?? 6))}
            className="text-[10px] tracking-widest uppercase border border-white/10 px-6 py-3 text-silver/50 hover:text-soft-white hover:border-white/30 transition-all duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            Load more
          </button>
        </div>
      )}

      {/* View all (homepage) */}
      {viewAllHref && (
        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-3 text-silver/50 hover:text-soft-white text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            View all news
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-none stroke-current text-glow-blue/60 group-hover:text-glow-blue transition-colors" strokeWidth={1.5}>
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <PostModal
            post={active}
            onClose={() => setActive(null)}
            onHashtag={(tag) => {
              setActive(null);
              setActiveHashtag(tag);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
