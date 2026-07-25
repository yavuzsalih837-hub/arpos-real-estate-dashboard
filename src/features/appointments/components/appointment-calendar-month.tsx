import { isSameDay, isSameMonth } from "date-fns";
import { CalendarDayCell } from "@/features/appointments/components/calendar-day-cell";
import { getMonthGridDays } from "@/features/appointments/lib";
import type { Appointment } from "@/features/appointments/types";

const WEEKDAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

type AppointmentCalendarMonthProps = {
  monthDate: Date;
  referenceDate: Date;
  appointments: Appointment[];
  conflictIds: Set<string>;
  onSelectAppointment: (appointment: Appointment) => void;
};

export function AppointmentCalendarMonth({
  monthDate,
  referenceDate,
  appointments,
  conflictIds,
  onSelectAppointment,
}: AppointmentCalendarMonthProps) {
  const days = getMonthGridDays(monthDate);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-r p-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            date={day}
            referenceDate={referenceDate}
            isCurrentMonth={isSameMonth(day, monthDate)}
            appointments={appointments.filter((appointment) =>
              isSameDay(new Date(appointment.scheduledAt), day),
            )}
            conflictIds={conflictIds}
            onSelectAppointment={onSelectAppointment}
            compact
          />
        ))}
      </div>
    </div>
  );
}
