"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";
import { useModalChrome } from "@/hooks/useModalChrome";

const BIO = `TMSTRY is not a genre. Not a sound. Not a brand.

It is thirty years of rhythm, melody, and restlessness, built by human hands and driven by something harder to name. From drumlines and vinyl to DAWs and cinematic soundscapes, every release is a transmission from somewhere between memory and machine.

No fixed identity. Just everything that ever refused to stay quiet.`;

// ─── Quote entries for "In Their Words" ───────────────────────────────────────
type QuoteEntry = {
  text: string;
  name: string;
  role: string;
  sig: {
    fontClass: string;   // tailwind font utility
    spacing: string;     // letter-spacing
    weight: string;      // font-weight
    upper: boolean;
    italic: boolean;
    size: string;        // font-size
  };
};

const QUOTES: QuoteEntry[] = [
  {
    text: "TMSTRY builds atmosphere like abandoned cinema.",
    name: "Ash Johansen",
    role: "Filmmaker / Visual Director",
    sig: {
      fontClass: "font-mono",
      spacing: "0.32em",
      weight: "300",
      upper: true,
      italic: false,
      size: "0.58rem",
    },
  },
  {
    text: "Synthetic aesthetics with an unexpectedly human center.",
    name: "Creator Name",
    role: "Visual Artist",
    sig: {
      fontClass: "font-display",
      spacing: "0.07em",
      weight: "200",
      upper: false,
      italic: true,
      size: "0.72rem",
    },
  },
  {
    text: "Not songs. Environments.",
    name: "Sound Designer",
    role: "Producer",
    sig: {
      fontClass: "font-display",
      spacing: "0.18em",
      weight: "500",
      upper: true,
      italic: false,
      size: "0.55rem",
    },
  },
];

// ─── Chapters ─────────────────────────────────────────────────────────────────
type Chapter = {
  index: string;
  label: string;
  accent: string;
  placeholder?: string;
  quotes?: QuoteEntry[];
  photo?: { src: string; caption?: string; rotate?: string };
};

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    label: "Manifesto",
    accent: "#4fc3f7",
    placeholder: `TMSTRY is not a genre. Not a sound. Not a brand.

Somewhere between a drumline at 14 and a DAW at 3am, it was born. Not from a plan. From an obsession. Thirty years of rhythm, melody, and restlessness, finally out in the open.

This is not background music. This is not content.
This is what happens when a mind full of sound finally finds a way out.

No fixed genre. No fixed identity. Just everything that ever refused to stay quiet.`,
  },
  {
    index: "02",
    label: "Origins",
    accent: "#9c6aff",
    photo: { src: "/photos/1.jpg", caption: "Behind the decks", rotate: "-2deg" },
    placeholder: `It started with four toms around a neck and a lot of noise.

At 14, joining a drumband taught me something no music theory class ever could: how rhythm lives in the body before it reaches the brain. Marching, performing, feeling the beat as something physical. That was the foundation.

A few years later, the clubs. Urban venues along the Belgian coast and back home, playing R&B, hip-hop, dancehall, reggaeton, old school and new jack swing. Still on vinyl. Still diggin. I was the DJ who played what nobody had heard yet, tracks that would become hits a year later, while the crowd stood there confused. That never stopped me.

Around 29, a producer course with one of Belgium's most decorated beatmakers changed everything. No music theory, not yet. But melody came naturally. Basslines too. Turns out the ears knew things the hands hadn't learned to say yet.

The first official release landed on Spotify in 2013, through a label, under a different sound. House, progressive, electro. A real release. Proof it was possible.

The rest was just a matter of time.`,
  },
  {
    index: "03",
    label: "Sonic DNA",
    accent: "#e040fb",
    placeholder: `The blueprint was written by others first.

Swizz Beatz. Timbaland. The Neptunes. Havoc. Scott Storch. Just Blaze. These were not just influences. They were an education. Every snare hit, every bassline, every beat that felt like it came from another planet. That sound lived in my head long before I had the tools to make it real.

R&B, hip-hop, dancehall, reggaeton. Later house, progressive, electro. No genre was off limits. No sound was too far. The only rule was that it had to hit. It had to feel like something.

Crazy drum patterns. Weird textures. Melodies that stick without trying to. That is what TMSTRY sounds like from the inside. Cinematic but raw. Futuristic but worn. Built from machines, but always reaching for something human.

The ears were always ahead. The tools just had to catch up.`,
  },
  {
    index: "04",
    label: "The Process",
    accent: "#4fc3f7",
    placeholder: `There is no single way in.

Sometimes it starts in Logic Pro, a sound in Serum, a chord progression that opens something up. That gets fed into Suno, shaped, pushed further. Sometimes it starts with old material, a sample, an idea from years ago that never found its moment. And sometimes it starts with footage. Stock video, a mood, a visual story that needs a soundtrack before the soundtrack even exists. The image comes first. Then the lyrics. Then the music follows.

Every track, whatever its origin, ends the same way. Back in Logic Pro, through a master chain built over years of trial and error. EQ, multiband compression, the PSP Vintage Warmer II, and finally a limiter. That is where a track stops being a draft and becomes a record.

The process is different every time. The standard is not.`,
  },
  {
    index: "05",
    label: "In Their Words",
    accent: "#9c6aff",
    quotes: QUOTES,
  },
  {
    index: "06",
    label: "The Universe",
    accent: "#e040fb",
    placeholder: `The music is only half of it.

Every release inside the TMSTRY universe comes with a world built around it. Visuals, atmosphere, narrative. Not as decoration, but as a second language that says what the sound alone cannot.

It started long before TMSTRY existed. Three years of audio visual training in secondary school. Learning to frame a shot, cut a sequence, tell a story through a lens. Those early sessions on the first translucent iMacs, editing frame by frame, were a school that never really ended.

The visual identity of TMSTRY is cinematic and deliberately worn. Post-apocalyptic landscapes, broken futures, quiet devastation. A world that feels like it survived something but is not sure what comes next. That atmosphere is not a style choice. It is a genuine obsession, built from years of film, fiction, and imagery that never let go.

The goal is always the same. Pull the viewer in. Hold them there. Leave them wanting to know what happens next.

Story first. Always.`,
  },
  {
    index: "07",
    label: "Human Error",
    accent: "#4fc3f7",
    placeholder: `Not everything went to plan. Most of it did not.

For years, the music lived only in my head. Beats that never got recorded. Melodies that disappeared. The frustration of knowing exactly what something should sound like and having no way to get it out. That gap between vision and execution followed me for a long time.

As a DJ, I played records nobody had heard yet. Tracks that would chart a year later. The crowd looked at me like I was wrong. I was not wrong. I was just early. That gets old fast.

Life happened too. Kids, time, priorities. Years passed where producing took a back seat. The ideas did not stop. The output did.

Then there is the space we are all building now, AI music, a genuinely exciting place full of people who support each other and share what they make. But honesty matters here too. We are largely each other's audience. That is a beautiful thing and a limitation at the same time. Growing beyond that bubble is the real challenge. The gatekeepers still exist, just wearing different clothes.

Human Error is not an excuse. It is just the part nobody usually talks about.`,
  },
  {
    index: "08",
    label: "Transmission",
    accent: "#9c6aff",
    placeholder: `This does not stop here.

The head never quiets down. There are always more tracks, more visuals, more stories waiting to get out. Music is the core, but the signal reaches further than that. Writing, film, series, ideas that do not fit neatly into a category and were never meant to.

TMSTRY was built on decades of learning from others, producers, directors, teachers, records, films, books. That debt does not disappear. It gets passed on. Coming soon to the channel: short video tutorials on craft, consistency, visual storytelling, the things that actually matter when you are building something from nothing.

The goal was never just to make music. It was to make something that stays with people. Something that pulls them in, holds them there, and makes them want to create something of their own.

That is the transmission. It is still broadcasting.`,
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────
function ChapterModal({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const isQuotes = Boolean(chapter.quotes?.length);
  useModalChrome(onClose);

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
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={chapter.label}
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

          {/* ── Quote layout ── */}
          {isQuotes ? (
            <div className="space-y-0">
              {chapter.quotes!.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.13, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Quote text */}
                  <blockquote
                    className="font-display italic text-soft-white/75 leading-relaxed"
                    style={{ fontSize: "clamp(1rem, 2.2vw, 1.15rem)", letterSpacing: "0.01em" }}
                  >
                    &ldquo;{q.text}&rdquo;
                  </blockquote>

                  {/* Signature row */}
                  <div className="mt-5 flex items-center gap-4">
                    {/* Thin rule growing from left */}
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${chapter.accent}25)`,
                      }}
                    />

                    {/* Creator identity block — right aligned */}
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`block text-soft-white/30 ${q.sig.fontClass}`}
                        style={{
                          letterSpacing: q.sig.spacing,
                          fontWeight: q.sig.weight,
                          textTransform: q.sig.upper ? "uppercase" : "none",
                          fontStyle: q.sig.italic ? "italic" : "normal",
                          fontSize: q.sig.size,
                        }}
                      >
                        {q.name}
                      </span>
                      <span
                        className="block text-silver/20 mt-0.5"
                        style={{
                          fontSize: "0.52rem",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                        }}
                      >
                        {q.role}
                      </span>
                    </div>
                  </div>

                  {/* Separator between quotes — not after last */}
                  {i < chapter.quotes!.length - 1 && (
                    <div className="my-9 flex justify-center">
                      <div
                        className="w-6 h-px"
                        style={{ background: `${chapter.accent}20` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Bottom label */}
              <div className="mt-10 flex items-center justify-between">
                <span
                  className="text-[9px] tracking-widest uppercase"
                  style={{ color: `${chapter.accent}50`, letterSpacing: "0.3em" }}
                >
                  Archival / Placeholder
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

          ) : (
            /* ── Standard text layout ── */
            <>
              <div className="space-y-4">
                {chapter.placeholder!.split("\n\n").map((para, i) => (
                  <Fragment key={i}>
                    <p className="text-silver/60 text-sm leading-relaxed">
                      {para}
                    </p>
                    {/* Polaroid after 2nd paragraph */}
                    {chapter.photo && i === 1 && (
                      <div className="flex justify-center py-4">
                        <motion.div
                          initial={{ opacity: 0, rotate: 0, scale: 0.95 }}
                          animate={{ opacity: 1, rotate: chapter.photo.rotate ?? "-2deg", scale: 1 }}
                          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="relative"
                          style={{
                            background: "#f0ede6",
                            padding: "10px 10px 36px 10px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
                            transform: `rotate(${chapter.photo.rotate ?? "-2deg"})`,
                            maxWidth: "220px",
                          }}
                        >
                          <Image
                            src={chapter.photo.src}
                            alt={chapter.photo.caption ?? chapter.label}
                            width={300}
                            height={300}
                            className="w-full h-auto block"
                            style={{ filter: "saturate(0.6) brightness(0.9) contrast(1.05)" }}
                          />
                          {chapter.photo.caption && (
                            <p
                              className="text-center mt-1"
                              style={{
                                fontFamily: "cursive",
                                fontSize: "0.65rem",
                                color: "#666",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {chapter.photo.caption}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
              <div className="mt-10 flex items-center justify-between">
                <span />
                <button
                  onClick={onClose}
                  className="text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 text-silver/50 hover:text-soft-white hover:border-white/30 transition-all duration-300"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
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
            <FadeInSection delay={0.05} className="flex flex-col h-full">
              <div className="space-y-5 flex-1">
                {BIO.trim().split("\n\n").map((para, i) => (
                  <p key={i} className="text-silver/75 leading-relaxed text-sm md:text-base">
                    {para}
                  </p>
                ))}
              </div>

              {/* Quote — pushed to bottom, aligned with chapter 08 */}
              <div className="mt-auto pt-16 border-l-2 border-glow-blue/25 pl-6 py-2">
                <blockquote
                  className="text-soft-white/65 italic leading-relaxed font-light"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
                >
                  "The machines don't dream. But they learned to wonder about the ones who do."
                </blockquote>
                <cite className="text-silver/25 text-[10px] tracking-widest not-italic mt-3 block" style={{ letterSpacing: "0.2em" }}>
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
