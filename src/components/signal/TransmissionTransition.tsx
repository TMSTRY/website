"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useStaticCanvas } from "@/hooks/useStaticCanvas";

/** Full-screen static-wipe shown while entering / leaving the Signal Room. */
export default function TransmissionTransition({ mode }: { mode: "in" | "out" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useStaticCanvas(canvasRef, { fps: 24, baseIntensity: 0.9, maxW: 640, maxH: 360 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[300] bg-black pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
      <div className="absolute inset-0 crt-scanlines opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: [0, 1, 0.4, 1], letterSpacing: "0.6em" }}
          transition={{ duration: 0.9 }}
          className="font-mono text-glow-blue text-xs md:text-sm uppercase text-center px-6"
          style={{ textShadow: "0 0 18px rgba(79,195,247,0.6)" }}
        >
          {mode === "in" ? "// transmission detected" : "// signal lost"}
        </motion.div>
      </div>
    </motion.div>
  );
}
