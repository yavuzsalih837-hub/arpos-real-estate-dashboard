import { format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AppointmentChip } from "@/features/appointments/components/appointment-chip";
import type { Appointment } from "@/features/appointments/types";

type CalendarDayCellProps = {
  date: Date;
  appointments: Appointment[];
  conflictIds: Set<string>;
  isCurrentMonth?: boolean;
  onSelectAppointment: (appointment: Appointment) => void;
  compact?: boolean;
  referenceDate: Date;
};

export function CalendarDayCell({
  date,
  appointments,
  conflictIds,
  isCurrentMonth = true,
  onSelectAppointment,
  compact = false,
  referenceDate,
}: CalendarDayCellProps) {
  const isToday = isSameDay(date, referenceDate);
  const visibleAppointments = compact ? appointments.slice(0, 3) : appointments;
  const overflowCount = appointments.length - visibleAppointments.length;

  return (
    <div
      className={cn(
        "flex min-h-24 flex-col gap-1 border-r border-b p-1.5 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0",
        !isCurrentMonth && "bg-muted/30",
        compact ? "sm:min-h-28" : "min-h-[20rem]",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
          isToday
            ? "bg-primary font-medium text-primary-foreground"
            : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground",
        )}
      >
        {format(date, "d", { locale: tr })}
      </span>

      <div className="flex flex-col gap-1">
        {visibleAppointments.map((appointment) => (
          <AppointmentChip
            key={appointment.id}
            appointment={appointment}
            hasConflict={conflictIds.has(appointment.id)}
            onSelect={onSelectAppointment}
          />
        ))}
        {overflowCount > 0 ? (
          <span className="px-1 text-[11px] text-muted-foreground">
            +{overflowCount} daha
          </span>
        ) : null}
      </div>
    </div>
  );
}
