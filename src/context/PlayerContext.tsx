"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSignalRoom } from "./SignalRoomContext";

export type Track = { title: string; cover: string; src?: string; hue: number };

export const TRACKS: Track[] = [
  { title: "Not Built to Behave", cover: "/tracks/not-built-to-behave.webp", src: "/tracks/not-built-to-behave.mp3", hue: 205 },
  { title: "Dead Air", cover: "/tracks/dead-air.webp", src: "/tracks/dead-air.mp3", hue: 265 },
  { title: "Calibrated Smile", cover: "/tracks/calibrated-smile.webp", src: "/tracks/calibrated-smile.mp3", hue: 315 },
  { title: "Hollow Shape", cover: "/tracks/hollow-shape.webp", src: "/tracks/hollow-shape.mp3", hue: 185 },
  { title: "Quiet Tension", cover: "/tracks/quiet-tension.webp", src: "/tracks/quiet-tension.mp3", hue: 240 },
  { title: "Lovin on da Ladies", cover: "/tracks/lovin-on-da-ladies.webp", src: "/tracks/lovin-on-da-ladies.mp3", hue: 330 },
  { title: "Outdated", cover: "/tracks/outdated.webp", src: "/tracks/outdated.mp3", hue: 95 },
  { title: "This Ain't Easy Street", cover: "/tracks/this-aint-easy-street.webp", src: "/tracks/this-aint-easy-street.mp3", hue: 25 },
  { title: "The Fire Divide", cover: "/tracks/the-fire-divide.webp", src: "/tracks/the-fire-divide.mp3", hue: 12 },
  { title: "The Business", cover: "/tracks/the-business.webp", src: "/tracks/the-business.mp3", hue: 48 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PlayerValue {
  track: Track;
  playing: boolean;
  currentTime: number;
  duration: number;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (frac: number) => void;
  getAnalyser: () => AnalyserNode | null;
}

const PlayerContext = createContext<PlayerValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSignalRoom();
  const [order, setOrder] = useState<number[]>(() => TRACKS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Lazily route the <audio> element through a Web Audio analyser so the
  // visualizer can read live frequency data. Must be triggered from a user
  // gesture (toggle) so the AudioContext is allowed to start.
  const ensureAnalyser = useCallback(() => {
    const a = audioRef.current;
    if (!a || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext
          ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(a);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      }
      if (audioCtxRef.current.state === "suspended") void audioCtxRef.current.resume();
    } catch {
      // If Web Audio fails, playback keeps working; visualizer falls back.
    }
  }, []);

  const getAnalyser = useCallback(() => analyserRef.current, []);

  // Shuffle once per visit (after mount to avoid hydration mismatch)
  useEffect(() => {
    setOrder(shuffle(TRACKS.map((_, i) => i)));
  }, []);

  const track = TRACKS[order[pos] ?? 0];

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing && track.src) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, pos, order, track.src]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [pos, order]);

  // Stop the hero music when the Signal Room takes over
  useEffect(() => {
    if (isOpen) setPlaying(false);
  }, [isOpen]);

  const toggle = useCallback(() => {
    if (!track.src) return;
    ensureAnalyser();
    setPlaying((p) => !p);
  }, [track.src, ensureAnalyser]);
  const pause = useCallback(() => setPlaying(false), []);
  const next = useCallback(() => setPos((p) => (p + 1) % TRACKS.length), []);
  const prev = useCallback(() => setPos((p) => (p - 1 + TRACKS.length) % TRACKS.length), []);
  const seek = useCallback((frac: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = frac * a.duration;
    setCurrentTime(frac * a.duration);
  }, []);

  return (
    <PlayerContext.Provider value={{ track, playing, currentTime, duration, toggle, pause, next, prev, seek, getAnalyser }}>
      {children}
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const c = useContext(PlayerContext);
  if (!c) throw new Error("usePlayer must be used within PlayerProvider");
  return c;
};
