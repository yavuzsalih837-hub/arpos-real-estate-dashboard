"use client";

import { useMemo, useState } from "react";
import { UserX } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  LeadFilters,
  type LeadFilterValues,
} from "@/features/leads/components/lead-filters";
import { LeadsList } from "@/features/leads/components/leads-list";
import { LeadDetailSheet } from "@/features/leads/components/lead-detail-sheet";
import type { Lead } from "@/features/leads/types";

const DEFAULT_FILTERS: LeadFilterValues = {
  search: "",
  status: "all",
  source: "all",
  agentId: "all",
};

export function LeadsView({ leads }: { leads: Lead[] }) {
  const [filters, setFilters] = useState<LeadFilterValues>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return leads
      .filter((lead) => {
        if (filters.status !== "all" && lead.status !== filters.status) {
          return false;
        }
        if (filters.source !== "all" && lead.source !== filters.source) {
          return false;
        }
        if (filters.agentId !== "all" && lead.agentId !== filters.agentId) {
          return false;
        }
        if (!search) return true;

        return (
          lead.name.toLowerCase().includes(search) ||
          lead.phone.replace(/\s/g, "").includes(search.replace(/\s/g, "")) ||
          lead.email.toLowerCase().includes(search)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.lastContactAt).getTime() -
          new Date(a.lastContactAt).getTime(),
      );
  }, [leads, filters]);

  return (
    <div className="flex flex-col gap-4">
      <LeadFilters
        values={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="Sonuç bulunamadı"
          description="Filtrelere uygun lead bulunmuyor. Filtreleri temizleyip tekrar deneyebilirsiniz."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Filtreleri Temizle
            </Button>
          }
        />
      ) : (
        <LeadsList leads={filteredLeads} onSelect={setSelectedLead} />
      )}

      <LeadDetailSheet
        lead={selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      />
    </div>
  );
}
