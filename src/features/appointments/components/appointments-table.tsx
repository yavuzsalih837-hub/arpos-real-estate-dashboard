import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { getAgentById } from "@/features/agents/data";
import { APPOINTMENT_TYPE_LABELS, type Appointment } from "@/features/appointments/types";

type AppointmentsTableProps = {
  appointments: Appointment[];
  conflictIds: Set<string>;
  onSelect: (appointment: Appointment) => void;
};

export function AppointmentsTable({
  appointments,
  conflictIds,
  onSelect,
}: AppointmentsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih / Saat</TableHead>
            <TableHead>Müşteri</TableHead>
            <TableHead>Portföy</TableHead>
            <TableHead>Danışman</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const hasConflict = conflictIds.has(appointment.id);

            return (
              <TableRow
                key={appointment.id}
                onClick={() => onSelect(appointment)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(appointment.scheduledAt), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {format(new Date(appointment.scheduledAt), "HH:mm", {
                        locale: tr,
                      })}
                      {hasConflict ? (
                        <span className="flex items-center gap-0.5 text-destructive">
                          <AlertTriangle className="size-3" />
                          Çakışma
                        </span>
                      ) : null}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{appointment.leadName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {appointment.propertyTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getAgentById(appointment.agentId)?.name ?? "Atanmadı"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {APPOINTMENT_TYPE_LABELS[appointment.type]}
                </TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </TableCell>
                <TableCell>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
