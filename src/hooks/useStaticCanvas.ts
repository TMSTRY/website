"use client";

import { useEffect, type RefObject } from "react";

interface Opts {
  /** frames per second (throttled for perf) */
  fps?: number;
  /** live intensity (0..1) — pass a ref so hover can change it without re-running */
  intensityRef?: RefObject<number>;
  /** multiplier applied on top of intensityRef */
  baseIntensity?: number;
  /** max internal render resolution (keeps it cheap; CSS upscales = chunky CRT) */
  maxW?: number;
  maxH?: number;
}

/**
 * Renders animated TV static into a canvas with a faint blue/purple tint.
 * Throttled, paused while the tab is hidden, and static (single frame) under
 * prefers-reduced-motion. Shared by the nav TV, the Signal Room and transitions.
 */
export function useStaticCanvas(ref: RefObject<HTMLCanvasElement | null>, opts: Opts = {}) {
  const { fps = 14, intensityRef, baseIntensity = 1, maxW = 480, maxH = 300 } = opts;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img: ImageData;

    const resize = () => {
      const w = Math.max(2, Math.min(canvas.clientWidth || maxW, maxW));
      const h = Math.max(2, Math.min(canvas.clientHeight || maxH, maxH));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const data = img.data;
      const intensity = Math.min(1, (intensityRef?.current ?? 1) * baseIntensity);
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v * 0.72;                    // r
        data[i + 1] = v * 0.82;                // g
        data[i + 2] = Math.min(255, v + 22);   // b — slight blue lift
        data[i + 3] = 255 * intensity;
      }
      ctx.putImageData(img, 0, 0);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw();
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let running = true;
    const interval = 1000 / fps;

    const loop = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (t - last < interval) return;
      last = t;
      draw();
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, fps, intensityRef, baseIntensity, maxW, maxH]);
}
