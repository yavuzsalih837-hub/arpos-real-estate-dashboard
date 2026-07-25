import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Phone, MapPin, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LeadScore } from "@/features/leads/components/lead-score";
import { formatCurrencyTRY } from "@/lib/utils";
import { parsePropertyInterest } from "@/features/pipeline/lib";
import { getAgentById } from "@/features/agents/data";
import type { Lead } from "@/features/leads/types";

type PipelineCardProps = {
  lead: Lead;
  onSelect?: (lead: Lead) => void;
  dragging?: boolean;
  className?: string;
};

export function PipelineCard({
  lead,
  onSelect,
  dragging,
  className,
}: PipelineCardProps) {
  const { propertyType, district } = parsePropertyInterest(
    lead.propertyInterest,
  );

  return (
    <Card
      onClick={() => onSelect?.(lead)}
      className={cn(
        "touch-none gap-3 py-3 select-none",
        onSelect && "cursor-pointer",
        dragging && "rotate-1 shadow-lg ring-2 ring-primary/40",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-2.5 px-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium">{lead.name}</span>
          <span className="shrink-0 text-xs font-medium tabular-nums text-primary">
            {formatCurrencyTRY(lead.budget)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="size-3.5 shrink-0" />
          <span>{lead.phone}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Home className="size-3.5 shrink-0" />
            {propertyType}
          </span>
          {district ? (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" />
              {district}
            </span>
          ) : null}
        </div>

        <LeadScore score={lead.score} />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getAgentById(lead.agentId)?.name ?? "Atanmadı"}</span>
          <span>
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
