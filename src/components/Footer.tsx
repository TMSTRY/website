import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { latestPostMetaQuery } from "@/sanity/lib/queries";

type LatestPost = { title: string; date?: string; slug?: string } | null;

function fmtDate(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

export default async function Footer() {
  const latest: LatestPost = await client
    .fetch(latestPostMetaQuery, {}, { next: { tags: ["newsPost"] } })
    .catch(() => null);

  return (
    <footer className="relative border-t border-white/[0.04] py-12 px-6 md:px-12">
      {/* Top divider glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(79,195,247,0.15), transparent)" }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span
              className="font-display font-black text-soft-white/80 text-sm"
              style={{ letterSpacing: "0.4em" }}
            >
              TMSTRY
            </span>
            <span className="text-silver/30 text-[10px] tracking-widest" style={{ letterSpacing: "0.2em" }}>
              Human // Signal // AI
            </span>
          </div>

          {/* Center — signal icon */}
          <div className="flex items-center gap-3 opacity-20">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-glow-blue/50" />
            <div className="w-1 h-1 rounded-full bg-glow-blue" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-glow-pink/50" />
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-silver/25 text-[10px] tracking-widest" style={{ letterSpacing: "0.2em" }}>
              © {new Date().getFullYear()} TMSTRY. All rights reserved.
            </p>
            <p className="text-silver/15 text-[9px] tracking-widest" style={{ letterSpacing: "0.15em" }}>
              Human emotion through artificial minds.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Press", href: "/#press" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-silver/25 hover:text-silver/60 text-[10px] tracking-widest uppercase transition-colors duration-300"
                style={{ letterSpacing: "0.2em" }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-glow-blue animate-pulse opacity-60" />
            {latest?.title ? (
              <Link
                href={latest.slug ? `/news/${latest.slug}` : "/news"}
                className="text-silver/35 hover:text-glow-blue/70 text-[9px] font-mono tracking-widest transition-colors duration-300 line-clamp-1 max-w-[70vw] sm:max-w-[420px]"
              >
                LAST TRANSMISSION{fmtDate(latest.date) ? ` // ${fmtDate(latest.date)}` : ""} — {latest.title.toUpperCase()}
              </Link>
            ) : (
              <span className="text-silver/40 text-[9px] font-mono tracking-widest opacity-75">SIGNAL ACTIVE</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
