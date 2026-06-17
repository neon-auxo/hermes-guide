// components/home/hero-section.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
        <div className="h-[360px] w-[720px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
          <BrainCircuit className="size-3.5" />
          오픈소스 AI 에이전트 · Nous Research
        </div>

        {/* title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-br from-foreground via-foreground to-primary/70 bg-clip-text text-transparent">
            Hermes
          </span>{" "}
          <span className="text-foreground">쉽게 따라하기</span>
        </h1>

        {/* description */}
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          memory를 쌓고, skill을 저장하고, Slack에서 바로 쓸 수 있는 AI 에이전트.
          CLI 설치부터 Slack 연결, 모델 설정, GUI까지 순서대로 따라올 수 있게 정리했습니다.
        </p>

        {/* quick-start */}
        <div className="mt-7 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm">
          <Terminal className="size-4 shrink-0 text-muted-foreground" />
          <code className="font-mono text-sm text-foreground">
            curl -fsSL https://hermes.nous.sh/install | sh
          </code>
        </div>

        {/* ctas */}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/guide/what-is-hermes" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            시작하기 <ArrowRight className="size-4" />
          </Link>
          <Link href="/guide/install/gui" className={buttonVariants({ variant: "outline", size: "lg" })}>
            GUI로 설치
          </Link>
        </div>
      </div>
    </section>
  );
}
