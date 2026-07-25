import { isSameMonth, subMonths } from "date-fns";
import { mockAgents } from "@/features/agents/data";
import { mockLeads } from "@/features/leads/data";
import { isHotLead } from "@/features/leads/lib";
import { mockProperties } from "@/features/properties/data";
import { mockAppointments, DEMO_TODAY } from "@/features/appointments/data";
import type { Lead } from "@/features/leads/types";
import type { Agent } from "@/features/agents/types";

export type MonthlyStats = {
  leads: number;
  wonDeals: number;
  salesValue: number;
};

export type AgentPerformance = {
  agentId: string;
  totalLeads: number;
  hotLeads: number;
  activeProperties: number;
  appointmentsCount: number;
  wonDeals: number;
  salesValue: number;
  conversionRate: number;
  performanceScore: number;
  thisMonth: MonthlyStats;
  lastMonth: MonthlyStats;
};

function getMonthlyStats(leads: Lead[], referenceDate: Date): MonthlyStats {
  const monthLeads = leads.filter((lead) =>
    isSameMonth(new Date(lead.createdAt), referenceDate),
  );
  const won = monthLeads.filter((lead) => lead.status === "kazanildi");

  return {
    leads: monthLeads.length,
    wonDeals: won.length,
    salesValue: won.reduce((sum, lead) => sum + lead.budget, 0),
  };
}

/**
 * Performans puanı; dönüşüm oranı, sıcak lead oranı ve kapanan satış
 * sayısının ağırlıklı bir bileşimidir (40 taban puan + katkılar, 0-100
 * aralığına sıkıştırılır). Gerçek Supabase entegrasyonunda bu hesap
 * backend tarafına taşınacaktır.
 */
function calculatePerformanceScore({
  conversionRate,
  hotLeadRatio,
  wonDeals,
}: {
  conversionRate: number;
  hotLeadRatio: number;
  wonDeals: number;
}): number {
  const raw = 40 + conversionRate * 1.2 + hotLeadRatio * 0.3 + wonDeals * 10;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function getAgentPerformance(agentId: string): AgentPerformance {
  const agentLeads = mockLeads.filter((lead) => lead.agentId === agentId);
  const totalLeads = agentLeads.length;
  const hotLeads = agentLeads.filter(isHotLead).length;
  const wonLeads = agentLeads.filter((lead) => lead.status === "kazanildi");
  const wonDeals = wonLeads.length;
  const salesValue = wonLeads.reduce((sum, lead) => sum + lead.budget, 0);
  const conversionRate =
    totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;
  const hotLeadRatio = totalLeads > 0 ? (hotLeads / totalLeads) * 100 : 0;

  const activeProperties = mockProperties.filter(
    (property) => property.agentId === agentId && property.status === "aktif",
  ).length;
  const appointmentsCount = mockAppointments.filter(
    (appointment) => appointment.agentId === agentId,
  ).length;

  return {
    agentId,
    totalLeads,
    hotLeads,
    activeProperties,
    appointmentsCount,
    wonDeals,
    salesValue,
    conversionRate,
    performanceScore: calculatePerformanceScore({
      conversionRate,
      hotLeadRatio,
      wonDeals,
    }),
    thisMonth: getMonthlyStats(agentLeads, DEMO_TODAY),
    lastMonth: getMonthlyStats(agentLeads, subMonths(DEMO_TODAY, 1)),
  };
}

export function getAllAgentPerformance(): Record<string, AgentPerformance> {
  return Object.fromEntries(
    mockAgents.map((agent) => [agent.id, getAgentPerformance(agent.id)]),
  );
}

export function getAgentLeads(agentId: string, limit?: number): Lead[] {
  const leads = mockLeads
    .filter((lead) => lead.agentId === agentId)
    .sort(
      (a, b) =>
        new Date(b.lastContactAt).getTime() -
        new Date(a.lastContactAt).getTime(),
    );

  return limit ? leads.slice(0, limit) : leads;
}

export function getAgentProperties(agentId: string, limit?: number) {
  const properties = mockProperties
    .filter((property) => property.agentId === agentId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return limit ? properties.slice(0, limit) : properties;
}

export function getAgentAppointments(agentId: string, limit?: number) {
  const appointments = mockAppointments
    .filter((appointment) => appointment.agentId === agentId)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );

  return limit ? appointments.slice(0, limit) : appointments;
}

export type AgentSortOption = "performance" | "name" | "leads" | "sales";

export const AGENT_SORT_LABELS: Record<AgentSortOption, string> = {
  performance: "Performansa Göre",
  name: "İsme Göre",
  leads: "Toplam Lead'e Göre",
  sales: "Satış Değerine Göre",
};

export function sortAgents(
  agents: Agent[],
  performanceByAgent: Record<string, AgentPerformance>,
  sortBy: AgentSortOption,
): Agent[] {
  const sorted = [...agents];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    case "leads":
      return sorted.sort(
        (a, b) =>
          performanceByAgent[b.id].totalLeads - performanceByAgent[a.id].totalLeads,
      );
    case "sales":
      return sorted.sort(
        (a, b) =>
          performanceByAgent[b.id].salesValue - performanceByAgent[a.id].salesValue,
      );
    case "performance":
    default:
      return sorted.sort(
        (a, b) =>
          performanceByAgent[b.id].performanceScore -
          performanceByAgent[a.id].performanceScore,
      );
  }
}

export function getUniqueRegions(): string[] {
  return Array.from(new Set(mockAgents.map((agent) => agent.region))).sort(
    (a, b) => a.localeCompare(b, "tr"),
  );
}

export function getUniqueSpecialties(): string[] {
  return Array.from(new Set(mockAgents.map((agent) => agent.specialty))).sort(
    (a, b) => a.localeCompare(b, "tr"),
  );
}
