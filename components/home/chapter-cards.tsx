// components/home/chapter-cards.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CHAPTERS = [
  {
    emoji: "🤔",
    title: "Hermes란?",
    desc: "Nous Research가 설계한 에이전트의 구조 — memory·skill·tool이 어떻게 맞물리는지, 왜 이런 방식으로 만들어졌는지 살펴봅니다.",
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
    desc: "Slack 워크스페이스, LLM 키 또는 Portal 계정, 그리고 키를 안전하게 보관할 규칙부터 정리합니다.",
    href: "/guide/prerequisites/slack-setup",
  },
  {
    emoji: "⚡",
    title: "설치하기",
    desc: "curl 한 줄로 CLI를 설치하고, 온보딩을 거쳐 Slack을 연결하고, 사용할 model을 설정하는 과정을 순서대로 안내합니다.",
    href: "/guide/install/curl",
  },
  {
    emoji: "🖥️",
    title: "GUI 설치",
    desc: "터미널 없이 쓸 수 있는 Hermes Desktop 앱을 설치하는 방법을 안내합니다. macOS/Windows 인스톨러 또는 CLI에서 실행하는 두 가지 경로를 소개합니다.",
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
