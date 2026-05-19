import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TMSTRY — Human // Signal // AI",
  description: "TMSTRY is an AI-inspired music artist blending futuristic aesthetics with human emotion. Human emotion through artificial minds.",
  keywords: ["TMSTRY", "electronic music", "AI music", "futuristic", "cinematic"],
  openGraph: {
    title: "TMSTRY — Human // Signal // AI",
    description: "Human emotion through artificial minds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TMSTRY — Human // Signal // AI",
    description: "Human emotion through artificial minds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080a0e" />
      </head>
      <body className="bg-obsidian text-soft-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
