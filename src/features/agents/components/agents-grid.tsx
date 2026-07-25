import { AgentCard } from "@/features/agents/components/agent-card";
import type { Agent } from "@/features/agents/types";
import type { AgentPerformance } from "@/features/agents/lib";

type AgentsGridProps = {
  agents: Agent[];
  performanceByAgent: Record<string, AgentPerformance>;
  onSelect: (agent: Agent) => void;
};

export function AgentsGrid({ agents, performanceByAgent, onSelect }: AgentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          performance={performanceByAgent[agent.id]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
