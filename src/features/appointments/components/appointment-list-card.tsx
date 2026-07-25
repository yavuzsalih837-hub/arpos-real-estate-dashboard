import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { getAgentById } from "@/features/agents/data";
import { APPOINTMENT_TYPE_LABELS, type Appointment } from "@/features/appointments/types";

type AppointmentListCardProps = {
  appointment: Appointment;
  hasConflict: boolean;
  onSelect: (appointment: Appointment) => void;
};

export function AppointmentListCard({
  appointment,
  hasConflict,
  onSelect,
}: AppointmentListCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(appointment)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(appointment);
        }
      }}
      className="cursor-pointer gap-3 py-4"
    >
      <CardContent className="flex flex-col gap-2.5 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-medium">{appointment.leadName}</span>
            <span className="text-xs text-muted-foreground">
              {appointment.propertyTitle}
            </span>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {format(new Date(appointment.scheduledAt), "d MMMM yyyy, HH:mm", {
              locale: tr,
            })}
          </span>
          <span>{APPOINTMENT_TYPE_LABELS[appointment.type]}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getAgentById(appointment.agentId)?.name ?? "Atanmadı"}</span>
          {hasConflict ? (
            <span className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="size-3.5" />
              Çakışma
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
