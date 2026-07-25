import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/features/leads/types";

const STATUS_STYLES: Record<LeadStatus, string> = {
  yeni: "border-transparent bg-secondary text-secondary-foreground",
  iletisimde: "border-transparent bg-accent text-accent-foreground",
  nitelikli: "border-transparent bg-accent text-accent-foreground",
  randevu: "border-transparent bg-primary/15 text-primary",
  teklif: "border-transparent bg-primary/25 text-primary",
  kazanildi: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  kaybedildi: "border-transparent bg-muted text-muted-foreground",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge className={cn(STATUS_STYLES[status])}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
