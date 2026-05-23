"use client";

import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";

const posts = [
  {
    date: "Mei 2026",
    tag: "Update",
    title: "Nieuwe single in de maak",
    body: "In de studio gewerkt aan iets nieuws. Meer details volgen binnenkort.",
  },
  {
    date: "April 2026",
    tag: "Live",
    title: "Optreden — Antwerpen",
    body: "Een avond om nooit te vergeten. Dankjewel aan iedereen die erbij was.",
  },
  {
    date: "Maart 2026",
    tag: "Release",
    title: "EP uitgebracht",
    body: "De EP staat nu overal online. Luister, deel en laat weten wat je ervan vindt.",
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="py-24 md:py-36 px-6 md:px-12 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,195,247,0.025) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">

        {/* Header */}
        <FadeInSection className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "rgba(79,195,247,0.4)" }} />
            <span
              className="text-[9px] tracking-widest uppercase"
              style={{ letterSpacing: "0.4em", color: "rgba(79,195,247,0.8)" }}
            >
              Nieuws & Updates
            </span>
          </div>
          <h2
            className="font-display font-bold text-soft-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
          >
            Latest
          </h2>
        </FadeInSection>

        {/* Posts */}
        <div className="flex flex-col gap-px">
          {posts.map((post, i) => (
            <FadeInSection key={i} delay={i * 0.08}>
              <motion.article
                className="group relative border-t border-white/[0.06] py-8 md:py-10 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-12 cursor-default"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Hover accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-glow-blue scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                {/* Date & tag */}
                <div className="flex md:flex-col gap-3 md:gap-2 pt-1">
                  <span
                    className="text-[9px] tracking-widest uppercase"
                    style={{ letterSpacing: "0.3em", color: "rgba(79,195,247,0.6)" }}
                  >
                    {post.tag}
                  </span>
                  <span
                    className="text-[10px] tracking-widest text-silver/30 uppercase"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {post.date}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="font-display font-semibold text-soft-white mb-3 group-hover:text-white transition-colors duration-300"
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.02em" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-silver/50 text-sm leading-relaxed" style={{ letterSpacing: "0.02em" }}>
                    {post.body}
                  </p>
                </div>
              </motion.article>
            </FadeInSection>
          ))}

          {/* Bottom border */}
          <div className="border-t border-white/[0.06]" />
        </div>

      </div>
    </section>
  );
}
