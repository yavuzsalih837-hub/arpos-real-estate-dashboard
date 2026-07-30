"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/features/messages/types";

const logWhatsAppMessageSchema = z.object({
  leadId: z.string().trim().min(1),
  agentId: z.string().nullable(),
  content: z.string().trim().min(1),
});

export type LogWhatsAppMessageInput = z.infer<typeof logWhatsAppMessageSchema>;

type LogWhatsAppMessageResult = { error: string | null };

/**
 * WhatsApp gönderimi wa.me deep-link ile tarayıcıda açılır; bu action yalnızca
 * "WhatsApp penceresi açıldı" bilgisini geçmiş kaydı olarak Supabase
 * `conversations` tablosuna düşer. Gerçek teslimat/okunma durumu bilinmediği
 * için deliveryStatus kasıtlı olarak set edilmez.
 */
export async function logWhatsAppMessage(
  input: LogWhatsAppMessageInput,
): Promise<LogWhatsAppMessageResult> {
  const parsed = logWhatsAppMessageSchema.safeParse(input);
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

  const newMessage: Message = {
    id: crypto.randomUUID(),
    direction: "outbound",
    content: values.content,
    sentAt: new Date().toISOString(),
    read: true,
    automated: false,
  };

  const { data: existing, error: selectError } = await supabase
    .from("conversations")
    .select("id, messages")
    .eq("lead_id", values.leadId)
    .maybeSingle();

  if (selectError) {
    return { error: "Mesaj geçmişine kaydedilirken bir hata oluştu." };
  }

  if (existing) {
    const { error } = await supabase
      .from("conversations")
      .update({ messages: [...(existing.messages ?? []), newMessage] })
      .eq("id", existing.id);

    if (error) {
      return { error: "Mesaj geçmişine kaydedilirken bir hata oluştu." };
    }

    return { error: null };
  }

  const { error } = await supabase.from("conversations").insert({
    id: crypto.randomUUID(),
    lead_id: values.leadId,
    agent_id: values.agentId,
    messages: [newMessage],
  });

  if (error) {
    return { error: "Mesaj geçmişine kaydedilirken bir hata oluştu." };
  }

  return { error: null };
}
