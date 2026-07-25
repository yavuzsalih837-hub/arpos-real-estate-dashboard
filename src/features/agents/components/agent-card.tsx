import { CalendarClock, Flame, Home, Target, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyTRY } from "@/lib/utils";
import { AgentAvatar } from "@/features/agents/components/agent-avatar";
import { AgentStatusBadge } from "@/features/agents/components/agent-status-badge";
import { AgentMetric } from "@/features/agents/components/agent-metric";
import type { Agent } from "@/features/agents/types";
import type { AgentPerformance } from "@/features/agents/lib";

type AgentCardProps = {
  agent: Agent;
  performance: AgentPerformance;
  onSelect: (agent: Agent) => void;
};

export function AgentCard({ agent, performance, onSelect }: AgentCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(agent)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(agent);
        }
      }}
      className="cursor-pointer gap-4 py-4"
    >
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <AgentAvatar initials={agent.initials} status={agent.status} size="lg" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{agent.name}</span>
              <span className="text-xs text-muted-foreground">{agent.specialty}</span>
            </div>
          </div>
          <AgentStatusBadge status={agent.status} />
        </div>

        <p className="text-xs text-muted-foreground">{agent.region}</p>

        <div className="grid grid-cols-2 gap-3 border-t pt-3">
          <AgentMetric icon={Users2} label="Toplam Lead" value={performance.totalLeads} />
          <AgentMetric icon={Flame} label="Sıcak Lead" value={performance.hotLeads} />
          <AgentMetric icon={Home} label="Aktif Portföy" value={performance.activeProperties} />
          <AgentMetric icon={CalendarClock} label="Randevu" value={performance.appointmentsCount} />
        </div>

        <div className="flex flex-col gap-2.5 border-t pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="size-3.5" />
              Performans Puanı
            </span>
            <span className="font-medium tabular-nums">
              {performance.performanceScore}/100
            </span>
          </div>
          <Progress value={performance.performanceScore} />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {performance.wonDeals} satış · {formatCurrencyTRY(performance.salesValue)}
            </span>
            <span>%{performance.conversionRate} dönüşüm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
