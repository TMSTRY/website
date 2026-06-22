"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import CoverLightbox from "./CoverLightbox";

/** Floating compact player that appears once you scroll past the hero. */
export default function MiniPlayer() {
  const { track, playing, currentTime, duration, toggle, next, prev } = usePlayer();
  const [pastHero, setPastHero] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight * 0.8);
      if (y < window.innerHeight * 0.3) setDismissed(false); // re-arm near the top
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const ctrl = "text-silver/70 hover:text-soft-white transition-colors duration-200";
  const show = pastHero && !dismissed;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 z-[90] w-[300px] max-w-[calc(100vw-2rem)] border border-white/10 bg-obsidian/85 backdrop-blur-xl"
            style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}
          >
            {/* progress line on top */}
            <div className="relative h-[2px] bg-white/10">
              <div className="absolute inset-y-0 left-0 bg-glow-blue/80" style={{ width: `${progress}%` }} />
            </div>

            {/* close */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Hide player"
              className="absolute top-1.5 right-1.5 z-10 text-silver/40 hover:text-soft-white text-xs leading-none p-1 transition-colors"
            >
              ×
            </button>

            <div className="flex items-center gap-3 p-3">
              <button
                onClick={() => setZoom(true)}
                aria-label="Enlarge cover"
                className="group/cv relative w-10 h-10 flex-shrink-0 overflow-hidden border border-white/10 cursor-zoom-in"
              >
                <Image key={track.cover} src={track.cover} alt={track.title} fill sizes="40px" className="object-cover transition-transform duration-300 group-hover/cv:scale-110" />
              </button>

              <div className="min-w-0 flex-1 pr-3">
                <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-silver/40">Now Playing</p>
                <p className="text-soft-white text-sm truncate">{track.title}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={prev} aria-label="Previous track" className={ctrl}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M6 6h2v12H6zM19 6v12L9 12z" /></svg>
                </button>
                <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={ctrl}>
                  {playing
                    ? <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
                    : <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8 5v14l11-7z" /></svg>}
                </button>
                <button onClick={next} aria-label="Next track" className={ctrl}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M16 6h2v12h-2zM5 6l10 6-10 6z" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoom && <CoverLightbox cover={track.cover} title={track.title} onClose={() => setZoom(false)} />}
      </AnimatePresence>
    </>
  );
}
