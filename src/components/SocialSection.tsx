"use client";

import { motion } from "framer-motion";
import FadeInSection from "./FadeInSection";

const socials = [
  {
    name: "Spotify",
    handle: "@tmstry",
    description: "Stream the signal",
    href: "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: "#1DB954",
    colorRgb: "29,185,84",
  },
  {
    name: "YouTube",
    handle: "@TMSTRY",
    description: "Watch the vision",
    href: "https://www.youtube.com/@TMSTRY-music",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: "#FF0000",
    colorRgb: "255,0,0",
  },
  {
    name: "Instagram",
    handle: "@tmstry",
    description: "Visual transmissions",
    href: "https://www.instagram.com/tmstry/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    color: "#E1306C",
    colorRgb: "225,48,108",
  },
  {
    name: "SoundCloud",
    handle: "tmstry",
    description: "Raw sessions",
    href: "https://soundcloud.com/tmstry",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M1.175 12.225c-.15 0-.255.105-.255.255l-.332 4.05.332 3.862c0 .15.105.255.255.255.15 0 .255-.105.255-.255l.368-3.862-.368-4.05c0-.15-.105-.255-.255-.255zm1.935-.727c-.18 0-.315.135-.315.315l-.285 4.777.285 3.645c0 .18.135.315.315.315s.315-.135.315-.315l.33-3.645-.33-4.777c0-.18-.135-.315-.315-.315zm1.98-.39c-.21 0-.375.165-.375.375l-.255 5.167.255 3.555c0 .21.165.375.375.375s.375-.165.375-.375l.3-3.555-.3-5.167c0-.21-.165-.375-.375-.375zM24 11.25c-.435-3.3-3.105-5.85-6.48-5.85-1.005 0-1.965.24-2.79.66-.3.135-.375.285-.39.42v12.105c.015.15.135.27.285.285h9.375c.825 0 1.5-.675 1.5-1.5l-.5-6.12z"/>
      </svg>
    ),
    color: "#FF5500",
    colorRgb: "255,85,0",
  },
  {
    name: "TikTok",
    handle: "@tmstry",
    description: "Short signals",
    href: "https://www.tiktok.com/@tmstry",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    color: "#69C9D0",
    colorRgb: "105,201,208",
  },
  {
    name: "X / Twitter",
    handle: "@tmstry",
    description: "Signal fragments",
    href: "https://x.com/TMSTRYmusic",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.849L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "#1DA1F2",
    colorRgb: "29,161,242",
  },
];

export default function SocialSection() {
  return (
    <section id="connect" className="py-24 md:py-36 px-6 md:px-12 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(79,195,247,0.02) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <FadeInSection className="mb-16 md:mb-20 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-glow-blue/30" />
            <span
              className="text-glow-blue text-[9px] tracking-widest uppercase"
              style={{ letterSpacing: "0.4em" }}
            >
              Connect
            </span>
            <div className="h-px w-8 bg-glow-blue/30" />
          </div>
          <h2
            className="font-display font-bold text-soft-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em" }}
          >
            Find the Signal
          </h2>
          <p className="text-silver/60 text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            Transmitting across platforms. Follow for new releases, visual content, and fragments of the process.
          </p>
        </FadeInSection>

        {/* Social grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {socials.map((social, i) => (
            <FadeInSection key={social.name} delay={i * 0.07}>
              <motion.a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col gap-4 p-5 md:p-6 border border-white/[0.06] bg-charcoal/20 hover:border-white/[0.15] transition-all duration-500 overflow-hidden"
                whileHover={{ y: -2 }}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at bottom left, rgba(${social.colorRgb},0.06) 0%, transparent 70%)`,
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <div
                    className="w-10 h-10 flex items-center justify-center border border-white/[0.08] group-hover:border-current transition-colors duration-300"
                    style={{ color: social.color }}
                  >
                    {social.icon}
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3 fill-none stroke-current text-silver/20 group-hover:text-silver/50 transition-colors duration-300 mt-1"
                    strokeWidth={1.5}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="relative">
                  <p className="text-soft-white font-medium text-sm group-hover:text-white transition-colors">{social.name}</p>
                  <p className="text-silver/40 text-[10px] mt-0.5">{social.handle}</p>
                  <p className="text-silver/30 text-[10px] mt-2 tracking-wide">{social.description}</p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${social.colorRgb},0.4), transparent)` }}
                />
              </motion.a>
            </FadeInSection>
          ))}
        </div>

        {/* Email contact */}
        <FadeInSection delay={0.4} className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-1.5">
            <p className="text-soft-white/85 text-sm md:text-base" style={{ letterSpacing: "0.02em" }}>
              Got something on your plate? Work for hire?
            </p>
            <p className="text-silver/40 text-xs italic">
              Or just here to hate? The inbox has thick skin.
            </p>
            <a
              href="mailto:contact@tmstry.com"
              className="mt-3 text-soft-white/70 hover:text-soft-white text-sm tracking-wide transition-colors duration-300 underline underline-offset-4 decoration-white/20 hover:decoration-glow-blue/40"
            >
              contact@tmstry.com
            </a>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
