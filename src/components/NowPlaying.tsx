"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useModalChrome } from "@/hooks/useModalChrome";
import { usePlayer } from "@/context/PlayerContext";

function CoverLightbox({ cover, title, onClose }: { cover: string; title: string; onClose: () => void }) {
  useModalChrome(onClose);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={`${title} cover`}
    >
      <div className="absolute inset-0 bg-obsidian/92 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative" onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-9 right-0 text-silver/60 hover:text-soft-white text-xs tracking-widest uppercase transition-colors" style={{ letterSpacing: "0.2em" }}>
          Close ×
        </button>
        <div className="relative w-[80vw] max-w-[460px] aspect-square overflow-hidden border border-white/10" style={{ boxShadow: "0 0 60px rgba(79,195,247,0.15)" }}>
          <Image src={cover} alt={title} fill sizes="460px" className="object-cover" />
          <div className="absolute inset-0 crt-scanlines opacity-[0.12] pointer-events-none" />
        </div>
        <p className="mt-4 text-center font-mono text-[11px] tracking-[0.25em] uppercase text-silver/70">{title}</p>
      </motion.div>
    </motion.div>
  );
}

function Eq({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-6" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="eq-bar w-[2px] bg-glow-blue/70"
          style={{
            height: "100%",
            animationDelay: `${(i % 5) * 0.12}s`,
            animationDuration: `${0.7 + (i % 4) * 0.18}s`,
            animationPlayState: playing ? "running" : "paused",
            opacity: playing ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

export default function NowPlaying() {
  const { track, playing, currentTime, duration, toggle, next, prev, seek } = usePlayer();
  const [zoom, setZoom] = useState(false);

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const ctrl = "text-silver/55 hover:text-soft-white transition-colors duration-200";

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-silver/50">&gt;&gt; Now Playing</p>
      <p className="font-display font-bold text-glow-blue text-xl tracking-wide mt-1 line-clamp-1">{track.title}</p>

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => setZoom(true)}
          aria-label="Enlarge cover"
          className="group/cv relative w-12 h-12 flex-shrink-0 overflow-hidden border border-white/10 cursor-zoom-in"
        >
          <Image key={track.cover} src={track.cover} alt={track.title} fill sizes="48px" className="object-cover transition-transform duration-300 group-hover/cv:scale-110" />
          <span className="absolute inset-0 bg-obsidian/0 group-hover/cv:bg-obsidian/20 transition-colors" />
        </button>
        <Eq playing={playing} />
      </div>

      {/* Progress bar (click to seek) */}
      <div className="mt-3">
        <div
          onClick={onSeek}
          className="group relative h-[3px] bg-white/10 cursor-pointer"
          role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(currentTime)}
        >
          <div className="absolute inset-y-0 left-0 bg-glow-blue/80" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-glow-blue opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 4px)` }} />
        </div>
        <div className="flex items-center justify-between mt-1.5 font-mono text-[9px] tracking-wider text-silver/40">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-5 mt-3">
        <button onClick={prev} aria-label="Previous track" className={ctrl}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 6h2v12H6zM19 6v12L9 12z" /></svg>
        </button>
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={ctrl}>
          {playing
            ? <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            : <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8 5v14l11-7z" /></svg>}
        </button>
        <button onClick={next} aria-label="Next track" className={ctrl}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 6h2v12h-2zM5 6l10 6-10 6z" /></svg>
        </button>
      </div>

      <AnimatePresence>
        {zoom && <CoverLightbox cover={track.cover} title={track.title} onClose={() => setZoom(false)} />}
      </AnimatePresence>
    </div>
  );
}
