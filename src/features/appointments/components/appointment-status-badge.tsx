import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
} from "@/features/appointments/types";

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  planlandi: "border-transparent bg-secondary text-secondary-foreground",
  onaylandi: "border-transparent bg-primary/15 text-primary",
  tamamlandi: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  iptal: "border-transparent bg-destructive/10 text-destructive",
  gelmedi: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge className={cn(STATUS_STYLES[status])}>
      {APPOINTMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
