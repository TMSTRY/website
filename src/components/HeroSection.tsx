"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "./ParticleField";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Atmospheric gradient background */}
      <div className="absolute inset-0 bg-obsidian">
        {/* Deep radial gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 40%, rgba(79,195,247,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(224,64,251,0.04) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 80% 20%, rgba(156,106,255,0.04) 0%, transparent 50%)
            `,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(79,195,247,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79,195,247,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Particles */}
      {mounted && <ParticleField />}

      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "600px",
            height: "600px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(79,195,247,0.04) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "900px",
            height: "900px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(156,106,255,0.025) 0%, transparent 60%)",
          }}
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main hero content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-glow-blue opacity-60" />
          <span
            className="text-glow-blue text-[10px] tracking-widest uppercase font-medium"
            style={{ letterSpacing: "0.4em" }}
          >
            Human // Signal // AI
          </span>
          <div className="h-px w-8 bg-glow-blue opacity-60" />
        </motion.div>

        {/* Logo / Artist name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-soft-white leading-none mb-8 relative"
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            letterSpacing: "0.08em",
            textShadow: "0 0 80px rgba(79,195,247,0.15), 0 0 160px rgba(156,106,255,0.1)",
          }}
        >
          TMSTRY
          {/* Subtle underline glow */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(79,195,247,0.4), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-silver text-sm md:text-base lg:text-lg max-w-md leading-relaxed"
          style={{ letterSpacing: "0.06em" }}
        >
          Human emotion through artificial minds.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
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
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-silver/40 text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
            Scroll
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-silver/30 to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
