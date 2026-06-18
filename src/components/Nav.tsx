"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import NavSignalTV from "./signal/NavSignalTV";
import HoverSwapText from "./HoverSwapText";

const navLinks: { href: string; label: string; alt?: string }[] = [
  { href: "#music", label: "Music", alt: "Racket" },
  { href: "#video", label: "Video", alt: "Reruns" },
  { href: "#about", label: "About", alt: "Ego" },
  { href: "#press", label: "Press", alt: "Crap" },
  { href: "#news", label: "News", alt: "Gossip" },
  { href: "#connect", label: "Connect", alt: "Spam" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: mark the nav item of the section currently in view
  useEffect(() => {
    const els = navLinks
      .map((l) => document.getElementById(l.href.replace("#", "")))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-soft-white font-display font-bold tracking-widest text-sm md:text-base"
          style={{ letterSpacing: "0.35em" }}
        >
          TMSTRY
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-10">
            {navLinks.map((link, i) => {
              const active = activeId === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    aria-current={active ? "true" : undefined}
                    className={`text-xs tracking-widest uppercase transition-colors duration-300 relative group ${active ? "text-soft-white" : "text-silver hover:text-soft-white"}`}
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {link.alt ? <HoverSwapText text={link.label} alt={link.alt} tone={i % 2 === 0 ? "purple" : "pink"} altClassName="text-base" /> : link.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-glow-blue"
                        style={{ boxShadow: "0 0 6px rgba(79,195,247,0.9)" }}
                      />
                    )}
                    <span className={`absolute -bottom-1 left-0 h-px bg-glow-blue transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </button>
                </li>
              );
            })}
          </ul>
          <NavSignalTV />
          <ThemeToggle />
        </div>

        {/* Mobile: signal + menu */}
        <div className="md:hidden flex items-center gap-3">
          <NavSignalTV />
        {/* Mobile menu button */}
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-soft-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-4 h-px bg-soft-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-soft-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal/95 backdrop-blur-xl border-b border-white/5"
          >
            <ul className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => {
                const active = activeId === link.href.replace("#", "");
                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      aria-current={active ? "true" : undefined}
                      className={`text-sm tracking-widest uppercase transition-colors flex items-center gap-2 ${active ? "text-soft-white" : "text-silver hover:text-soft-white"}`}
                      style={{ letterSpacing: "0.25em" }}
                    >
                      {link.label}
                      {active && <span aria-hidden="true" className="w-1 h-1 rounded-full bg-glow-blue" style={{ boxShadow: "0 0 6px rgba(79,195,247,0.9)" }} />}
                    </button>
                  </li>
                );
              })}
              <li className="pt-2 border-t border-white/[0.06]">
                <ThemeToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
