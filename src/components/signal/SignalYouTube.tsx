"use client";

import { useEffect, useRef } from "react";

interface YTPlayer {
  playVideo(): void;
  mute(): void;
  unMute(): void;
  setVolume(v: number): void;
  loadVideoById(opts: { videoId: string; startSeconds?: number; endSeconds?: number }): void;
  destroy(): void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYTApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * YouTube player via the IFrame API. Always autoplays MUTED (reliable, never
 * shows the play-button overlay), then unmutes once playing if audio is on.
 */
export default function SignalYouTube({
  videoId,
  start,
  duration,
  muted,
}: {
  videoId: string;
  start: number;
  duration?: number;
  muted: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Create the player once
  useEffect(() => {
    let cancelled = false;
    loadYTApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, start: Math.round(start),
          ...(duration ? { end: Math.round(start + duration) } : {}),
          modestbranding: 1, rel: 0, playsinline: 1, disablekb: 1, fs: 0, iv_load_policy: 3,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            readyRef.current = true;
            e.target.playVideo();
            if (!mutedRef.current) { e.target.unMute(); e.target.setVolume(60); }
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === window.YT?.PlayerState.PLAYING && !mutedRef.current) {
              e.target.unMute();
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
      playerRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load a new snippet without rebuilding the iframe
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    playerRef.current.loadVideoById({
      videoId,
      startSeconds: Math.round(start),
      endSeconds: duration ? Math.round(start + duration) : undefined,
    });
  }, [videoId, start, duration]);

  // React to the audio toggle
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    if (muted) p.mute();
    else { p.unMute(); p.setVolume(60); }
  }, [muted]);

  return <div ref={hostRef} className="absolute inset-0 w-full h-full" />;
}
