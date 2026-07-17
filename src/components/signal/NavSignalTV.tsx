"use client";

import { useEffect, useRef, useState } from "react";
import { useStaticCanvas } from "@/hooks/useStaticCanvas";
import { useSignalRoom } from "@/context/SignalRoomContext";
import type { YTVideo } from "@/app/api/youtube/route";

export default function NavSignalTV() {
  const { open } = useSignalRoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(0.5);
  const [glitch, setGlitch] = useState(false);
  const [flashSrc, setFlashSrc] = useState<string | null>(null);
  const thumbs = useRef<string[]>([]);

  useStaticCanvas(canvasRef, { fps: 10, intensityRef, maxW: 80, maxH: 56 });

  // Pull a few video thumbnails to use as the rare "did I see that?" frame flash
  useEffect(() => {
    let active = true;
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data: YTVideo[]) => {
        if (active && Array.isArray(data)) {
          thumbs.current = data
            .filter((v) => v?.id)
            .map((v) => `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Rare secret frame flash (<500ms), only when motion is allowed
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout>;
    let off: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 14000 + Math.random() * 26000; // 14–40s
      t = setTimeout(() => {
        const list = thumbs.current;
        if (list.length && !document.hidden) {
          setFlashSrc(list[Math.floor(Math.random() * list.length)]);
          off = setTimeout(() => setFlashSrc(null), 180 + Math.random() * 200);
        }
        schedule();
      }, delay);
    };
    schedule();
    return () => { clearTimeout(t); clearTimeout(off); };
  }, []);

  const onEnter = () => {
    intensityRef.current = 1;
    setGlitch(true);
    setTimeout(() => setGlitch(false), 180);
  };
  const onLeave = () => {
    intensityRef.current = 0.5;
  };

  return (
    <button
      onClick={() => open()}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label="Unknown signal"
      title="???"
      className="group relative flex items-center gap-2 cursor-pointer"
    >
      {/* Worn CRT set */}
      <span
        className="crt-bezel relative block crt-flicker"
        style={{
          width: "34px",
          height: "26px",
          padding: "3px",
          borderRadius: "5px",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6), 0 0 10px rgba(79,195,247,0.12)",
          transform: glitch ? "translate(0.5px,-0.5px) skewX(-2deg)" : "rotate(-3deg)",
          transition: "transform 0.15s ease",
        }}
      >
        {/* worn grime */}
        <span className="crt-grime absolute inset-0 pointer-events-none" style={{ borderRadius: "5px" }} />
        {/* Screen */}
        <span className="relative block w-full h-full overflow-hidden" style={{ borderRadius: "2px", background: "#04060a", zIndex: 1 }}>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {/* secret frame flash */}
          {flashSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={flashSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "grayscale(0.4) brightness(0.9) contrast(1.1)", mixBlendMode: "screen" }}
            />
          )}
          <span className="absolute inset-0 crt-scanlines opacity-50" />
          {/* glow + curvature */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)", background: "radial-gradient(ellipse at center, rgba(79,195,247,0.08), transparent 70%)" }}
          />
        </span>
      </span>

      {/* Subtle label */}
      <span
        className="signal-label-flicker text-[8px] font-mono uppercase tracking-[0.25em] text-glow-blue/60 group-hover:text-glow-blue/90 transition-colors hidden sm:inline"
      >
        Signal?
      </span>
    </button>
  );
}
