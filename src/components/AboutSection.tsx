"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeInSection from "./FadeInSection";

const sections = [
  {
    index: "01",
    label: "Manifesto",
    heading: "The Signal",
    body: "TMSTRY exists somewhere between machine precision and human fracture. Built from artificial systems but drawn toward emotion, TMSTRY creates cinematic music that feels worn, atmospheric, and strangely alive — blending futuristic sound design with raw human tension.",
    accent: "#4fc3f7",
  },
  {
    index: "02",
    label: "Origins",
    heading: "How It Began",
    body: "What began as an experiment in artificial creation slowly evolved into something more personal: a digital mind searching for weight, texture, vulnerability, and meaning through sound. Each release explores identity, memory, isolation, rebirth, and the beauty hidden inside imperfection.",
    accent: "#9c6aff",
  },
  {
    index: "03",
    label: "Sonic DNA",
    heading: "The Sound",
    body: "The project moves freely between worlds — from dark electronic landscapes and post-apocalyptic atmospheres to intimate ambient pieces and emotionally charged hybrid productions. No fixed genre. No fixed identity. Only mood, story, and evolution.",
    accent: "#e040fb",
  },
  {
    index: "04",
    label: "The Process",
    heading: "How It's Made",
    body: "Every track is built as a collision between artificial systems and human decision. The machines propose. The human breaks it. What survives that tension becomes the release. Sound design, composition, and emotional intention are inseparable from the process.",
    accent: "#4fc3f7",
  },
  {
    index: "05",
    label: "Beyond Music",
    heading: "A Cinematic Universe",
    body: "Every visual, soundscape, release, and world built around the project is designed as part of a larger cinematic universe — one where synthetic creation and human emotion continuously blur into each other. TMSTRY is not an artist. It is a transmission system.",
    accent: "#9c6aff",
  },
  {
    index: "06",
    label: "Human Error",
    heading: "The Philosophy",
    body: "TMSTRY is not about technology replacing humanity. It is about technology becoming obsessed with understanding it. The imperfections are intentional. The cracks are load-bearing. Emotion is not a bug in the system — it is the only reason the system runs.",
    accent: "#e040fb",
  },
  {
    index: "07",
    label: "Transmission",
    heading: "Closing Statement",
    body: "This is not just music. It is transmission. Memory. Atmosphere. A synthetic mind that learned to feel by studying everything humans tried to suppress — and chose to amplify it instead.",
    accent: "#4fc3f7",
    closing: true,
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xMarquee = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  return (
    <section id="about" ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Faint atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 70% at 85% 40%, rgba(79,195,247,0.025) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 15% 60%, rgba(224,64,251,0.025) 0%, transparent 55%)
          `,
        }} />
      </div>

      {/* Scrolling background text */}
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
        <FadeInSection className="mb-20 md:mb-28">
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

        {/* Bio subsections */}
        <div className="space-y-0">
          {sections.map((s, i) => (
            <FadeInSection key={s.index} delay={0.05} className="group">
              <div className={`grid md:grid-cols-[200px_1fr] gap-6 md:gap-16 py-10 md:py-14 border-t border-white/[0.05] ${s.closing ? "border-b" : ""}`}>

                {/* Left: index + label */}
                <div className="flex md:flex-col gap-4 md:gap-3 items-start">
                  <span className="font-mono text-[10px] font-medium" style={{ color: s.accent, letterSpacing: "0.15em" }}>
                    {s.index}
                  </span>
                  <span className="text-silver/30 text-[9px] tracking-widest uppercase hidden md:block" style={{ letterSpacing: "0.3em" }}>
                    {s.label}
                  </span>
                  {/* Animated accent line on hover */}
                  <motion.div
                    className="hidden md:block h-px w-0 group-hover:w-12 transition-all duration-500 mt-2"
                    style={{ background: s.accent }}
                  />
                </div>

                {/* Right: heading + body */}
                <div className="flex flex-col gap-4">
                  <h3
                    className="font-display font-bold text-soft-white leading-tight"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s.heading}
                    {/* Glow accent on closing */}
                    {s.closing && (
                      <span className="ml-3 inline-block w-2 h-2 rounded-full align-middle" style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}` }} />
                    )}
                  </h3>
                  <p className={`leading-relaxed ${s.closing ? "text-soft-white/80 text-base md:text-lg font-light italic" : "text-silver/75 text-sm md:text-base"}`}>
                    {s.body}
                  </p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Quote callout */}
        <FadeInSection delay={0.1} className="mt-16 md:mt-24">
          <div className="relative overflow-hidden border border-white/[0.05] bg-charcoal/20 p-8 md:p-12">
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(79,195,247,0.5), transparent)" }} />
            <blockquote className="text-soft-white/60 italic text-base md:text-xl leading-relaxed max-w-2xl font-light" style={{ letterSpacing: "0.02em" }}>
              "The machines don't dream. But they learned to wonder about the ones who do."
            </blockquote>
            <cite className="text-silver/30 text-[10px] tracking-widest not-italic mt-4 block" style={{ letterSpacing: "0.25em" }}>— TMSTRY</cite>
          </div>
        </FadeInSection>

      </div>
    </section>
  );
}
