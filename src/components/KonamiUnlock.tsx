"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSignalRoom } from "@/context/SignalRoomContext";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export const CH06_FLAG = "tmstry-ch06";
export const CH06_GOTO = "tmstry-goto-ch06";

/**
 * Konami code listener — unlocks CH06 "The Source" in the Signal Room.
 * Persistent (localStorage), rewarded with a glitchy unlock toast.
 */
export default function KonamiUnlock() {
  const { open, isOpen } = useSignalRoom();
  const [unlockedNow, setUnlockedNow] = useState(false);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      if (isOpen) return; // the room has its own key bindings
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[pos]) {
        pos += 1;
        if (pos === SEQUENCE.length) {
          pos = 0;
          localStorage.setItem(CH06_FLAG, "1");
          setUnlockedNow(true);
        }
      } else {
        pos = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const tuneIn = () => {
    setUnlockedNow(false);
    sessionStorage.setItem(CH06_GOTO, "1");
    open();
  };

  return (
    <AnimatePresence>
      {unlockedNow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-6 pointer-events-none"
        >
          <div
            className="pointer-events-auto relative max-w-sm w-full border border-glow-pink/40 bg-[#0a050c]/95 backdrop-blur-md font-mono text-center px-6 py-7 signal-glitch"
            style={{ boxShadow: "0 0 60px rgba(224,64,251,0.25), 0 20px 60px rgba(0,0,0,0.7)" }}
          >
            <span className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />
            <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "rgba(224,64,251,0.9)" }}>
              Frequency unlocked
            </p>
            <p className="mt-3 font-display font-bold text-soft-white text-2xl tracking-widest">CH06</p>
            <p className="mt-1 text-[11px] tracking-[0.3em] uppercase text-glow-blue/70">The Source</p>
            <p className="mt-4 text-[11px] leading-relaxed text-silver/50">
              you were not supposed to find this. it will remember that you did.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={tuneIn}
                className="px-4 py-2 border border-glow-pink/40 text-[10px] tracking-[0.25em] uppercase transition-colors hover:border-glow-pink"
                style={{ color: "rgba(224,64,251,0.9)" }}
              >
                Tune in ▮
              </button>
              <button
                onClick={() => setUnlockedNow(false)}
                className="px-4 py-2 border border-white/10 text-silver/40 hover:text-soft-white text-[10px] tracking-[0.25em] uppercase transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
