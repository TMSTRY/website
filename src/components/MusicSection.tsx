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

            {/* Right — player + DSP links */}
            <div className="p-6 md:p-10 flex flex-col gap-8">

              {/* Spotify embed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] text-silver/30 tracking-widest uppercase" style={{ letterSpacing: "0.3em" }}>
                    Stream Now
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span className="text-[9px] text-[#1DB954]/60 font-mono tracking-wider">LIVE</span>
                  </div>
                </div>
                <div className="w-full overflow-hidden">
                  <iframe
                    src="https://open.spotify.com/embed/artist/6N2jkKJIcbzHwMs4cswMpw?utm_source=generator&theme=0"
                    width="100%"
                    height="280"
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
                <p className="text-[9px] text-silver/25 tracking-widest uppercase mb-5" style={{ letterSpacing: "0.3em" }}>
                  Available On
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      name: "Spotify",
                      href: "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw",
                      color: "#1DB954",
                      icon: <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>,
                    },
                    {
                      name: "Apple Music",
                      href: "https://music.apple.com/us/artist/tmstry/646739670",
                      color: "#FC3C44",
                      icon: <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H7.991c-.08.007-.16.01-.24.017a9.506 9.506 0 00-1.803.23 4.985 4.985 0 00-2.123 1.05c-.973.833-1.5 1.913-1.676 3.15a10.56 10.56 0 00-.13 1.65c0 .05-.007.1-.007.15v8.085c.003.07.007.138.01.208.018.68.082 1.356.236 2.02.29 1.248.982 2.207 2.02 2.927.65.456 1.376.7 2.135.832.52.09 1.044.13 1.57.15.05.002.1.007.15.007h8.07c.09-.003.18-.007.27-.012.57-.025 1.14-.075 1.69-.2 1.252-.295 2.223-1.005 2.93-2.067.454-.67.69-1.42.81-2.2.1-.63.128-1.267.13-1.907V6.124zM15.998 9.38H13.35v8.27h-2.66V9.38H8.93V7.17h7.068v2.21z"/>,
                    },
                    {
                      name: "YouTube Music",
                      href: "https://music.youtube.com/@TMSTRY-music",
                      color: "#FF0000",
                      icon: <><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></>,
                    },
                    {
                      name: "Amazon Music",
                      href: "https://music.amazon.com/artists/B00CQATSF0/tmstry",
                      color: "#00A8E1",
                      icon: <path d="M.057 18.674c.168.133.384.085.576-.04 5.32-3.173 11.354-4.85 17.48-4.85 2.326 0 4.63.27 6.862.784.32.075.647-.133.687-.456.04-.32-.133-.62-.454-.695a35.16 35.16 0 00-7.28-.832c-6.37 0-12.635 1.73-18.16 5.03-.274.163-.36.515-.19.785.047.075.1.133.164.18l.315.094zm-.057-3.7c.21.155.48.1.69-.048 3.847-2.408 8.23-3.7 12.744-3.7 2.58 0 5.12.44 7.533 1.305.313.112.653-.05.766-.363.112-.314-.05-.654-.363-.767a26.515 26.515 0 00-7.936-1.374c-4.74 0-9.348 1.358-13.386 3.9-.27.168-.354.517-.186.786.046.073.1.13.138.26zm21.88 3.044c-.264-.168-.57-.088-.73.18-.156.268-.08.613.186.78 1.08.668 2.09 1.427 3.02 2.263.224.2.57.19.78-.04.21-.224.196-.57-.028-.77-1.004-.896-2.085-1.71-3.228-2.413zm-3.78-12.018C9.45.457 3.354 3.165.254 8.58c-.156.272-.063.62.208.778.27.158.62.065.78-.207C4.1 4.244 9.8 1.71 15.65 2.15c6.008.45 11.148 4.147 13.694 9.657.136.295.484.424.78.287.294-.137.423-.484.286-.78C27.758 5.622 22.333 1.688 16.1 1.22c-.67-.05-1.342-.065-2.01-.034l2.01.814z"/>,
                    },
                    {
                      name: "Deezer",
                      href: "https://www.deezer.com/en/artist/4768699",
                      color: "#A238FF",
                      icon: <><rect x="0" y="14" width="3" height="4" rx="0.5"/><rect x="4.5" y="11" width="3" height="7" rx="0.5"/><rect x="9" y="8" width="3" height="10" rx="0.5"/><rect x="13.5" y="5" width="3" height="13" rx="0.5"/><rect x="18" y="2" width="3" height="16" rx="0.5"/></>,
                    },
                  ].map((dsp) => (
                    <motion.a
                      key={dsp.name}
                      href={dsp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 px-4 py-3 border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 relative overflow-hidden"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Color accent on hover */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: dsp.color }}
                      />
                      {/* Icon */}
                      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 transition-opacity duration-300 opacity-50 group-hover:opacity-100" style={{ fill: dsp.color }}>
                        {dsp.icon}
                      </svg>
                      {/* Name */}
                      <span
                        className="text-silver/50 group-hover:text-soft-white text-xs tracking-widest uppercase transition-colors duration-300 flex-1"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {dsp.name}
                      </span>
                      {/* Arrow */}
                      <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 fill-none stroke-current text-silver" strokeWidth={1.5}>
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </FadeInSection>

    </section>
  );
}
