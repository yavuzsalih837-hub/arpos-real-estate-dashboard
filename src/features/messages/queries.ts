import { createClient } from "@/lib/supabase/server";
import { mockConversations } from "@/features/messages/data";
import type { Conversation, Message } from "@/features/messages/types";
import type { Database } from "@/types/database";

type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];

function mapMessages(messages: ConversationRow["messages"]): Message[] {
  if (!Array.isArray(messages)) return [];

  return messages.map((message) => ({
    id: message.id,
    direction: message.direction,
    content: message.content,
    sentAt: message.sentAt,
    read: message.read,
    deliveryStatus: message.deliveryStatus,
    automated: message.automated,
  }));
}

function mapConversationRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    leadId: row.lead_id ?? "",
    agentId: row.agent_id ?? "",
    messages: mapMessages(row.messages),
  };
}

/**
 * Supabase `conversations` tablosundan konuşma listesini çeker. `messages`
 * jsonb alanı mevcut Message[] tipine güvenli şekilde eşlenir. Bağlantı
 * veya sorgu hatası durumunda mevcut mockConversations verisine fallback
 * yapar.
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("id, lead_id, agent_id, messages");

    if (error) {
      console.error(
        "Supabase conversations sorgusu başarısız, mockConversations kullanılıyor:",
        error,
      );
      return mockConversations;
    }

    return data.map(mapConversationRow);
  } catch (error) {
    console.error(
      "Supabase conversations bağlantısı başarısız, mockConversations kullanılıyor:",
      error,
    );
    return mockConversations;
  }
}
