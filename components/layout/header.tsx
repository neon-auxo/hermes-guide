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
