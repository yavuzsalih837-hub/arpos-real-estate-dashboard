import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FollowUpStatusBadge } from "@/features/followups/components/followup-status-badge";
import { FollowUpPriorityBadge } from "@/features/followups/components/followup-priority-badge";
import { FollowUpChannelTag } from "@/features/followups/components/followup-channel";
import { ContactQuickActions } from "@/components/shared/contact-quick-actions";
import { getAgentById } from "@/features/agents/data";
import { isDueToday, isOverdue } from "@/features/followups/lib";
import type { FollowUp } from "@/features/followups/types";

type FollowUpCardProps = {
  followUp: FollowUp;
  phone?: string;
  email?: string;
  onSelect: (followUp: FollowUp) => void;
};

export function FollowUpCard({ followUp, phone, email, onSelect }: FollowUpCardProps) {
  const overdue = isOverdue(followUp);
  const dueToday = isDueToday(followUp);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(followUp)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(followUp);
        }
      }}
      className={cn(
        "cursor-pointer gap-3 py-4",
        overdue && "border-destructive/40",
        dueToday && "ring-1 ring-primary/40",
      )}
    >
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-medium">{followUp.leadName}</span>
            <span className="text-xs text-muted-foreground">
              {getAgentById(followUp.agentId)?.name ?? "Atanmadı"}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <FollowUpStatusBadge followUp={followUp} />
            <FollowUpPriorityBadge priority={followUp.priority} />
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{followUp.note}</p>

        <div className="flex items-center justify-between text-xs">
          <FollowUpChannelTag channel={followUp.channel} />
          <span
            className={cn(
              "flex items-center gap-1 tabular-nums",
              overdue ? "font-medium text-destructive" : "text-muted-foreground",
            )}
          >
            {overdue ? <AlertTriangle className="size-3.5" /> : null}
            {format(new Date(followUp.dueAt), "d MMMM yyyy, HH:mm", { locale: tr })}
          </span>
        </div>

        <Separator />

        <ContactQuickActions phone={phone} email={email} stopPropagation />
      </CardContent>
    </Card>
  );
}
