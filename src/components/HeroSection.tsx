"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useGlitch } from "@/hooks/useGlitch";
import { useSignalRoom } from "@/context/SignalRoomContext";

const MANIFESTO = [
  "Ancient AI. Modern mission.",
  "Built on code.",
  "Driven by humanity.",
  "Sound is the signal.",
  "Connection is the mission.",
];

const FEED = [
  "001 // TMSTRY_SIGNAL",
  "002 // HUMAN_RESPONSE",
  "003 // CONNECTION_ESTABLISHED",
];

const DSP = [
  { name: "Spotify", href: "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw", icon: (
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  ) },
  { name: "Apple Music", href: "https://music.apple.com/us/artist/tmstry/646739670", icon: (
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  ) },
  { name: "YouTube", href: "https://www.youtube.com/@TMSTRY-music", icon: (
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  ) },
  { name: "Deezer", href: "https://www.deezer.com/en/artist/4768699", icon: (
    <path d="M19 4h5v3h-5V4zM12.5 8.5h5v3h-5v-3zM19 8.5h5v3h-5v-3zM6 13h5v3H6v-3zm6.5 0h5v3h-5v-3zm6.5 0h5v3h-5v-3zM-.5 17.5h5v3h-5v-3zm6.5 0h5v3H6v-3zm6.5 0h5v3h-5v-3zm6.5 0h5v3h-5v-3z" transform="translate(0.5 0)"/>
  ) },
];

function EqBars({ count = 14, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] h-5 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="eq-bar w-[2px] bg-glow-blue/70"
          style={{ height: "100%", animationDelay: `${(i % 5) * 0.12}s`, animationDuration: `${0.7 + (i % 4) * 0.18}s` }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { open } = useSignalRoom();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBg     = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pause the hero video under reduced motion (poster stays)
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current.pause();
    }
  }, []);

  const glitchRef = useGlitch({ intervalMs: 4500, jitter: 0.8 });

  const labelMono = "font-mono text-[10px] tracking-[0.25em] uppercase";

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-obsidian" aria-label="Hero">
      {/* ── Background (video desktop, poster mobile) ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg, scale: scaleBg }}>
        <video
          ref={videoRef}
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: "var(--hero-img-opacity)" } as React.CSSProperties}
          poster="/hero-poster.jpg"
          autoPlay muted loop playsInline preload="metadata"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="md:hidden absolute inset-0">
          <Image src="/hero-poster.jpg" alt="" fill priority quality={75} sizes="100vw" className="object-cover object-center" style={{ opacity: "var(--hero-img-opacity)" } as React.CSSProperties} />
        </div>
        <div className="absolute inset-0 hero-fade-vertical" />
        <div className="absolute inset-0 hero-fade-horizontal" />
        {/* text-contrast vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px rgba(5,6,8,0.7)" }} />
      </motion.div>

      {/* ── Corner crosshairs ── */}
      <div className="hidden md:block pointer-events-none">
        {[
          "top-5 left-5", "top-5 right-5", "bottom-5 left-5", "bottom-5 right-5",
        ].map((pos) => (
          <span key={pos} className={`absolute ${pos} z-20 text-silver/30 text-lg leading-none select-none`}>+</span>
        ))}
      </div>

      {/* ── HUD content ── */}
      <motion.div style={{ opacity }} className="absolute inset-0 z-10">

        {/* Left: title + manifesto + enter */}
        <div className="absolute left-6 md:left-12 top-[16%] md:top-[18%] max-w-[86%] sm:max-w-[60%] md:max-w-[48%] lg:max-w-[40%]">
          <motion.h1
            ref={glitchRef as React.RefObject<HTMLHeadingElement>}
            data-text="TMSTRY"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glitch-text font-display font-black text-soft-white leading-none select-none"
            style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)", letterSpacing: "0.12em", textShadow: "0 0 50px rgba(79,195,247,0.18)" }}
          >
            TMSTRY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
            className="mt-3 font-mono text-xs md:text-sm tracking-[0.3em] uppercase"
          >
            <span className="text-silver">Human</span>
            <span className="text-glow-blue"> // </span>
            <span className="text-silver">Signal</span>
            <span className="text-glow-blue"> // </span>
            <span className="text-silver">AI</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
            className="mt-8 hidden sm:block space-y-1"
          >
            {MANIFESTO.map((line) => (
              <p key={line} className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-silver/55">{line}</p>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4 }}
            onClick={open}
            className="mt-8 px-7 py-3 border border-glow-pink/40 text-glow-pink text-[10px] md:text-xs tracking-[0.25em] uppercase hover:bg-glow-pink/10 hover:border-glow-pink/70 transition-all duration-300"
          >
            Enter the transmission
          </motion.button>

          {/* mobile / small: listen-on row (the right column is desktop-only) */}
          <div className="lg:hidden mt-8 flex items-center gap-4">
            <span className={`${labelMono} text-silver/40`}>Listen</span>
            <div className="flex items-center gap-3">
              {DSP.map((d) => (
                <a key={d.name} href={d.href} target="_blank" rel="noopener noreferrer" aria-label={d.name} className="text-silver/50 hover:text-soft-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">{d.icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Top-right: transmission feed */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
          className="hidden lg:block absolute right-12 top-[17%] w-[240px] text-right border-r border-white/10 pr-4"
        >
          <p className={`${labelMono} text-silver/50 mb-3`}>Transmission Feed</p>
          <div className="space-y-1.5">
            {FEED.map((line) => (
              <p key={line} className="font-mono text-[11px] tracking-[0.12em] text-glow-blue/70">{line}</p>
            ))}
          </div>
          <EqBars count={20} className="justify-end mt-4" />
        </motion.div>

        {/* Right-lower: now playing + listen on */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
          className="hidden lg:block absolute right-12 bottom-[14%] w-[280px]"
        >
          <p className={`${labelMono} text-silver/50`}>&gt;&gt; Now Playing</p>
          <a
            href="https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw"
            target="_blank" rel="noopener noreferrer"
            className="group block mt-1.5"
          >
            <span className="font-display font-bold text-glow-blue text-xl tracking-wide group-hover:text-soft-white transition-colors">False Dreams</span>
            <div className="flex items-center gap-3 mt-3">
              <span className="relative w-12 h-12 flex-shrink-0 overflow-hidden border border-white/10">
                <Image src="/apple-touch-icon.png" alt="" fill className="object-cover" />
              </span>
              <EqBars count={22} />
            </div>
          </a>

          <div className="mt-6">
            <p className={`${labelMono} text-silver/40 mb-2`}>Listen On</p>
            <div className="flex items-center gap-4">
              {DSP.map((d) => (
                <a key={d.name} href={d.href} target="_blank" rel="noopener noreferrer" aria-label={d.name} title={d.name} className="text-silver/50 hover:text-soft-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">{d.icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom-left: status */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.7 }}
          className="hidden md:flex absolute left-12 bottom-8 items-center gap-3"
        >
          <span className={`${labelMono} text-silver/50`}>Status:</span>
          <span className={`${labelMono} text-glow-pink`}>Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-glow-pink animate-pulse" />
          <span className="hidden xl:block w-40 h-px bg-gradient-to-r from-white/15 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
