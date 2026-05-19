"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";

const videos = [
  {
    id: "fK4z0vTYh7g",
    title: "Human // Signal // AI — Official Visual",
    subtitle: "Official Video",
    duration: "4:32",
    featured: true,
  },
  {
    id: "fK4z0vTYh7g",
    title: "Neural Drift",
    subtitle: "Music Video",
    duration: "3:47",
    featured: false,
  },
  {
    id: "fK4z0vTYh7g",
    title: "Ghost Signal",
    subtitle: "Lyric Video",
    duration: "5:12",
    featured: false,
  },
  {
    id: "fK4z0vTYh7g",
    title: "Live at Parallax",
    subtitle: "Live Session",
    duration: "28:14",
    featured: false,
  },
];

function VideoThumbnail({
  video,
  onClick,
  large = false,
}: {
  video: (typeof videos)[0];
  onClick: () => void;
  large?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full text-left"
      aria-label={`Play ${video.title}`}
    >
      <div className={`relative overflow-hidden bg-deep-gray ${large ? "aspect-video" : "aspect-video"}`}>
        {/* YouTube thumbnail placeholder */}
        <div
          className="absolute inset-0"
          style={{
            background: large
              ? "radial-gradient(ellipse at center, rgba(79,195,247,0.1) 0%, rgba(8,10,14,0.95) 70%)"
              : "radial-gradient(ellipse at center, rgba(156,106,255,0.08) 0%, rgba(8,10,14,0.95) 70%)",
          }}
        />

        {/* Cinematic bars */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/80" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80" />

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Play button */}
            <div className="relative">
              <div
                className={`${large ? "w-16 h-16" : "w-10 h-10"} rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:border-glow-blue/60 transition-colors duration-300`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`${large ? "w-6 h-6" : "w-4 h-4"} fill-white/80 group-hover:fill-white ml-0.5`}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {hovered && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-glow-blue/30"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
            {large && (
              <p
                className="text-soft-white/60 text-[9px] tracking-widest"
                style={{ letterSpacing: "0.3em" }}
              >
                {video.subtitle.toUpperCase()}
              </p>
            )}
          </motion.div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-10 right-3">
          <span className="text-white/60 text-[9px] font-mono bg-black/60 px-1.5 py-0.5">
            {video.duration}
          </span>
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 border border-glow-blue/0 group-hover:border-glow-blue/20 transition-colors duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-silver/50 text-[9px] tracking-widest mb-1" style={{ letterSpacing: "0.25em" }}>
          {video.subtitle.toUpperCase()}
        </p>
        <h4 className={`text-soft-white font-medium group-hover:text-glow-blue transition-colors duration-300 ${large ? "text-base md:text-lg" : "text-sm"}`}>
          {video.title}
        </h4>
      </div>
    </button>
  );
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-silver hover:text-soft-white text-xs tracking-widest uppercase"
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

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <section id="video" className="py-24 md:py-36 px-6 md:px-12 relative">
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(156,106,255,0.03) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <FadeInSection className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-8 bg-glow-purple/30" />
              <span
                className="text-glow-purple text-[9px] tracking-widest uppercase"
                style={{ letterSpacing: "0.4em", color: "#9c6aff" }}
              >
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

          {/* Featured video */}
          <FadeInSection delay={0.1} className="mb-8 md:mb-10">
            <div className="border border-white/[0.06] p-4 md:p-6 bg-charcoal/20">
              <VideoThumbnail
                video={videos[0]}
                onClick={() => setActiveVideo(videos[0].id)}
                large
              />
            </div>
          </FadeInSection>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {videos.slice(1).map((video, i) => (
              <FadeInSection key={video.id + i} delay={i * 0.08}>
                <div className="border border-white/[0.04] p-3 bg-charcoal/10 hover:border-white/[0.1] transition-all duration-500">
                  <VideoThumbnail
                    video={video}
                    onClick={() => setActiveVideo(video.id)}
                  />
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* YouTube channel link */}
          <FadeInSection delay={0.3} className="mt-12 text-center">
            <a
              href="https://www.youtube.com/@TMSTRY-music"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-silver/60 hover:text-soft-white text-xs tracking-widest uppercase transition-colors duration-300 group"
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

      {/* Modal */}
      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
