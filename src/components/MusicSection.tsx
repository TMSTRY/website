"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import FadeInSection from "./FadeInSection";

const topTracks = [
  { title: "No Defeat",     plays: "10.5K" },
  { title: "Bars to Bridges", plays: "6.6K" },
  { title: "System Shock",  plays: "8.1K" },
  { title: "Strike Back",   plays: "6.0K" },
  { title: "Hollow Shape",  plays: "Latest" },
];

export default function MusicSection() {
  return (
    <section id="music" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto">

      {/* Section header */}
      <FadeInSection className="mb-16 md:mb-24">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-8 bg-glow-blue/30" />
          <span className="text-glow-blue text-[9px] tracking-widest uppercase" style={{ letterSpacing: "0.4em" }}>
            Music
          </span>
        </div>
        <h2 className="font-display font-bold text-soft-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}>
          The Signal
        </h2>
      </FadeInSection>

      {/* Main music block */}
      <FadeInSection delay={0.1}>
        <div className="relative group border border-white/[0.06] bg-charcoal/40">

          {/* Hover glow edge */}
          <div
            className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(79,195,247,0.1), rgba(156,106,255,0.07), rgba(224,64,251,0.05))" }}
          />

          <div className="relative grid md:grid-cols-[1fr_1.6fr] gap-0">

            {/* Left — artist identity */}
            <div className="p-6 md:p-10 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-white/[0.05]">

              {/* Logo */}
              <div className="relative w-full aspect-square max-w-[220px] mx-auto md:mx-0">
                <Image
                  src="/circle-logo.png"
                  alt="TMSTRY"
                  fill
                  quality={90}
                  className="object-contain p-4"
                  style={{ mixBlendMode: "screen" }}
                />
                {/* Bloom */}
                <motion.div
                  className="absolute inset-0 -z-10 blur-2xl scale-110"
                  style={{ background: "radial-gradient(circle, rgba(156,106,255,0.12) 0%, rgba(79,195,247,0.06) 60%, transparent 100%)" }}
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Artist info */}
              <div>
                <p className="text-glow-blue text-[9px] tracking-widest mb-2" style={{ letterSpacing: "0.35em" }}>
                  INDEPENDENT ARTIST
                </p>
                <h3 className="font-display font-bold text-soft-white text-xl md:text-2xl mb-3" style={{ letterSpacing: "0.06em" }}>
                  TMSTRY
                </h3>
                <p className="text-silver/60 text-xs leading-relaxed">
                  Electronic · Cinematic · AI-Hybrid
                </p>
              </div>

              {/* Top tracks list */}
              <div>
                <p className="text-[9px] text-silver/30 tracking-widest uppercase mb-4" style={{ letterSpacing: "0.3em" }}>
                  Top Tracks
                </p>
                <ul className="space-y-3">
                  {topTracks.map((track, i) => (
                    <li key={track.title} className="flex items-center justify-between gap-3 group/track">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-silver/20 w-4 text-right">{i + 1}</span>
                        <span className="text-silver/70 text-xs group-hover/track:text-soft-white transition-colors duration-200">
                          {track.title}
                        </span>
                      </div>
                      <span className="text-silver/25 text-[9px] font-mono flex-shrink-0">{track.plays}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spotify link button */}
              <a
                href="https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-[10px] tracking-widest uppercase hover:bg-[#1DB954]/20 transition-all duration-300"
                style={{ letterSpacing: "0.2em" }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Open on Spotify
              </a>
            </div>

            {/* Right — Spotify embedded player */}
            <div className="p-6 md:p-10 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] text-silver/30 tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
                  Stream Now
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                  <span className="text-[9px] text-[#1DB954]/60 font-mono tracking-wider">LIVE</span>
                </div>
              </div>

              {/* Spotify artist embed — dark theme, shows top tracks */}
              <div className="w-full overflow-hidden" style={{ borderRadius: "0" }}>
                <iframe
                  src="https://open.spotify.com/embed/artist/6N2jkKJIcbzHwMs4cswMpw?utm_source=generator&theme=0"
                  width="100%"
                  height="460"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="TMSTRY on Spotify"
                  style={{ display: "block" }}
                />
              </div>

              <p className="text-silver/20 text-[9px] text-center tracking-widest" style={{ letterSpacing: "0.15em" }}>
                Streaming on Spotify · Apple Music · YouTube Music · Tidal
              </p>
            </div>

          </div>
        </div>
      </FadeInSection>

    </section>
  );
}
