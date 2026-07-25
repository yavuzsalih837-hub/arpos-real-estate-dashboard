import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/features/appointments/types";

const STATUS_DOT_STYLES: Record<Appointment["status"], string> = {
  planlandi: "bg-muted-foreground",
  onaylandi: "bg-primary",
  tamamlandi: "bg-emerald-500",
  iptal: "bg-destructive",
  gelmedi: "bg-amber-500",
};

type AppointmentChipProps = {
  appointment: Appointment;
  hasConflict: boolean;
  onSelect: (appointment: Appointment) => void;
};

export function AppointmentChip({
  appointment,
  hasConflict,
  onSelect,
}: AppointmentChipProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(appointment);
      }}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm border bg-card px-1.5 py-1 text-left text-[11px] leading-tight transition-colors hover:bg-accent",
        hasConflict && "border-destructive/50 bg-destructive/5",
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          STATUS_DOT_STYLES[appointment.status],
        )}
      />
      <span className="shrink-0 tabular-nums text-muted-foreground">
        {format(new Date(appointment.scheduledAt), "HH:mm", { locale: tr })}
      </span>
      <span className="truncate">{appointment.leadName}</span>
      {hasConflict ? (
        <AlertTriangle className="ml-auto size-3 shrink-0 text-destructive" />
      ) : null}
    </button>
  );
}
