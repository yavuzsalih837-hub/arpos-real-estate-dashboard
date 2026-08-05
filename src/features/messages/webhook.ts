import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneDigits, toNaiveISOString } from "@/lib/utils";
import type { Database } from "@/types/database";
import type {
  WhatsAppInboundMessage,
  WhatsAppStatusEvent,
  WhatsAppWebhookPayload,
} from "@/features/messages/webhook-types";

type AdminClient = ReturnType<typeof createAdminClient>;
type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
type ConversationMessage = ConversationRow["messages"][number];
type Lead = Pick<
  Database["public"]["Tables"]["leads"]["Row"],
  "id" | "phone" | "agent_id"
>;

const STATUS_MAP: Record<string, ConversationMessage["deliveryStatus"]> = {
  sent: "gonderildi",
  delivered: "iletildi",
  read: "okundu",
};

/**
 * Meta'nın gönderdiği webhook payload'ındaki tüm entry/change/value
 * bloklarını gezip gelen mesajları ve durum (sent/delivered/read)
 * eventlerini işler. Her mesaj/event kendi try/catch bloğunda ele alınır;
 * biri başarısız olsa da diğerleri işlenmeye devam eder.
 */
export async function processWhatsAppWebhookPayload(
  payload: WhatsAppWebhookPayload,
): Promise<void> {
  const values = (payload.entry ?? []).flatMap(
    (entry) => entry.changes?.map((change) => change.value) ?? [],
  );

  const admin = createAdminClient();

  for (const value of values) {
    if (!value) continue;

    for (const message of value.messages ?? []) {
      try {
        await handleInboundMessage(admin, message);
      } catch (error) {
        console.error(
          `WhatsApp webhook: gelen mesaj işlenemedi (wamid=${message.id}).`,
          error,
        );
      }
    }

    for (const status of value.statuses ?? []) {
      try {
        await handleStatusEvent(admin, status);
      } catch (error) {
        console.error(
          `WhatsApp webhook: durum güncellemesi işlenemedi (wamid=${status.id}).`,
          error,
        );
      }
    }
  }
}

async function handleInboundMessage(
  admin: AdminClient,
  message: WhatsAppInboundMessage,
): Promise<void> {
  const waId = normalizePhoneDigits(message.from);
  if (!waId) return;

  const conversation = await findOrCreateConversation(admin, waId);

  const reserved = await reserveWamid(admin, message.id, conversation.id);
  if (!reserved) return;

  const newMessage: ConversationMessage = {
    id: crypto.randomUUID(),
    direction: "inbound",
    content: extractMessageContent(message),
    sentAt: toNaiveISOString(new Date(Number(message.timestamp) * 1000)),
    read: false,
    waMessageId: message.id,
  };

  const { error } = await admin
    .from("conversations")
    .update({ messages: [...(conversation.messages ?? []), newMessage] })
    .eq("id", conversation.id);

  if (error) {
    console.error("WhatsApp webhook: gelen mesaj kaydedilemedi.", error);
  }
}

/**
 * Aynı wamid için eşzamanlı/tekrar denenen webhook çağrılarında yalnızca bir
 * mesajın kaydedilmesini garanti eder. Rezervasyon, whatsapp_message_log
 * tablosundaki primary key (wamid) ihlaline dayanır — bu kontrol veritabanı
 * seviyesinde atomik olduğundan, uygulama içi bir "zaten var mı" kontrolünün
 * aksine yarış durumuna (race condition) karşı güvenlidir. Rezervasyon
 * başarısız olursa (duplicate ya da başka bir hata), mesaj ikinci kez
 * eklenmeden çıkılır — bu, olası bir duplicate'ten daha güvenli bir
 * varsayılan davranıştır.
 */
async function reserveWamid(
  admin: AdminClient,
  wamid: string,
  conversationId: string,
): Promise<boolean> {
  const { error } = await admin
    .from("whatsapp_message_log")
    .insert({ wamid, conversation_id: conversationId });

  if (!error) return true;

  if (error.code === "23505") {
    // unique_violation: bu wamid daha önce başarıyla işlendi, duplicate.
    return false;
  }

  console.error(`WhatsApp webhook: wamid rezervasyonu başarısız (wamid=${wamid}).`, error);
  return false;
}

async function handleStatusEvent(
  admin: AdminClient,
  status: WhatsAppStatusEvent,
): Promise<void> {
  const deliveryStatus = STATUS_MAP[status.status];
  if (!deliveryStatus) return;

  const waId = normalizePhoneDigits(status.recipient_id);
  if (!waId) return;

  const { data: conversation, error } = await admin
    .from("conversations")
    .select("id, messages")
    .eq("wa_id", waId)
    .maybeSingle();

  if (error || !conversation) return;

  const messages = conversation.messages ?? [];
  const index = messages.findIndex((m) => m.waMessageId === status.id);
  if (index === -1 || messages[index].deliveryStatus === deliveryStatus) {
    return;
  }

  const updatedMessages = [...messages];
  updatedMessages[index] = { ...updatedMessages[index], deliveryStatus };

  const { error: updateError } = await admin
    .from("conversations")
    .update({ messages: updatedMessages })
    .eq("id", conversation.id);

  if (updateError) {
    console.error("WhatsApp webhook: mesaj durumu güncellenemedi.", updateError);
  }
}

/**
 * Konuşmayı önce wa_id (gerçek WhatsApp konuşma anahtarı) ile arar. Bulamazsa
 * telefon numarasından lead eşleştirmeye çalışır; eşleşen lead'in wa.me
 * deep-link akışıyla önceden oluşmuş wa_id'siz bir konuşması varsa onu
 * wa_id ile günceller (self-heal). Hiçbiri yoksa yeni konuşma oluşturur
 * (lead eşleşmediyse lead_id null kalır, mesaj kaybolmaz).
 */
async function findOrCreateConversation(
  admin: AdminClient,
  waId: string,
): Promise<ConversationRow> {
  const { data: byWaId } = await admin
    .from("conversations")
    .select("id, lead_id, agent_id, messages, wa_id")
    .eq("wa_id", waId)
    .maybeSingle();

  if (byWaId) return byWaId;

  const lead = await findLeadByPhone(admin, waId);

  if (lead) {
    const { data: legacyConversation } = await admin
      .from("conversations")
      .select("id, lead_id, agent_id, messages, wa_id")
      .eq("lead_id", lead.id)
      .is("wa_id", null)
      .maybeSingle();

    if (legacyConversation) {
      const { data: healed } = await admin
        .from("conversations")
        .update({ wa_id: waId })
        .eq("id", legacyConversation.id)
        .select("id, lead_id, agent_id, messages, wa_id")
        .single();

      if (healed) return healed;
    }
  }

  const { data: created, error } = await admin
    .from("conversations")
    .insert({
      id: crypto.randomUUID(),
      lead_id: lead?.id ?? null,
      agent_id: lead?.agent_id ?? null,
      messages: [],
      wa_id: waId,
    })
    .select("id, lead_id, agent_id, messages, wa_id")
    .single();

  if (error || !created) {
    throw new Error(`Konuşma oluşturulamadı: ${error?.message ?? "bilinmeyen hata"}`);
  }

  return created;
}

const TURKEY_COUNTRY_CODE = "90";

/**
 * Bir rakam dizisini Türkiye E.164 formatına (90 + 10 haneli numara,
 * toplam 12 hane) indirger. Uygulama şu an yalnızca Türkiye pazarında
 * çalıştığından (CLAUDE.md: arayüz Türkçe, TRY para birimi) yalnızca
 * bilinen üç Türk numara biçimi kabul edilir:
 *  - zaten tam E.164: 90XXXXXXXXXX (12 hane)
 *  - yurt içi trunk prefix'li: 0XXXXXXXXXX (11 hane, "0" ile başlar)
 *  - trunk prefix'siz yerel: 5XXXXXXXXX (10 hane, "5" ile başlar)
 * Bunların dışındaki (ör. eksik/bozuk veya yabancı ülke kodlu) numaralar
 * için null döner — belirsiz numaralar üzerinden "kontrolsüz" bir tahmin
 * yapılmaz.
 */
function toCanonicalTurkishNumber(digits: string): string | null {
  if (digits.length === 12 && digits.startsWith(TURKEY_COUNTRY_CODE)) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return TURKEY_COUNTRY_CODE + digits.slice(1);
  }
  if (digits.length === 10 && digits.startsWith("5")) {
    return TURKEY_COUNTRY_CODE + digits;
  }
  return null;
}

/**
 * Lead sayısı bu CRM ölçeğinde küçük olduğundan tüm lead'ler çekilip
 * telefon numarası uygulama içinde normalize edilerek karşılaştırılıyor.
 * Lead hacmi büyürse bunun yerine normalize edilmiş bir telefon kolonu +
 * index üzerinden sorgu yapılmalı.
 *
 * Eşleştirme, her iki taraf da (gelen wa_id ve lead.phone) aynı kanonik
 * E.164 forma indirgenerek yapılır — numaranın son N hanesine bakan
 * "fuzzy" bir karşılaştırma kullanılmaz, bu yüzden farklı ülke kodlu ama
 * yerel kısmı çakışan numaralar birbirine karışamaz. Kanonikleştirme
 * başarısız olursa (beklenmeyen format) eşleştirme denenmez. Birden fazla
 * lead aynı kanonik numarayla eşleşirse (veride mükerrer telefon), hangi
 * lead'in doğru olduğu belirsiz olduğundan rastgele/ilk sonuç seçilmez;
 * eşleştirme güvenli şekilde atlanır ve mesaj sahipsiz (wa_id ile) bir
 * konuşmaya düşer. Telefon numarası veya wa_id loglara yazılmaz.
 */
async function findLeadByPhone(
  admin: AdminClient,
  waId: string,
): Promise<Lead | null> {
  const canonicalWaId = toCanonicalTurkishNumber(waId);
  if (!canonicalWaId) return null;

  const { data: leads, error } = await admin.from("leads").select("id, phone, agent_id");
  if (error || !leads) return null;

  const matches = leads.filter(
    (lead) => toCanonicalTurkishNumber(normalizePhoneDigits(lead.phone)) === canonicalWaId,
  );

  if (matches.length === 1) return matches[0];

  if (matches.length > 1) {
    console.warn(
      `WhatsApp webhook: aynı numarayla birden fazla lead eşleşti (adet=${matches.length}); belirsizlik nedeniyle otomatik eşleştirme atlandı.`,
    );
  }

  return null;
}

function extractMessageContent(message: WhatsAppInboundMessage): string {
  if (message.type === "text" && message.text?.body) {
    return message.text.body;
  }
  return `[desteklenmeyen mesaj türü: ${message.type}]`;
}
