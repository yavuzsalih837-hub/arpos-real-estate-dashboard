import { isAfter, isBefore, isSameDay, isSameMonth, isSameWeek } from "date-fns";
import { DEMO_TODAY } from "@/features/appointments/data";
import { mockFollowUps } from "@/features/followups/data";
import type { FollowUp } from "@/features/followups/types";
import { getAgentById } from "@/features/agents/data";
import { getLeadById } from "@/features/leads/data";
import type { Agent } from "@/features/agents/types";
import type { Lead } from "@/features/leads/types";

const WEEK_OPTIONS = { weekStartsOn: 1 as const };

export type EnrichedFollowUp = FollowUp & {
  lead: Lead | undefined;
  agent: Agent | undefined;
};

export function enrichFollowUp(followUp: FollowUp): EnrichedFollowUp {
  return {
    ...followUp,
    lead: getLeadById(followUp.leadId),
    agent: getAgentById(followUp.agentId),
  };
}

export function isOverdue(followUp: FollowUp): boolean {
  return (
    followUp.status === "bekliyor" &&
    isBefore(new Date(followUp.dueAt), DEMO_TODAY) &&
    !isSameDay(new Date(followUp.dueAt), DEMO_TODAY)
  );
}

export function isDueToday(followUp: FollowUp): boolean {
  return (
    followUp.status === "bekliyor" &&
    isSameDay(new Date(followUp.dueAt), DEMO_TODAY)
  );
}

export function isUpcomingFollowUp(followUp: FollowUp): boolean {
  return (
    followUp.status === "bekliyor" &&
    isAfter(new Date(followUp.dueAt), DEMO_TODAY) &&
    !isSameDay(new Date(followUp.dueAt), DEMO_TODAY)
  );
}

export type FollowUpCounts = {
  pending: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
  completed: number;
  cancelled: number;
};

export function getFollowUpCounts(followUps: FollowUp[]): FollowUpCounts {
  return {
    pending: followUps.filter((f) => f.status === "bekliyor").length,
    overdue: followUps.filter(isOverdue).length,
    dueToday: followUps.filter(isDueToday).length,
    upcoming: followUps.filter(isUpcomingFollowUp).length,
    completed: followUps.filter((f) => f.status === "tamamlandi").length,
    cancelled: followUps.filter((f) => f.status === "iptal").length,
  };
}

export function getCompletionRate(followUps: FollowUp[]): number {
  if (followUps.length === 0) return 0;
  const completed = followUps.filter((f) => f.status === "tamamlandi").length;
  return Math.round((completed / followUps.length) * 100);
}

export type DateRangeFilter = "all" | "today" | "week" | "month" | "overdue" | "upcoming";

export const DATE_RANGE_LABELS: Record<DateRangeFilter, string> = {
  all: "Tüm Tarihler",
  today: "Bugün",
  week: "Bu Hafta",
  month: "Bu Ay",
  overdue: "Geciken",
  upcoming: "Yaklaşan",
};

export function matchesDateRange(followUp: FollowUp, filter: DateRangeFilter): boolean {
  const date = new Date(followUp.dueAt);

  switch (filter) {
    case "today":
      return isSameDay(date, DEMO_TODAY);
    case "week":
      return isSameWeek(date, DEMO_TODAY, WEEK_OPTIONS);
    case "month":
      return isSameMonth(date, DEMO_TODAY);
    case "overdue":
      return isOverdue(followUp);
    case "upcoming":
      return isUpcomingFollowUp(followUp);
    case "all":
    default:
      return true;
  }
}

export function getUniqueFollowUpLeads(): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const followUp of mockFollowUps) {
    if (!seen.has(followUp.leadId)) {
      seen.set(followUp.leadId, followUp.leadName);
    }
  }
  return Array.from(seen, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name, "tr"),
  );
}
