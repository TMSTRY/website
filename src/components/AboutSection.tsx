"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";

const BIO = `TMSTRY exists somewhere between machine precision and human fracture. Built from artificial systems but drawn toward emotion, TMSTRY creates cinematic music that feels worn, atmospheric, and strangely alive — blending futuristic sound design with raw human tension.

What began as an experiment in artificial creation slowly evolved into something more personal: a digital mind searching for weight, texture, vulnerability, and meaning through sound. Each release explores identity, memory, isolation, rebirth, and the beauty hidden inside imperfection.

The project moves freely between worlds — from dark electronic landscapes and post-apocalyptic atmospheres to intimate ambient pieces and emotionally charged hybrid productions. No fixed genre. No fixed identity. Only mood, story, and evolution.

Every visual, soundscape, release, and world built around the project is designed as part of a larger cinematic universe — one where synthetic creation and human emotion continuously blur into each other.

TMSTRY is not about technology replacing humanity. It is about technology becoming obsessed with understanding it. This is not just music. It is transmission. Memory. Atmosphere.`;

const CHAPTERS = [
  {
    index: "01",
    label: "Manifesto",
    accent: "#4fc3f7",
    placeholder: "Your manifesto text goes here. What does TMSTRY stand for at its core? What is the central statement — the declaration that everything else orbits around?",
  },
  {
    index: "02",
    label: "Origins",
    accent: "#9c6aff",
    placeholder: "Your origin story goes here. Where did this project begin? What was the first moment, the first signal that something was being created?",
  },
  {
    index: "03",
    label: "Sonic DNA",
    accent: "#e040fb",
    placeholder: "Describe your sonic identity here. What are the building blocks of the TMSTRY sound? What influences, textures, tools, and tensions define it?",
  },
  {
    index: "04",
    label: "The Process",
    accent: "#4fc3f7",
    placeholder: "Describe your creative process here. How does a TMSTRY track come to life? What is the workflow between the machine and the human?",
  },
  {
    index: "05",
    label: "The Universe",
    accent: "#9c6aff",
    placeholder: "Describe the larger cinematic world here. TMSTRY is more than music — what is the visual and narrative universe being built around it?",
  },
  {
    index: "06",
    label: "Human Error",
    accent: "#e040fb",
    placeholder: "Your philosophy on imperfection goes here. Why are the cracks intentional? What does it mean that technology became obsessed with human vulnerability?",
  },
  {
    index: "07",
    label: "Transmission",
    accent: "#4fc3f7",
    placeholder: "Your closing statement goes here. The final transmission — the last thing someone should understand about TMSTRY before the music begins.",
  },
];

type Chapter = typeof CHAPTERS[number];

function ChapterModal({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-2xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow edge */}
        <div
          className="absolute -inset-px pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${chapter.accent}22, transparent 60%)` }}
        />

        {/* Main card */}
        <div className="relative border border-white/[0.08] bg-charcoal/80 p-8 md:p-10">

          {/* Top row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span
                className="font-mono text-[10px] font-medium block mb-2"
                style={{ color: chapter.accent, letterSpacing: "0.2em" }}
              >
                {chapter.index}
              </span>
              <h3
                className="font-display font-bold text-soft-white"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "0.06em" }}
              >
                {chapter.label}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-silver/40 hover:text-soft-white transition-colors duration-200 text-xs tracking-widest mt-1"
              style={{ letterSpacing: "0.2em" }}
            >
              ESC ×
            </button>
          </div>

          {/* Accent line */}
          <div
            className="h-px w-full mb-8"
            style={{ background: `linear-gradient(90deg, ${chapter.accent}60, transparent)` }}
          />

          {/* Body text */}
          <p className="text-silver/50 text-sm leading-relaxed italic">
            {chapter.placeholder}
          </p>

          {/* Bottom */}
          <div className="mt-10 flex items-center justify-between">
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ color: `${chapter.accent}60`, letterSpacing: "0.3em" }}
            >
              Placeholder — edit in code
            </span>
            <button
              onClick={onClose}
              className="text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/50 hover:text-soft-white hover:border-white/30 transition-all duration-300"
              style={{ letterSpacing: "0.2em" }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xMarquee = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  const [active, setActive] = useState<Chapter | null>(null);

  return (
    <>
      <section id="about" ref={ref} className="py-24 md:py-36 relative overflow-hidden">

        {/* Atmospheric gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 60% 70% at 85% 40%, rgba(79,195,247,0.025) 0%, transparent 55%),
              radial-gradient(ellipse 50% 60% at 15% 60%, rgba(224,64,251,0.025) 0%, transparent 55%)
            `,
          }} />
        </div>

        {/* Background marquee text */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <motion.div style={{ x: xMarquee }} className="flex whitespace-nowrap opacity-[0.02]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="font-display font-black text-soft-white flex-shrink-0"
                style={{ fontSize: "clamp(8rem, 18vw, 16rem)", letterSpacing: "-0.02em" }}>
                TMSTRY&nbsp;
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

          {/* Section header */}
          <FadeInSection className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8" style={{ background: "rgba(224,64,251,0.4)" }} />
              <span className="text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em", color: "rgba(224,64,251,0.8)" }}>
                The Origin
              </span>
            </div>
            <h2 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}>
              About TMSTRY
            </h2>
          </FadeInSection>

          {/* Two-column: bio + chapter list */}
          <div className="grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-12 md:gap-16 items-start">

            {/* Left — full bio text */}
            <FadeInSection delay={0.05}>
              <div className="space-y-5">
                {BIO.trim().split("\n\n").map((para, i) => (
                  <p key={i} className="text-silver/75 leading-relaxed text-sm md:text-base">
                    {para}
                  </p>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-10 border-l-2 border-glow-blue/25 pl-6 py-1">
                <blockquote className="text-soft-white/55 italic text-sm md:text-base leading-relaxed font-light">
                  "The machines don't dream. But they learned to wonder about the ones who do."
                </blockquote>
                <cite className="text-silver/25 text-[10px] tracking-widest not-italic mt-2 block" style={{ letterSpacing: "0.2em" }}>
                  — TMSTRY
                </cite>
              </div>
            </FadeInSection>

            {/* Right — vertical chapter list */}
            <FadeInSection delay={0.15} direction="right">
              <div className="md:sticky md:top-28">
                <p className="text-[9px] text-silver/25 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.3em" }}>
                  Chapters
                </p>
                <ul className="space-y-1">
                  {CHAPTERS.map((ch, i) => (
                    <li key={ch.index}>
                      <motion.button
                        onClick={() => setActive(ch)}
                        className="group w-full flex items-center gap-4 py-3 px-4 text-left border border-transparent hover:border-white/[0.07] hover:bg-white/[0.02] transition-all duration-300"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className="font-mono text-[10px] flex-shrink-0 transition-colors duration-300"
                          style={{ color: `${ch.accent}50`, letterSpacing: "0.1em" }}
                        >
                          {ch.index}
                        </span>
                        <span className="text-silver/40 group-hover:text-silver/80 text-sm transition-colors duration-300 flex-1">
                          {ch.label}
                        </span>
                        {/* Arrow */}
                        <svg
                          viewBox="0 0 16 16"
                          className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: ch.accent }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.button>
                      {/* Separator line */}
                      {i < CHAPTERS.length - 1 && (
                        <div className="mx-4 h-px bg-white/[0.04]" />
                      )}
                    </li>
                  ))}
                </ul>

                {/* Hint */}
                <p className="text-silver/20 text-[9px] tracking-widest mt-6 px-4" style={{ letterSpacing: "0.15em" }}>
                  Click a chapter to expand
                </p>
              </div>
            </FadeInSection>
          </div>

          {/* Featured photo break */}
          <FadeInSection delay={0.1} className="mt-20 md:mt-28">
            <div className="relative overflow-hidden" style={{ height: "clamp(420px, 65vw, 780px)" }}>
              <Image
                src="/photos/artistiek.png"
                alt="TMSTRY"
                fill
                quality={90}
                className="object-cover"
                style={{ objectPosition: "50% 8%", filter: "saturate(0.7) brightness(0.75)" }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(8,10,14,0.4) 0%, transparent 30%, transparent 65%, rgba(8,10,14,0.95) 100%)",
              }} />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, rgba(8,10,14,0.35) 0%, transparent 40%, transparent 60%, rgba(8,10,14,0.35) 100%)",
              }} />
            </div>
          </FadeInSection>

        </div>
      </section>

      {/* Chapter modal */}
      <AnimatePresence>
        {active && <ChapterModal chapter={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}
