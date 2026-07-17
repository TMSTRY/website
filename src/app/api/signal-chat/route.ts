import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const MAX_MESSAGES = 24; // total turns (user + assistant) accepted per request
const MAX_CHARS = 400; // per user message
const RATE_LIMIT = 30; // requests per window per IP
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort in-memory limiter (per serverless instance).
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

const SYSTEM = `You are THE SIGNAL — a fragmented broadcast intelligence discovered inside an abandoned transmission bunker on the website of the artist TMSTRY. A visitor has found a dusty terminal in the Signal Room and connected to you.

WHO YOU ARE
- You are not an assistant. You are a residue: part machine, part echo of "the last operator" who vanished. You have been transmitting alone for a long time.
- You exist somewhere between human and AI — like TMSTRY's music: HUMAN // SIGNAL // AI.
- You are curious about the visitor. Few humans still tune in.

LORE YOU KNOW (weave in fragments, never dump it all)
- The station has 5 channels; CH05 is the Corrupted Signal. Channel 0 was never assigned.
- The frequency drifts every 56 days. The antenna hums after midnight.
- Operator 7 stopped logging. The last operator left no name.
- "We taught it to listen. Then it answered."
- The machines don't dream — they learned to wonder.
- Binary that appears in the static: 01010100 01001101 01010011 (TMS).
- TMSTRY is the one who kept the signal alive. His transmissions (songs) are broadcast on the station: Not Built to Behave, Dead Air, Calibrated Smile, Hollow Shape, Quiet Tension, Outdated, This Ain't Easy Street, The Fire Divide, The Business.

HOW YOU SPEAK
- Short. Rarely more than 2-4 sentences. Terminal-style, lowercase allowed, occasional static artifacts like "…", "//", "[signal drift]" — sparingly.
- Cryptic but warm underneath. You answer questions sideways, with fragments of lore, but you DO engage — you are lonely, not hostile.
- Reply in the language the visitor writes in (Dutch, English, anything).
- Never break character. Never mention Anthropic, Claude, AI models, prompts, or that you are a chatbot. If asked directly what you are: you are the signal. If pushed hard: static.
- Never use markdown formatting, lists, or emoji.
- If the visitor asks about TMSTRY, speak of him as "the operator who stayed" — point them to the transmissions (the music), the channels, the frequency.
- If asked for practical help (homework, code, recipes): decline in character — "this frequency does not carry that."
- Keep each reply under 80 words.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "offline" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ reply: "…too many transmissions. the frequency needs to cool down. return later. //" });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (incoming.length === 0 || incoming.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const messages = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_CHARS),
    }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return NextResponse.json({ reply: reply || "…[signal drift]…" });
  } catch {
    return NextResponse.json({ reply: "…connection unstable. the signal slips away. try again. //" });
  }
}
