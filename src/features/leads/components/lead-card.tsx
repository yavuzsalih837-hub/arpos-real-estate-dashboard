import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { LeadScore } from "@/features/leads/components/lead-score";
import { getAgentById } from "@/features/agents/data";
import { LEAD_SOURCE_LABELS, type Lead } from "@/features/leads/types";

type LeadCardProps = {
  lead: Lead;
  onSelect: (lead: Lead) => void;
};

export function LeadCard({ lead, onSelect }: LeadCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(lead)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(lead);
        }
      }}
      className="cursor-pointer gap-3 py-4"
    >
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-medium">{lead.name}</span>
            <span className="text-xs text-muted-foreground">{lead.phone}</span>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{LEAD_SOURCE_LABELS[lead.source]}</span>
          <span>{getAgentById(lead.agentId)?.name ?? "Atanmadı"}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <LeadScore score={lead.score} />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(lead.lastContactAt), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
