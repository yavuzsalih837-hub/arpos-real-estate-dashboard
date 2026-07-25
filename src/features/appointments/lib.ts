import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { DEMO_TODAY, mockAppointments } from "@/features/appointments/data";
import {
  ACTIVE_APPOINTMENT_STATUSES,
  type Appointment,
} from "@/features/appointments/types";
import { getAgentById } from "@/features/agents/data";
import { getLeadById } from "@/features/leads/data";
import { getPropertyById } from "@/features/properties/data";
import type { Agent } from "@/features/agents/types";
import type { Lead } from "@/features/leads/types";
import type { Property } from "@/features/properties/types";

const WEEK_OPTIONS = { weekStartsOn: 1 as const };

export type EnrichedAppointment = Appointment & {
  lead: Lead | undefined;
  agent: Agent | undefined;
  property: Property | undefined;
  endAt: Date;
};

export function enrichAppointment(appointment: Appointment): EnrichedAppointment {
  const start = new Date(appointment.scheduledAt);

  return {
    ...appointment,
    lead: getLeadById(appointment.leadId),
    agent: getAgentById(appointment.agentId),
    property: getPropertyById(appointment.propertyId),
    endAt: new Date(start.getTime() + appointment.durationMinutes * 60_000),
  };
}

export function enrichAppointments(
  appointments: Appointment[],
): EnrichedAppointment[] {
  return appointments.map(enrichAppointment);
}

function rangesOverlap(a: Appointment, b: Appointment): boolean {
  const aStart = new Date(a.scheduledAt).getTime();
  const aEnd = aStart + a.durationMinutes * 60_000;
  const bStart = new Date(b.scheduledAt).getTime();
  const bEnd = bStart + b.durationMinutes * 60_000;
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Aynı danışmana ait, zaman aralığı çakışan randevuların id'lerini döner.
 * İptal edilen ve gelinmeyen randevular çakışma sayılmaz.
 */
export function getConflictingAppointmentIds(
  appointments: Appointment[],
): Set<string> {
  const conflicts = new Set<string>();
  const byAgent = new Map<string, Appointment[]>();

  for (const appointment of appointments) {
    if (appointment.status === "iptal" || appointment.status === "gelmedi") {
      continue;
    }
    const list = byAgent.get(appointment.agentId) ?? [];
    list.push(appointment);
    byAgent.set(appointment.agentId, list);
  }

  for (const list of byAgent.values()) {
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        if (rangesOverlap(list[i], list[j])) {
          conflicts.add(list[i].id);
          conflicts.add(list[j].id);
        }
      }
    }
  }

  return conflicts;
}

export function getTodaysAppointments(
  appointments: Appointment[] = mockAppointments,
): Appointment[] {
  return appointments.filter((appointment) =>
    isSameDay(new Date(appointment.scheduledAt), DEMO_TODAY),
  );
}

export function getUpcomingAppointments(
  appointments: Appointment[] = mockAppointments,
  limit = 4,
): Appointment[] {
  return appointments
    .filter(
      (appointment) =>
        ACTIVE_APPOINTMENT_STATUSES.includes(appointment.status) &&
        (isSameDay(new Date(appointment.scheduledAt), DEMO_TODAY) ||
          isAfter(new Date(appointment.scheduledAt), DEMO_TODAY)),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
    .slice(0, limit);
}

export function getMonthGridDays(monthDate: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate), WEEK_OPTIONS),
    end: endOfWeek(endOfMonth(monthDate), WEEK_OPTIONS),
  });
}

export function getWeekDays(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, WEEK_OPTIONS),
    end: endOfWeek(date, WEEK_OPTIONS),
  });
}

export type DateRangeFilter =
  | "all"
  | "today"
  | "week"
  | "month"
  | "past"
  | "upcoming";

export const DATE_RANGE_LABELS: Record<DateRangeFilter, string> = {
  all: "Tüm Tarihler",
  today: "Bugün",
  week: "Bu Hafta",
  month: "Bu Ay",
  past: "Geçmiş",
  upcoming: "Yaklaşan",
};

export function matchesDateRange(
  appointment: Appointment,
  filter: DateRangeFilter,
): boolean {
  const date = new Date(appointment.scheduledAt);

  switch (filter) {
    case "today":
      return isSameDay(date, DEMO_TODAY);
    case "week":
      return isSameWeek(date, DEMO_TODAY, WEEK_OPTIONS);
    case "month":
      return isSameMonth(date, DEMO_TODAY);
    case "past":
      return isBefore(date, DEMO_TODAY) && !isSameDay(date, DEMO_TODAY);
    case "upcoming":
      return isAfter(date, DEMO_TODAY) || isSameDay(date, DEMO_TODAY);
    case "all":
    default:
      return true;
  }
}
