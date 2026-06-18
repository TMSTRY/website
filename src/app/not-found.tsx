import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-obsidian flex items-center justify-center px-6 overflow-hidden">
      {/* atmosphere */}
      <div className="absolute inset-0 crt-scanlines opacity-[0.08] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)" }} />
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(79,195,247,0.06), transparent 70%)" }}
      />

      {/* wordmark */}
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-10 font-display font-bold text-soft-white text-sm tracking-widest"
        style={{ letterSpacing: "0.35em" }}
      >
        TMSTRY
      </Link>

      <div className="relative z-10 text-center max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-8 bg-glow-blue/40" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-glow-blue/80">
            Signal lost
          </span>
          <span className="h-px w-8 bg-glow-blue/40" />
        </div>

        <h1
          className="signal-glitch crt-flicker font-display font-black text-soft-white leading-none select-none"
          style={{
            fontSize: "clamp(5rem, 22vw, 12rem)",
            letterSpacing: "0.05em",
            textShadow: "3px 0 rgba(79,195,247,0.5), -3px 0 rgba(224,64,251,0.5), 0 0 50px rgba(79,195,247,0.2)",
          }}
        >
          404
        </h1>

        <p className="text-silver/70 text-sm md:text-base mt-6 leading-relaxed">
          Dead air. The transmission you tuned into doesn&apos;t exist — or it was never meant to be found.
        </p>
        <p className="text-silver/30 text-xs mt-3 font-mono tracking-wider">
          Some signals are hidden. Keep looking.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 mt-10 text-[10px] tracking-widest uppercase border border-glow-blue/30 text-glow-blue px-6 py-3 hover:bg-glow-blue/10 hover:border-glow-blue/60 transition-all duration-300"
          style={{ letterSpacing: "0.25em" }}
        >
          ← Back to broadcast
        </Link>
      </div>
    </main>
  );
}
