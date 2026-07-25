import { useDroppable } from "@dnd-kit/core";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { PipelineDraggableCard } from "@/features/pipeline/components/pipeline-draggable-card";
import { formatCurrencyTRY } from "@/lib/utils";
import { getColumnValue } from "@/features/pipeline/lib";
import { LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/features/leads/types";

type PipelineColumnProps = {
  status: LeadStatus;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
};

export function PipelineColumn({ status, leads, onSelectLead }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 snap-start flex-col rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-2 border-b p-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {LEAD_STATUS_LABELS[status]}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatCurrencyTRY(getColumnValue(leads))}
          </span>
        </div>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-1 flex-col gap-2 overflow-y-auto p-2 transition-colors",
          isOver && "bg-accent/60",
        )}
      >
        {leads.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Lead yok"
            description="Bu aşamada henüz lead bulunmuyor."
            compact
          />
        ) : (
          leads.map((lead) => (
            <PipelineDraggableCard
              key={lead.id}
              lead={lead}
              onSelect={onSelectLead}
            />
          ))
        )}
      </div>
    </div>
  );
}
