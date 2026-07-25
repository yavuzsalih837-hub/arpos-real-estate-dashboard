import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getAgentById } from "@/features/agents/data";
import {
  APPOINTMENT_TYPE_LABELS,
  type Appointment,
} from "@/features/appointments/types";

export function UpcomingAppointments({
  appointments,
}: {
  appointments: Appointment[];
}) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Yaklaşan randevu yok"
        description="Önümüzdeki günlerde planlanmış bir randevu bulunmuyor."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {appointments.map((appointment) => (
        <li
          key={appointment.id}
          className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm"
        >
          <div className="flex flex-col gap-0.5">
            <p className="font-medium">{appointment.leadName}</p>
            <p className="text-xs text-muted-foreground">
              {APPOINTMENT_TYPE_LABELS[appointment.type]} ·{" "}
              {appointment.propertyTitle} ·{" "}
              {getAgentById(appointment.agentId)?.name}
            </p>
          </div>
          <div className="shrink-0 text-right text-xs text-muted-foreground">
            <p>{format(new Date(appointment.scheduledAt), "d MMMM", { locale: tr })}</p>
            <p>{format(new Date(appointment.scheduledAt), "HH:mm", { locale: tr })}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
