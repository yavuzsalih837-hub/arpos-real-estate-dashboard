/**
 * WhatsApp Cloud API webhook payload'ının bu uygulamada işlenen alt kümesi.
 * Referans: Meta WhatsApp Cloud API "Webhooks" dokümantasyonu.
 */

export type WhatsAppWebhookPayload = {
  object?: string;
  entry?: WhatsAppWebhookEntry[];
};

export type WhatsAppWebhookEntry = {
  id?: string;
  changes?: WhatsAppWebhookChange[];
};

export type WhatsAppWebhookChange = {
  field?: string;
  value?: WhatsAppWebhookValue;
};

export type WhatsAppWebhookValue = {
  messaging_product?: string;
  metadata?: {
    display_phone_number?: string;
    phone_number_id?: string;
  };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppInboundMessage[];
  statuses?: WhatsAppStatusEvent[];
};

export type WhatsAppContact = {
  wa_id: string;
  profile?: { name?: string };
};

export type WhatsAppInboundMessage = {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
};

export type WhatsAppMessageStatus = "sent" | "delivered" | "read" | "failed";

export type WhatsAppStatusEvent = {
  id: string;
  status: WhatsAppMessageStatus | string;
  timestamp: string;
  recipient_id: string;
};
