"use client";

import { Children, isValidElement, useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const tabs = Children.toArray(children).filter(isValidElement);
  const labels = tabs.map((tab) => (tab.props as { label?: string }).label ?? "");

  return (
    <div className="my-6">
      <div className="flex border-b border-border">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              active === i
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs[active]}</div>
    </div>
  );
}

export function Tab({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
