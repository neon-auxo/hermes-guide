import { Fragment } from "react";
import { MessageSquare, Brain, Wrench, Database, RefreshCw, ChevronRight } from "lucide-react";

const STEPS = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "요청 입구",
    lines: ["CLI", "Slack · Telegram", "Cron"],
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "에이전트 코어",
    lines: ["의도 파악", "계획 수립"],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: "도구 실행",
    lines: ["검색 · 파일", "터미널 · MCP"],
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "기록과 기억",
    lines: ["Session", "Memory · Skill"],
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "재사용",
    lines: ["자기 개선 루프"],
  },
];

// ChevronRight는 w-4(16px) — 라벨 행 spacer도 동일 너비로 맞춤
const ARROW_W = "w-4";

export function HermesFlow() {
  return (
    <div className="my-8 rounded-xl border border-border bg-card shadow-sm select-none overflow-x-auto">
      <div className="min-w-[560px] p-4 sm:p-6">
        {/* Icon row */}
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex flex-1 justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  {step.icon}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`${ARROW_W} h-4 flex-shrink-0 text-muted-foreground/35`} />
              )}
            </Fragment>
          ))}
        </div>

        {/* Label row — mirrors icon row structure exactly */}
        <div className="mt-4 flex">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex-1 text-center px-1">
                <div className="text-sm font-semibold text-foreground">{step.title}</div>
                <div className="mt-1 space-y-0.5">
                  {step.lines.map((line) => (
                    <div key={line} className="text-xs text-muted-foreground leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${ARROW_W} flex-shrink-0`} />
              )}
            </Fragment>
          ))}
        </div>

        {/* Loopback arrow: step 5 → step 1 */}
        <div className="relative mt-5 mx-[10%] h-5">
          <div className="absolute left-0 top-2 bottom-0 w-px bg-primary/30" />
          <div className="absolute left-0 right-0 bottom-0 h-px bg-primary/30" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-primary/30" />
          <svg
            className="absolute text-primary/30"
            style={{ left: "-4px", top: 0 }}
            width="8"
            height="8"
            viewBox="0 0 8 8"
          >
            <path d="M4 0 L8 8 L0 8 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
