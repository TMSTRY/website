"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      className="relative flex items-center gap-2 group"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      whileTap={{ scale: 0.95 }}
    >
      {/* Track */}
      <div
        className="relative w-10 h-5 rounded-full border transition-all duration-400"
        style={{
          background: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(79,195,247,0.15)",
          borderColor: isDark
            ? "rgba(255,255,255,0.14)"
            : "rgba(79,195,247,0.40)",
        }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full"
          animate={{ left: isDark ? "2px" : "22px" }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          style={{
            background: isDark
              ? "rgba(255,255,255,0.30)"
              : "rgba(79,195,247,0.95)",
            boxShadow: isDark
              ? "none"
              : "0 0 10px rgba(79,195,247,0.7)",
          }}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-[9px] tracking-widest uppercase hidden md:block"
          style={{
            letterSpacing: "0.25em",
            color: isDark ? "rgba(136,146,160,0.6)" : "rgba(79,195,247,0.8)",
          }}
        >
          {isDark ? "Dark" : "Light"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
