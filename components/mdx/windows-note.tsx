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
