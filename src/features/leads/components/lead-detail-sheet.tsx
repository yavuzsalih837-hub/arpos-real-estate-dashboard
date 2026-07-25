import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Mail, Phone, User, Building2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { LeadScore } from "@/features/leads/components/lead-score";
import { formatCurrencyTRY } from "@/lib/utils";
import { getAgentById } from "@/features/agents/data";
import { LEAD_SOURCE_LABELS, type Lead } from "@/features/leads/types";

type LeadDetailSheetProps = {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
};

export function LeadDetailSheet({ lead, onOpenChange }: LeadDetailSheetProps) {
  return (
    <Sheet open={lead !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {lead ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>{lead.name}</SheetTitle>
              <div className="flex items-center gap-2 pt-1">
                <LeadStatusBadge status={lead.status} />
                <span className="text-xs text-muted-foreground">
                  {LEAD_SOURCE_LABELS[lead.source]}
                </span>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span>{getAgentById(lead.agentId)?.name ?? "Atanmadı"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span>{lead.propertyInterest}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Lead Skoru
                </span>
                <LeadScore score={lead.score} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bütçe</span>
                <span className="font-medium">
                  {formatCurrencyTRY(lead.budget)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Oluşturulma</span>
                <span>
                  {format(new Date(lead.createdAt), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Son İletişim</span>
                <span>
                  {format(new Date(lead.lastContactAt), "d MMMM yyyy HH:mm", {
                    locale: tr,
                  })}
                </span>
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">Notlar</span>
                <p className="text-sm">{lead.notes}</p>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
