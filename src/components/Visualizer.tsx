"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";

/**
 * Audio-reactive spectrum bars, tinted with the current track's hue.
 * Reads live frequency data from the player's Web Audio analyser; falls
 * back to a gentle synthetic pulse if Web Audio isn't available.
 */
export default function Visualizer({ className = "" }: { className?: string }) {
  const { getAnalyser, playing, track } = usePlayer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(track.hue);
  hueRef.current = track.hue;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const BARS = 44;
    const bins = new Uint8Array(1024);
    const levels = new Float32Array(BARS);
    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const analyser = getAnalyser();
      const live = !!analyser && playingRef.current && !reduced;
      if (live) analyser.getByteFrequencyData(bins.subarray(0, analyser.frequencyBinCount));

      const hue = hueRef.current;
      const gap = Math.max(1, (w / BARS) * 0.35);
      const bw = (w - gap * (BARS - 1)) / BARS;

      for (let i = 0; i < BARS; i++) {
        let target: number;
        if (live) {
          // Log-ish mapping over the lower two thirds of the spectrum,
          // where music actually lives.
          const idx = Math.floor(Math.pow(i / BARS, 1.6) * analyser.frequencyBinCount * 0.66);
          target = bins[idx] / 255;
        } else if (playingRef.current && !reduced) {
          target = 0.22 + 0.18 * Math.abs(Math.sin(t * 2 + i * 0.6));
        } else {
          target = 0.1 + 0.05 * Math.sin(i * 0.7);
        }
        // Fast attack, slow decay — keeps the motion musical.
        levels[i] += (target - levels[i]) * (target > levels[i] ? 0.5 : 0.12);
        const v = levels[i];
        const bh = Math.max(dpr, v * h * 0.96);
        const x = i * (bw + gap);
        ctx.fillStyle = `hsla(${hue}, 90%, ${55 + v * 20}%, ${0.35 + v * 0.6})`;
        ctx.shadowColor = `hsla(${hue}, 95%, 60%, ${v * 0.8})`;
        ctx.shadowBlur = 6 * dpr * v;
        ctx.fillRect(x, h - bh, bw, bh);
      }
      ctx.shadowBlur = 0;

      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [getAnalyser]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block ${className}`} />;
}
