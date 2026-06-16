"use client";

import { useEffect } from "react";

/**
 * Shared modal behaviour: close on Escape + lock body scroll while mounted.
 * Use in every modal/lightbox so the "ESC ×" affordance actually works and the
 * page behind the overlay can't scroll.
 */
export function useModalChrome(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
}
