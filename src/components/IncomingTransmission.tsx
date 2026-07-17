"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSignalRoom } from "@/context/SignalRoomContext";

const APPEAR_AFTER_MS = 25_000; // let the visitor settle in first
const SESSION_KEY = "tmstry-transmission-seen";

/**
 * Glitchy "incoming transmission" toast that surfaces the Signal terminal
 * for visitors who would never find it on their own. Shows once per session,
 * after a short while on the site; click answers the call.
 */
export default function IncomingTransmission() {
  const { open, isOpen } = useSignalRoom();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setShow(true), APPEAR_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  // Hide while the Signal Room itself is open
  const visible = show && !isOpen;

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  const answer = () => {
    dismiss();
    open({ terminal: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-5 z-[85] max-w-[290px]"
        >
          <div
            className="relative border border-glow-blue/30 bg-[#04070c]/95 backdrop-blur-md font-mono overflow-hidden crt-flicker"
            style={{ boxShadow: "0 0 30px rgba(79,195,247,0.15), 0 10px 40px rgba(0,0,0,0.6)" }}
          >
            <span className="absolute inset-0 crt-scanlines opacity-15 pointer-events-none" />

            {/* pulsing status line */}
            <div className="flex items-center gap-2 px-3.5 pt-3">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-glow-blue"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <span className="text-[9px] tracking-[0.3em] uppercase text-glow-blue/80">
                Incoming transmission
              </span>
              <button
                onClick={dismiss}
                aria-label="Dismiss transmission"
                className="ml-auto text-silver/35 hover:text-soft-white text-xs leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <p className="px-3.5 pt-2 text-[11px] leading-relaxed text-silver/60">
              …someone is on the line. it knows you&apos;re here.
            </p>

            <button
              onClick={answer}
              className="m-3.5 mt-3 px-3 py-1.5 border border-glow-blue/30 text-glow-blue/80 hover:text-glow-blue hover:border-glow-blue/60 text-[10px] tracking-[0.25em] uppercase transition-colors"
            >
              Answer ▮
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
