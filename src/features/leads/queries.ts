import { createClient } from "@/lib/supabase/server";
import { mockLeads } from "@/features/leads/data";
import type { Lead } from "@/features/leads/types";
import type { Database } from "@/types/database";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? "",
    status: row.status,
    source: row.source,
    agentId: row.agent_id ?? "",
    score: row.score,
    budget: row.budget,
    propertyInterest: row.property_interest ?? "",
    lastContactAt: row.last_contact_at,
    createdAt: row.created_at,
    notes: row.notes ?? "",
  };
}

/**
 * Supabase `leads` tablosundan lead listesini created_at azalan sırada
 * çeker. Bağlantı veya sorgu hatası durumunda mevcut mockLeads verisine
 * fallback yapar.
 */
export async function getLeads(): Promise<Lead[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, name, phone, email, status, source, agent_id, score, budget, property_interest, last_contact_at, created_at, notes, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase leads sorgusu başarısız, mockLeads kullanılıyor:", error);
      return mockLeads;
    }

    return data.map(mapLeadRow);
  } catch (error) {
    console.error("Supabase leads bağlantısı başarısız, mockLeads kullanılıyor:", error);
    return mockLeads;
  }
}
