"use client";

import { useEffect, useState } from "react";

const btn =
  "flex items-center justify-center w-9 h-9 border border-white/[0.08] text-silver/50 hover:text-soft-white hover:border-white/30 transition-colors duration-200";

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const enc = encodeURIComponent;
  const shareText = title;

  const links = {
    x: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    whatsapp: `https://wa.me/?text=${enc(`${shareText} ${url}`)}`,
    email: `mailto:?subject=${enc(shareText)}&body=${enc(`${shareText}\n\n${url}`)}`,
  };

  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const onNative = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({ title, url });
    } catch {
      /* user cancelled / unsupported */
    }
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span
        className="text-[9px] tracking-widest uppercase text-silver/30"
        style={{ letterSpacing: "0.3em" }}
      >
        Share
      </span>

      <div className="flex items-center gap-2">
        {/* Copy link */}
        <button onClick={onCopy} className={btn} aria-label="Copy link" title="Copy link">
          {copied ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current text-glow-blue" strokeWidth={1.8}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.6}>
              <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Native share (mobile) */}
        {canNativeShare && (
          <button onClick={onNative} className={btn} aria-label="Share" title="Share">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.6}>
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* X / Twitter */}
        <a href={links.x} target="_blank" rel="noopener noreferrer" onClick={stop} className={btn} aria-label="Share on X" title="Share on X">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.849L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Facebook */}
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" onClick={stop} className={btn} aria-label="Share on Facebook" title="Share on Facebook">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
          </svg>
        </a>

        {/* WhatsApp */}
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" onClick={stop} className={btn} aria-label="Share on WhatsApp" title="Share on WhatsApp">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* Email */}
        <a href={links.email} onClick={stop} className={btn} aria-label="Share by email" title="Share by email">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.6}>
            <rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3.5 6.5l8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {copied && (
        <span className="text-[9px] tracking-widest uppercase text-glow-blue/80" style={{ letterSpacing: "0.25em" }}>
          Copied
        </span>
      )}
    </div>
  );
}
