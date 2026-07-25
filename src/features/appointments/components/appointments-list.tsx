import { AppointmentsTable } from "@/features/appointments/components/appointments-table";
import { AppointmentListCard } from "@/features/appointments/components/appointment-list-card";
import type { Appointment } from "@/features/appointments/types";

type AppointmentsListProps = {
  appointments: Appointment[];
  conflictIds: Set<string>;
  onSelect: (appointment: Appointment) => void;
};

export function AppointmentsList({
  appointments,
  conflictIds,
  onSelect,
}: AppointmentsListProps) {
  return (
    <>
      <AppointmentsTable
        appointments={appointments}
        conflictIds={conflictIds}
        onSelect={onSelect}
      />
      <div className="flex flex-col gap-3 md:hidden">
        {appointments.map((appointment) => (
          <AppointmentListCard
            key={appointment.id}
            appointment={appointment}
            hasConflict={conflictIds.has(appointment.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}
