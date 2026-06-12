// components/home/hero-section.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-4 text-5xl">🪬</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        헤르메스 쉽게 따라하기
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        코딩 몰라도 OK. AI 에이전트 <strong className="text-primary">Hermes</strong>를 처음부터 차근차근 설치하고 Slack에 연결해봅니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/guide/what-is-hermes" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          시작하기 <ArrowRight className="size-4" />
        </Link>
        <Link href="/guide/prerequisites/slack-setup" className={buttonVariants({ variant: "outline", size: "lg" })}>
          사전 준비 확인
        </Link>
      </div>
    </section>
  );
}
