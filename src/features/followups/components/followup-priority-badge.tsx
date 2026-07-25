import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FOLLOWUP_PRIORITY_LABELS,
  type FollowUpPriority,
} from "@/features/followups/types";

const PRIORITY_STYLES: Record<FollowUpPriority, string> = {
  dusuk: "border-transparent bg-muted text-muted-foreground",
  normal: "border-transparent bg-secondary text-secondary-foreground",
  yuksek: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  acil: "border-transparent bg-destructive/10 text-destructive",
};

export function FollowUpPriorityBadge({ priority }: { priority: FollowUpPriority }) {
  return (
    <Badge className={cn(PRIORITY_STYLES[priority])}>
      {FOLLOWUP_PRIORITY_LABELS[priority]}
    </Badge>
  );
}
