export type FollowUpChannel =
  | "whatsapp"
  | "telefon"
  | "e-posta"
  | "gorusme"
  | "manuel-gorev";

export type FollowUpPriority = "dusuk" | "normal" | "yuksek" | "acil";

export type FollowUpStatus = "bekliyor" | "tamamlandi" | "iptal";

export type FollowUpActivity = {
  id: string;
  at: string;
  label: string;
};

export type FollowUp = {
  id: string;
  leadId: string;
  leadName: string;
  agentId: string;
  dueAt: string;
  channel: FollowUpChannel;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  note: string;
  history: FollowUpActivity[];
};

export const FOLLOWUP_CHANNEL_LABELS: Record<FollowUpChannel, string> = {
  whatsapp: "WhatsApp",
  telefon: "Telefon",
  "e-posta": "E-posta",
  gorusme: "Görüşme",
  "manuel-gorev": "Manuel Görev",
};

export const FOLLOWUP_PRIORITY_LABELS: Record<FollowUpPriority, string> = {
  dusuk: "Düşük",
  normal: "Normal",
  yuksek: "Yüksek",
  acil: "Acil",
};

export const FOLLOWUP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  bekliyor: "Bekliyor",
  tamamlandi: "Tamamlandı",
  iptal: "İptal Edildi",
};
