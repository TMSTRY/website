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
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        This Privacy Policy explains how the TMSTRY website (<strong>tmstry.com</strong>)
        and the BROADCAST site handle information when you visit. TMSTRY is an independent
        music project; these sites are a portfolio and link hub, not a store or account-based service.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        What we collect
      </h2>
      <p>
        We do not ask you to create an account and we do not collect payment details. We only
        keep what you choose to give us: a name and a message when you comment on a news post,
        and your e-mail address when you sign up for the newsletter. The rest stays in your own
        browser: small preferences and progress (such as the <code>theme</code> or the lights you
        found) saved in <em>localStorage</em>. You can clear them at any time via your browser settings.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Newsletter
      </h2>
      <p>
        If you sign up, your e-mail address is stored in our content system (Sanity), out of public
        view, and used only to send you TMSTRY news: new music and videos. It is never sold or shared.
        To be taken off the list, write to{" "}
        <a href="mailto:contact@tmstry.com" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">contact@tmstry.com</a>{" "}
        and your address is deleted.
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
        IP address and user agent) for security and operational purposes. Visits are counted with
        Vercel Web Analytics, which uses no cookies. See{" "}
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
