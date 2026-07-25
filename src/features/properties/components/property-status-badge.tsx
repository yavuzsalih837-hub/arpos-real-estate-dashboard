import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROPERTY_STATUS_LABELS, type PropertyStatus } from "@/features/properties/types";

const STATUS_STYLES: Record<PropertyStatus, string> = {
  aktif: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  pasif: "border-transparent bg-muted text-muted-foreground",
  satildi: "border-transparent bg-primary/15 text-primary",
  kiralandi: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <Badge className={cn(STATUS_STYLES[status])}>
      {PROPERTY_STATUS_LABELS[status]}
    </Badge>
  );
}
