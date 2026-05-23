"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ParticleField from "./ParticleField";
import WaveformCanvas from "./WaveformCanvas";
import { useGlitch } from "@/hooks/useGlitch";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBg     = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const yText   = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Glitch ref — cast to any so we can attach to motion.h1
  const glitchRef = useGlitch({ intervalMs: 4500, jitter: 0.8 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian"
      aria-label="Hero"
    >
      {/* ── Layer 1: Cinematic background photo ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg, scale: scaleBg }}
      >
        <Image
          src="/hero-website.png"
          alt=""
          fill
          priority
          quality={95}
          className="object-cover object-center"
          style={{ opacity: "var(--hero-img-opacity)" } as React.CSSProperties}
        />
        {/* Top/bottom fade — uses CSS var so it adapts to light/dark theme */}
        <div className="absolute inset-0 hero-fade-vertical" />
        {/* Side fades */}
        <div className="absolute inset-0 hero-fade-horizontal" />
      </motion.div>

      {/* ── Layer 2: Subtle grid ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,195,247,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,195,247,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Layer 3: Waveform canvas ── */}
      {mounted && <WaveformCanvas />}

      {/* ── Layer 4: Particle field ── */}
      {mounted && <ParticleField />}

      {/* ── Layer 5: Ambient glow orbs ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "800px", height: "800px",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(79,195,247,0.03) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "1100px", height: "1100px",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(224,64,251,0.018) 0%, transparent 60%)",
          }}
          animate={{ scale: [1.04, 1, 1.04] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Layer 6: Text content ── */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="h-px w-8 opacity-50" style={{ background: "#4fc3f7" }} />
          <span
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ letterSpacing: "0.4em", color: "#4fc3f7" }}
          >
            Human // Signal // AI
          </span>
          <div className="h-px w-8 opacity-50" style={{ background: "#4fc3f7" }} />
        </motion.div>

        {/* ── TMSTRY title with glitch effect ── */}
        <motion.h1
          ref={glitchRef as React.RefObject<HTMLHeadingElement>}
          data-text="TMSTRY"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glitch-text font-display font-black text-soft-white leading-none mb-6 relative select-none"
          style={{
            fontSize: "clamp(3.5rem, 16vw, 12rem)",
            letterSpacing: "0.1em",
            textShadow: "0 0 60px rgba(79,195,247,0.18), 0 0 160px rgba(156,106,255,0.08)",
          }}
        >
          TMSTRY
          {/* Underline reveal */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(79,195,247,0.5), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: 1.6 }}
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-silver text-sm md:text-base max-w-sm leading-relaxed"
          style={{ letterSpacing: "0.06em" }}
        >
          Human emotion through artificial minds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => document.querySelector("#music")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 border border-glow-blue/40 text-glow-blue text-xs tracking-widest uppercase hover:bg-glow-blue/10 hover:border-glow-blue/70 transition-all duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            Listen Now
          </button>
          <button
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 border border-white/10 text-silver text-xs tracking-widest uppercase hover:border-white/30 hover:text-soft-white transition-all duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            Discover
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-silver/30 text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-silver/30 to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
