import Link from "next/link";

/** Minimal, on-brand shell for static legal pages (Privacy, Terms). */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-obsidian px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-16">
          <Link
            href="/"
            className="font-display font-bold text-soft-white tracking-widest text-sm"
            style={{ letterSpacing: "0.35em" }}
          >
            TMSTRY
          </Link>
          <Link
            href="/"
            className="text-silver/50 hover:text-soft-white text-[10px] tracking-widest uppercase transition-colors duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            ← Back
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-8 bg-glow-blue/30" />
            <span
              className="text-glow-blue text-[9px] tracking-widest uppercase"
              style={{ letterSpacing: "0.4em" }}
            >
              Legal
            </span>
          </div>
          <h1
            className="font-display font-bold text-soft-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.04em" }}
          >
            {title}
          </h1>
          <p className="text-silver/30 text-[10px] tracking-widest uppercase mt-4" style={{ letterSpacing: "0.2em" }}>
            Last updated · {updated}
          </p>
        </div>

        {/* Body */}
        <div className="legal-body space-y-6 text-silver/70 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </main>
  );
}
