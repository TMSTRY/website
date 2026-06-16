"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import { useModalChrome } from "@/hooks/useModalChrome";

const photos = [
  { src: "/photos/artistiek.png", alt: "TMSTRY — Artistic", label: "Editorial" },
  { src: "/photos/studio.png",    alt: "TMSTRY — Studio",   label: "Studio"    },
  { src: "/photos/tunnel.png",    alt: "TMSTRY — Tunnel",   label: "Location"  },
  { src: "/photos/studio-2.png",  alt: "TMSTRY — Studio II",label: "Studio II" },
  { src: "/photos/platen.png",    alt: "TMSTRY — Records",  label: "The Craft" },
];

// How each slot looks relative to center (offset = i - current)
const SLOT = {
  0:  { x: "0%",    scale: 1,    blur: 0,  opacity: 1,    zIndex: 10, brightness: 1    },
  1:  { x: "62%",   scale: 0.78, blur: 3,  opacity: 0.65, zIndex: 7,  brightness: 0.7  },
  "-1":{ x: "-62%", scale: 0.78, blur: 3,  opacity: 0.65, zIndex: 7,  brightness: 0.7  },
  2:  { x: "105%",  scale: 0.60, blur: 6,  opacity: 0.35, zIndex: 4,  brightness: 0.5  },
  "-2":{ x: "-105%",scale: 0.60, blur: 6,  opacity: 0.35, zIndex: 4,  brightness: 0.5  },
} as const;

function getSlot(offset: number) {
  const key = Math.max(-2, Math.min(2, offset)).toString();
  return SLOT[key as keyof typeof SLOT] ?? { x: "0%", scale: 0, blur: 8, opacity: 0, zIndex: 0, brightness: 0 };
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useModalChrome(onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-16"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-silver/60 hover:text-soft-white text-xs tracking-widest uppercase transition-colors z-10"
          style={{ letterSpacing: "0.25em" }}
        >
          Close ×
        </button>
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={1400}
          quality={95}
          className="w-full h-auto object-contain"
          style={{ maxHeight: "85vh", filter: "saturate(0.85)" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function PressSection() {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const navigate = (dir: number) => {
    setCurrent((c) => Math.max(0, Math.min(photos.length - 1, c + dir)));
  };

  return (
    <>
      <section id="press" className="py-24 md:py-36 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(79,195,247,0.02) 0%, transparent 65%)" }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

          {/* Header */}
          <FadeInSection className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8" style={{ background: "rgba(200,169,110,0.4)" }} />
              <span className="text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em", color: "rgba(200,169,110,0.8)" }}>
                Press &amp; Photos
              </span>
            </div>
            <h2 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}>
              The Frame
            </h2>
          </FadeInSection>

          {/* Carousel */}
          <FadeInSection delay={0.1}>
            <div
              className="relative flex items-center justify-center select-none"
              style={{ height: "clamp(320px, 45vw, 560px)" }}
            >
              {photos.map((photo, i) => {
                const offset = i - current;
                const slot = getSlot(offset);
                const isCenter = offset === 0;
                const isVisible = Math.abs(offset) <= 2;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={photo.src}
                    className="absolute"
                    style={{
                      width: "clamp(220px, 30vw, 400px)",
                      aspectRatio: "1 / 1",
                      zIndex: slot.zIndex,
                      cursor: isCenter ? "zoom-in" : "pointer",
                    }}
                    animate={{
                      x: slot.x,
                      scale: slot.scale,
                      opacity: slot.opacity,
                      filter: `blur(${slot.blur}px) brightness(${slot.brightness})`,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={isCenter ? { scale: 1.04 } : {}}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) navigate(1);
                      else if (info.offset.x > 40) navigate(-1);
                    }}
                    onClick={() => {
                      if (isCenter) {
                        setLightbox({ src: photo.src, alt: photo.alt });
                      } else {
                        navigate(offset > 0 ? 1 : -1);
                      }
                    }}
                  >
                    {/* Photo — uniform square crop */}
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        quality={90}
                        className="object-cover"
                        style={{ filter: "saturate(0.8)" }}
                        draggable={false}
                      />

                      {/* Hover overlay — center only */}
                      {isCenter && (
                        <div className="absolute inset-0 bg-obsidian/0 hover:bg-obsidian/20 transition-colors duration-500" />
                      )}

                      {/* Label — slides up on hover, center only */}
                      {isCenter && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 hover:opacity-100 hover:translate-y-0 transition-all duration-300">
                          <div className="h-px w-full mb-2" style={{ background: "linear-gradient(90deg, rgba(79,195,247,0.5), transparent)" }} />
                          <p className="text-silver/70 text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
                            {photo.label}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "6px",
                    height: "6px",
                    background: i === current ? "rgba(79,195,247,0.8)" : "rgba(255,255,255,0.15)",
                    borderRadius: "3px",
                  }}
                />
              ))}
            </div>

            {/* Arrow hints */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <button
                onClick={() => navigate(-1)}
                disabled={current === 0}
                className="text-silver/20 hover:text-silver/60 disabled:opacity-10 transition-colors duration-200 text-xs tracking-widest"
                style={{ letterSpacing: "0.2em" }}
              >
                ← prev
              </button>
              <span className="text-silver/15 text-[9px] tracking-widest" style={{ letterSpacing: "0.3em" }}>
                {current + 1} / {photos.length}
              </span>
              <button
                onClick={() => navigate(1)}
                disabled={current === photos.length - 1}
                className="text-silver/20 hover:text-silver/60 disabled:opacity-10 transition-colors duration-200 text-xs tracking-widest"
                style={{ letterSpacing: "0.2em" }}
              >
                next →
              </button>
            </div>
          </FadeInSection>

        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
