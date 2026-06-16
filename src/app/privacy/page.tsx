import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — TMSTRY",
  description: "How TMSTRY handles data on tmstry.com.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains how the TMSTRY website (<strong>tmstry.com</strong>)
        handles information when you visit. TMSTRY is an independent music project; this
        site is a portfolio and link hub, not a store or account-based service.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        What we collect
      </h2>
      <p>
        We do not ask you to create an account and we do not collect names, emails, or
        payment details through this site. The only data stored in your browser is a small{" "}
        <code>theme</code> preference (dark / light) saved in <em>localStorage</em> so the
        site remembers your choice. You can clear it at any time via your browser settings.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Third-party content
      </h2>
      <p>
        Some sections embed content from third parties — Spotify (music player) and YouTube
        (video player). When these embeds load, the providers may set their own cookies and
        process data according to their own policies. We have no control over that data and
        recommend reviewing the privacy policies of{" "}
        <a href="https://www.spotify.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">Spotify</a>{" "}
        and{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">Google / YouTube</a>.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Hosting
      </h2>
      <p>
        The site is hosted on Vercel, which may log standard technical request data (such as
        IP address and user agent) for security and operational purposes. See{" "}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">Vercel&rsquo;s privacy policy</a>.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Contact
      </h2>
      <p>
        Questions about this policy? Reach out at{" "}
        <a href="mailto:contact@tmstry.com" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">contact@tmstry.com</a>.
      </p>
    </LegalPage>
  );
}
