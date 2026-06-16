"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaticCanvas } from "@/hooks/useStaticCanvas";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useSignalRoom } from "@/context/SignalRoomContext";
import { useModalChrome } from "@/hooks/useModalChrome";
import { getYouTubeId } from "@/components/newsTypes";
import type { YTVideo } from "@/app/api/youtube/route";
import type { Transmission } from "@/app/api/transmissions/route";

const CHANNELS = [
  { id: "CH01", label: "Music Videos" },
  { id: "CH02", label: "Teasers" },
  { id: "CH03", label: "Archive Footage" },
  { id: "CH04", label: "Behind The Scenes" },
  { id: "CH05", label: "Corrupted Signal" },
];

const DEFAULT_DURATION = 22;
const FALLBACK_VIDEO = "fK4z0vTYh7g";

const HIDDEN_MESSAGES = [
  "WHO IS LISTENING?",
  "SIGNAL ORIGIN UNKNOWN",
  "DO NOT TRUST THE BROADCAST",
  "WE ARE STILL HERE",
  "01001000 01001001",
  "RETURN TO THE SOURCE",
  "ERROR // HUMAN DETECTED",
  "THE MACHINE REMEMBERS",
];

const LORE_LOGS = [
  "LOG 04 — transmission intercepted 03:14",
  "ARCHIVE // tape 12 corrupted",
  "signal traced to grid 7",
  "last operator left no name",
  "frequency drifts every 56 days",
  "the machines don't dream. they learned to wonder.",
  "decryption failed — retrying",
  "subject refused to stay quiet",
];

interface Snippet {
  id: string;
  title: string;
  videoId?: string;
  mp4?: string | null;
  start: number;
  duration?: number;
  corrupted?: boolean;
  note?: string;
}

export default function SignalRoom() {
  const { close } = useSignalRoom();
  useModalChrome(close);

  const [byChannel, setByChannel] = useState<Record<string, Snippet[]>>({});
  const [fallback, setFallback] = useState<Snippet[]>([]);
  const [channelIdx, setChannelIdx] = useState(0);
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [switching, setSwitching] = useState(true);
  const [muted, setMuted] = useState(true);
  const [glitchMsg, setGlitchMsg] = useState<string | null>(null);
  const [lore, setLore] = useState<{ text: string; side: "left" | "right" } | null>(null);

  const staticRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useStaticCanvas(staticRef, { fps: 20, baseIntensity: 0.9, maxW: 480, maxH: 270 });

  // ── Load content ──
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/transmissions").then((r) => r.json()).catch(() => []),
      fetch("/api/youtube").then((r) => r.json()).catch(() => []),
    ]).then(([trans, yt]: [Transmission[], YTVideo[]]) => {
      if (!active) return;
      const grouped: Record<string, Snippet[]> = {};
      (Array.isArray(trans) ? trans : []).forEach((t) => {
        const videoId = t.youtubeUrl ? getYouTubeId(t.youtubeUrl) ?? undefined : undefined;
        if (!videoId && !t.mp4) return;
        (grouped[t.channel] ||= []).push({
          id: t._id, title: t.title, videoId, mp4: t.mp4,
          start: t.start ?? 0, duration: t.duration, corrupted: t.corrupted, note: t.note,
        });
      });
      setByChannel(grouped);

      const pool: Snippet[] = (Array.isArray(yt) ? yt : [])
        .filter((v) => v?.id)
        .map((v) => ({ id: v.id, title: v.title, videoId: v.id, start: 0 }));
      setFallback(pool.length ? pool : [{ id: FALLBACK_VIDEO, title: "TMSTRY — Hollow Shape", videoId: FALLBACK_VIDEO, start: 0 }]);

      setSnippetIdx(0);
      setTimeout(() => active && setSwitching(false), 600);
    });
    return () => { active = false; };
  }, []);

  const channel = CHANNELS[channelIdx];
  const snippets = useMemo(() => {
    const list = byChannel[channel.id];
    return list && list.length ? list : fallback;
  }, [byChannel, fallback, channel.id]);

  const snippet = snippets.length ? snippets[snippetIdx % snippets.length] : undefined;
  const corruptedActive = channel.id === "CH05" || !!snippet?.corrupted;

  useAmbientAudio(!muted, corruptedActive);

  // keep <video> mute state in sync (the muted prop alone is unreliable)
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, snippet]);

  // ── Navigation with static burst ──
  const burst = useCallback((apply: () => void) => {
    setSwitching(true);
    setTimeout(apply, 320);
    setTimeout(() => setSwitching(false), 720);
  }, []);
  const switchChannel = (i: number) => burst(() => { setChannelIdx(i); setSnippetIdx(Math.floor(Math.random() * 8)); });
  const nextSnippet = useCallback(() => burst(() => setSnippetIdx((n) => n + 1)), [burst]);
  const randomSignal = () => burst(() => {
    setChannelIdx(Math.floor(Math.random() * CHANNELS.length));
    setSnippetIdx(Math.floor(Math.random() * 8));
  });

  // ── Auto-advance snippets ──
  useEffect(() => {
    if (switching || !snippet) return;
    const ms = (snippet.duration ?? DEFAULT_DURATION) * 1000;
    const t = setTimeout(() => nextSnippet(), ms);
    return () => clearTimeout(t);
  }, [switching, snippet, nextSnippet]);

  // ── Corrupted channel: flash hidden messages ──
  useEffect(() => {
    setGlitchMsg(null);
    if (!corruptedActive || switching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let on: ReturnType<typeof setTimeout>;
    const tick = () => {
      setGlitchMsg(HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]);
      on = setTimeout(() => setGlitchMsg(null), 700 + Math.random() * 500);
    };
    const iv = setInterval(tick, 4500 + Math.random() * 4000);
    return () => { clearInterval(iv); clearTimeout(on); };
  }, [corruptedActive, switching]);

  // ── Lore logs on the side monitors (desktop) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let hide: ReturnType<typeof setTimeout>;
    let i = 0;
    const tick = () => {
      setLore({ text: LORE_LOGS[Math.floor(Math.random() * LORE_LOGS.length)], side: i % 2 ? "right" : "left" });
      i++;
      hide = setTimeout(() => setLore(null), 5000);
    };
    const iv = setInterval(tick, 11000 + Math.random() * 6000);
    return () => { clearInterval(iv); clearTimeout(hide); };
  }, []);

  const ytSrc = useMemo(() => {
    if (!snippet?.videoId) return "";
    const m = muted ? 1 : 0;
    const start = Math.round(snippet.start);
    const end = snippet.duration ? `&end=${Math.round(snippet.start + snippet.duration)}` : "";
    return `https://www.youtube.com/embed/${snippet.videoId}?autoplay=1&mute=${m}&controls=0&start=${start}${end}&modestbranding=1&rel=0&playsinline=1`;
  }, [snippet, muted]);

  const btn =
    "text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/60 hover:text-soft-white hover:border-white/30 transition-all duration-300";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] overflow-hidden bg-obsidian"
      role="dialog" aria-modal="true" aria-label="The Signal Room"
    >
      {/* ── Room scene ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 35%, #10131a 0%, #080a0e 55%, #050608 100%)" }} />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/signal-room.webp')" }} />
        <div className="absolute inset-0 hidden md:block pointer-events-none" style={{ mixBlendMode: "screen" }}>
          <motion.div className="absolute rounded-full blur-[120px]" style={{ width: 460, height: 460, left: "16%", top: "52%", background: "radial-gradient(circle, rgba(79,195,247,0.10), transparent 70%)" }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full blur-[130px]" style={{ width: 560, height: 560, right: "10%", top: "22%", background: "radial-gradient(circle, rgba(224,64,251,0.08), transparent 70%)" }} animate={{ opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(5,6,8,0.7) 0%, transparent 20%, transparent 72%, rgba(5,6,8,0.55) 100%)" }} />
        <div className="absolute inset-y-0 left-0 w-[360px] pointer-events-none hidden md:block" style={{ background: "linear-gradient(to right, rgba(5,6,8,0.6), transparent)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.8)" }} />
        <div className="absolute inset-0 crt-scanlines opacity-[0.1] pointer-events-none" />
      </div>

      {/* ── Lore overlays (desktop) ── */}
      <AnimatePresence>
        {lore && (
          <motion.div
            key={lore.text}
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="hidden md:block absolute z-20 max-w-[200px] font-mono text-[9px] tracking-[0.12em] uppercase text-glow-blue/50 pointer-events-none"
            style={lore.side === "left" ? { left: "4%", top: "30%" } : { right: "5%", top: "58%" }}
          >
            <span className="signal-label-flicker">{lore.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-glow-blue animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-soft-white/80">The Signal Room</span>
        </div>
        <button onClick={close} className={btn} aria-label="Close the Signal Room">Exit ×</button>
      </div>

      {/* ── Channel rail (desktop) ── */}
      <div className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 z-20 flex-col gap-1">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-silver/30 mb-3">Channels</span>
        {CHANNELS.map((c, i) => {
          const activeCh = i === channelIdx;
          return (
            <button key={c.id} onClick={() => i !== channelIdx && switchChannel(i)} className="group flex items-center gap-3 py-2 text-left">
              <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: activeCh ? "#4fc3f7" : "rgba(136,146,160,0.45)" }}>{c.id}</span>
              <span className="text-[11px] tracking-wider transition-colors" style={{ color: activeCh ? "rgba(232,234,237,0.9)" : "rgba(136,146,160,0.35)" }}>{c.label}</span>
              {activeCh && <span className="w-1 h-1 rounded-full bg-glow-blue animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* ── Central CRT ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-12">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: corruptedActive ? "rgba(224,64,251,0.8)" : "rgba(79,195,247,0.7)" }}>
              {switching ? "// acquiring signal" : `// ${channel.id} · ${channel.label}`}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-silver/40 line-clamp-1 max-w-[50%] text-right">{snippet?.title ?? ""}</span>
          </div>

          <div
            className={`crt-bezel relative aspect-video w-full overflow-hidden crt-flicker ${corruptedActive && !switching ? "signal-glitch" : ""}`}
            style={{
              borderRadius: "10px", padding: "10px",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 16px rgba(0,0,0,0.85), 0 20px 60px rgba(0,0,0,0.7), 0 0 50px rgba(79,195,247,0.12)",
            }}
          >
            {/* worn grime on the bezel */}
            <span className="crt-grime absolute inset-0 pointer-events-none" style={{ borderRadius: "10px", zIndex: 1 }} />

            <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "4px", background: "#04060a", zIndex: 2 }}>
              {snippet?.mp4 ? (
                <video
                  ref={videoRef}
                  key={`${snippet.id}-${snippet.mp4}`}
                  src={snippet.mp4}
                  autoPlay loop playsInline
                  onLoadedMetadata={(e) => { e.currentTarget.currentTime = snippet.start || 0; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : snippet?.videoId ? (
                <iframe
                  key={`${snippet.videoId}-${snippet.start}-${muted}`}
                  src={ytSrc}
                  title="Intercepted transmission"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : null}

              {/* hidden corrupted message */}
              <AnimatePresence>
                {glitchMsg && (
                  <motion.div
                    key={glitchMsg}
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.3, 1] }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center z-[8] pointer-events-none"
                  >
                    <span className="signal-glitch font-mono text-sm md:text-xl tracking-[0.2em] uppercase text-center px-4" style={{ color: "rgba(224,64,251,0.9)", textShadow: "2px 0 rgba(79,195,247,0.7), -2px 0 rgba(224,64,251,0.7)" }}>
                      {glitchMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* faint signal note */}
              {snippet?.note && !switching && (
                <div className="absolute bottom-3 left-3 z-[7] font-mono text-[9px] tracking-[0.15em] uppercase text-glow-blue/50 max-w-[70%]">{snippet.note}</div>
              )}

              {/* static layer */}
              <canvas ref={staticRef} className="absolute inset-0 w-full h-full transition-opacity duration-300" style={{ opacity: switching ? 0.95 : corruptedActive ? 0.18 : 0, zIndex: 5 }} />

              <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" style={{ zIndex: 6 }} />
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6, boxShadow: "inset 0 0 60px rgba(0,0,0,0.7)", background: "radial-gradient(ellipse at center, rgba(79,195,247,0.06), transparent 75%)" }} />
            </div>
          </div>

          {/* channel chips (mobile) */}
          <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-1">
            {CHANNELS.map((c, i) => (
              <button key={c.id} onClick={() => i !== channelIdx && switchChannel(i)} className="flex-shrink-0 font-mono text-[10px] tracking-[0.1em] px-3 py-1.5 border transition-colors"
                style={{ color: i === channelIdx ? "#4fc3f7" : "rgba(136,146,160,0.5)", borderColor: i === channelIdx ? "rgba(79,195,247,0.4)" : "rgba(255,255,255,0.08)" }}>
                {c.id}
              </button>
            ))}
          </div>

          {/* controls */}
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={randomSignal} className={btn}>Random</button>
            <button onClick={nextSnippet} className={btn}>Next signal →</button>
            <button onClick={() => setMuted((m) => !m)} className={btn}>{muted ? "Audio off" : "Audio on"}</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
