// components/mdx/term.tsx
import { ReactNode } from "react";

interface TermProps {
  children: ReactNode;
  tip: string;
}

export function Term({ children, tip }: TermProps) {
  return (
    <span className="relative inline-block group cursor-help">
      <span className="border-b border-dashed border-primary/50 text-foreground">
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card text-card-foreground px-3 py-1.5 text-xs shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}
