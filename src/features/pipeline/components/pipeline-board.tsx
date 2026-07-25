"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import {
  PipelineFilters,
  type PipelineFilterValues,
} from "@/features/pipeline/components/pipeline-filters";
import { PipelineColumn } from "@/features/pipeline/components/pipeline-column";
import { PipelineCard } from "@/features/pipeline/components/pipeline-card";
import { LeadDetailSheet } from "@/features/leads/components/lead-detail-sheet";
import { groupLeadsByStatus, KANBAN_STATUSES } from "@/features/pipeline/lib";
import {
  LEAD_STATUS_LABELS,
  type Lead,
  type LeadStatus,
} from "@/features/leads/types";

const DEFAULT_FILTERS: PipelineFilterValues = {
  search: "",
  agentId: "all",
};

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && value in LEAD_STATUS_LABELS;
}

export function PipelineBoard({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filters, setFilters] = useState<PipelineFilterValues>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const filteredLeads = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return leads.filter((lead) => {
      if (filters.agentId !== "all" && lead.agentId !== filters.agentId) {
        return false;
      }
      if (!search) return true;

      return (
        lead.name.toLowerCase().includes(search) ||
        lead.phone.replace(/\s/g, "").includes(search.replace(/\s/g, ""))
      );
    });
  }, [leads, filters]);

  const grouped = useMemo(
    () => groupLeadsByStatus(filteredLeads),
    [filteredLeads],
  );

  function handleDragStart(event: DragStartEvent) {
    const lead = leads.find((item) => item.id === event.active.id);
    setActiveLead(lead ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);

    const targetStatus = event.over?.id;
    if (!isLeadStatus(targetStatus)) return;

    const draggedLead = leads.find((lead) => lead.id === event.active.id);
    if (!draggedLead || draggedLead.status === targetStatus) return;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === draggedLead.id ? { ...lead, status: targetStatus } : lead,
      ),
    );
    toast.success(
      `${draggedLead.name} → ${LEAD_STATUS_LABELS[targetStatus]} aşamasına taşındı.`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PipelineFilters values={filters} onChange={setFilters} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {KANBAN_STATUSES.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              leads={grouped[status]}
              onSelectLead={setSelectedLead}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <PipelineCard lead={activeLead} dragging /> : null}
        </DragOverlay>
      </DndContext>

      <LeadDetailSheet
        lead={selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      />
    </div>
  );
}
