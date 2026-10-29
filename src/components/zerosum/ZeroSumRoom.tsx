"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ScreeningState = {
  serverNow: number;
  targetAt: number;
  startedAt: number | string | null;
  endedAt: number | string | null;
};

// The album's palette (zerosum.tmstry.com). Brass is the only accent.
const SOOT = "#0C0B09";
const IRON = "#16130F";
const BRASS = "#C9913F";
const BONE = "#E6DFD2";
const ASH = "#8A8175";
const OXIDE = "#6E3B25";

const SITE = "https://zerosum.tmstry.com";

const TRACKS = [
  { n: 1, slug: "escapement", title: "Escapement", duration: "3:39" },
  { n: 2, slug: "rule-of-three", title: "Rule of Three", duration: "3:57" },
  { n: 3, slug: "going-once", title: "Going Once", duration: "3:21" },
  { n: 4, slug: "compound", title: "Compound", duration: "3:34" },
  { n: 5, slug: "say-it-again", title: "Say It Again", duration: "4:23" },
  { n: 6, slug: "rewind", title: "Rewind", duration: "3:49" },
  { n: 7, slug: "borrowed-light", title: "Borrowed Light", duration: "3:39" },
  { n: 8, slug: "zero", title: "Zero", duration: "3:34" },
];
const TOTAL = "29:56";

type Phase = "countdown" | "open" | "live" | "archive";

const ARCHIVE_AFTER_MS = 6 * 60 * 60 * 1000; // the night is over, the album is out

function phaseAt(s: ScreeningState, now: number): Phase {
  if (now < s.targetAt) return "countdown";
  if (s.endedAt || now > s.targetAt + ARCHIVE_AFTER_MS) return "archive";
  if (s.startedAt) return "live";
  return "open";
}

/** the screening's day and hour as the room has them (Brussels), from the album site's own time */
function when(t: number) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  // (the zone by its offset from UTC, not the browser's name for it, so server and browser agree)
  const off = (Number(p.hour) - new Date(t).getUTCHours() + 24) % 24;
  return { day: `${p.day} · ${p.month} · ${p.year}`, hour: `${p.hour}:${p.minute} ${off === 2 ? "CEST" : "CET"}` };
}

function split(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { v: pad(Math.floor(t / 86400)), unit: "days" },
    { v: pad(Math.floor((t % 86400) / 3600)), unit: "hrs" },
    { v: pad(Math.floor((t % 3600) / 60)), unit: "min" },
    { v: pad(t % 60), unit: "sec" },
  ];
}

/** One split-flap tile: the character flips over when it changes. */
function Flap({ ch, still }: { ch: string; still: boolean }) {
  return (
    <span
      className="relative inline-flex items-center justify-center w-[1.05em] h-[1.45em] overflow-hidden"
      style={{ background: IRON, border: `1px solid ${BRASS}40`, perspective: 400, borderRadius: 2 }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={ch}
          initial={still ? false : { rotateX: -90, opacity: 0.3 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={still ? undefined : { rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ color: BONE, display: "inline-block", transformOrigin: "50% 50%" }}
        >
          {ch}
        </motion.span>
      </AnimatePresence>
      {/* the hinge */}
      <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-px" style={{ background: "rgba(0,0,0,0.65)" }} />
    </span>
  );
}

export default function ZeroSumRoom({ state, displayFont }: { state: ScreeningState; displayFont: string }) {
  const reduce = useReducedMotion() ?? false;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const phase: Phase = now === null ? "countdown" : phaseAt(state, now);
  const units = now === null ? split(Math.max(0, state.targetAt - state.serverNow)) : split(state.targetAt - now);
  const ready = now !== null;

  const w = when(state.targetAt);
  const plate =
    phase === "countdown" ? `Private screening · ${w.day} · ${w.hour}`
    : phase === "open" ? "The room is open · the film starts soon"
    : phase === "live" ? "The film is running · come in, you'll join in sync"
    : "Out now · every track, every lyric, every number";

  const cta =
    phase === "countdown" ? "Enter the room"
    : phase === "archive" ? "Visit the album"
    : "Enter now";

  const stamp = phase === "archive" ? "Sold" : `On sale ${w.day}`;

  return (
    <section id="zerosum" className="relative overflow-hidden" style={{ background: SOOT }}>
      {/* ── the room: workshop still, one shared grade, one window of light ── */}
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src="/zerosum/workshop-empty-960.webp"
          srcSet="/zerosum/workshop-empty-960.webp 960w, /zerosum/workshop-empty-1672.webp 1672w"
          sizes="100vw"
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "contrast(1.08) saturate(0.85) brightness(0.55)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 72% 30%, rgba(201,145,63,.18), transparent 60%), linear-gradient(180deg, rgba(12,11,9,.35), rgba(12,11,9,.85))",
          }}
        />
        {/* the beam — the one moment of motion */}
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(68% 0%, 86% 0%, 48% 100%, 14% 100%)",
            background: "linear-gradient(180deg, rgba(201,145,63,0.16), rgba(201,145,63,0.02) 85%)",
            mixBlendMode: "screen",
          }}
          animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(12,11,9,0.92) 100%)" }}
        />
        {/* hand-over from the blue signal to the brass room */}
        <div className="absolute top-0 left-0 right-0 h-24" style={{ background: `linear-gradient(180deg, #050608, transparent)` }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* intercepted label */}
        <div className="flex items-center gap-3 mb-14 md:mb-20">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRASS, boxShadow: `0 0 8px ${BRASS}` }} />
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] uppercase" style={{ color: `${BRASS}cc` }}>
            Transmission 005 // intercepted · a different room
          </span>
          <span className="h-px flex-1 max-w-[180px]" style={{ background: `linear-gradient(90deg, ${BRASS}66, transparent)` }} />
        </div>

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-16 lg:gap-20 items-center">
          {/* ── left: title, plate, flaps, door ── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: ASH }}>
              New album · TMSTRY
            </p>
            <h2
              className={`${displayFont} uppercase leading-[0.9]`}
              style={{
                color: BONE,
                fontWeight: 600,
                fontStretch: "125%",
                letterSpacing: "0.06em",
                fontSize: "clamp(3rem, 9vw, 7.5rem)",
                textShadow: "0 0 40px rgba(201,145,63,0.15)",
              }}
            >
              Zero
              <br />
              Sum
            </h2>
            <p className="mt-6 max-w-md text-sm md:text-base leading-relaxed" style={{ color: ASH }}>
              Eight tracks about time, debt and silence. One narrator who measures his life in units:
              minutes, bids, repetitions, threes.
            </p>

            {/* engraved plate */}
            <p
              className="mt-10 inline-block font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase px-3 py-2"
              style={{ color: BRASS, border: `1px solid ${BRASS}55`, borderRadius: 2 }}
            >
              {plate}
            </p>

            {/* split-flap counter: empties instead of fills */}
            <div
              className={`${displayFont} mt-6 flex items-end gap-3 md:gap-5`}
              style={{ fontWeight: 600, fontStretch: "125%", fontSize: "clamp(1.6rem, 4.2vw, 2.9rem)" }}
              role="timer"
              aria-label={ready ? `${units[0].v} days ${units[1].v} hours ${units[2].v} minutes until the screening` : "Countdown to the screening"}
            >
              {units.map((u, i) => (
                <div key={u.unit} className="flex items-end gap-3 md:gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-[3px]">
                      {u.v.split("").map((ch, j) => (
                        <Flap key={j} ch={ready ? ch : "–"} still={reduce || !ready} />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em] uppercase" style={{ color: ASH, fontStretch: "100%" }}>
                      {u.unit}
                    </span>
                  </div>
                  {i < units.length - 1 && (
                    <span className="pb-6 text-[0.6em]" style={{ color: `${BRASS}80` }} aria-hidden="true">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* the door */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href={SITE}
                className="group inline-flex items-center gap-3 px-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors duration-300"
                style={{ color: SOOT, background: BRASS, borderRadius: 2 }}
              >
                {cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
              <a
                href={SITE}
                className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hover:text-[#E6DFD2]"
                style={{ color: ASH }}
              >
                Trailer · 1:24
              </a>
            </div>
          </div>

          {/* ── right: the cover, stapled to a receipt ── */}
          <div className="relative mx-auto w-full max-w-[380px]">
            <div
              className="relative px-6 pt-6 pb-7 font-mono text-[11px] leading-relaxed"
              style={{
                background: BONE,
                color: SOOT,
                transform: "rotate(-1.5deg)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.2)",
                borderRadius: 2,
              }}
            >
              {/* cover, pinned */}
              <img
                src="/zerosum/cover-512.webp"
                srcSet="/zerosum/cover-512.webp 512w, /zerosum/cover-1024.webp 1024w"
                sizes="140px"
                alt="ZERO SUM album cover"
                loading="lazy"
                className="absolute -top-8 -right-6 w-[120px] md:w-[140px] aspect-square object-cover"
                style={{ transform: "rotate(4deg)", border: `1px solid ${BRASS}`, boxShadow: "0 12px 30px rgba(0,0,0,0.55)" }}
              />
              <span
                aria-hidden="true"
                className="absolute -top-9 right-12 md:right-14 w-6 h-2"
                style={{ background: "#9a9387", transform: "rotate(4deg)", borderRadius: 1 }}
              />

              <p className="tracking-[0.25em] uppercase text-[10px] pr-24">TMSTRY</p>
              <p className="tracking-[0.25em] uppercase text-[10px] pr-24">Zero Sum</p>
              <p className="mt-1 tracking-[0.2em] uppercase text-[9px] opacity-60">Receipt · {w.day}</p>

              <div className="my-4 border-t border-dashed" style={{ borderColor: "rgba(12,11,9,0.35)" }} />

              <ul className="space-y-1">
                {TRACKS.map((t) => (
                  <li key={t.slug}>
                    <a
                      href={`${SITE}/album/${t.slug}`}
                      className="group flex items-baseline gap-2 transition-colors duration-200 hover:text-[#6E3B25]"
                    >
                      <span className="opacity-50 w-4 text-right">{t.n}</span>
                      <span className="uppercase tracking-wider text-[10px] whitespace-nowrap">{t.title}</span>
                      <span className="flex-1 border-b border-dotted translate-y-[-3px]" style={{ borderColor: "rgba(12,11,9,0.3)" }} />
                      <span className="tabular-nums">{t.duration}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="my-4 border-t border-dashed" style={{ borderColor: "rgba(12,11,9,0.35)" }} />

              <div className="flex items-baseline justify-between uppercase tracking-[0.2em] text-[10px] font-bold">
                <span>Total · Zero Sum</span>
                <span className="tabular-nums">{TOTAL}</span>
              </div>
              <p className="mt-3 text-[9px] tracking-[0.2em] uppercase opacity-60">Paid in time. No refunds.</p>

              {/* stamp */}
              <span
                className="absolute bottom-5 right-4 px-2 py-1 text-[9px] tracking-[0.25em] uppercase font-bold"
                style={{ color: OXIDE, border: `1.5px solid ${OXIDE}`, transform: "rotate(-8deg)", opacity: 0.85, borderRadius: 2 }}
              >
                {stamp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* hand-back to the blue signal */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${BRASS}55, transparent)` }} />
    </section>
  );
}
