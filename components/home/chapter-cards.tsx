// components/home/chapter-cards.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CHAPTERS = [
  {
    emoji: "🤔",
    title: "헤르메스란?",
    desc: "Nous Research의 AI 에이전트 프레임워크. 무엇이고 왜 쓰는지 알아봅니다.",
    href: "/guide/what-is-hermes",
  },
  {
    emoji: "⚖️",
    title: "다른 도구와 비교",
    desc: "OpenClaw, Claude Code, ChatGPT와 뭐가 다른지 목적별로 비교해봅니다.",
    href: "/guide/comparison",
  },
  {
    emoji: "🛠️",
    title: "사전 준비",
    desc: "Slack 설정, API 키 발급, 설치 전 꼭 확인해야 할 것들을 정리했습니다.",
    href: "/guide/prerequisites/slack-setup",
  },
  {
    emoji: "⚡",
    title: "설치하기",
    desc: "curl 한 줄로 CLI 설치, 온보딩, Slack 연결, 모델 설정까지 단계별 진행.",
    href: "/guide/install/curl",
  },
  {
    emoji: "🖥️",
    title: "GUI 설치",
    desc: "브라우저에서 쓸 수 있는 헤르메스 웹 인터페이스 설치 방법.",
    href: "/guide/install/gui",
  },
] as const;

export function ChapterCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-center">전체 챕터</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((chapter) => (
          <Link
            key={chapter.href}
            href={chapter.href}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:bg-accent/30 transition-all"
          >
            <div className="text-3xl">{chapter.emoji}</div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {chapter.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {chapter.desc}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs text-primary font-medium">
              읽기 <ArrowRight className="size-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
