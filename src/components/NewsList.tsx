"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import Comments from "./Comments";
import { useModalChrome } from "@/hooks/useModalChrome";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = {
  _type: "image";
  asset: { _ref: string };
};

// Body can be rich text (Portable Text) or — for legacy posts — a plain string
type PostBody = string | PortableTextBlock[];

type Post = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  body: PostBody;
  image?: SanityImage;
  youtubeUrl?: string;
  likes?: number;
};

// Flatten a single Portable Text block to its text
function blockText(block: unknown): string {
  const b = block as { _type?: string; children?: { text?: unknown }[] };
  if (b?._type !== "block" || !Array.isArray(b.children)) return "";
  return b.children.map((c) => (typeof c.text === "string" ? c.text : "")).join("");
}

// Plain-text version of a body (rich text or legacy string) — for previews,
// hashtag extraction and filtering
function bodyToPlainText(body: PostBody): string {
  if (typeof body === "string") return body;
  if (!Array.isArray(body)) return "";
  return body.map(blockText).join("\n\n");
}

// True when a paragraph/block contains only hashtags (shown as pills instead)
const HASHTAG_ONLY = /^(#[\w]+\s*)+$/;

// Rendering rules for rich-text body, styled to match the site
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-silver/70 text-sm leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h4 className="font-display font-semibold text-soft-white text-lg md:text-xl mt-6" style={{ letterSpacing: "0.02em" }}>{children}</h4>
    ),
    h3: ({ children }) => (
      <h5 className="font-display font-medium text-soft-white/90 text-base mt-5" style={{ letterSpacing: "0.02em" }}>{children}</h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-glow-blue/30 pl-4 italic text-soft-white/70 text-sm leading-relaxed">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-silver/70 text-sm leading-relaxed">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-silver/70 text-sm leading-relaxed">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-soft-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string })?.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-glow-blue/80 hover:text-glow-blue underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

// Extract hashtags from a body (rich text or string)
function extractHashtags(body: PostBody): string[] {
  const matches = bodyToPlainText(body).match(/#[\w]+/g) ?? [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

// Body without hashtag-only lines/blocks (hashtags become pills)
function RenderBody({ body }: { body: PostBody }) {
  // Legacy plain-text posts (pre rich-text migration)
  if (typeof body === "string") {
    const cleanParas = body
      .split("\n\n")
      .filter((para) => !HASHTAG_ONLY.test(para.trim()));
    return (
      <>
        {cleanParas.map((para, i) => (
          <p key={i} className="text-silver/70 text-sm leading-relaxed">
            {para}
          </p>
        ))}
      </>
    );
  }

  // Rich text — drop blocks that are only hashtags
  const blocks = body.filter((b) => {
    const t = blockText(b).trim();
    return t === "" || !HASHTAG_ONLY.test(t);
  });
  return <PortableText value={blocks} components={ptComponents} />;
}

// Hashtag pill badges
function HashtagPills({
  tags,
  onHashtag,
}: {
  tags: string[];
  onHashtag: (tag: string) => void;
}) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={(e) => {
            e.stopPropagation();
            onHashtag(tag);
          }}
          className="text-[10px] tracking-widest border px-3 py-1 transition-all duration-200 hover:border-glow-blue/50 hover:text-soft-white"
          style={{
            color: "rgba(79,195,247,0.6)",
            borderColor: "rgba(79,195,247,0.15)",
            letterSpacing: "0.12em",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// Thumbs-up — one like per browser (deduped via localStorage)
function LikeButton({ post }: { post: Post }) {
  const [count, setCount] = useState(post.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`tmstry-liked-${post._id}`)) setLiked(true);
    } catch { /* ignore */ }
  }, [post._id]);

  const onLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked || busy) return;
    setBusy(true);
    // Optimistic update
    setCount((c) => c + 1);
    setLiked(true);
    try { localStorage.setItem(`tmstry-liked-${post._id}`, "1"); } catch { /* ignore */ }

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id }),
      });
      if (!res.ok) throw new Error("like failed");
      const data = await res.json();
      if (typeof data.likes === "number") setCount(data.likes);
    } catch {
      // Revert on failure
      setCount((c) => Math.max(0, c - 1));
      setLiked(false);
      try { localStorage.removeItem(`tmstry-liked-${post._id}`); } catch { /* ignore */ }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onLike}
      disabled={liked || busy}
      aria-pressed={liked}
      aria-label={liked ? "Liked" : "Like this post"}
      className="flex items-center gap-2 text-[11px] tracking-widest uppercase transition-colors duration-200 disabled:cursor-default"
      style={{ letterSpacing: "0.15em", color: liked ? "rgba(224,64,251,0.9)" : "rgba(136,146,160,0.6)" }}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
        <path d="M7 10v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-mono">{count}</span>
    </button>
  );
}

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

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span
                className="font-mono text-[9px] block mb-2"
                style={{ color: "rgba(79,195,247,0.8)", letterSpacing: "0.3em" }}
              >
                {post.tag.toUpperCase()} · {formatDate(post.date)}
              </span>
              <h3
                className="font-display font-bold text-soft-white"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em" }}
              >
                {post.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-silver/40 hover:text-soft-white transition-colors duration-200 text-xs tracking-widest mt-1 ml-4 flex-shrink-0"
              style={{ letterSpacing: "0.2em" }}
            >
              ESC ×
            </button>
          </div>

          {/* Accent line */}
          <div
            className="h-px w-full mb-8"
            style={{ background: "linear-gradient(90deg, rgba(79,195,247,0.5), transparent)" }}
          />

          {/* Image */}
          {post.image?.asset && (
            <div className="w-full mb-8 overflow-hidden">
              <Image
                src={urlFor(post.image).width(900).url()}
                alt={post.title}
                width={900}
                height={900}
                className="w-full h-auto block"
                style={{ filter: "saturate(0.8) brightness(0.85)" }}
              />
            </div>
          )}

          {/* Body */}
          <div className="space-y-4">
            <RenderBody body={post.body} />
          </div>

          {/* Hashtag pills */}
          <HashtagPills
            tags={extractHashtags(post.body)}
            onHashtag={(tag) => { onClose(); onHashtag(tag); }}
          />

          {/* YouTube embed */}
          {post.youtubeUrl && getYouTubeId(post.youtubeUrl) && (
            <div className="w-full mt-8 overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(post.youtubeUrl)}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* Bottom row: like + YouTube link + Close */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <LikeButton post={post} />
              {post.youtubeUrl && (
                <a
                  href={post.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] tracking-widest uppercase flex items-center gap-2 transition-colors duration-200"
                  style={{ color: "rgba(79,195,247,0.6)", letterSpacing: "0.2em" }}
                >
                  Watch on YouTube
                  <svg viewBox="0 0 12 12" className="w-3 h-3 fill-none stroke-current" strokeWidth={1.5}>
                    <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/50 hover:text-soft-white hover:border-white/30 transition-all duration-300 flex-shrink-0"
              style={{ letterSpacing: "0.2em" }}
            >
              Close
            </button>
          </div>

          {/* Comments */}
          <Comments postId={post._id} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewsList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Post | null>(null);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  const filtered = activeHashtag
    ? posts.filter((p) => bodyToPlainText(p.body).toLowerCase().includes(activeHashtag))
    : posts;

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
        {filtered.map((post, i) => (
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
