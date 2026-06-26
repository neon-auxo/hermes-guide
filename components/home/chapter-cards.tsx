// components/home/chapter-cards.tsx
import Link from "next/link";
import { ArrowRight, Monitor, Terminal } from "lucide-react";
import { buildNavigation } from "@/lib/navigation";

const INSTALL_PATHS = [
  {
    icon: Monitor,
    label: "GUI 인스톨러",
    sub: "Hermes Desktop · macOS / Windows",
    desc: "터미널 없이 설치. 앱 실행 후 바로 쓸 수 있습니다.",
    href: "/guide/install/gui",
    badge: "추천",
  },
  {
    icon: Terminal,
    label: "CLI 설치",
    sub: "CLI · 터미널 한 줄",
    desc: "curl 한 줄로 설치하고 Quick Setup으로 Slack까지 연결합니다.",
    href: "/guide/install/curl",
    badge: null,
  },
] as const;

type TocRow =
  | { divider: string }
  | { num: string; title: string; href: string };

export async function ChapterCards() {
  // 사이드바와 동일한 내비게이션 정보에서 목차를 자동 생성 (콘텐츠 추가 시 자동 반영)
  const groups = await buildNavigation();
  const TOC: TocRow[] = [];
  let n = 0;
  for (const g of groups) {
    TOC.push({ divider: g.group });
    for (const item of g.items) {
      n += 1;
      TOC.push({ num: String(n).padStart(2, "0"), title: item.title, href: item.href });
      for (const child of item.children ?? []) {
        n += 1;
        TOC.push({ num: String(n).padStart(2, "0"), title: child.title, href: child.href });
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 space-y-20">
      {/* installation paths */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          설치 방법 선택
        </p>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground">
          어떻게 시작할까요?
        </h2>
        <div
          className="grid gap-4 sm:grid-cols-2 animate-[fade-up_0.6s_ease-out_both]"
          style={{ animationDelay: "300ms" }}
        >
          {INSTALL_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.href}
                href={path.href}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                {path.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {path.badge}
                  </span>
                )}
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {path.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70 font-mono">
                    {path.sub}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {path.desc}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-primary">
                  가이드 보기
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* table of contents */}
      <section
        className="animate-[fade-up_0.6s_ease-out_both]"
        style={{ animationDelay: "450ms" }}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          가이드 구성
        </p>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground">
          읽는 순서
        </h2>

        <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {TOC.map((item, i) => {
            if ("divider" in item) {
              return (
                <div
                  key={`divider-${i}`}
                  className="bg-muted/50 px-5 py-2"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {item.divider}
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 bg-card px-5 py-3.5 transition-colors hover:bg-accent"
              >
                <span className="w-6 shrink-0 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground/40">
                  {item.num}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
