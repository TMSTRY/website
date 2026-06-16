"use client";

import { useEffect, useState } from "react";

type Comment = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
};

function formatWhen(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot — must stay empty
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/comment?postId=${encodeURIComponent(postId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (active && Array.isArray(d.comments)) setComments(d.comments);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "sending") return;
    if (!name.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name: name.trim(), message: message.trim(), hp }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("sent");
      setName("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-obsidian/60 border border-white/[0.08] focus:border-glow-blue/40 outline-none text-soft-white/90 text-sm px-3 py-2.5 transition-colors duration-200 placeholder:text-silver/25";

  return (
    <div className="mt-10 pt-8 border-t border-white/[0.08]">
      <p
        className="font-mono text-[10px] uppercase mb-6"
        style={{ color: "rgba(79,195,247,0.8)", letterSpacing: "0.3em" }}
      >
        Reacties{comments.length > 0 ? ` · ${comments.length}` : ""}
      </p>

      {/* Existing comments */}
      {loading ? (
        <p className="text-silver/30 text-xs">Laden…</p>
      ) : comments.length === 0 ? (
        <p className="text-silver/30 text-xs mb-8">Nog geen reacties. Wees de eerste.</p>
      ) : (
        <ul className="space-y-5 mb-8">
          {comments.map((c) => (
            <li key={c._id} className="border-l-2 border-white/[0.08] pl-4">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-soft-white/80 text-sm">{c.name}</span>
                <span className="text-silver/25 text-[10px] tracking-widest uppercase" style={{ letterSpacing: "0.15em" }}>
                  {formatWhen(c.createdAt)}
                </span>
              </div>
              <p className="text-silver/65 text-sm leading-relaxed whitespace-pre-line">{c.message}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Form */}
      {status === "sent" ? (
        <div className="border border-glow-blue/20 bg-glow-blue/[0.04] px-4 py-4">
          <p className="text-glow-blue/80 text-sm">Bedankt! Je reactie is verstuurd en verschijnt zodra ze is goedgekeurd.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Je naam"
            maxLength={50}
            required
            className={inputClass}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Je reactie…"
            maxLength={2000}
            required
            rows={3}
            className={`${inputClass} resize-y`}
          />
          {/* Honeypot — hidden from humans */}
          <input
            type="text"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="text-[10px] tracking-widest uppercase border border-glow-blue/30 text-glow-blue px-5 py-2.5 hover:bg-glow-blue/10 hover:border-glow-blue/60 transition-all duration-300 disabled:opacity-40"
              style={{ letterSpacing: "0.2em" }}
            >
              {status === "sending" ? "Versturen…" : "Plaats reactie"}
            </button>
            {status === "error" && (
              <span className="text-glow-pink/80 text-xs">Er ging iets mis. Probeer opnieuw.</span>
            )}
          </div>
          <p className="text-silver/20 text-[10px] leading-relaxed">
            Reacties worden gemodereerd en verschijnen pas na goedkeuring.
          </p>
        </form>
      )}
    </div>
  );
}
