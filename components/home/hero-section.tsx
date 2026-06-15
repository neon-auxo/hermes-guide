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
        Hermes 쉽게 따라하기
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Hermes는 memory를 쌓고, skill을 저장하고, Slack 같은 메신저와도 연결되는 오픈소스 AI 에이전트입니다.{" "}
        처음 설치해서 직접 써보려는 분을 위해, CLI 설치부터 Slack 연결, model 설정, GUI 설치까지 순서대로 따라올 수 있게 정리했습니다.
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
