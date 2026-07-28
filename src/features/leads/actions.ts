"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { LEAD_SOURCE_LABELS, type LeadSource } from "@/features/leads/types";

const LEAD_SOURCE_VALUES = Object.keys(LEAD_SOURCE_LABELS) as [
  LeadSource,
  ...LeadSource[],
];

const createLeadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  email: z.string().trim().optional().nullable(),
  source: z.enum(LEAD_SOURCE_VALUES),
  agentId: z.string().nullable(),
  propertyInterest: z.string().trim().optional().nullable(),
  budget: z.number().min(0).optional(),
  notes: z.string().trim().optional().nullable(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

type CreateLeadResult = { error: string | null };

/**
 * Lead insert işlemini yalnızca sunucu tarafında, doğrulanmış kullanıcı
 * session'ı üzerinden yapar. Böylece "leads" tablosundaki authenticated
 * INSERT RLS politikası, browser client'taki session senkronizasyon
 * farklarından etkilenmez.
 */
export async function createLead(
  input: CreateLeadInput,
): Promise<CreateLeadResult> {
  const parsed = createLeadSchema.safeParse(input);
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

  const { error } = await supabase.from("leads").insert({
    id: crypto.randomUUID(),
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    source: values.source,
    agent_id: values.agentId,
    property_interest: values.propertyInterest || null,
    budget: values.budget ?? 0,
    notes: values.notes || null,
  });

  if (error) {
    return { error: "Lead eklenirken bir hata oluştu. Lütfen tekrar deneyin." };
  }

  return { error: null };
}
