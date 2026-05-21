"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";

const photos = [
  { src: "/photos/artistiek.png", alt: "TMSTRY — Artistic", label: "Editorial" },
  { src: "/photos/studio.png",    alt: "TMSTRY — Studio",   label: "Studio" },
  { src: "/photos/tunnel.png",    alt: "TMSTRY — Tunnel",   label: "Location" },
  { src: "/photos/studio-2.png",  alt: "TMSTRY — Studio II",label: "Studio II" },
  { src: "/photos/platen.png",    alt: "TMSTRY — Records",  label: "The Craft" },
];

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
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
        className="relative max-w-5xl w-full"
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

export default function PressSection() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <section id="press" className="py-24 md:py-36 px-6 md:px-12 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(79,195,247,0.02) 0%, transparent 65%)" }}
        />

        <div className="max-w-7xl mx-auto relative">

          {/* Header */}
          <FadeInSection className="mb-16 md:mb-20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-8" style={{ background: "rgba(200,169,110,0.4)" }} />
                  <span className="text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em", color: "rgba(200,169,110,0.8)" }}>
                    Press & Photos
                  </span>
                </div>
                <h2 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}>
                  The Frame
                </h2>
              </div>
              <p className="text-silver/30 text-[10px] tracking-widest uppercase self-end pb-1" style={{ letterSpacing: "0.2em" }}>
                Click to enlarge
              </p>
            </div>
          </FadeInSection>

          {/* Masonry-style columns — photos shown at natural height, no cropping */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <FadeInSection key={photo.src} delay={i * 0.07} className="break-inside-avoid">
                <motion.button
                  onClick={() => setLightbox({ src: photo.src, alt: photo.alt })}
                  className="group relative w-full overflow-hidden block"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Natural aspect ratio — no cropping */}
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={800}
                    height={800}
                    quality={85}
                    className="w-full h-auto block"
                    style={{ filter: "saturate(0.75) brightness(0.82)" }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/25 transition-colors duration-500" />

                  {/* Label — slides up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="h-px w-full mb-2" style={{ background: "linear-gradient(90deg, rgba(79,195,247,0.5), transparent)" }} />
                    <p className="text-silver/70 text-[9px] tracking-widest uppercase text-left" style={{ letterSpacing: "0.3em" }}>
                      {photo.label}
                    </p>
                  </div>

                  {/* Fullscreen icon */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-7 h-7 border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-white/60" strokeWidth={1.5}>
                        <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Border glow */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-white/10 transition-colors duration-500" />
                </motion.button>
              </FadeInSection>
            ))}
          </div>

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
