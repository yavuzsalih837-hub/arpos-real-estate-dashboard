import { createClient } from "@/lib/supabase/server";
import { mockAgents } from "@/features/agents/data";
import type { Agent } from "@/features/agents/types";

/**
 * Supabase `agents` tablosundan danışman listesini çeker. Bağlantı veya
 * sorgu hatası durumunda mevcut mockAgents verisine fallback yapar.
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agents")
      .select("id, name, initials, phone, email, region, specialty, status")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase agents sorgusu başarısız, mockAgents kullanılıyor:", error);
      return mockAgents;
    }

    return data;
  } catch (error) {
    console.error("Supabase agents bağlantısı başarısız, mockAgents kullanılıyor:", error);
    return mockAgents;
  }
}
