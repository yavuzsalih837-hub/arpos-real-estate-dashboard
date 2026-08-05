import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { processWhatsAppWebhookPayload } from "@/features/messages/webhook";
import type { WhatsAppWebhookPayload } from "@/features/messages/webhook-types";

/**
 * Meta, webhook'u kaydederken bu endpoint'e GET isteğiyle doğrulama yapar:
 * hub.verify_token, WHATSAPP_VERIFY_TOKEN ortam değişkeniyle eşleşmeli.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error("WhatsApp webhook: WHATSAPP_VERIFY_TOKEN tanımlı değil, doğrulama reddedildi.");
    return new Response("Forbidden", { status: 403 });
  }

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

/**
 * Meta'dan gelen mesaj/durum eventleri. İmza doğrulaması sonrası işlenir,
 * Meta'nın tekrar denemesini (retry storm) önlemek için her durumda hızlıca
 * 200 döndürülür; hatalar yalnızca sunucu loglarına yazılır.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!isValidSignature(rawBody, signature)) {
    console.error("WhatsApp webhook: imza doğrulaması başarısız, istek reddedildi.");
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error("WhatsApp webhook: gövde JSON olarak ayrıştırılamadı.", error);
    return new Response("OK", { status: 200 });
  }

  try {
    await processWhatsAppWebhookPayload(payload);
  } catch (error) {
    console.error("WhatsApp webhook: payload işlenirken beklenmeyen hata.", error);
  }

  return new Response("OK", { status: 200 });
}

function isValidSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
