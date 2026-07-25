export type LeadStatus =
  | "yeni"
  | "iletisimde"
  | "nitelikli"
  | "randevu"
  | "teklif"
  | "kazanildi"
  | "kaybedildi";

export type LeadSource =
  | "web-sitesi"
  | "whatsapp"
  | "instagram"
  | "referans"
  | "portal"
  | "telefon";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  agentId: string;
  score: number;
  budget: number;
  propertyInterest: string;
  lastContactAt: string;
  createdAt: string;
  notes: string;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  yeni: "Yeni",
  iletisimde: "İletişimde",
  nitelikli: "Nitelikli",
  randevu: "Randevu Planlandı",
  teklif: "Teklif Aşamasında",
  kazanildi: "Kazanıldı",
  kaybedildi: "Kaybedildi",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  "web-sitesi": "Web Sitesi",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  referans: "Referans",
  portal: "İlan Portalı",
  telefon: "Telefon",
};

export const ACTIVE_LEAD_STATUSES: LeadStatus[] = [
  "yeni",
  "iletisimde",
  "nitelikli",
  "randevu",
  "teklif",
];
