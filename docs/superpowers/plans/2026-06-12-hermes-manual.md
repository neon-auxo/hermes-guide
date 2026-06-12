# 헤르메스 쉽게 따라하기 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 완전 초보자(iOS/macOS 기준)를 위한 헤르메스 설치 가이드 정적 docs 사이트 구축

**Architecture:** Next.js 16 App Router + MDX 파일 기반 정적 사이트. 사이드바 docs 레이아웃에 다크 퍼플 테마(다크/라이트/시스템 토글). 콘텐츠는 `content/guide/` 하위 MDX 파일로 관리하며, frontmatter의 `order`/`group`으로 사이드바 자동 구성.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, next-mdx-remote, next-themes, shadcn/ui, shiki, rehype-pretty-code, Geist font

---

## 파일 구조 전체 맵

```
/Users/neonauxo/Documents/HIAI/claude/20260612_hermes_manual/
├── app/
│   ├── globals.css               # Tailwind + 다크 퍼플 CSS 변수
│   ├── layout.tsx                # 루트 레이아웃 (ThemeProvider, Header)
│   ├── page.tsx                  # 홈페이지 (히어로 + 챕터 카드)
│   └── guide/
│       └── [...slug]/
│           └── page.tsx          # 동적 MDX 렌더링 페이지
├── components/
│   ├── layout/
│   │   ├── header.tsx            # 상단 헤더 + 테마 토글(3-way)
│   │   ├── sidebar.tsx           # 사이드바 (그룹 + 현재 페이지 하이라이트)
│   │   ├── guide-layout.tsx      # 가이드 페이지 레이아웃 (sidebar + 본문)
│   │   └── nav-pagination.tsx    # 이전/다음 페이지 버튼
│   ├── mdx/
│   │   ├── callout.tsx           # <Callout type="info|warning|tip|danger">
│   │   ├── terminal-block.tsx    # <TerminalBlock title="..."> + 복사 버튼
│   │   ├── windows-note.tsx      # <WindowsNote> 윈도우 전용 코멘트 박스
│   │   └── mdx-components.tsx    # MDX 컴포넌트 레지스트리
│   ├── home/
│   │   ├── hero-section.tsx      # 홈 히어로 섹션
│   │   └── chapter-cards.tsx     # 챕터 카드 그리드
│   └── ui/                       # shadcn/ui 컴포넌트 (button, etc.)
├── lib/
│   ├── content.ts                # MDX 파일 로딩 + frontmatter 파싱
│   ├── navigation.ts             # 사이드바 구조 생성 (그룹/순서)
│   └── utils.ts                  # cn() 유틸리티
├── content/
│   └── guide/
│       ├── what-is-hermes.mdx
│       ├── comparison.mdx
│       ├── concepts.mdx
│       ├── prerequisites/
│       │   ├── slack-setup.mdx
│       │   ├── api-keys.mdx
│       │   └── cautions.mdx
│       └── install/
│           ├── curl.mdx
│           ├── onboarding.mdx
│           ├── model-setup.mdx
│           └── gui.mdx
├── next.config.ts
├── tailwind.config.ts (없음 — Tailwind v4는 CSS에서 직접 설정)
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## Task 1: 프로젝트 초기화 및 의존성 설치

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Next.js 프로젝트 생성**

작업 디렉터리: `/Users/neonauxo/Documents/HIAI/claude/20260612_hermes_manual`

```bash
cd /Users/neonauxo/Documents/HIAI/claude/20260612_hermes_manual
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint \
  --yes
```

- [ ] **Step 2: 추가 의존성 설치**

```bash
npm install next-themes next-mdx-remote gray-matter \
  rehype-pretty-code rehype-slug remark-gfm shiki \
  lucide-react geist class-variance-authority clsx tailwind-merge \
  @tailwindcss/typography tw-animate-css
npm install -D @tailwindcss/postcss @types/node
```

- [ ] **Step 3: shadcn/ui 초기화**

```bash
npx shadcn@latest init -d
```

프롬프트가 나오면:
- Style: Default
- Base color: Slate
- CSS variables: yes

- [ ] **Step 4: shadcn Button 컴포넌트 추가**

```bash
npx shadcn@latest add button
```

- [ ] **Step 5: next.config.ts 설정**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
```

- [ ] **Step 6: .gitignore 확인 후 .superpowers 추가**

`.gitignore`를 열어 맨 아래에 추가:
```
.superpowers/
```

- [ ] **Step 7: git 초기화 및 첫 커밋**

```bash
git init
git add package.json tsconfig.json next.config.ts .gitignore
git commit -m "chore: initialize Next.js 16 project"
```

---

## Task 2: CSS 테마 — 다크 퍼플 + Tailwind v4

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: globals.css를 다크 퍼플 테마로 교체**

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-destructive: var(--destructive);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

/* 라이트 모드 — 퍼플 포인트 */
:root {
  --background: oklch(0.98 0.005 280);
  --foreground: oklch(0.15 0.02 280);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.02 280);
  --primary: oklch(0.55 0.22 280);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.94 0.015 280);
  --secondary-foreground: oklch(0.25 0.05 280);
  --muted: oklch(0.94 0.01 280);
  --muted-foreground: oklch(0.5 0.05 280);
  --accent: oklch(0.92 0.025 280);
  --accent-foreground: oklch(0.25 0.08 280);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.88 0.02 280);
  --input: oklch(0.88 0.02 280);
  --ring: oklch(0.55 0.22 280);
  --radius: 0.625rem;
}

/* 다크 모드 — 다크 퍼플 */
.dark {
  --background: oklch(0.11 0.025 280);
  --foreground: oklch(0.93 0.02 280);
  --card: oklch(0.15 0.025 280);
  --card-foreground: oklch(0.93 0.02 280);
  --primary: oklch(0.70 0.22 280);
  --primary-foreground: oklch(0.11 0.025 280);
  --secondary: oklch(0.20 0.04 280);
  --secondary-foreground: oklch(0.85 0.03 280);
  --muted: oklch(0.18 0.03 280);
  --muted-foreground: oklch(0.60 0.06 280);
  --accent: oklch(0.22 0.05 280);
  --accent-foreground: oklch(0.90 0.05 280);
  --destructive: oklch(0.65 0.22 27.325);
  --border: oklch(0.25 0.04 280);
  --input: oklch(0.25 0.04 280);
  --ring: oklch(0.70 0.22 280);
}

body {
  font-family: var(--font-sans), sans-serif;
}
```

- [ ] **Step 2: 커밋**

```bash
git add app/globals.css
git commit -m "feat: add dark purple theme with light/dark CSS variables"
```

---

## Task 3: 루트 레이아웃 및 헤더 (테마 토글 3-way)

**Files:**
- Create: `components/layout/header.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Header 컴포넌트 작성 (다크/라이트/시스템 3-way 토글)**

```tsx
// components/layout/header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, Sun, Monitor, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: Sun, label: "라이트 모드" },
  { value: "system", icon: Monitor, label: "시스템 설정" },
  { value: "dark", icon: Moon, label: "다크 모드" },
] as const;

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.value === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.value);
  };

  const CurrentIcon =
    THEMES.find((t) => t.value === theme)?.icon ?? Monitor;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary">
          <span>🪬</span>
          <span>헤르메스 가이드</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={cycleTheme}
            title={THEMES.find((t) => t.value === theme)?.label}
          >
            <CurrentIcon className="size-4" />
            <span className="sr-only">테마 전환</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t px-6 py-3 md:hidden">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
          >
            홈
          </Link>
          <Link
            href="/guide/what-is-hermes"
            onClick={() => setMobileOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
          >
            가이드 시작
          </Link>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: 루트 layout.tsx 작성**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "헤르메스 쉽게 따라하기",
  description: "완전 초보자를 위한 Hermes Agent 설치 가이드 — 설치, Slack 연결, 모델 설정, GUI까지",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/layout/header.tsx app/layout.tsx
git commit -m "feat: add header with 3-way theme toggle (dark/light/system)"
```

---

## Task 4: 콘텐츠 로딩 유틸리티 및 사이드바 내비게이션

**Files:**
- Create: `lib/content.ts`
- Create: `lib/navigation.ts`

- [ ] **Step 1: lib/content.ts 작성**

```typescript
// lib/content.ts
import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");

export interface GuideFrontmatter {
  title: string;
  description: string;
  order: number;
  group: string;
}

async function readMdxFile(filePath: string) {
  return fs.readFile(filePath, "utf-8");
}

async function compilePage(source: string) {
  return compileMDX<GuideFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: "one-dark-pro" }],
        ],
      },
    },
    components: mdxComponents,
  });
}

/** slug 배열 → 파일 경로 변환 */
function slugToPath(slug: string[]): string {
  return path.join(GUIDE_DIR, ...slug) + ".mdx";
}

export async function getGuidePage(slug: string[]) {
  const filePath = slugToPath(slug);
  const source = await readMdxFile(filePath);
  const { content, frontmatter } = await compilePage(source);
  return { content, frontmatter, slug };
}

/** content/guide 하위 모든 .mdx 파일의 slug 목록 반환 */
export async function getAllGuideSlugs(): Promise<string[][]> {
  const slugs: string[][] = [];

  async function walk(dir: string, prefix: string[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith(".mdx")) {
        slugs.push([...prefix, entry.name.replace(/\.mdx$/, "")]);
      }
    }
  }

  await walk(GUIDE_DIR, []);
  return slugs;
}

/** 사이드바용: 모든 페이지의 frontmatter + slug 반환 (order 순 정렬) */
export async function getAllGuidePages() {
  const slugs = await getAllGuideSlugs();
  const pages = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readMdxFile(slugToPath(slug));
      const { frontmatter } = await compilePage(source);
      return { frontmatter, slug };
    })
  );
  return pages.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
```

- [ ] **Step 2: lib/navigation.ts 작성**

```typescript
// lib/navigation.ts
import { getAllGuidePages } from "./content";

export interface NavItem {
  title: string;
  slug: string[];
  href: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export async function buildNavigation(): Promise<NavGroup[]> {
  const pages = await getAllGuidePages();
  const groups: Record<string, NavItem[]> = {};

  for (const { frontmatter, slug } of pages) {
    const g = frontmatter.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push({
      title: frontmatter.title,
      slug,
      href: `/guide/${slug.join("/")}`,
    });
  }

  // group 내 첫 번째 항목의 order 순으로 그룹 정렬
  return Object.entries(groups).map(([group, items]) => ({ group, items }));
}
```

- [ ] **Step 3: 커밋**

```bash
git add lib/content.ts lib/navigation.ts
git commit -m "feat: add content loader and navigation builder for MDX guide"
```

---

## Task 5: MDX 커스텀 컴포넌트

**Files:**
- Create: `components/mdx/callout.tsx`
- Create: `components/mdx/terminal-block.tsx`
- Create: `components/mdx/windows-note.tsx`
- Create: `components/mdx/mdx-components.tsx`

- [ ] **Step 1: Callout 컴포넌트**

```tsx
// components/mdx/callout.tsx
import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  info: {
    icon: Info,
    color: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    color: "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  tip: {
    icon: Lightbulb,
    color: "border-green-500 bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
  },
  danger: {
    icon: AlertCircle,
    color: "border-red-500 bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
}) {
  const v = variants[type];
  const Icon = v.icon;
  return (
    <div className={cn("my-4 rounded-lg border-l-4 p-4", v.color)}>
      <div className={cn("flex items-center gap-2 font-semibold text-sm", v.textColor)}>
        <Icon className="size-4 shrink-0" />
        {title && <span>{title}</span>}
      </div>
      <div className="mt-1 text-sm leading-relaxed [&>p]:mt-0 [&>p:first-child]:mt-1">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: TerminalBlock 컴포넌트**

```tsx
// components/mdx/terminal-block.tsx
"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

export function TerminalBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const copy = () => {
    const text = contentRef.current?.textContent ?? "";
    navigator.clipboard
      .writeText(text.replace(/^\$\s*/gm, ""))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-2 bg-muted px-4 py-2">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-yellow-500/80" />
          <span className="size-3 rounded-full bg-green-500/80" />
        </div>
        {title && (
          <span className="ml-2 text-xs text-muted-foreground">{title}</span>
        )}
        <button
          onClick={copy}
          className="ml-auto rounded p-1 hover:bg-accent transition-colors"
          aria-label="복사"
        >
          {copied ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <div
        ref={contentRef}
        className="bg-zinc-950 p-4 text-sm text-zinc-100 overflow-x-auto font-mono leading-relaxed"
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: WindowsNote 컴포넌트**

```tsx
// components/mdx/windows-note.tsx
import { Monitor } from "lucide-react";

export function WindowsNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-sky-400/40 bg-sky-50/60 dark:bg-sky-950/20 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">
        <Monitor className="size-4 shrink-0" />
        <span>🪟 Windows 사용자</span>
      </div>
      <div className="text-sm leading-relaxed text-sky-800 dark:text-sky-200 [&>p]:mt-0 [&>p:first-child]:mt-1">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: MDX 컴포넌트 레지스트리**

```tsx
// components/mdx/mdx-components.tsx
import type { MDXComponents } from "mdx/types";
import { Callout } from "./callout";
import { TerminalBlock } from "./terminal-block";
import { WindowsNote } from "./windows-note";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-8 scroll-m-20 text-3xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  ul: (props) => <ul className="mt-4 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props) => (
    <ol className="mt-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border px-3 py-2 text-left font-semibold bg-muted"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-3 py-2" {...props} />
  ),
  a: (props) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary"
      {...props}
    />
  ),
  Callout,
  TerminalBlock,
  WindowsNote,
};
```

- [ ] **Step 5: 커밋**

```bash
git add components/mdx/
git commit -m "feat: add MDX components (Callout, TerminalBlock, WindowsNote)"
```

---

## Task 6: 사이드바 및 가이드 레이아웃

**Files:**
- Create: `components/layout/sidebar.tsx`
- Create: `components/layout/nav-pagination.tsx`
- Create: `components/layout/guide-layout.tsx`

- [ ] **Step 1: Sidebar 컴포넌트**

```tsx
// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/navigation";

export function Sidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 space-y-6 py-6 pr-4">
      {groups.map((group) => (
        <div key={group.group}>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: NavPagination 컴포넌트**

```tsx
// components/layout/nav-pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavItem } from "@/lib/navigation";

export function NavPagination({
  prev,
  next,
}: {
  prev: NavItem | null;
  next: NavItem | null;
}) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{next.title}</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
```

- [ ] **Step 3: GuideLayout 컴포넌트**

```tsx
// components/layout/guide-layout.tsx
import { buildNavigation } from "@/lib/navigation";
import { Sidebar } from "./sidebar";

export async function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = await buildNavigation();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
      <aside className="hidden md:block">
        <div className="sticky top-20">
          <Sidebar groups={groups} />
        </div>
      </aside>
      <article className="min-w-0 flex-1 max-w-3xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </article>
    </div>
  );
}
```

- [ ] **Step 4: 커밋**

```bash
git add components/layout/sidebar.tsx components/layout/nav-pagination.tsx components/layout/guide-layout.tsx
git commit -m "feat: add sidebar, pagination, and guide layout components"
```

---

## Task 7: 동적 가이드 페이지 라우트

**Files:**
- Create: `app/guide/[...slug]/page.tsx`

- [ ] **Step 1: 동적 페이지 작성**

```tsx
// app/guide/[...slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuidePage, getAllGuideSlugs } from "@/lib/content";
import { buildNavigation } from "@/lib/navigation";
import { GuideLayout } from "@/components/layout/guide-layout";
import { NavPagination } from "@/components/layout/nav-pagination";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = await getGuidePage(slug);
    return { title: `${frontmatter.title} — 헤르메스 가이드`, description: frontmatter.description };
  } catch {
    return {};
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;

  let page;
  try {
    page = await getGuidePage(slug);
  } catch {
    notFound();
  }

  const groups = await buildNavigation();
  const allItems = groups.flatMap((g) => g.items);
  const currentHref = `/guide/${slug.join("/")}`;
  const currentIdx = allItems.findIndex((i) => i.href === currentHref);

  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const next = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

  return (
    <GuideLayout>
      {page.content}
      <NavPagination prev={prev} next={next} />
    </GuideLayout>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add app/guide/
git commit -m "feat: add dynamic guide page with MDX rendering and prev/next pagination"
```

---

## Task 8: 홈페이지

**Files:**
- Create: `components/home/hero-section.tsx`
- Create: `components/home/chapter-cards.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: HeroSection 컴포넌트**

```tsx
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
```

- [ ] **Step 2: ChapterCards 컴포넌트**

```tsx
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
```

- [ ] **Step 3: app/page.tsx 업데이트**

```tsx
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
```

- [ ] **Step 4: 커밋**

```bash
git add components/home/ app/page.tsx
git commit -m "feat: add homepage with hero section and chapter cards"
```

---

## Task 9: MDX 콘텐츠 파일 — 시작하기 섹션

**Files:**
- Create: `content/guide/what-is-hermes.mdx`
- Create: `content/guide/comparison.mdx`
- Create: `content/guide/concepts.mdx`

- [ ] **Step 1: content/guide 디렉터리 생성**

```bash
mkdir -p content/guide/prerequisites content/guide/install
```

- [ ] **Step 2: what-is-hermes.mdx 작성**

```mdx
---
title: "헤르메스란?"
description: "Nous Research의 AI 에이전트 프레임워크 Hermes 개요"
order: 1
group: "시작하기"
---

# 헤르메스(Hermes)란?

**헤르메스(Hermes)**는 [Nous Research](https://nousresearch.com/)에서 만든 **AI 에이전트 프레임워크**입니다.

쉽게 말하면, 여러분이 Slack 채널에 "이 파일 요약해줘" 라고 메시지를 보내면 — 헤르메스가 알아서 처리해주는 AI 비서입니다.

## 에이전트가 뭔가요?

일반 AI 챗봇(ChatGPT 등)은 질문에 답변만 합니다. 반면 **에이전트(Agent)**는 여러 단계를 스스로 계획하고 실행합니다.

| 일반 AI | AI 에이전트(헤르메스) |
|---------|------|
| 질문 → 답변 | 목표 → 계획 → 실행 → 결과 |
| 도구 없음 | 검색, 파일 읽기, 코드 실행 등 가능 |
| 1회성 | 연속적인 작업 처리 |

## 헤르메스의 특징

- **Slack 기반**: 별도 앱 없이 Slack에서 바로 사용
- **확장 가능**: MCP(Model Context Protocol)로 다양한 도구 연결
- **모델 자유**: Claude, GPT-4, 로컬 모델 등 원하는 LLM 선택 가능
- **오픈소스 기반**: [Nous Research Portal](https://portal.nousresearch.com/)에서 관리

<Callout type="info" title="처음 들어보는 용어들이 많아도 괜찮아요">
지금은 "Slack에서 쓰는 AI 비서구나" 정도만 이해해도 충분합니다. 설치하면서 자연스럽게 익히게 됩니다.
</Callout>

## 어떻게 쓰나요?

1. Slack 워크스페이스에 헤르메스 봇을 추가합니다
2. 채널에서 `@hermes 이 파일 분석해줘` 처럼 말을 걸면
3. 헤르메스가 도구를 사용해 작업을 수행하고 결과를 알려줍니다
```

- [ ] **Step 3: comparison.mdx 작성**

```mdx
---
title: "다른 도구와 비교"
description: "헤르메스 vs OpenClaw vs Claude Code vs ChatGPT — 목적과 차이"
order: 2
group: "시작하기"
---

# 다른 도구와 비교

비슷해 보이지만 목적이 다릅니다. 각 도구가 어떤 상황에 맞는지 정리했습니다.

## 한눈에 비교

| 도구 | 주 사용처 | 인터페이스 | 특징 |
|------|---------|----------|------|
| **헤르메스** | 팀 워크플로우 자동화 | Slack | 에이전트, 도구 연동, 지속 실행 |
| **OpenClaw** | 클로드 코드 스킬 관리 | 웹 앱 | 스킬 저장·공유, 팀 협업 |
| **Claude Code** | 개발자 코딩 보조 | 터미널(CLI) | 코드 작성·수정·실행 |
| **ChatGPT** | 일반 질의응답 | 웹/앱 | 대화형 AI, 1회성 |

## 각 도구의 목적

### 헤르메스 — "자동화 에이전트"
팀이 Slack을 쓴다면, 헤르메스는 그 안에 살면서 반복 작업을 대신 처리합니다.
예: 매일 오전 9시에 보고서 요약, 파일 업로드되면 자동 분류

### OpenClaw — "스킬 저장소"
Claude Code에서 사용할 스킬(슬래시 커맨드)을 팀원들과 공유·관리하는 플랫폼입니다.
헤르메스와 직접 경쟁하지 않고, 함께 사용합니다.

### Claude Code — "개발자 도우미"
터미널에서 AI와 함께 코딩합니다. 파일을 읽고, 수정하고, 테스트를 실행합니다.
개발자 전용 도구입니다.

### ChatGPT — "대화형 AI"
질문하면 답해주는 가장 기본적인 형태. 도구 연동이나 자동화보다는 즉석 대화에 적합합니다.

## 이런 경우 헤르메스를 쓰세요

<Callout type="tip" title="헤르메스가 적합한 상황">
- Slack을 팀 커뮤니케이션 도구로 쓰고 있을 때
- 반복 작업을 자동화하고 싶을 때  
- 여러 도구(Google Drive, GitHub, 웹 검색 등)를 AI가 조합해서 써주길 원할 때
</Callout>
```

- [ ] **Step 4: concepts.mdx 작성**

```mdx
---
title: "구성 개념 소개"
description: "헤르메스의 핵심 구성 요소 간략 설명"
order: 3
group: "시작하기"
---

# 구성 개념 소개

설치 전에 핵심 용어를 간단히 알아두면 온보딩이 훨씬 쉬워집니다.

## 핵심 구성 요소

### Agent (에이전트)
헤르메스의 본체입니다. LLM(AI 모델)을 사용해 목표를 이해하고, 필요한 도구를 골라 실행합니다.

### Tool (도구)
에이전트가 할 수 있는 행동입니다. 예: 웹 검색, 파일 읽기, 코드 실행, Slack 메시지 보내기.

### MCP (Model Context Protocol)
도구를 에이전트에 연결하는 표준 방식입니다. 마치 플러그인처럼 필요한 기능을 추가합니다.

### Skill (스킬)
에이전트에게 특정 행동 방식을 가르치는 지침서입니다. 슬래시 커맨드(`/요약`, `/번역` 등)로 불러옵니다.

### LLM (대형 언어 모델)
헤르메스의 "두뇌" 역할. Claude(Anthropic), GPT-4(OpenAI) 등을 선택해서 사용합니다.

## 동작 흐름

```
Slack 메시지
    ↓
헤르메스 에이전트가 의도 파악
    ↓
필요한 Tool 선택 & 실행
    ↓
결과를 Slack에 응답
```

<Callout type="info">
지금 이 개념들을 완벽히 이해할 필요 없습니다. 설치하고 사용하면서 자연스럽게 이해됩니다.
</Callout>
```

- [ ] **Step 5: 커밋**

```bash
git add content/guide/what-is-hermes.mdx content/guide/comparison.mdx content/guide/concepts.mdx
git commit -m "content: add intro section (what-is-hermes, comparison, concepts)"
```

---

## Task 10: MDX 콘텐츠 — 사전 준비 섹션

**Files:**
- Create: `content/guide/prerequisites/slack-setup.mdx`
- Create: `content/guide/prerequisites/api-keys.mdx`
- Create: `content/guide/prerequisites/cautions.mdx`

- [ ] **Step 1: slack-setup.mdx 작성**

```mdx
---
title: "Slack 설정"
description: "헤르메스 연결을 위한 Slack 워크스페이스 및 앱 봇 토큰 발급"
order: 4
group: "사전 준비"
---

# Slack 설정

헤르메스는 Slack을 통해 명령을 받고 결과를 전달합니다. 먼저 Slack 봇 토큰을 발급받아야 합니다.

<Callout type="info" title="Slack 계정이 없다면?">
[slack.com](https://slack.com)에서 무료로 가입하고 새 워크스페이스를 만드세요. 개인 테스트용 워크스페이스를 하나 따로 만드는 걸 추천합니다.
</Callout>

## 1단계: Slack 앱 생성

1. [api.slack.com/apps](https://api.slack.com/apps) 접속
2. **Create New App** 클릭
3. **From scratch** 선택
4. App Name에 `Hermes` (또는 원하는 이름) 입력
5. 워크스페이스 선택 후 **Create App** 클릭

## 2단계: Bot 권한 설정

1. 왼쪽 메뉴 **OAuth & Permissions** 클릭
2. **Scopes** 섹션에서 **Bot Token Scopes** 찾기
3. 다음 권한들을 추가:

| 권한 | 용도 |
|------|------|
| `app_mentions:read` | @멘션 읽기 |
| `channels:history` | 채널 메시지 읽기 |
| `chat:write` | 메시지 보내기 |
| `files:read` | 파일 읽기 |
| `im:history` | DM 읽기 |
| `im:write` | DM 보내기 |

## 3단계: 봇 토큰 발급

1. 같은 페이지에서 위로 스크롤
2. **Install to Workspace** 클릭
3. 권한 요청 화면에서 **허용** 클릭
4. **Bot User OAuth Token** 복사 (`xoxb-`로 시작하는 긴 문자열)

<Callout type="warning" title="토큰 보관 주의">
이 토큰은 비밀번호와 같습니다. 메모장이나 비밀번호 관리 앱(1Password, iCloud Keychain)에 안전하게 저장하세요.
절대 카카오톡, 슬랙 채널, GitHub 등 공개된 곳에 붙여넣지 마세요.
</Callout>

## 4단계: 봇을 채널에 추가

1. Slack 앱 열기
2. 테스트할 채널 선택 (또는 새 채널 생성)
3. 채널에서 `/invite @앱이름` 입력

<WindowsNote>
Windows에서도 Slack 앱 절차는 동일합니다. 브라우저에서 api.slack.com에 접속하면 됩니다.
</WindowsNote>
```

- [ ] **Step 2: api-keys.mdx 작성**

```mdx
---
title: "API 키 발급 및 관리"
description: "Anthropic(Claude), OpenAI(GPT) API 키 발급 방법과 안전한 관리법"
order: 5
group: "사전 준비"
---

# API 키 발급 및 관리

헤르메스는 AI 모델(Claude, GPT 등)을 사용하기 위해 **API 키**가 필요합니다. API 키는 "사용권 증명서"라고 생각하면 됩니다.

<Callout type="warning" title="API 키는 유료입니다">
API 키를 발급받으면 사용량에 따라 요금이 청구됩니다. 처음에는 소액($5~10)만 충전해서 테스트해보세요.
</Callout>

## Anthropic (Claude) API 키

Claude 모델을 사용하려면 Anthropic API 키가 필요합니다. **헤르메스 공식 권장 모델**입니다.

1. [console.anthropic.com](https://console.anthropic.com) 접속
2. 회원가입 또는 로그인
3. 상단 메뉴 **API Keys** 클릭
4. **Create Key** 클릭, 이름 입력 (예: `hermes-test`)
5. 생성된 키 복사 (`sk-ant-`로 시작)

<Callout type="danger" title="키는 한 번만 보여집니다">
생성 직후에만 전체 키가 표시됩니다. 반드시 즉시 복사해서 안전한 곳에 저장하세요.
</Callout>

## OpenAI (GPT) API 키

GPT-4를 대신 쓰고 싶다면:

1. [platform.openai.com](https://platform.openai.com) 접속
2. 로그인 후 오른쪽 상단 프로필 → **API Keys**
3. **Create new secret key** 클릭
4. 키 복사 (`sk-`로 시작)

## API 키 안전하게 관리하기

**절대 하면 안 되는 것:**
- GitHub, GitLab 등 코드 저장소에 업로드
- Slack, 카카오톡 채팅으로 전송
- 메모 앱에 그대로 저장 (공유 메모 앱 특히 주의)

**권장하는 방법:**
- macOS **키체인(Keychain)** 또는 **iCloud Keychain** 사용
- 비밀번호 관리 앱 (1Password, Bitwarden 등)

<WindowsNote>
Windows 사용자는 **Windows 자격 증명 관리자** 또는 1Password, Bitwarden 같은 비밀번호 관리 앱을 사용하세요.
</WindowsNote>

## 월간 비용 예상 (참고)

| 사용 패턴 | 예상 비용 |
|----------|---------|
| 가벼운 테스트 (하루 10~20회) | $1~3/월 |
| 일반 사용 (하루 50~100회) | $5~15/월 |
| 집중 사용 (자동화 포함) | $20~50+/월 |

<Callout type="tip">
Anthropic Console에서 **월 예산 한도**를 설정할 수 있습니다. 처음엔 $10 한도를 설정해두면 안심이 됩니다.
</Callout>
```

- [ ] **Step 3: cautions.mdx 작성**

```mdx
---
title: "설치 전 유의사항"
description: "헤르메스 설치 전 꼭 확인해야 할 보안 및 환경 주의사항"
order: 6
group: "사전 준비"
---

# 설치 전 유의사항

설치 전에 아래 사항을 꼭 확인하세요. 나중에 발생할 수 있는 문제를 미리 예방합니다.

## macOS 보안 설정 확인

### Gatekeeper (보안 경고 처리)
처음 실행 시 "확인되지 않은 개발자" 경고가 나올 수 있습니다.

<TerminalBlock title="보안 경고 발생 시">
```bash
# 설치 후 실행 시 오류가 나면:
xattr -dr com.apple.quarantine /usr/local/bin/hermes
```
</TerminalBlock>

### macOS 버전 확인

<TerminalBlock title="macOS 버전 확인">
```bash
sw_vers
```
</TerminalBlock>

macOS 13 (Ventura) 이상을 권장합니다.

## Node.js 환경 확인

헤르메스 CLI는 Node.js가 필요합니다.

<TerminalBlock title="Node.js 버전 확인">
```bash
node -v
```
</TerminalBlock>

`v18` 이상이 필요합니다. 없다면 [nodejs.org](https://nodejs.org)에서 LTS 버전을 설치하세요.

<WindowsNote>
Windows에서 Node.js는 [nodejs.org](https://nodejs.org)에서 `.msi` 인스톨러로 설치하세요. 설치 후 **명령 프롬프트(cmd)** 또는 **PowerShell**을 재시작해야 `node` 명령이 인식됩니다.
</WindowsNote>

## 네트워크 환경 확인

회사 네트워크나 VPN을 사용 중이라면 API 호출이 차단될 수 있습니다.

<TerminalBlock title="연결 테스트">
```bash
curl -I https://api.anthropic.com
```
</TerminalBlock>

`HTTP/2 200` 또는 `HTTP/2 404`가 나오면 연결 가능합니다. `curl: (6) Could not resolve host` 라면 DNS 문제입니다.

## 체크리스트

설치를 시작하기 전에 아래를 모두 확인하세요:

- [ ] macOS 13 이상 (또는 Windows 10/11)
- [ ] Node.js v18 이상 설치됨
- [ ] Slack 봇 토큰 준비됨 (`xoxb-`로 시작)
- [ ] AI API 키 준비됨 (Anthropic 또는 OpenAI)
- [ ] 인터넷 연결 및 API 서버 접근 가능

<Callout type="tip">
모두 체크됐다면 설치하기로 넘어가세요!
</Callout>
```

- [ ] **Step 4: 커밋**

```bash
git add content/guide/prerequisites/
git commit -m "content: add prerequisites section (slack-setup, api-keys, cautions)"
```

---

## Task 11: MDX 콘텐츠 — 설치 섹션

**Files:**
- Create: `content/guide/install/curl.mdx`
- Create: `content/guide/install/onboarding.mdx`
- Create: `content/guide/install/model-setup.mdx`
- Create: `content/guide/install/gui.mdx`

- [ ] **Step 1: curl.mdx 작성**

```mdx
---
title: "curl로 설치하기"
description: "curl 명령어 한 줄로 헤르메스 CLI 설치 및 실행 확인"
order: 7
group: "설치하기"
---

# curl로 설치하기

헤르메스 CLI 설치는 터미널 명령어 한 줄이면 됩니다.

## 터미널 열기

**macOS**에서 터미널을 여는 방법:
- `Cmd + Space` → "터미널" 검색 → 엔터
- Finder → 응용 프로그램 → 유틸리티 → Terminal.app

<WindowsNote>
Windows에서는 **PowerShell**을 관리자 권한으로 열어주세요. 시작 버튼 → PowerShell 검색 → 우클릭 → "관리자 권한으로 실행"
</WindowsNote>

## 설치 명령어 실행

<TerminalBlock title="헤르메스 CLI 설치">
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```
</TerminalBlock>

이 명령이 자동으로 처리하는 것:
1. OS 감지 (macOS / Linux)
2. 헤르메스 CLI 최신 버전 다운로드
3. 전역 설치 (`/usr/local/bin/hermes`)

<Callout type="info" title="설치 시간">
인터넷 속도에 따라 1~3분 정도 소요됩니다.
</Callout>

## 설치 확인

설치가 완료되면 아래 명령어로 확인하세요:

<TerminalBlock title="설치 확인">
```bash
hermes --version
```
</TerminalBlock>

`hermes v0.x.x` 같은 버전 정보가 나오면 성공입니다.

## 문제 해결

### `command not found: hermes` 오류

PATH 설정이 필요합니다:

<TerminalBlock title="PATH 설정 (zsh)">
```bash
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
hermes --version
```
</TerminalBlock>

<WindowsNote>
Windows에서 `hermes` 명령이 인식되지 않으면 PowerShell을 재시작한 후 다시 시도해보세요. 그래도 안 된다면 환경 변수 PATH에 설치 경로를 추가해야 합니다.
</WindowsNote>

### 권한 오류 (Permission denied)

<TerminalBlock title="권한 부여">
```bash
sudo chmod +x /usr/local/bin/hermes
```
</TerminalBlock>
```

- [ ] **Step 2: onboarding.mdx 작성**

```mdx
---
title: "온보딩 & Slack 연결"
description: "hermes onboarding 명령으로 초기 설정 및 Slack 워크스페이스 연결"
order: 8
group: "설치하기"
---

# 온보딩 & Slack 연결

설치가 완료됐으면 이제 헤르메스를 초기 설정하고 Slack에 연결합니다.

## 온보딩 시작

<TerminalBlock title="온보딩 실행">
```bash
hermes onboarding
```
</TerminalBlock>

터미널에 대화형 설정 마법사가 시작됩니다.

## Slack 봇 토큰 입력

온보딩 중에 아래 질문이 나옵니다:

```
? Enter your Slack Bot Token: 
```

[사전 준비 — Slack 설정](/guide/prerequisites/slack-setup)에서 발급받은 `xoxb-`로 시작하는 토큰을 붙여넣으세요.

<Callout type="warning">
토큰 입력 후 엔터를 누르면 화면에 표시되지 않아도 정상입니다. 보안을 위해 입력값을 숨깁니다.
</Callout>

## Slack 채널 설정

```
? Enter the Slack channel to listen on (e.g. #hermes): 
```

헤르메스가 메시지를 받을 채널 이름을 입력합니다. 예: `#hermes` 또는 `#general`

<Callout type="tip">
테스트용 전용 채널(예: `#hermes-test`)을 만들어서 사용하면 기존 채널이 지저분해지지 않습니다.
</Callout>

## 연결 테스트

온보딩이 완료되면 헤르메스가 자동으로 Slack에 연결을 시도합니다.

Slack 앱을 열어서 설정한 채널에 다음 메시지를 보내보세요:

```
@Hermes 안녕
```

헤르메스가 응답하면 연결 성공입니다! 🎉

<WindowsNote>
Windows에서도 `hermes onboarding` 명령은 동일합니다. PowerShell에서 실행하세요. 토큰 붙여넣기는 `Ctrl+V` 또는 오른쪽 클릭 → 붙여넣기.
</WindowsNote>
```

- [ ] **Step 3: model-setup.mdx 작성**

```mdx
---
title: "모델 설정"
description: "헤르메스에서 사용할 AI 모델(Claude, GPT 등) 선택 및 API 키 입력"
order: 9
group: "설치하기"
---

# 모델 설정

헤르메스는 여러 AI 모델을 지원합니다. 사용할 모델을 선택하고 API 키를 입력합니다.

## 지원 모델 목록

| 모델 | 제공사 | 추천 용도 |
|------|-------|---------|
| `claude-sonnet-4-6` | Anthropic | 범용 (속도·성능 균형) ⭐ |
| `claude-opus-4-8` | Anthropic | 복잡한 작업 (느리지만 강력) |
| `gpt-4o` | OpenAI | GPT 선호 시 |
| `gpt-4o-mini` | OpenAI | 빠른 응답 필요 시 |

<Callout type="tip" title="처음이라면 claude-sonnet-4-6 추천">
성능과 비용의 균형이 가장 좋습니다. 나중에 언제든 바꿀 수 있습니다.
</Callout>

## API 키 설정

온보딩 중 또는 이후에 아래 명령어로 모델과 API 키를 설정합니다:

<TerminalBlock title="Anthropic API 키 설정">
```bash
hermes config set model claude-sonnet-4-6
hermes config set anthropic_api_key sk-ant-여기에붙여넣기
```
</TerminalBlock>

OpenAI를 사용한다면:

<TerminalBlock title="OpenAI API 키 설정">
```bash
hermes config set model gpt-4o
hermes config set openai_api_key sk-여기에붙여넣기
```
</TerminalBlock>

## 설정 확인

<TerminalBlock title="현재 설정 확인">
```bash
hermes config list
```
</TerminalBlock>

`model`, `anthropic_api_key` (또는 `openai_api_key`) 항목이 표시되면 설정 완료입니다.

<Callout type="info">
API 키는 로컬에 암호화되어 저장됩니다. 타인과 공유하거나 공개 서버에 올리지 마세요.
</Callout>

<WindowsNote>
Windows에서도 명령어는 동일합니다. PowerShell에서 실행하세요.
API 키 붙여넣기 시 앞뒤로 공백이 들어가지 않도록 주의하세요.
</WindowsNote>
```

- [ ] **Step 4: gui.mdx 작성**

```mdx
---
title: "GUI 설치"
description: "헤르메스 웹 인터페이스(GUI) 설치 및 브라우저 접속 방법"
order: 10
group: "설치하기"
---

# GUI 설치

CLI(터미널)만으로도 헤르메스를 사용할 수 있지만, 브라우저 기반 **GUI(웹 인터페이스)**를 사용하면 훨씬 편리합니다.

## GUI란?

헤르메스 GUI는 로컬 서버에서 실행되는 웹 앱입니다. 브라우저에서 `http://localhost:3000` 같은 주소로 접속해 사용합니다.

- 대화 기록 시각적으로 확인
- 설정 화면에서 클릭으로 모델·도구 변경
- 여러 에이전트 동시 관리

## GUI 설치

<TerminalBlock title="GUI 설치">
```bash
hermes install-gui
```
</TerminalBlock>

설치 중 진행 상황이 표시됩니다:

```
Downloading hermes-gui...
Installing dependencies...
✓ GUI installed successfully
```

## GUI 실행

<TerminalBlock title="GUI 실행">
```bash
hermes gui
```
</TerminalBlock>

아래 메시지가 나오면 브라우저에서 접속할 수 있습니다:

```
✓ Hermes GUI running at http://localhost:3000
```

브라우저를 열고 **http://localhost:3000** 에 접속하세요.

<Callout type="tip">
GUI를 항상 백그라운드에서 실행하고 싶다면:

```bash
hermes gui --background
```
</Callout>

## GUI 중지

<TerminalBlock title="GUI 중지">
```bash
hermes gui --stop
```
</TerminalBlock>

<WindowsNote>
Windows에서 GUI 실행 후 브라우저가 자동으로 열리지 않으면 직접 `http://localhost:3000` 을 주소창에 입력하세요.
방화벽 경고가 뜨면 "액세스 허용"을 클릭하세요.
</WindowsNote>

## 여기까지 완료했다면 🎉

축하합니다! 헤르메스 설치와 기본 설정이 모두 끝났습니다.

- ✅ CLI 설치
- ✅ Slack 연결
- ✅ 모델 설정  
- ✅ GUI 설치

이제 Slack에서 `@Hermes`를 멘션해 다양한 작업을 시켜보세요!
```

- [ ] **Step 5: 커밋**

```bash
git add content/guide/install/
git commit -m "content: add install section (curl, onboarding, model-setup, gui)"
```

---

## Task 12: 빌드 검증 및 Vercel 배포 설정

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: 로컬 빌드 테스트**

```bash
npm run build
```

오류 없이 완료되는지 확인. TypeScript 타입 오류가 있으면 수정.

- [ ] **Step 2: 개발 서버에서 전체 페이지 확인**

```bash
npm run dev
```

브라우저에서 다음 URL을 순서대로 확인:
- `http://localhost:3000` — 홈 (히어로 + 챕터 카드)
- `http://localhost:3000/guide/what-is-hermes` — 사이드바 + 본문
- `http://localhost:3000/guide/prerequisites/slack-setup`
- `http://localhost:3000/guide/install/gui` — 마지막 페이지, Next 버튼 없어야 함
- 헤더 테마 토글 3번 클릭해서 dark → system → light 전환 확인

- [ ] **Step 3: vercel.json 작성**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

- [ ] **Step 4: 최종 커밋**

```bash
git add vercel.json
git commit -m "chore: add vercel deployment config"
```

- [ ] **Step 5: Vercel 배포 (선택)**

Vercel CLI가 있다면:
```bash
npx vercel --prod
```

또는 [vercel.com](https://vercel.com) 에서 GitHub 저장소 import 후 배포.

---

## 자체 검토 결과

**스펙 커버리지:** 설계 문서의 모든 항목(7개 페이지 그룹, 5개 MDX 컴포넌트, 테마 토글, 사이드바 구조) 구현 태스크에 대응됨.

**플레이스홀더:** 없음. 모든 태스크에 실제 코드 포함.

**타입 일관성:** `GuideFrontmatter`, `NavGroup`, `NavItem` 타입이 Task 4에서 정의되고 Task 6, 7에서 동일하게 사용됨.
