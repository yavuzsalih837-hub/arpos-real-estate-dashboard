export type MessageDirection = "inbound" | "outbound";

export type MessageDeliveryStatus = "gonderildi" | "iletildi" | "okundu";

export type Message = {
  id: string;
  direction: MessageDirection;
  content: string;
  sentAt: string;
  read: boolean;
  deliveryStatus?: MessageDeliveryStatus;
  automated?: boolean;
};

export type Conversation = {
  id: string;
  leadId: string;
  agentId: string;
  messages: Message[];
};
