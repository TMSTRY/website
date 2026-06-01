"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = {
  _type: "image";
  asset: { _ref: string };
};

type Post = {
  _id: string;
  title: string;
  tag: string;
  date: string;
  body: string;
  image?: SanityImage;
  youtubeUrl?: string;
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

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
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
      >
        <div className="absolute -inset-px pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(79,195,247,0.12), transparent 60%)" }}
        />

        <div className="relative border border-white/[0.08] bg-charcoal/80 p-8 md:p-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="font-mono text-[9px] block mb-2"
                style={{ color: "rgba(79,195,247,0.8)", letterSpacing: "0.3em" }}>
                {post.tag.toUpperCase()} · {formatDate(post.date)}
              </span>
              <h3 className="font-display font-bold text-soft-white"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "0.04em" }}>
                {post.title}
              </h3>
            </div>
            <button onClick={onClose}
              className="text-silver/40 hover:text-soft-white transition-colors duration-200 text-xs tracking-widest mt-1 ml-4 flex-shrink-0"
              style={{ letterSpacing: "0.2em" }}>
              ESC ×
            </button>
          </div>

          {/* Accent line */}
          <div className="h-px w-full mb-8"
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
            {post.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-silver/70 text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* YouTube embed */}
          {post.youtubeUrl && getYouTubeId(post.youtubeUrl) && (
            <div className="w-full mt-8 overflow-hidden"
              style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(post.youtubeUrl)}`}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* Close */}
          <div className="mt-10 flex justify-end">
            <button onClick={onClose}
              className="text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/50 hover:text-soft-white hover:border-white/30 transition-all duration-300"
              style={{ letterSpacing: "0.2em" }}>
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewsList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Post | null>(null);

  if (!posts.length) {
    return (
      <p className="text-silver/20 text-[10px] tracking-widest uppercase py-12"
        style={{ letterSpacing: "0.25em" }}>
        No posts yet
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-px">
        {posts.map((post, i) => (
          <FadeInSection key={post._id} delay={i * 0.08}>
            <motion.article
              onClick={() => setActive(post)}
              className="group relative border-t border-white/[0.06] py-8 md:py-10 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12 cursor-pointer"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-glow-blue scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              {/* Date & tag */}
              <div className="flex md:flex-col gap-3 md:gap-2 pt-1">
                <span className="text-[9px] tracking-widest uppercase"
                  style={{ letterSpacing: "0.3em", color: "rgba(79,195,247,0.6)" }}>
                  {post.tag}
                </span>
                <span className="text-[10px] tracking-widest text-silver/30 uppercase"
                  style={{ letterSpacing: "0.2em" }}>
                  {formatDate(post.date)}
                </span>
              </div>

              {/* Content */}
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-soft-white mb-3 group-hover:text-white transition-colors duration-300"
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.02em" }}>
                    {post.title}
                  </h3>
                  <p className="text-silver/50 text-sm leading-relaxed line-clamp-2"
                    style={{ letterSpacing: "0.02em" }}>
                    {post.body}
                  </p>
                </div>

                {/* Thumbnail */}
                {post.image?.asset && (
                  <div className="flex-shrink-0 relative w-16 h-16 md:w-20 md:h-20 overflow-hidden opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                    <Image
                      src={urlFor(post.image).width(120).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                      style={{ filter: "saturate(0.7)" }}
                    />
                  </div>
                )}
              </div>
            </motion.article>
          </FadeInSection>
        ))}

        <div className="border-t border-white/[0.06]" />
      </div>

      <AnimatePresence>
        {active && <PostModal post={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}
