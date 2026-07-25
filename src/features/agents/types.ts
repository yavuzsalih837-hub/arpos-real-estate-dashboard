export type AgentStatus = "aktif" | "izinli" | "pasif";

export type Agent = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  region: string;
  specialty: string;
  status: AgentStatus;
};

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  aktif: "Aktif",
  izinli: "İzinli",
  pasif: "Pasif",
};
