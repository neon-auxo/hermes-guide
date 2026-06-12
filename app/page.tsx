// app/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { ChapterCards } from "@/components/home/chapter-cards";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ChapterCards />
    </>
  );
}
