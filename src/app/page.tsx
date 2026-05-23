import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import VideoSection from "@/components/VideoSection";
import AboutSection from "@/components/AboutSection";
import SocialSection from "@/components/SocialSection";
import PressSection from "@/components/PressSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen bg-obsidian">
      <CustomCursor />
      <Nav />
      <HeroSection />

      {/* Section divider */}
      <div className="section-divider mx-12 md:mx-24" />

      <MusicSection />

      <div className="section-divider mx-12 md:mx-24" />

      <VideoSection />

      <div className="section-divider mx-12 md:mx-24" />

      <AboutSection />

      <div className="section-divider mx-12 md:mx-24" />

      <PressSection />

      <div className="section-divider mx-12 md:mx-24" />

      <NewsSection />

      <div className="section-divider mx-12 md:mx-24" />

      <SocialSection />

      <Footer />
    </main>
  );
}
