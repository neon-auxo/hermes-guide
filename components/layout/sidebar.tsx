"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavGroup, NavItem } from "@/lib/navigation";

export function Sidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  function renderItem(item: NavItem) {
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
        {item.children && item.children.length > 0 && (
          <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-3">
            {item.children.map((child) => {
              const isChildActive = pathname === child.href;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isChildActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {child.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <nav className="w-56 shrink-0 py-6 pr-4">
      {groups.map((group, index) => (
        <div
          key={group.group}
          className={cn(index > 0 && "mt-1 border-t border-border pt-4")}
        >
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(renderItem)}
          </ul>
        </div>
      ))}
    </nav>
  );
}
