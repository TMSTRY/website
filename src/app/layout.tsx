import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Rubik_Distressed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SignalRoomProvider } from "@/context/SignalRoomContext";
import ScrollProgress from "@/components/ScrollProgress";
import ConsoleSignal from "@/components/ConsoleSignal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const rubikDistressed = Rubik_Distressed({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-grunge",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tmstry.com"),
  title: "TMSTRY — Human // Signal // AI",
  description: "TMSTRY is an AI-inspired music artist blending futuristic aesthetics with human emotion. Human emotion through artificial minds.",
  keywords: ["TMSTRY", "electronic music", "AI music", "futuristic", "cinematic"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "TMSTRY — Human // Signal // AI",
    description: "Human emotion through artificial minds.",
    type: "website",
    url: "https://tmstry.com",
    siteName: "TMSTRY",
    images: [
      {
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "TMSTRY",
  url: "https://tmstry.com",
  genre: ["Electronic", "Cinematic", "AI-Hybrid"],
  image: "https://tmstry.com/og.png",
  description: "Human emotion through artificial minds.",
  sameAs: [
    "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw",
    "https://music.apple.com/us/artist/tmstry/646739670",
    "https://music.youtube.com/@TMSTRY-music",
    "https://www.youtube.com/@TMSTRY-music",
    "https://www.instagram.com/tmstry/",
    "https://soundcloud.com/tmstry",
    "https://www.tiktok.com/@tmstry",
    "https://x.com/TMSTRYmusic",
    "https://music.amazon.com/artists/B00CQATSF0/tmstry",
    "https://www.deezer.com/en/artist/4768699",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${rubikDistressed.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tmstry-theme');if(t==='light'||t==='slate'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080a0e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-obsidian text-soft-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        <ScrollProgress />
        <ConsoleSignal />
        <ThemeProvider>
          <SignalRoomProvider>{children}</SignalRoomProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
