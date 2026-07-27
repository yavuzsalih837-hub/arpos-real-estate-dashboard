import { createClient } from "@/lib/supabase/server";
import { mockFollowUps } from "@/features/followups/data";
import type { FollowUp, FollowUpActivity } from "@/features/followups/types";
import type { Database } from "@/types/database";

type FollowUpRow = Database["public"]["Tables"]["followups"]["Row"];

function mapHistory(history: FollowUpRow["history"]): FollowUpActivity[] {
  if (!Array.isArray(history)) return [];

  return history.map((activity) => ({
    id: activity.id,
    at: activity.at,
    label: activity.label,
  }));
}

function mapFollowUpRow(row: FollowUpRow): FollowUp {
  return {
    id: row.id,
    leadId: row.lead_id ?? "",
    leadName: row.lead_name,
    agentId: row.agent_id ?? "",
    dueAt: row.due_at,
    channel: row.channel,
    priority: row.priority,
    status: row.status,
    note: row.note ?? "",
    history: mapHistory(row.history),
  };
}

/**
 * Supabase `followups` tablosundan takip listesini due_at artan sırada
 * çeker. Bağlantı veya sorgu hatası durumunda mevcut mockFollowUps
 * verisine fallback yapar.
 */
export async function getFollowUps(): Promise<FollowUp[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("followups")
      .select(
        "id, lead_id, lead_name, agent_id, due_at, channel, priority, status, note, history",
      )
      .order("due_at", { ascending: true });

    if (error) {
      console.error(
        "Supabase followups sorgusu başarısız, mockFollowUps kullanılıyor:",
        error,
      );
      return mockFollowUps;
    }

    return data.map(mapFollowUpRow);
  } catch (error) {
    console.error(
      "Supabase followups bağlantısı başarısız, mockFollowUps kullanılıyor:",
      error,
    );
    return mockFollowUps;
  }
}
