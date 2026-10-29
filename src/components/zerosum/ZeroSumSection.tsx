import { Archivo } from "next/font/google";
import ZeroSumRoom, { type ScreeningState } from "./ZeroSumRoom";

// The cover title's wide mechanical grotesk (same face as zerosum.tmstry.com)
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const FALLBACK: ScreeningState = {
  serverNow: 0,
  targetAt: Date.parse("2026-11-06T23:20:00+01:00"),
  startedAt: null,
  endedAt: null,
};

/** Reads the live screening state from the album site; falls back to the planned date. */
async function getState(): Promise<ScreeningState> {
  try {
    const res = await fetch("https://zerosum.tmstry.com/api/time", { next: { revalidate: 60 } });
    if (!res.ok) return FALLBACK;
    const s = await res.json();
    if (typeof s?.targetAt !== "number") return FALLBACK;
    return {
      serverNow: typeof s.serverNow === "number" ? s.serverNow : 0,
      targetAt: s.targetAt,
      startedAt: s.startedAt ?? null,
      endedAt: s.endedAt ?? null,
    };
  } catch {
    return FALLBACK;
  }
}

export default async function ZeroSumSection() {
  const state = await getState();
  return <ZeroSumRoom state={state} displayFont={archivo.className} />;
}
