/**
 * On hover, swaps `text` for a dirty, skewed `alt` rendered in the grunge font.
 * Pure CSS (group-hover) — works in server or client components.
 */
const TONES = {
  purple: { cls: "text-glow-purple", shadow: "0 0 14px rgba(156,106,255,0.5)" },
  pink: { cls: "text-glow-pink", shadow: "0 0 14px rgba(224,64,251,0.5)" },
};

export default function HoverSwapText({
  text,
  alt,
  tone = "purple",
  className = "",
  altClassName = "",
}: {
  text: string;
  alt: string;
  tone?: "purple" | "pink";
  className?: string;
  altClassName?: string;
}) {
  const t = TONES[tone];
  return (
    <span className={`swap-group relative inline-block group/swap ${className}`}>
      <span className="block transition-opacity duration-200 group-hover/swap:opacity-0">{text}</span>
      <span
        aria-hidden="true"
        className={`swap-alt font-grunge normal-case pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap opacity-0 group-hover/swap:opacity-100 transition-opacity duration-200 ${t.cls} ${altClassName}`}
        style={{
          transform: "translate(-50%, -50%) skewX(-12deg) rotate(-3deg)",
          textShadow: t.shadow,
        }}
      >
        {alt}
      </span>
    </span>
  );
}
