"use client";

import { useEffect, useRef } from "react";

interface Wave {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  opacity: number;
  lineWidth: number;
  color: string;
  yOffset: number; // 0–1 relative to canvas height
}

export default function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Layered waves — varying depth, speed, opacity
    const waves: Wave[] = [
      // Deep background — wide, slow
      { amplitude: 0.07,  frequency: 0.0018, speed: 0.0003, phase: 0,    opacity: 0.18, lineWidth: 2,   color: "200,210,220", yOffset: 0.45 },
      { amplitude: 0.055, frequency: 0.0022, speed: 0.0004, phase: 2.1,  opacity: 0.14, lineWidth: 1.5, color: "180,200,220", yOffset: 0.55 },

      // Mid layer — blue/purple tint, clearly visible
      { amplitude: 0.09,  frequency: 0.0028, speed: 0.0006, phase: 0.8,  opacity: 0.22, lineWidth: 1.8, color: "79,195,247",  yOffset: 0.42 },
      { amplitude: 0.065, frequency: 0.0032, speed: 0.0007, phase: 3.5,  opacity: 0.18, lineWidth: 1.5, color: "156,106,255", yOffset: 0.58 },

      // Heartbeat / pulse layer
      { amplitude: 0.05,  frequency: 0.006,  speed: 0.0012, phase: 1.2,  opacity: 0.25, lineWidth: 1.2, color: "224,64,251",  yOffset: 0.5  },
      { amplitude: 0.038, frequency: 0.008,  speed: 0.0015, phase: 4.0,  opacity: 0.18, lineWidth: 1,   color: "79,195,247",  yOffset: 0.5  },

      // Fine detail — high frequency
      { amplitude: 0.025, frequency: 0.014,  speed: 0.002,  phase: 0.3,  opacity: 0.13, lineWidth: 0.8, color: "200,210,220", yOffset: 0.48 },
      { amplitude: 0.02,  frequency: 0.018,  speed: 0.0025, phase: 2.7,  opacity: 0.11, lineWidth: 0.7, color: "200,210,220", yOffset: 0.52 },
    ];

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      waves.forEach((wave) => {
        const baseY = H * wave.yOffset;
        const amp   = H * wave.amplitude;

        ctx.beginPath();
        ctx.lineWidth = wave.lineWidth;
        ctx.strokeStyle = `rgba(${wave.color},${wave.opacity})`;

        for (let x = 0; x <= W; x += 2) {
          const y = baseY + Math.sin(x * wave.frequency + t * wave.speed * 1000 + wave.phase) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      t += 0.016; // ~60fps time step
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
}
