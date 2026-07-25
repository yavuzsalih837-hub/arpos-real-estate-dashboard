import { LeadsTable } from "@/features/leads/components/leads-table";
import { LeadCard } from "@/features/leads/components/lead-card";
import type { Lead } from "@/features/leads/types";

type LeadsListProps = {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
};

export function LeadsList({ leads, onSelect }: LeadsListProps) {
  return (
    <>
      <LeadsTable leads={leads} onSelect={onSelect} />
      <div className="flex flex-col gap-3 md:hidden">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onSelect={onSelect} />
        ))}
      </div>
    </>
  );
}
