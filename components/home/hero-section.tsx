// components/home/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        <Button asChild size="lg" className="gap-2">
          <Link href="/guide/what-is-hermes">
            시작하기 <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/guide/prerequisites/slack-setup">사전 준비 확인</Link>
        </Button>
      </div>
    </section>
  );
}
