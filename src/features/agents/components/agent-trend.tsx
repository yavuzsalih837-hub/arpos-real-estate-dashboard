import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentTrendProps = {
  label: string;
  current: number;
  previous: number;
  formatValue?: (value: number) => string;
};

export function AgentTrend({
  label,
  current,
  previous,
  formatValue = String,
}: AgentTrendProps) {
  const delta = current - previous;
  const isFlat = delta === 0;
  const isUp = delta > 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium tabular-nums">{formatValue(current)}</span>
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs tabular-nums",
            isFlat
              ? "text-muted-foreground"
              : isUp
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive",
          )}
        >
          {isFlat ? (
            <Minus className="size-3" />
          ) : isUp ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )}
          {formatValue(Math.abs(delta))}
        </span>
      </div>
    </div>
  );
}
