"use client";

import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";
import Image from "next/image";

const releases = [
  {
    id: 1,
    title: "Human // Signal // AI",
    subtitle: "Debut Album",
    year: "2025",
    tracks: 12,
    spotifyId: "placeholder",
    featured: true,
  },
  {
    id: 2,
    title: "Neural Drift",
    subtitle: "Single",
    year: "2025",
    tracks: 1,
    spotifyId: "placeholder",
    featured: false,
  },
  {
    id: 3,
    title: "Ghost Signal",
    subtitle: "EP",
    year: "2024",
    tracks: 5,
    spotifyId: "placeholder",
    featured: false,
  },
];

function AlbumCover({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <div className="w-full aspect-square relative overflow-hidden bg-obsidian">
      <Image
        src="/circle-logo.png"
        alt="TMSTRY — Human // Signal // AI"
        fill
        quality={90}
        className="object-contain object-center p-8"
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,10,14,0.3) 100%)",
        }}
      />
    </div>
  );
}

export default function MusicSection() {
  return (
    <section id="music" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section header */}
      <FadeInSection className="mb-16 md:mb-24">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 max-w-8 bg-glow-blue/30" />
          <span
            className="text-glow-blue text-[9px] tracking-widest uppercase"
            style={{ letterSpacing: "0.4em" }}
          >
            Latest Release
          </span>
        </div>
        <h2
          className="font-display font-bold text-soft-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
        >
          The Signal
        </h2>
      </FadeInSection>

      {/* Featured release */}
      <FadeInSection delay={0.1} className="mb-8 md:mb-12">
        <div className="relative group">
          {/* Outer glow on hover */}
          <motion.div
            className="absolute -inset-px rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: "linear-gradient(135deg, rgba(79,195,247,0.15), rgba(156,106,255,0.1), rgba(224,64,251,0.08))",
            }}
          />

          <div className="relative border border-white/[0.06] bg-charcoal/40 p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Album art */}
              <div className="relative">
                <AlbumCover size="large" />
                {/* Glow */}
                <div
                  className="absolute -inset-4 opacity-20 blur-2xl -z-10 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: "linear-gradient(135deg, rgba(79,195,247,0.6), rgba(224,64,251,0.4))" }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-6">
                <div>
                  <p
                    className="text-glow-blue text-[10px] tracking-widest mb-3"
                    style={{ letterSpacing: "0.3em" }}
                  >
                    DEBUT ALBUM · 2025
                  </p>
                  <h3
                    className="font-display font-bold text-soft-white leading-tight mb-4"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                  >
                    Human //<br />Signal // AI
                  </h3>
                  <p className="text-silver text-sm leading-relaxed">
                    Twelve transmissions from the boundary between consciousness and code.
                    An album born at the intersection of machine learning and human longing.
                  </p>
                </div>

                {/* Track count */}
                <div className="flex gap-6">
                  <div>
                    <p className="text-[9px] text-silver/50 tracking-widest uppercase mb-1" style={{ letterSpacing: "0.25em" }}>Tracks</p>
                    <p className="text-soft-white font-medium">12</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] text-silver/50 tracking-widest uppercase mb-1" style={{ letterSpacing: "0.25em" }}>Runtime</p>
                    <p className="text-soft-white font-medium">54 min</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] text-silver/50 tracking-widest uppercase mb-1" style={{ letterSpacing: "0.25em" }}>Label</p>
                    <p className="text-soft-white font-medium">Independent</p>
                  </div>
                </div>

                {/* Spotify embed placeholder */}
                <div className="border border-white/[0.08] bg-black/30 rounded-none p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-soft-white text-xs font-medium">Human // Signal // AI</p>
                      <p className="text-silver/60 text-[10px]">TMSTRY · Album</p>
                    </div>
                  </div>
                  {/* Waveform placeholder */}
                  <div className="flex items-center gap-1 h-8">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-[#1DB954]/30 rounded-full"
                        style={{ height: `${Math.sin(i * 0.4) * 40 + 50}%` }}
                        animate={{ height: [`${Math.sin(i * 0.4) * 40 + 50}%`, `${Math.sin(i * 0.4 + 1) * 40 + 50}%`, `${Math.sin(i * 0.4) * 40 + 50}%`] }}
                        transition={{ duration: 2 + i * 0.05, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                  <p className="text-silver/40 text-[9px] mt-3 text-center" style={{ letterSpacing: "0.15em" }}>
                    AVAILABLE ON SPOTIFY
                  </p>
                </div>

                {/* Stream button */}
                <a
                  href="https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs tracking-widest uppercase hover:bg-[#1DB954]/20 transition-all duration-300"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Stream on Spotify
                </a>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Other releases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12">
        {releases.slice(1).concat([{
          id: 4,
          title: "Synthetic Pulse",
          subtitle: "Single",
          year: "2024",
          tracks: 1,
          spotifyId: "placeholder",
          featured: false,
        }]).map((release, i) => (
          <FadeInSection key={release.id} delay={i * 0.1} direction="up">
            <div className="group relative border border-white/[0.06] bg-charcoal/20 p-4 hover:border-white/[0.12] transition-all duration-500 cursor-pointer">
              <AlbumCover size="small" />
              <div className="mt-4">
                <p className="text-silver/50 text-[9px] tracking-widest mb-1" style={{ letterSpacing: "0.3em" }}>
                  {release.subtitle.toUpperCase()} · {release.year}
                </p>
                <h4 className="text-soft-white font-medium text-sm">{release.title}</h4>
              </div>
              {/* Hover glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
