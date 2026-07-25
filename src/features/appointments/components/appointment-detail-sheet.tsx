"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  AlertTriangle,
  CalendarClock,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { enrichAppointment } from "@/features/appointments/lib";
import {
  APPOINTMENT_TYPE_LABELS,
  type Appointment,
  type AppointmentStatus,
} from "@/features/appointments/types";

type AppointmentDetailSheetProps = {
  appointment: Appointment | null;
  hasConflict: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onNoteChange: (id: string, note: string) => void;
};

const STATUS_ACTIONS: Record<
  AppointmentStatus,
  { target: AppointmentStatus; label: string }[]
> = {
  planlandi: [
    { target: "onaylandi", label: "Onayla" },
    { target: "iptal", label: "İptal Et" },
  ],
  onaylandi: [
    { target: "tamamlandi", label: "Tamamlandı Olarak İşaretle" },
    { target: "gelmedi", label: "Gelmedi Olarak İşaretle" },
    { target: "iptal", label: "İptal Et" },
  ],
  tamamlandi: [{ target: "planlandi", label: "Yeniden Planla" }],
  iptal: [{ target: "planlandi", label: "Yeniden Planla" }],
  gelmedi: [{ target: "planlandi", label: "Yeniden Planla" }],
};

export function AppointmentDetailSheet({
  appointment,
  hasConflict,
  onOpenChange,
  onStatusChange,
  onNoteChange,
}: AppointmentDetailSheetProps) {
  return (
    <Sheet open={appointment !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {appointment ? (
          <AppointmentDetailContent
            key={appointment.id}
            appointment={appointment}
            hasConflict={hasConflict}
            onStatusChange={onStatusChange}
            onNoteChange={onNoteChange}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function AppointmentDetailContent({
  appointment,
  hasConflict,
  onStatusChange,
  onNoteChange,
}: {
  appointment: Appointment;
  hasConflict: boolean;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onNoteChange: (id: string, note: string) => void;
}) {
  const enriched = useMemo(() => enrichAppointment(appointment), [appointment]);
  const [noteDraft, setNoteDraft] = useState(appointment.note);
  const noteDirty = noteDraft !== appointment.note;

  const address = enriched.property
    ? `${enriched.property.neighborhood}, ${enriched.property.district} / ${enriched.property.city}`
    : "Adres bilgisi bulunamadı";

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle>{appointment.leadName}</SheetTitle>
        <div className="flex items-center gap-2 pt-1">
          <AppointmentStatusBadge status={appointment.status} />
          <span className="text-xs text-muted-foreground">
            {APPOINTMENT_TYPE_LABELS[appointment.type]}
          </span>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        {hasConflict ? (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            Bu randevu, aynı danışmanın başka bir randevusuyla çakışıyor.
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-sm">
          <CalendarClock className="size-4 text-muted-foreground" />
          <span>
            {format(new Date(appointment.scheduledAt), "d MMMM yyyy, HH:mm", {
              locale: tr,
            })}{" "}
            - {format(enriched.endAt, "HH:mm", { locale: tr })} (
            {appointment.durationMinutes} dk)
          </span>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Müşteri</span>
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-muted-foreground" />
            <span>{appointment.leadName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-muted-foreground" />
            <span>{enriched.lead?.phone ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span>{enriched.lead?.email ?? "-"}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Portföy</span>
          <div className="flex items-center gap-2 text-sm">
            <Home className="size-4 text-muted-foreground" />
            <span>{appointment.propertyTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-muted-foreground" />
            <span>{address}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Danışman</span>
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-muted-foreground" />
            <span>{enriched.agent?.name ?? "Atanmadı"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-muted-foreground" />
            <span>{enriched.agent?.phone ?? "-"}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Görüşme Notu</span>
          <Textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            rows={3}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={!noteDirty}
            onClick={() => onNoteChange(appointment.id, noteDraft)}
            className="w-fit"
          >
            Notu Kaydet
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Durumu Güncelle</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_ACTIONS[appointment.status].map((action) => (
              <Button
                key={action.target}
                variant={action.target === "iptal" ? "outline" : "default"}
                size="sm"
                onClick={() => onStatusChange(appointment.id, action.target)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
