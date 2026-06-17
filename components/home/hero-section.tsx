// components/home/hero-section.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="relative flex flex-col items-center">
        {/* title */}
        <h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[3.75rem] animate-[fade-up_0.6s_ease-out_both]"
          style={{ animationDelay: "0ms" }}
        >
          <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Hermes
          </span>{" "}
          <span className="text-foreground">쉽게 따라하기</span>
        </h1>

        {/* description */}
        <p
          className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg animate-[fade-up_0.6s_ease-out_both]"
          style={{ animationDelay: "100ms" }}
        >
          GUI 인스톨러 또는 curl 한 줄로 설치하고, Slack 연결부터 모델 설정까지
          순서대로 따라할 수 있게 정리했습니다.
        </p>

        {/* cta */}
        <div
          className="mt-8 animate-[fade-up_0.6s_ease-out_both]"
          style={{ animationDelay: "200ms" }}
        >
          <Link
            href="/guide/what-is-hermes"
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex items-center gap-2 px-8"
            )}
          >
            시작하기
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
