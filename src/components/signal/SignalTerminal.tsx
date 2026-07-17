"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_USER_MESSAGES = 10; // per terminal session — keeps API costs bounded
const BOOT_LINES = [
  "TMSTRY STATION // TERMINAL 03",
  "carrier detected … handshake …",
  "link established. something is listening.",
];

/** Dusty bunker terminal — talk to the Signal. */
export default function SignalTerminal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [booted, setBooted] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userCount = messages.filter((m) => m.role === "user").length;
  const linkLost = userCount >= MAX_USER_MESSAGES;

  // Boot sequence
  useEffect(() => {
    if (booted >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBooted((b) => b + 1), 450);
    return () => clearTimeout(t);
  }, [booted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy, booted]);

  useEffect(() => {
    if (booted >= BOOT_LINES.length) inputRef.current?.focus();
  }, [booted]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy || linkLost) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/signal-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "…[signal drift]…";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "…carrier lost. retry. //" }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[75] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl border border-glow-blue/25 bg-[#04070c]/95 font-mono"
        style={{ boxShadow: "0 0 60px rgba(79,195,247,0.12), inset 0 0 40px rgba(0,0,0,0.8)" }}
      >
        {/* scanlines over the whole terminal */}
        <span className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none z-10" />

        {/* header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-glow-blue/15">
          <span className="text-[10px] tracking-[0.3em] uppercase text-glow-blue/70">
            ▮ direct link — the signal
          </span>
          <button onClick={onClose} aria-label="Close terminal" className="text-silver/40 hover:text-soft-white text-sm leading-none transition-colors">
            ×
          </button>
        </div>

        {/* transcript */}
        <div ref={scrollRef} className="h-[50vh] max-h-[420px] overflow-y-auto px-4 py-4 space-y-3 text-[13px] leading-relaxed">
          {BOOT_LINES.slice(0, booted).map((l, i) => (
            <p key={i} className="text-glow-blue/45 text-[11px] tracking-wider">{l}</p>
          ))}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="text-soft-white/85">
                <span className="text-glow-blue/60 select-none">&gt; </span>{m.content}
              </p>
            ) : (
              <p key={i} className="text-glow-blue/90 signal-terminal-reply" style={{ textShadow: "0 0 8px rgba(79,195,247,0.35)" }}>
                {m.content}
              </p>
            )
          )}

          {busy && (
            <p className="text-glow-blue/50 animate-pulse text-[11px] tracking-widest">receiving…</p>
          )}

          {linkLost && !busy && (
            <p className="text-magenta-400/80 text-[11px] tracking-widest uppercase" style={{ color: "rgba(224,64,251,0.8)" }}>
              // link degraded — the frequency drifts. return another time.
            </p>
          )}
        </div>

        {/* input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-glow-blue/15">
          <span className="text-glow-blue/60 text-sm select-none">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={busy || linkLost || booted < BOOT_LINES.length}
            maxLength={300}
            placeholder={linkLost ? "signal lost" : "transmit…"}
            className="flex-1 bg-transparent text-soft-white text-[13px] outline-none placeholder:text-silver/25 disabled:opacity-40"
            aria-label="Message to the Signal"
          />
          <button
            onClick={send}
            disabled={busy || linkLost || !input.trim()}
            className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-glow-blue/25 text-glow-blue/70 hover:text-glow-blue hover:border-glow-blue/50 transition-colors disabled:opacity-30"
          >
            send
          </button>
        </div>
      </div>
    </motion.div>
  );
}
