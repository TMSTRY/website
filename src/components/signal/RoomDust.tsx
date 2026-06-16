"use client";

import { useEffect, useRef } from "react";

/** Slow drifting dust motes for the Signal Room (desktop, perf-guarded). */
export default function RoomDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0, running = true;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: 48 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(Math.random() * 0.12 + 0.02),
      o: Math.random() * 0.25 + 0.04,
    }));

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.y < -5) { m.y = H + 5; m.x = Math.random() * W; }
        if (m.x < -5) m.x = W + 5; else if (m.x > W + 5) m.x = -5;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,205,215,${m.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(draw); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
