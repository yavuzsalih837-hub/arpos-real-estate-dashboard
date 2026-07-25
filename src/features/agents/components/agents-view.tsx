"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Table2, UserPlus, UserX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import { ViewToggle, type ViewToggleOption } from "@/components/shared/view-toggle";
import {
  AgentsFilters,
  type AgentFilterValues,
} from "@/features/agents/components/agents-filters";
import { AgentsGrid } from "@/features/agents/components/agents-grid";
import { AgentsTable } from "@/features/agents/components/agents-table";
import { AgentDetailSheet } from "@/features/agents/components/agent-detail-sheet";
import { getAllAgentPerformance, sortAgents } from "@/features/agents/lib";
import type { Agent } from "@/features/agents/types";

const DEFAULT_FILTERS: AgentFilterValues = {
  search: "",
  status: "all",
  region: "all",
  specialty: "all",
  sortBy: "performance",
};

type ViewMode = "card" | "table";

const VIEW_OPTIONS: ViewToggleOption<ViewMode>[] = [
  { value: "card", label: "Kart görünümü", icon: LayoutGrid },
  { value: "table", label: "Tablo görünümü", icon: Table2 },
];

export function AgentsView({ agents }: { agents: Agent[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filters, setFilters] = useState<AgentFilterValues>(DEFAULT_FILTERS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const performanceByAgent = useMemo(() => getAllAgentPerformance(), []);

  const filteredAgents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    const filtered = agents.filter((agent) => {
      if (filters.status !== "all" && agent.status !== filters.status) {
        return false;
      }
      if (filters.region !== "all" && agent.region !== filters.region) {
        return false;
      }
      if (filters.specialty !== "all" && agent.specialty !== filters.specialty) {
        return false;
      }
      if (!search) return true;

      return (
        agent.name.toLowerCase().includes(search) ||
        agent.email.toLowerCase().includes(search) ||
        agent.phone.replace(/\s/g, "").includes(search.replace(/\s/g, ""))
      );
    });

    return sortAgents(filtered, performanceByAgent, filters.sortBy);
  }, [agents, filters, performanceByAgent]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <AgentsFilters
          values={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
        <div className="flex shrink-0 items-center gap-2">
          <ViewToggle value={viewMode} onChange={setViewMode} options={VIEW_OPTIONS} />
          <ComingSoonButton icon={UserPlus} label="Yeni Danışman Ekle" size="sm" />
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="Sonuç bulunamadı"
          description="Filtrelere uygun danışman bulunmuyor. Filtreleri temizleyip tekrar deneyebilirsiniz."
        />
      ) : viewMode === "card" ? (
        <AgentsGrid
          agents={filteredAgents}
          performanceByAgent={performanceByAgent}
          onSelect={setSelectedAgent}
        />
      ) : (
        <AgentsTable
          agents={filteredAgents}
          performanceByAgent={performanceByAgent}
          onSelect={setSelectedAgent}
        />
      )}

      <AgentDetailSheet
        agent={selectedAgent}
        onOpenChange={(open) => !open && setSelectedAgent(null)}
      />
    </div>
  );
}
