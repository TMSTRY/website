"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import type { YTVideo } from "@/app/api/youtube/route";

// Fallback featured video shown while loading
const FALLBACK: YTVideo = {
  id: "fK4z0vTYh7g",
  title: "TMSTRY – Hollow Shape (Symphonic Remix)",
  published: "",
  thumbnail: "https://i.ytimg.com/vi/fK4z0vTYh7g/maxresdefault.jpg",
  url: "https://www.youtube.com/watch?v=fK4z0vTYh7g",
};

function VideoThumbnail({
  video,
  onClick,
  large = false,
}: {
  video: { id: string; title: string; subtitle?: string };
  onClick: () => void;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const thumbnail = imgError
    ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full text-left"
      aria-label={`Play ${video.title}`}
    >
      <div className={`relative overflow-hidden bg-deep-gray aspect-video`}>
        {/* Real YouTube thumbnail */}
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes={large ? "100vw" : "33vw"}
        />

        {/* Dark overlay */}
        <div className={`absolute inset-0 bg-obsidian transition-opacity duration-500 ${hovered ? "opacity-30" : "opacity-50"}`} />

        {/* Cinematic bars */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <div
              className={`${large ? "w-16 h-16" : "w-11 h-11"} rounded-full border border-white/25 flex items-center justify-center backdrop-blur-sm bg-black/30 group-hover:border-glow-blue/60 transition-colors duration-300`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`${large ? "w-6 h-6" : "w-4 h-4"} fill-white/80 group-hover:fill-white ml-0.5 transition-colors`}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {hovered && (
              <motion.div
                className="absolute inset-0 rounded-full border border-glow-blue/30"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 border border-glow-blue/0 group-hover:border-glow-blue/20 transition-colors duration-500" />
      </div>

      {/* Info */}
      <div className="mt-3">
        {video.subtitle && (
          <p className="text-silver/40 text-[9px] tracking-widest mb-1 uppercase" style={{ letterSpacing: "0.25em" }}>
            {video.subtitle}
          </p>
        )}
        <h4 className={`text-soft-white font-medium group-hover:text-glow-blue transition-colors duration-300 line-clamp-2 ${large ? "text-base md:text-lg" : "text-sm"}`}>
          {video.title}
        </h4>
      </div>
    </button>
  );
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/92 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-silver hover:text-soft-white text-xs tracking-widest uppercase transition-colors"
          style={{ letterSpacing: "0.2em" }}
        >
          Close ×
        </button>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="TMSTRY Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Skeleton loader for grid items
function VideoSkeleton() {
  return (
    <div className="border border-white/[0.04] p-3 bg-charcoal/10">
      <div className="aspect-video bg-deep-gray animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-white/8 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [featured, setFeatured] = useState<YTVideo>(FALLBACK);
  const [gridVideos, setGridVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data: YTVideo[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        // API already returns only long-form videos, sorted newest first
        // Index 0 = featured (latest), indices 1–3 = grid
        setFeatured(data[0]);
        setGridVideos(data.slice(1, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section id="video" className="py-24 md:py-36 px-6 md:px-12 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(156,106,255,0.025) 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <FadeInSection className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-8" style={{ background: "rgba(156,106,255,0.35)" }} />
              <span className="text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em", color: "rgba(156,106,255,0.85)" }}>
                Visuals
              </span>
            </div>
            <h2
              className="font-display font-bold text-soft-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
            >
              The Vision
            </h2>
          </FadeInSection>

          {/* Featured video — always latest long-form */}
          <FadeInSection delay={0.1} className="mb-8 md:mb-10">
            <div className="border border-white/[0.06] p-4 md:p-6 bg-charcoal/20">
              <VideoThumbnail
                video={{ id: featured.id, title: featured.title, subtitle: "Latest Video" }}
                onClick={() => setActiveVideo(featured.id)}
                large
              />
            </div>
          </FadeInSection>

          {/* Latest videos grid — live from YouTube RSS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <VideoSkeleton key={i} />)
              : gridVideos.length > 0
              ? gridVideos.map((video, i) => (
                  <FadeInSection key={video.id} delay={i * 0.08}>
                    <div className="border border-white/[0.04] p-3 bg-charcoal/10 hover:border-white/[0.1] transition-all duration-500">
                      <VideoThumbnail
                        video={{ id: video.id, title: video.title }}
                        onClick={() => setActiveVideo(video.id)}
                      />
                    </div>
                  </FadeInSection>
                ))
              : // Fallback: prompt to add channel ID
                null
            }
          </div>

          {/* YouTube channel link */}
          <FadeInSection delay={0.3} className="mt-12 text-center">
            <a
              href="https://www.youtube.com/@TMSTRY-music"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-silver/50 hover:text-soft-white text-xs tracking-widest uppercase transition-colors duration-300 group"
              style={{ letterSpacing: "0.25em" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-red-500/60 group-hover:text-red-500 transition-colors">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              View all on YouTube
            </a>
          </FadeInSection>
        </div>
      </section>

      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
