import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle, CalendarClock, Mail, Phone, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FollowUpStatusBadge } from "@/features/followups/components/followup-status-badge";
import { FollowUpPriorityBadge } from "@/features/followups/components/followup-priority-badge";
import { FollowUpChannelTag } from "@/features/followups/components/followup-channel";
import { ContactQuickActions } from "@/components/shared/contact-quick-actions";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { enrichFollowUp, isOverdue } from "@/features/followups/lib";
import type { FollowUp } from "@/features/followups/types";

type FollowUpDetailSheetProps = {
  followUp: FollowUp | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onPostpone: (id: string, days: number) => void;
  onReschedule: (id: string) => void;
};

export function FollowUpDetailSheet({
  followUp,
  onOpenChange,
  onComplete,
  onCancel,
  onPostpone,
  onReschedule,
}: FollowUpDetailSheetProps) {
  const enriched = followUp ? enrichFollowUp(followUp) : null;

  return (
    <Sheet open={followUp !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {followUp && enriched ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>{followUp.leadName}</SheetTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <FollowUpStatusBadge followUp={followUp} />
                <FollowUpPriorityBadge priority={followUp.priority} />
                {enriched.lead ? (
                  <LeadStatusBadge status={enriched.lead.status} />
                ) : null}
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              {isOverdue(followUp) ? (
                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertTriangle className="size-4 shrink-0" />
                  Bu takip planlanan tarihi geçti.
                </div>
              ) : null}

              <div className="flex items-center gap-2 text-sm">
                <CalendarClock className="size-4 text-muted-foreground" />
                <span>
                  {format(new Date(followUp.dueAt), "d MMMM yyyy, HH:mm", {
                    locale: tr,
                  })}
                </span>
              </div>

              <FollowUpChannelTag channel={followUp.channel} />

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Müşteri</span>
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-4 text-muted-foreground" />
                  <span>{followUp.leadName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{enriched.lead?.phone ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{enriched.lead?.email ?? "-"}</span>
                </div>
                <ContactQuickActions
                  phone={enriched.lead?.phone}
                  email={enriched.lead?.email}
                  size="sm"
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Danışman</span>
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-4 text-muted-foreground" />
                  <span>{enriched.agent?.name ?? "Atanmadı"}</span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Mesaj İçeriği</span>
                <p className="text-sm">{followUp.note}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Geçmiş Aktiviteler</span>
                <ul className="flex flex-col gap-2">
                  {[...followUp.history]
                    .reverse()
                    .map((activity) => (
                      <li key={activity.id} className="flex flex-col text-sm">
                        <span>{activity.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.at), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Aksiyonlar</span>
                <div className="flex flex-wrap gap-2">
                  {followUp.status === "bekliyor" ? (
                    <>
                      <Button size="sm" onClick={() => onComplete(followUp.id)}>
                        Takibi Tamamla
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPostpone(followUp.id, 1)}
                      >
                        1 Gün Ertele
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPostpone(followUp.id, 7)}
                      >
                        1 Hafta Ertele
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(followUp.id)}
                      >
                        İptal Et
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReschedule(followUp.id)}
                    >
                      Yeniden Planla
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
