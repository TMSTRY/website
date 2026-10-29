import { createHash } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";

/**
 * Newsletter sign-ups, for tmstry.com and the BROADCAST site (which forwards its own here, so the
 * write token stays in this project only). Stored in Sanity as a "subscriber" under a private path,
 * one per address (a second sign-up changes nothing). A honeypot field, a limit per sender (the
 * BROADCAST site limits its own visitors before it passes them on; to this its requests all come from
 * its server, so that limit is looser here) and a ceiling on new sign-ups per hour keep bots out.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCES = new Set(["tmstry.com", "broadcast"]);
const recent = new Map<string, number[]>();
let hour: number[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) ?? {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" && SOURCES.has(body.source) ? body.source : "tmstry.com";
    // Bot honeypot: pretend it worked, store nothing
    if (typeof body.hp === "string" && body.hp) return NextResponse.json({ ok: true });
    if (email.length > 254 || !EMAIL.test(email)) return NextResponse.json({ error: "That address does not look right." }, { status: 400 });

    // at most 30 sign-ups per sender in 10 minutes and 300 in an hour in all (per server instance)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
    const now = Date.now(), times = (recent.get(ip) ?? []).filter((t) => now - t < 600000);
    hour = hour.filter((t) => now - t < 3600000);
    if (times.length >= 30 || hour.length >= 300) return NextResponse.json({ error: "Too many sign-ups. Try again later." }, { status: 429 });
    if (recent.size > 5000) recent.clear();
    recent.set(ip, [...times, now]);
    hour.push(now);

    const id = `subscriber.${createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
    await writeClient.createIfNotExists({ _id: id, _type: "subscriber", email: email, source: source, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No signal right now." }, { status: 502 });
  }
}
