import { createClient } from "@/lib/supabase/server";
import { mockAppointments } from "@/features/appointments/data";
import type { Appointment } from "@/features/appointments/types";
import type { Database } from "@/types/database";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];

function mapAppointmentRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    leadId: row.lead_id ?? "",
    leadName: row.lead_name,
    agentId: row.agent_id ?? "",
    propertyId: row.property_id ?? "",
    propertyTitle: row.property_title,
    type: row.type,
    status: row.status,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    note: row.note ?? "",
  };
}

/**
 * Supabase `appointments` tablosundan randevu listesini scheduled_at artan
 * sırada çeker. Bağlantı veya sorgu hatası durumunda mevcut mockAppointments
 * verisine fallback yapar.
 */
export async function getAppointments(): Promise<Appointment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "id, lead_id, lead_name, agent_id, property_id, property_title, type, status, scheduled_at, duration_minutes, note",
      )
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error(
        "Supabase appointments sorgusu başarısız, mockAppointments kullanılıyor:",
        error,
      );
      return mockAppointments;
    }

    return data.map(mapAppointmentRow);
  } catch (error) {
    console.error(
      "Supabase appointments bağlantısı başarısız, mockAppointments kullanılıyor:",
      error,
    );
    return mockAppointments;
  }
}
