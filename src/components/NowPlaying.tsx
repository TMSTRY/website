"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Track = { title: string; cover: string; src?: string };

// Fill cover + src per track (drop files in /public/tracks/). Without src the
// transport shows but won't play; covers/titles still cycle with next/back.
const TRACKS: Track[] = [
  { title: "False Dreams", cover: "/apple-touch-icon.png" },
  { title: "No Defeat", cover: "/apple-touch-icon.png" },
  { title: "System Shock", cover: "/apple-touch-icon.png" },
  { title: "Bars to Bridges", cover: "/apple-touch-icon.png" },
  { title: "Hollow Shape", cover: "/apple-touch-icon.png" },
];

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
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[index];

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing && track.src) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [playing, index, track.src]);

  const toggle = () => {
    if (!track.src) return; // no audio yet — transport is visible but inert
    setPlaying((p) => !p);
  };
  const next = () => setIndex((i) => (i + 1) % TRACKS.length);
  const prev = () => setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);

  const ctrl = "text-silver/55 hover:text-soft-white transition-colors duration-200";

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-silver/50">&gt;&gt; Now Playing</p>
      <p className="font-display font-bold text-glow-blue text-xl tracking-wide mt-1 line-clamp-1">{track.title}</p>

      <div className="flex items-center gap-3 mt-3">
        <span className="relative w-12 h-12 flex-shrink-0 overflow-hidden border border-white/10">
          <Image key={track.cover} src={track.cover} alt="" fill sizes="48px" className="object-cover" />
        </span>
        <Eq playing={playing} />
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

      <audio ref={audioRef} src={track.src} onEnded={next} preload="none" />
    </div>
  );
}
