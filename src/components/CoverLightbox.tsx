"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useModalChrome } from "@/hooks/useModalChrome";

export default function CoverLightbox({ cover, title, onClose }: { cover: string; title: string; onClose: () => void }) {
  useModalChrome(onClose);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={`${title} cover`}
    >
      <div className="absolute inset-0 bg-obsidian/92 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative" onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-9 right-0 text-silver/60 hover:text-soft-white text-xs tracking-widest uppercase transition-colors" style={{ letterSpacing: "0.2em" }}>
          Close ×
        </button>
        <div className="relative w-[80vw] max-w-[460px] aspect-square overflow-hidden border border-white/10" style={{ boxShadow: "0 0 60px rgba(79,195,247,0.15)" }}>
          <Image src={cover} alt={title} fill sizes="460px" className="object-cover" />
          <div className="absolute inset-0 crt-scanlines opacity-[0.12] pointer-events-none" />
        </div>
        <p className="mt-4 text-center font-mono text-[11px] tracking-[0.25em] uppercase text-silver/70">{title}</p>
      </motion.div>
    </motion.div>
  );
}
