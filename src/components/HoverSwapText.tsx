/**
 * On hover, swaps `text` for a dirty, skewed `alt` rendered in the grunge font.
 * Pure CSS (group-hover) — works in server or client components.
 */
export default function HoverSwapText({
  text,
  alt,
  className = "",
  altClassName = "",
}: {
  text: string;
  alt: string;
  className?: string;
  altClassName?: string;
}) {
  return (
    <span className={`relative inline-block group/swap ${className}`}>
      <span className="block transition-opacity duration-200 group-hover/swap:opacity-0">{text}</span>
      <span
        aria-hidden="true"
        className={`font-grunge normal-case pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap opacity-0 group-hover/swap:opacity-100 transition-opacity duration-200 text-glow-purple ${altClassName}`}
        style={{
          transform: "translate(-50%, -50%) skewX(-12deg) rotate(-3deg)",
          textShadow: "0 0 14px rgba(156,106,255,0.5)",
        }}
      >
        {alt}
      </span>
    </span>
  );
}
