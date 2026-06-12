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
