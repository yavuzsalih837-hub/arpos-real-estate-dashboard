import { ACTIVE_LEAD_STATUSES, type Lead } from "@/features/leads/types";

export type ScoreTier = "sicak" | "ilik" | "soguk";

export const SCORE_TIER_LABELS: Record<ScoreTier, string> = {
  sicak: "Sıcak",
  ilik: "Ilık",
  soguk: "Soğuk",
};

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "sicak";
  if (score >= 50) return "ilik";
  return "soguk";
}

export function isHotLead(lead: Lead): boolean {
  return (
    getScoreTier(lead.score) === "sicak" &&
    ACTIVE_LEAD_STATUSES.includes(lead.status)
  );
}
