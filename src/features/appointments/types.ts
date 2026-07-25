export type AppointmentType = "gösterim" | "görüşme" | "imza";

export type AppointmentStatus =
  | "planlandi"
  | "onaylandi"
  | "tamamlandi"
  | "iptal"
  | "gelmedi";

export type Appointment = {
  id: string;
  leadId: string;
  leadName: string;
  agentId: string;
  propertyId: string;
  propertyTitle: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: string;
  durationMinutes: number;
  note: string;
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  gösterim: "Gösterim",
  görüşme: "Görüşme",
  imza: "İmza",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  planlandi: "Planlandı",
  onaylandi: "Onaylandı",
  tamamlandi: "Tamamlandı",
  iptal: "İptal Edildi",
  gelmedi: "Gelmedi",
};

export const ACTIVE_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "planlandi",
  "onaylandi",
];
