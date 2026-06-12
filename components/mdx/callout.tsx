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
