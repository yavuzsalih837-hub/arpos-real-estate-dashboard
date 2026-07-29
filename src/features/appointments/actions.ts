"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  type AppointmentStatus,
  type AppointmentType,
} from "@/features/appointments/types";

const APPOINTMENT_TYPE_VALUES = Object.keys(APPOINTMENT_TYPE_LABELS) as [
  AppointmentType,
  ...AppointmentType[],
];
const APPOINTMENT_STATUS_VALUES = Object.keys(APPOINTMENT_STATUS_LABELS) as [
  AppointmentStatus,
  ...AppointmentStatus[],
];

const createAppointmentSchema = z.object({
  leadId: z.string().trim().min(1),
  leadName: z.string().trim().min(1),
  agentId: z.string().nullable(),
  propertyId: z.string().trim().min(1),
  propertyTitle: z.string().trim().min(1),
  type: z.enum(APPOINTMENT_TYPE_VALUES),
  status: z.enum(APPOINTMENT_STATUS_VALUES),
  scheduledAt: z.string().refine(
    (value) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return false;
      const year = parsed.getUTCFullYear();
      return year >= 1900 && year <= 2100;
    },
    { message: "Geçerli bir tarih/saat girin." },
  ),
  durationMinutes: z.number().int().min(1),
  note: z.string().trim().optional().nullable(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

type CreateAppointmentResult = { error: string | null };

/**
 * Randevu insert işlemini yalnızca sunucu tarafında, doğrulanmış kullanıcı
 * session'ı üzerinden yapar. Böylece "appointments" tablosundaki authenticated
 * INSERT RLS politikası, browser client'taki session senkronizasyon
 * farklarından etkilenmez.
 */
export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<CreateAppointmentResult> {
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Girilen bilgiler geçersiz. Lütfen formu kontrol edin." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Yetkisiz işlem. Lütfen tekrar giriş yapın." };
  }

  const values = parsed.data;

  const { error } = await supabase.from("appointments").insert({
    id: crypto.randomUUID(),
    lead_id: values.leadId,
    lead_name: values.leadName,
    agent_id: values.agentId,
    property_id: values.propertyId,
    property_title: values.propertyTitle,
    type: values.type,
    status: values.status,
    scheduled_at: values.scheduledAt,
    duration_minutes: values.durationMinutes,
    note: values.note || null,
  });

  if (error) {
    // GEÇİCİ TANI LOGU: yalnızca Postgres/PostgREST hata alanları loglanır;
    // token, cookie veya kullanıcı verisi loglanmaz. Kök neden netleşince
    // kaldırılacaktır.
    console.error("Randevu insert hatası:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      role: user.role ?? null,
    });
    return { error: "Randevu eklenirken bir hata oluştu. Lütfen tekrar deneyin." };
  }

  return { error: null };
}
