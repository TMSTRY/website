"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStaticCanvas } from "@/hooks/useStaticCanvas";
import { useSignalRoom } from "@/context/SignalRoomContext";
import { useModalChrome } from "@/hooks/useModalChrome";
import type { YTVideo } from "@/app/api/youtube/route";

const FALLBACK: YTVideo[] = [
  {
    id: "fK4z0vTYh7g",
    title: "TMSTRY – Hollow Shape (Symphonic Remix)",
    published: "",
    thumbnail: "https://i.ytimg.com/vi/fK4z0vTYh7g/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=fK4z0vTYh7g",
  },
];

export default function SignalRoom() {
  const { close } = useSignalRoom();
  useModalChrome(close); // Esc to close + lock body scroll

  const [clips, setClips] = useState<YTVideo[]>([]);
  const [index, setIndex] = useState(0);
  const [switching, setSwitching] = useState(true);
  const [muted, setMuted] = useState(true);

  const staticRef = useRef<HTMLCanvasElement>(null);
  useStaticCanvas(staticRef, { fps: 20, baseIntensity: 0.9, maxW: 480, maxH: 270 });

  useEffect(() => {
    let active = true;
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data: YTVideo[]) => {
        const list = Array.isArray(data) && data.length ? data : FALLBACK;
        if (!active) return;
        setClips(list);
        setIndex(Math.floor(Math.random() * list.length));
      })
      .catch(() => { if (active) setClips(FALLBACK); })
      .finally(() => {
        if (active) setTimeout(() => setSwitching(false), 600);
      });
    return () => { active = false; };
  }, []);

  const goTo = (idx: number) => {
    setSwitching(true);
    setTimeout(() => setIndex(idx), 320);
    setTimeout(() => setSwitching(false), 700);
  };
  const random = () => { if (clips.length) goTo(Math.floor(Math.random() * clips.length)); };
  const next = () => { if (clips.length) goTo((index + 1) % clips.length); };

  const current = clips[index];
  const iframeSrc = useMemo(() => {
    if (!current) return "";
    const m = muted ? 1 : 0;
    return `https://www.youtube.com/embed/${current.id}?autoplay=1&mute=${m}&controls=0&loop=1&playlist=${current.id}&modestbranding=1&rel=0&playsinline=1`;
  }, [current, muted]);

  const btn =
    "text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/60 hover:text-soft-white hover:border-white/30 transition-all duration-300";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] overflow-hidden bg-obsidian"
      role="dialog"
      aria-modal="true"
      aria-label="The Signal Room"
    >
      {/* ── Room scene ── */}
      <div className="absolute inset-0">
        {/* base atmosphere */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 35%, #10131a 0%, #080a0e 55%, #050608 100%)",
          }}
        />
        {/* optional photoreal still (drop public/signal-room.jpg to enable) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/signal-room.jpg')", opacity: 0.5, mixBlendMode: "luminosity" }}
        />
        {/* ambient colour glows (desktop) */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          <motion.div
            className="absolute rounded-full blur-[120px]"
            style={{ width: 520, height: 520, left: "20%", top: "55%", background: "radial-gradient(circle, rgba(79,195,247,0.16), transparent 70%)" }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full blur-[130px]"
            style={{ width: 600, height: 600, right: "12%", top: "20%", background: "radial-gradient(circle, rgba(224,64,251,0.12), transparent 70%)" }}
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {/* vignette + global scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.9)" }} />
        <div className="absolute inset-0 crt-scanlines opacity-[0.15] pointer-events-none" />
      </div>

      {/* ── HUD: title + close ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-soft-white/80">
            The Signal Room
          </span>
        </div>
        <button onClick={close} className={btn} aria-label="Close the Signal Room">
          Exit ×
        </button>
      </div>

      {/* ── Central CRT ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-12">
        <div className="w-full max-w-3xl">
          {/* channel label */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-glow-blue/70">
              {switching ? "// acquiring signal" : "// intercepted transmission"}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-silver/40 line-clamp-1 max-w-[55%] text-right">
              {current?.title ?? ""}
            </span>
          </div>

          {/* CRT bezel */}
          <div
            className="relative aspect-video w-full overflow-hidden crt-flicker"
            style={{
              borderRadius: "10px",
              padding: "10px",
              background: "linear-gradient(160deg, #15171c, #090a0d)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.7), 0 0 50px rgba(79,195,247,0.12)",
            }}
          >
            <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "4px", background: "#04060a" }}>
              {current && (
                <iframe
                  key={`${current.id}-${muted}`}
                  src={iframeSrc}
                  title="Intercepted transmission"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute inset-0 w-full h-full border-0"
                />
              )}

              {/* static layer between channels */}
              <canvas
                ref={staticRef}
                className="absolute inset-0 w-full h-full transition-opacity duration-300"
                style={{ opacity: switching ? 0.95 : 0, zIndex: 5 }}
              />

              {/* CRT overlays */}
              <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" style={{ zIndex: 6 }} />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 6, boxShadow: "inset 0 0 60px rgba(0,0,0,0.7)", background: "radial-gradient(ellipse at center, rgba(79,195,247,0.06), transparent 75%)" }}
              />
            </div>
          </div>

          {/* controls */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={random} className={btn}>Random</button>
            <button onClick={next} className={btn}>Next signal →</button>
            <button onClick={() => setMuted((m) => !m)} className={btn}>
              {muted ? "Audio off" : "Audio on"}
            </button>
          </div>

          <p className="mt-6 text-center font-mono text-[9px] tracking-[0.25em] uppercase text-silver/20">
            Channels decoding · stand by
          </p>
        </div>
      </div>
    </motion.div>
  );
}
