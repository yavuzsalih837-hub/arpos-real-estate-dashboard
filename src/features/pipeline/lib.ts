import { mockLeads } from "@/features/leads/data";
import {
  LEAD_STATUS_LABELS,
  type Lead,
  type LeadStatus,
} from "@/features/leads/types";

const PIPELINE_STAGES: LeadStatus[] = [
  "yeni",
  "iletisimde",
  "nitelikli",
  "randevu",
  "teklif",
  "kazanildi",
];

export type PipelineStageSummary = {
  status: LeadStatus;
  label: string;
  count: number;
};

export function getPipelineSummary(): PipelineStageSummary[] {
  return PIPELINE_STAGES.map((status) => ({
    status,
    label: LEAD_STATUS_LABELS[status],
    count: mockLeads.filter((lead) => lead.status === status).length,
  }));
}

/** Kanban panosundaki kolon sırası — kaybedilen leadler de dahil. */
export const KANBAN_STATUSES: LeadStatus[] = [
  "yeni",
  "iletisimde",
  "nitelikli",
  "randevu",
  "teklif",
  "kazanildi",
  "kaybedildi",
];

export function groupLeadsByStatus(
  leads: Lead[],
): Record<LeadStatus, Lead[]> {
  const grouped = Object.fromEntries(
    KANBAN_STATUSES.map((status) => [status, [] as Lead[]]),
  ) as Record<LeadStatus, Lead[]>;

  for (const lead of leads) {
    grouped[lead.status].push(lead);
  }

  return grouped;
}

export function getColumnValue(leads: Lead[]): number {
  return leads.reduce((sum, lead) => sum + lead.budget, 0);
}

export function parsePropertyInterest(interest: string): {
  propertyType: string;
  district: string;
} {
  const [propertyType, district] = interest.split(",").map((part) => part.trim());
  return { propertyType: propertyType ?? interest, district: district ?? "" };
}
