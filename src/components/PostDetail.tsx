"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Comments from "./Comments";
import ShareBar from "./ShareBar";
import { urlFor } from "@/sanity/lib/image";
import {
  type Post,
  type PostBody,
  HASHTAG_ONLY,
  blockText,
  extractHashtags,
  formatDate,
  getYouTubeId,
  postUrl,
} from "./newsTypes";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-silver/70 text-sm leading-relaxed">{children}</p>,
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

function RenderBody({ body }: { body: PostBody }) {
  if (typeof body === "string") {
    const cleanParas = body.split("\n\n").filter((para) => !HASHTAG_ONLY.test(para.trim()));
    return (
      <>
        {cleanParas.map((para, i) => (
          <p key={i} className="text-silver/70 text-sm leading-relaxed">{para}</p>
        ))}
      </>
    );
  }
  const blocks = body.filter((b) => {
    const t = blockText(b).trim();
    return t === "" || !HASHTAG_ONLY.test(t);
  });
  return <PortableText value={blocks} components={ptComponents} />;
}

function HashtagPills({ tags, onHashtag }: { tags: string[]; onHashtag?: (tag: string) => void }) {
  if (!tags.length) return null;
  const cls = "text-[10px] tracking-widest border px-3 py-1 transition-all duration-200 hover:border-glow-blue/50 hover:text-soft-white";
  const style = { color: "rgba(79,195,247,0.6)", borderColor: "rgba(79,195,247,0.15)", letterSpacing: "0.12em" };
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((tag) =>
        onHashtag ? (
          <button key={tag} onClick={(e) => { e.stopPropagation(); onHashtag(tag); }} className={cls} style={style}>{tag}</button>
        ) : (
          <span key={tag} className={cls} style={style}>{tag}</span>
        )
      )}
    </div>
  );
}

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

export default function PostDetail({
  post,
  onHashtag,
  onClose,
}: {
  post: Post;
  onHashtag?: (tag: string) => void;
  onClose?: () => void;
}) {
  const shareUrl = postUrl(post.slug);
  const ytId = post.youtubeUrl ? getYouTubeId(post.youtubeUrl) : null;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="font-mono text-[9px] block mb-2" style={{ color: "rgba(79,195,247,0.8)", letterSpacing: "0.3em" }}>
            {post.tag.toUpperCase()} · {formatDate(post.date)}
          </span>
          <h3 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em" }}>
            {post.title}
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-silver/40 hover:text-soft-white transition-colors duration-200 text-xs tracking-widest mt-1 ml-4 flex-shrink-0"
            style={{ letterSpacing: "0.2em" }}
          >
            ESC ×
          </button>
        )}
      </div>

      {/* Accent line */}
      <div className="h-px w-full mb-8" style={{ background: "linear-gradient(90deg, rgba(79,195,247,0.5), transparent)" }} />

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

      {/* Hashtags */}
      <HashtagPills tags={extractHashtags(post.body)} onHashtag={onHashtag} />

      {/* YouTube */}
      {ytId && (
        <div className="w-full mt-8 overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* Actions: like + watch + share */}
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
        <ShareBar url={shareUrl} title={post.title} />
      </div>

      {/* Comments */}
      <Comments postId={post._id} />
    </>
  );
}
