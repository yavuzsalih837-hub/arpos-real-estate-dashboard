import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { FollowUpPriorityBadge } from "@/features/followups/components/followup-priority-badge";
import type { FollowUp } from "@/features/followups/types";

type FollowUpSummaryListProps = {
  followUps: FollowUp[];
  onSelect: (followUp: FollowUp) => void;
  emptyLabel: string;
};

export function FollowUpSummaryList({
  followUps,
  onSelect,
  emptyLabel,
}: FollowUpSummaryListProps) {
  if (followUps.length === 0) {
    return <EmptyState icon={CheckCircle2} title={emptyLabel} compact />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {followUps.slice(0, 5).map((followUp) => (
        <li key={followUp.id}>
          <button
            type="button"
            onClick={() => onSelect(followUp)}
            className="flex w-full items-center justify-between gap-2 rounded-md border p-2 text-left text-sm transition-colors hover:bg-accent"
          >
            <div className="flex flex-col">
              <span className="font-medium">{followUp.leadName}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(followUp.dueAt), "d MMMM, HH:mm", { locale: tr })}
              </span>
            </div>
            <FollowUpPriorityBadge priority={followUp.priority} />
          </button>
        </li>
      ))}
    </ul>
  );
}
