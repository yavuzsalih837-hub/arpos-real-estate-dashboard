import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyTRY } from "@/lib/utils";
import { AgentAvatar } from "@/features/agents/components/agent-avatar";
import { AgentStatusBadge } from "@/features/agents/components/agent-status-badge";
import type { Agent } from "@/features/agents/types";
import type { AgentPerformance } from "@/features/agents/lib";

type AgentsTableProps = {
  agents: Agent[];
  performanceByAgent: Record<string, AgentPerformance>;
  onSelect: (agent: Agent) => void;
};

export function AgentsTable({ agents, performanceByAgent, onSelect }: AgentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Danışman</TableHead>
            <TableHead>Bölge</TableHead>
            <TableHead>Uzmanlık</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Sıcak</TableHead>
            <TableHead>Portföy</TableHead>
            <TableHead>Satış</TableHead>
            <TableHead>Satış Değeri</TableHead>
            <TableHead>Dönüşüm</TableHead>
            <TableHead>Performans</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => {
            const performance = performanceByAgent[agent.id];

            return (
              <TableRow
                key={agent.id}
                onClick={() => onSelect(agent)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <AgentAvatar initials={agent.initials} status={agent.status} size="sm" />
                    <div className="flex flex-col">
                      <span className="font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {agent.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{agent.region}</TableCell>
                <TableCell className="text-muted-foreground">{agent.specialty}</TableCell>
                <TableCell>
                  <AgentStatusBadge status={agent.status} />
                </TableCell>
                <TableCell className="tabular-nums">{performance.totalLeads}</TableCell>
                <TableCell className="tabular-nums">{performance.hotLeads}</TableCell>
                <TableCell className="tabular-nums">{performance.activeProperties}</TableCell>
                <TableCell className="tabular-nums">{performance.wonDeals}</TableCell>
                <TableCell className="tabular-nums text-primary">
                  {formatCurrencyTRY(performance.salesValue)}
                </TableCell>
                <TableCell className="tabular-nums">%{performance.conversionRate}</TableCell>
                <TableCell className="tabular-nums">
                  {performance.performanceScore}/100
                </TableCell>
                <TableCell>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
