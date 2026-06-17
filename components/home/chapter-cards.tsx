// components/home/chapter-cards.tsx
import Link from "next/link";
import { ArrowRight, Bot, Scale, ListChecks, Download, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CHAPTERS: { step: number; icon: LucideIcon; title: string; desc: string; href: string }[] = [
  {
    step: 1,
    icon: Bot,
    title: "Hermes란?",
    desc: "Nous Research가 설계한 에이전트의 구조 — memory·skill·tool이 어떻게 맞물리는지 살펴봅니다.",
    href: "/guide/what-is-hermes",
  },
  {
    step: 2,
    icon: Scale,
    title: "다른 도구와 비교",
    desc: "OpenClaw, Claude Code, ChatGPT와 뭐가 다른지 목적별로 비교해봅니다.",
    href: "/guide/comparison",
  },
  {
    step: 3,
    icon: ListChecks,
    title: "사전 준비",
    desc: "Slack 워크스페이스, LLM 키 또는 Portal 계정, 키를 안전하게 보관할 규칙부터 정리합니다.",
    href: "/guide/prerequisites/slack-setup",
  },
  {
    step: 4,
    icon: Download,
    title: "설치하기",
    desc: "curl 한 줄로 CLI를 설치하고, 온보딩을 거쳐 Slack 연결, 모델 설정까지 순서대로 안내합니다.",
    href: "/guide/install/curl",
  },
  {
    step: 5,
    icon: Monitor,
    title: "GUI 설치",
    desc: "터미널 없이 쓸 수 있는 Hermes Desktop 앱. macOS/Windows 인스톨러 또는 CLI 두 가지 경로를 소개합니다.",
    href: "/guide/install/gui",
  },
];

export function ChapterCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      {/* section header */}
      <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary/70">목차</p>
          <h2 className="text-2xl font-bold tracking-tight">전체 챕터</h2>
        </div>
        <span className="text-sm text-muted-foreground">{CHAPTERS.length}개 챕터</span>
      </div>

      {/* cards — first row 3-col, last row 2-col centered */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((chapter) => {
          const Icon = chapter.icon;
          const isLast = chapter.step === CHAPTERS.length;
          const isSecondLast = chapter.step === CHAPTERS.length - 1;
          const totalCards = CHAPTERS.length;
          const remainder = totalCards % 3;
          // last row orphan centering: if remainder=2, last 2 cards span a centered row
          const orphanClass =
            remainder === 2 && (isLast || isSecondLast)
              ? "lg:col-span-1 lg:[&:nth-child(4)]:col-start-1 lg:[&:nth-child(5)]:col-start-2"
              : "";
          return (
            <Link
              key={chapter.href}
              href={chapter.href}
              className={`group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all ${orphanClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="text-[11px] font-mono font-semibold text-muted-foreground/50 tabular-nums">
                  {String(chapter.step).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {chapter.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {chapter.desc}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs text-primary font-medium">
                읽기 <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
