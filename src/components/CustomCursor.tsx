"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX - 3}px`;
      dot.style.top = `${mouseY - 3}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX - 16) * 0.12;
      ringY += (mouseY - ringY - 16) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    };

    const INTERACTIVE = "a, button, [role='button']";

    const setHovered = (hovered: boolean) => {
      ring.style.width = hovered ? "52px" : "32px";
      ring.style.height = hovered ? "52px" : "32px";
      ring.style.borderColor = hovered
        ? "rgba(224, 64, 251, 0.6)"
        : "rgba(79, 195, 247, 0.4)";
      dot.style.transform = hovered ? "scale(0)" : "scale(1)";
    };

    // Delegated hover detection — works for elements added after mount (modals)
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) setHovered(true);
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) setHovered(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  );
}
