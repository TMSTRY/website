"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";

const topTracks = [
  { title: "No Defeat",       plays: "10.5K" },
  { title: "Bars to Bridges", plays: "6.6K"  },
  { title: "System Shock",    plays: "8.1K"  },
  { title: "Strike Back",     plays: "6.0K"  },
  { title: "Hollow Shape",    plays: "Latest"},
];

const DSP = [
  { name: "Spotify",       href: "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw", color: "#1DB954" },
  { name: "Apple Music",   href: "https://music.apple.com/us/artist/tmstry/646739670",      color: "#FC3C44" },
  { name: "YouTube Music", href: "https://music.youtube.com/@TMSTRY-music",                 color: "#FF0000" },
  { name: "Amazon Music",  href: "https://music.amazon.com/artists/B00CQATSF0/tmstry",      color: "#00A8E1" },
  { name: "Deezer",        href: "https://www.deezer.com/en/artist/4768699",                color: "#A238FF" },
];

export default function MusicSection() {
  return (
    <section id="music" className="py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <FadeInSection className="mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-8 bg-glow-blue/30" />
            <span className="text-glow-blue text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em" }}>
              Music
            </span>
          </div>
          <h2 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}>
            The Signal
          </h2>
        </FadeInSection>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">

          {/* ── Left: Artist identity ── */}
          <FadeInSection delay={0.05} className="flex flex-col gap-10">

            {/* Logo */}
            <div className="relative w-full aspect-square max-w-[260px]">
              <Image
                src="/circle-logo.png"
                alt="TMSTRY"
                fill
                quality={90}
                className="object-contain"
                style={{ mixBlendMode: "screen" }}
              />
              <motion.div
                className="absolute inset-0 -z-10 blur-3xl scale-110"
                style={{ background: "radial-gradient(circle, rgba(156,106,255,0.15) 0%, rgba(79,195,247,0.07) 60%, transparent 100%)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Artist info */}
            <div className="space-y-2">
              <p className="text-glow-blue text-[9px] tracking-widest" style={{ letterSpacing: "0.4em" }}>
                INDEPENDENT ARTIST
              </p>
              <h3 className="font-display font-bold text-soft-white text-2xl md:text-3xl" style={{ letterSpacing: "0.06em" }}>
                TMSTRY
              </h3>
              <p className="text-silver/40 text-xs tracking-widest" style={{ letterSpacing: "0.2em" }}>
                Electronic · Cinematic · AI-Hybrid
              </p>
            </div>

            {/* Top tracks */}
            <div>
              <p className="text-[9px] text-silver/25 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.35em" }}>
                Top Tracks
              </p>
              <ul className="space-y-0">
                {topTracks.map((track, i) => (
                  <li key={track.title}>
                    <div className="group flex items-center justify-between py-3 border-t border-white/[0.05] hover:border-white/[0.12] transition-colors duration-300">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-silver/20 w-4 text-right flex-shrink-0">{i + 1}</span>
                        <span className="text-silver/60 text-xs group-hover:text-soft-white transition-colors duration-300" style={{ letterSpacing: "0.04em" }}>
                          {track.title}
                        </span>
                      </div>
                      <span className="text-silver/20 text-[9px] font-mono flex-shrink-0">{track.plays}</span>
                    </div>
                  </li>
                ))}
                <li><div className="border-t border-white/[0.05]" /></li>
              </ul>
            </div>

          </FadeInSection>

          {/* ── Right: Player + DSP ── */}
          <FadeInSection delay={0.15} className="flex flex-col gap-12">

            {/* Spotify embed */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[9px] text-silver/25 tracking-widest uppercase" style={{ letterSpacing: "0.35em" }}>
                  Stream Now
                </p>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[9px] text-[#1DB954]/50 font-mono tracking-wider">LIVE</span>
                </div>
              </div>
              <div className="w-full overflow-hidden border border-white/[0.06]">
                <iframe
                  src="https://open.spotify.com/embed/artist/6N2jkKJIcbzHwMs4cswMpw?utm_source=generator&theme=0"
                  width="100%"
                  height="240"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="TMSTRY on Spotify"
                  style={{ display: "block" }}
                />
              </div>
            </div>

            {/* DSP links */}
            <div>
              <p className="text-[9px] text-silver/25 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.35em" }}>
                Available On
              </p>
              <div className="space-y-0">
                {DSP.map((dsp) => (
                  <motion.a
                    key={dsp.name}
                    href={dsp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between py-4 border-t border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Brand color flash on left */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"
                      style={{ background: dsp.color }}
                    />

                    {/* Platform name */}
                    <span
                      className="text-silver/40 group-hover:text-soft-white text-xs tracking-widest uppercase transition-colors duration-300 pl-4"
                      style={{ letterSpacing: "0.22em" }}
                    >
                      {dsp.name}
                    </span>

                    {/* Arrow */}
                    <motion.svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 flex-shrink-0 fill-none stroke-current text-silver/20 group-hover:text-silver/60 transition-colors duration-300"
                      strokeWidth={1.5}
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </motion.a>
                ))}
                <div className="border-t border-white/[0.05]" />
              </div>
            </div>

          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
