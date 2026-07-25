import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FOLLOWUP_STATUS_LABELS,
  type FollowUp,
  type FollowUpStatus,
} from "@/features/followups/types";
import { isOverdue } from "@/features/followups/lib";

const STATUS_STYLES: Record<FollowUpStatus, string> = {
  bekliyor: "border-transparent bg-secondary text-secondary-foreground",
  tamamlandi: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  iptal: "border-transparent bg-muted text-muted-foreground",
};

export function FollowUpStatusBadge({ followUp }: { followUp: FollowUp }) {
  if (isOverdue(followUp)) {
    return (
      <Badge className="border-transparent bg-destructive/10 text-destructive">
        Gecikti
      </Badge>
    );
  }

  return (
    <Badge className={cn(STATUS_STYLES[followUp.status])}>
      {FOLLOWUP_STATUS_LABELS[followUp.status]}
    </Badge>
  );
}
