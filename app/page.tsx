// app/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { ChapterCards } from "@/components/home/chapter-cards";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-[10%] top-[5%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]"
          style={{ animation: "drift-a 14s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[8%] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/7 blur-[100px]"
          style={{ animation: "drift-b 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[10%] left-[35%] h-[400px] w-[400px] rounded-full bg-indigo-400/6 blur-[100px]"
          style={{ animation: "drift-c 18s ease-in-out infinite" }}
        />
      </div>

      <HeroSection />
      <ChapterCards />
    </div>
  );
}
