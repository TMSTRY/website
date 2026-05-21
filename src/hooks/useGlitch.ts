"use client";

import { useEffect, useRef } from "react";

interface GlitchOptions {
  /** Average ms between glitch events */
  intervalMs?: number;
  /** Randomness factor — higher = more irregular (0–1) */
  jitter?: number;
}

/**
 * Returns a ref to attach to the element you want to glitch.
 * Adds/removes the `data-glitch` attribute on a random schedule,
 * which drives the CSS animation.
 */
export function useGlitch({ intervalMs = 4000, jitter = 0.7 }: GlitchOptions = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      // Random delay centred around intervalMs with jitter
      const delay = intervalMs * (1 - jitter / 2 + Math.random() * jitter);
      timeout = setTimeout(triggerGlitch, delay);
    };

    const triggerGlitch = () => {
      el.setAttribute("data-glitching", "true");

      // Run 2–4 rapid flicker cycles
      const cycles = 2 + Math.floor(Math.random() * 3);
      let i = 0;

      const flicker = () => {
        if (i >= cycles) {
          el.removeAttribute("data-glitching");
          scheduleNext();
          return;
        }
        // Randomise the CSS variables that drive slice/offset intensity
        const sliceY  = 20 + Math.random() * 60;     // % down the element
        const offsetX = (Math.random() - 0.5) * 14;  // px left/right
        const r       = (Math.random() - 0.5) * 8;   // red channel offset
        const b       = (Math.random() - 0.5) * 8;   // blue channel offset

        el.style.setProperty("--gl-slice-y",   `${sliceY}%`);
        el.style.setProperty("--gl-offset-x",  `${offsetX}px`);
        el.style.setProperty("--gl-r-offset",  `${r}px`);
        el.style.setProperty("--gl-b-offset",  `${b}px`);

        i++;
        setTimeout(flicker, 60 + Math.random() * 80);
      };

      flicker();
    };

    scheduleNext();
    return () => clearTimeout(timeout);
  }, [intervalMs, jitter]);

  return ref;
}
