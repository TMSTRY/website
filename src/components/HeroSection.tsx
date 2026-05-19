"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ParticleField from "./ParticleField";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax layers at different speeds
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const yAvatar = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian"
      aria-label="Hero"
    >
      {/* ── Layer 1: background banner image with parallax ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg, scale: scaleBg }}
      >
        <Image
          src="/branding.png"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          style={{ opacity: 0.18 }}
        />
        {/* Dark vignette over the image */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(8,10,14,0.7) 70%, rgba(8,10,14,0.95) 100%),
              linear-gradient(to bottom, rgba(8,10,14,0.4) 0%, transparent 20%, transparent 70%, rgba(8,10,14,1) 100%)
            `,
          }}
        />
      </motion.div>

      {/* ── Layer 2: subtle grid ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,195,247,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,195,247,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Layer 3: particles ── */}
      {mounted && <ParticleField />}

      {/* ── Layer 4: avatar image — centred, parallax, faded ── */}
      <motion.div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
        style={{ y: yAvatar, opacity: opacityHero }}
      >
        <motion.div
          className="relative"
          style={{ width: "min(560px, 80vw)", aspectRatio: "1 / 1" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/mini-avatar-1.png"
            alt="TMSTRY"
            fill
            priority
            quality={90}
            className="object-contain"
            style={{ opacity: 0.55, mixBlendMode: "screen" }}
          />
          {/* Soft bloom underneath the image */}
          <div
            className="absolute inset-0 -z-10 blur-3xl scale-75"
            style={{
              background: "radial-gradient(ellipse at center, rgba(79,195,247,0.12) 0%, rgba(224,64,251,0.08) 50%, transparent 80%)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── Layer 5: animated ambient orbs ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "700px", height: "700px",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(79,195,247,0.035) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "1000px", height: "1000px",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(224,64,251,0.02) 0%, transparent 60%)",
          }}
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Layer 6: text content ── */}
      <motion.div
        style={{ y: yText, opacity: opacityHero }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-glow-blue opacity-50" />
          <span
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ letterSpacing: "0.4em", color: "#4fc3f7" }}
          >
            Human // Signal // AI
          </span>
          <div className="h-px w-8 bg-glow-blue opacity-50" />
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-soft-white leading-none mb-8 relative"
          style={{
            fontSize: "clamp(4.5rem, 20vw, 15rem)",
            letterSpacing: "0.1em",
            textShadow: `
              0 0 40px rgba(79,195,247,0.2),
              0 0 100px rgba(79,195,247,0.08),
              0 0 200px rgba(156,106,255,0.06)
            `,
          }}
        >
          TMSTRY
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(79,195,247,0.5), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: 1.4 }}
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-silver text-sm md:text-base lg:text-lg max-w-sm leading-relaxed"
          style={{ letterSpacing: "0.06em" }}
        >
          Human emotion through artificial minds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
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
          transition={{ duration: 1, delay: 2 }}
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
