import { format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarDayCell } from "@/features/appointments/components/calendar-day-cell";
import { getWeekDays } from "@/features/appointments/lib";
import type { Appointment } from "@/features/appointments/types";

type AppointmentCalendarWeekProps = {
  weekDate: Date;
  referenceDate: Date;
  appointments: Appointment[];
  conflictIds: Set<string>;
  onSelectAppointment: (appointment: Appointment) => void;
};

export function AppointmentCalendarWeek({
  weekDate,
  referenceDate,
  appointments,
  conflictIds,
  onSelectAppointment,
}: AppointmentCalendarWeekProps) {
  const days = getWeekDays(weekDate);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <div className="grid min-w-[840px] grid-cols-7 border-b bg-muted/40">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="border-r p-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
          >
            {format(day, "EEEE d MMMM", { locale: tr })}
          </div>
        ))}
      </div>
      <div className="grid min-w-[840px] grid-cols-7">
        {days.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            date={day}
            referenceDate={referenceDate}
            appointments={appointments
              .filter((appointment) =>
                isSameDay(new Date(appointment.scheduledAt), day),
              )
              .sort(
                (a, b) =>
                  new Date(a.scheduledAt).getTime() -
                  new Date(b.scheduledAt).getTime(),
              )}
            conflictIds={conflictIds}
            onSelectAppointment={onSelectAppointment}
          />
        ))}
      </div>
    </div>
  );
}
