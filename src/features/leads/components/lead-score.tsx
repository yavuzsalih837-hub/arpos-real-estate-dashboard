import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getScoreTier, SCORE_TIER_LABELS } from "@/features/leads/lib";

const TIER_INDICATOR_STYLES = {
  sicak: "[&_[data-slot=progress-indicator]]:bg-primary",
  ilik: "[&_[data-slot=progress-indicator]]:bg-amber-500",
  soguk: "[&_[data-slot=progress-indicator]]:bg-muted-foreground/50",
} as const;

const TIER_TEXT_STYLES = {
  sicak: "text-primary",
  ilik: "text-amber-600 dark:text-amber-400",
  soguk: "text-muted-foreground",
} as const;

export function LeadScore({ score }: { score: number }) {
  const tier = getScoreTier(score);

  return (
    <div className="flex w-32 flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", TIER_TEXT_STYLES[tier])}>
          {SCORE_TIER_LABELS[tier]}
        </span>
        <span className="tabular-nums text-muted-foreground">{score}</span>
      </div>
      <Progress
        value={score}
        className={cn("w-full gap-0", TIER_INDICATOR_STYLES[tier])}
      />
    </div>
  );
}
