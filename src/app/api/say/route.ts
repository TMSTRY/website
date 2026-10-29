import { timingSafeEqual } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";

/**
 * "Say it anyway", for the BROADCAST site (which passes its visitors' lines on to here, so the write
 * token stays in this project): one line, kept as a "broadcastWindow", shown at once as a lit window
 * at the end of that site's walk. A line is short and plain words: invisible and look-alike characters
 * are folded away, and links, e-mail addresses and phone numbers are refused. With SAY_SECRET set in
 * both projects (the same value), only the BROADCAST site gets in, and it passes on who its visitor is,
 * so the limit here is per visitor; without it, per sender. A honeypot field and a ceiling per hour
 * keep bots out; Tim hides or deletes any in the Studio (a line with personal details: delete it, the
 * dataset is public).
 */
const MAX = 80;
const LINK = /(https?:\/\/|\bwww\.|\b[\p{L}\p{N}-]+\s*\.\s*(com|net|org|be|nl|io|co|me|ly|app|xyz|info|ru|tk|link|site|online|shop)\b)/iu;
const MAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/u;
const PHONE = /(?:\d[\s().\/-]{0,2}){9,}/u;
const recent = new Map<string, number[]>();
let hour: number[] = [];

/** the line as plain words: look-alikes folded (NFKC), invisible and direction characters out, one space */
const plain = (t: string) => t.normalize("NFKC").replace(/\p{Cf}/gu, "").replace(/(\p{M})\p{M}+/gu, "$1").replace(/\s+/g, " ").trim();
const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) ?? {};
    if (typeof body.hp === "string" && body.hp) return NextResponse.json({ ok: true, id: null });
    const secret = process.env.SAY_SECRET;
    const ours = !!secret && same(req.headers.get("x-say-secret") ?? "", secret);
    if (secret && !ours) return NextResponse.json({ error: "Not from here." }, { status: 403 });
    const text = typeof body.text === "string" ? plain(body.text) : "";
    if (text.length < 1 || text.length > MAX || !/[\p{L}\p{N}]/u.test(text)) return NextResponse.json({ error: `One line, 1 to ${MAX} characters.` }, { status: 400 });
    if (LINK.test(text) || MAIL.test(text) || PHONE.test(text)) return NextResponse.json({ error: "Just words: no links, addresses or phone numbers." }, { status: 400 });
    // (the BROADCAST site passes its visitor on once it has proved itself; otherwise the sender)
    const ip = (ours && req.headers.get("x-visitor-ip")?.trim()) || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
    const now = Date.now(), times = (recent.get(ip) ?? []).filter((t) => now - t < 600000);
    hour = hour.filter((t) => now - t < 3600000);
    if (times.length >= (ours ? 3 : 30) || hour.length >= 200) return NextResponse.json({ error: "Too many lines at once. Try again later." }, { status: 429 });
    if (recent.size > 5000) recent.clear();
    recent.set(ip, [...times, now]);
    hour.push(now);
    const doc = await writeClient.create({ _type: "broadcastWindow", text: text, createdAt: new Date().toISOString(), hidden: false });
    return NextResponse.json({ ok: true, id: doc._id });
  } catch {
    return NextResponse.json({ error: "No signal right now." }, { status: 502 });
  }
}
