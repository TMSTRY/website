import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use — TMSTRY",
  description: "Terms for using the TMSTRY website.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="June 2026">
      <p>
        By accessing the TMSTRY website (<strong>tmstry.com</strong>) you agree to these
        Terms of Use. If you do not agree, please do not use the site.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Content &amp; intellectual property
      </h2>
      <p>
        All music, visuals, text, logos, and design on this site are the property of TMSTRY
        or its respective rights holders, unless otherwise stated. You may share links to the
        site freely, but you may not reproduce, redistribute, or use the content for
        commercial purposes without written permission.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Third-party links &amp; embeds
      </h2>
      <p>
        This site links to and embeds third-party platforms (e.g. Spotify, Apple Music,
        YouTube, and social networks). TMSTRY is not responsible for the content, availability,
        or policies of those external services.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        No warranty
      </h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. We aim to keep
        it available and accurate but cannot guarantee uninterrupted access or that all
        information is error-free.
      </p>

      <h2 className="text-soft-white font-display font-semibold text-lg pt-4" style={{ letterSpacing: "0.04em" }}>
        Contact
      </h2>
      <p>
        Questions about these terms? Reach out at{" "}
        <a href="mailto:contact@tmstry.com" className="text-glow-blue/70 hover:text-glow-blue underline underline-offset-4">contact@tmstry.com</a>.
      </p>
    </LegalPage>
  );
}
