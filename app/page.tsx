// app/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { ChapterCards } from "@/components/home/chapter-cards";
import { Starfield } from "@/components/home/starfield";

export default function Home() {
  return (
    <div className="relative">
      {/* ambient background layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* drifting color orbs — aurora glow */}
        <div
          className="absolute left-[5%] top-0 h-[700px] w-[700px] rounded-full bg-primary/18 blur-[140px]"
          style={{ animation: "drift-a 14s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[5%] top-[25%] h-[550px] w-[550px] rounded-full bg-violet-500/12 blur-[120px]"
          style={{ animation: "drift-b 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-[120px]"
          style={{ animation: "drift-c 18s ease-in-out infinite" }}
        />
        {/* twinkling stars */}
        <Starfield />
      </div>

      <HeroSection />
      <ChapterCards />
    </div>
  );
}
