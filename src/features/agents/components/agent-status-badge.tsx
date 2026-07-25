import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AGENT_STATUS_LABELS, type AgentStatus } from "@/features/agents/types";

const STATUS_STYLES: Record<AgentStatus, string> = {
  aktif: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  izinli: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  pasif: "border-transparent bg-muted text-muted-foreground",
};

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <Badge className={cn(STATUS_STYLES[status])}>
      {AGENT_STATUS_LABELS[status]}
    </Badge>
  );
}
