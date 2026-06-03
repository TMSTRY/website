import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

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
    url: "https://tmstry.com",
    siteName: "TMSTRY",
    images: [
      {
        url: "https://tmstry.com/Spotify Banner.png",
        width: 1200,
        height: 630,
        alt: "TMSTRY — Human // Signal // AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TMSTRY — Human // Signal // AI",
    description: "Human emotion through artificial minds.",
    images: ["https://tmstry.com/Spotify Banner.png"],
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
        <link rel="icon" href="/glyph favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/glyph favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080a0e" />
      </head>
      <body className="bg-obsidian text-soft-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
