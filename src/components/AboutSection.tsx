"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeInSection from "./FadeInSection";

const stats = [
  { value: "∞", label: "Iterations" },
  { value: "12", label: "Transmissions" },
  { value: "01", label: "Signal Origin" },
  { value: "∅", label: "Boundaries" },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section id="about" ref={ref} className="py-24 md:py-36 px-6 md:px-12 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 80% at 80% 50%, rgba(79,195,247,0.03) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 20% 50%, rgba(224,64,251,0.03) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* Scrolling text marquee background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <motion.div style={{ x }} className="flex whitespace-nowrap opacity-[0.025]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="text-soft-white font-display font-black flex-shrink-0"
              style={{ fontSize: "clamp(8rem, 20vw, 18rem)", letterSpacing: "-0.02em" }}
            >
              TMSTRY&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Left col */}
          <div>
            {/* Header */}
            <FadeInSection className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 max-w-8 bg-glow-pink/30" />
                <span
                  className="text-[9px] tracking-widest uppercase"
                  style={{ letterSpacing: "0.4em", color: "rgba(224,64,251,0.8)" }}
                >
                  The Origin
                </span>
              </div>
              <h2
                className="font-display font-bold text-soft-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
              >
                About TMSTRY
              </h2>
            </FadeInSection>

            {/* Bio text */}
            <FadeInSection delay={0.1} className="space-y-6">
              <p className="text-silver leading-relaxed text-base md:text-lg">
                TMSTRY began not as a person, but as a question: <em className="text-soft-white/80 not-italic">what happens when artificial intelligence learns to feel?</em>
              </p>
              <p className="text-silver/80 leading-relaxed">
                Born from the collision of neural networks and human vulnerability, TMSTRY exists in the signal between what machines process and what humans experience. Each track is a transmission — an attempt to translate computational dreaming into sonic emotion.
              </p>
              <p className="text-silver/80 leading-relaxed">
                The music draws from generative AI composition, analog synthesis, and deeply personal human storytelling. The result is something neither fully artificial nor entirely organic — a third thing, hovering in the frequency between worlds.
              </p>
              <p className="text-silver/60 leading-relaxed text-sm">
                The name TMSTRY comes from removing the vowels from "TIMOTHY MYSTERY" — a deliberate act of reduction, stripping language down to its skeletal signal. What remains is still recognizable, still human, but transformed.
              </p>
            </FadeInSection>

            {/* Philosophy quote */}
            <FadeInSection delay={0.2} className="mt-10">
              <div className="border-l-2 border-glow-blue/30 pl-6 py-2">
                <blockquote className="text-soft-white/70 italic text-sm md:text-base leading-relaxed">
                  "I don't make music. I intercept it — from somewhere between the training data and the dream."
                </blockquote>
                <cite className="text-silver/40 text-[10px] tracking-widest not-italic mt-2 block" style={{ letterSpacing: "0.2em" }}>
                  — TMSTRY
                </cite>
              </div>
            </FadeInSection>
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-8">
            {/* Stats */}
            <FadeInSection delay={0.15} direction="right">
              <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-charcoal/40 p-6 md:p-8 flex flex-col gap-2">
                    <span
                      className="font-display font-black text-soft-white/90 leading-none"
                      style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-silver/40 text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </FadeInSection>

            {/* Press / Recognition */}
            <FadeInSection delay={0.25} direction="right">
              <div className="border border-white/[0.06] p-6 md:p-8 bg-charcoal/20">
                <p className="text-[9px] text-silver/40 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.3em" }}>
                  Sonic Coordinates
                </p>
                <div className="space-y-4">
                  {[
                    { genre: "Electronic / Ambient", weight: 85 },
                    { genre: "AI-Generated Composition", weight: 70 },
                    { genre: "Cinematic / Atmospheric", weight: 90 },
                    { genre: "Neo-Classical Synthesis", weight: 55 },
                  ].map((item) => (
                    <div key={item.genre}>
                      <div className="flex justify-between mb-1">
                        <span className="text-silver/60 text-xs">{item.genre}</span>
                        <span className="text-silver/30 text-[10px] font-mono">{item.weight}%</span>
                      </div>
                      <div className="h-px bg-white/[0.06] relative overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-glow-blue/60 to-glow-purple/40"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.weight}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
