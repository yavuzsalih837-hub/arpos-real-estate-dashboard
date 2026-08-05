/**
 * Bu dosya Supabase şeması bağlandığında `supabase gen types typescript`
 * komutuyla üretilecek gerçek veritabanı tipleriyle değiştirilecektir.
 * Şimdilik yalnızca uygulama genelinde tip güvenliğini bozmayan bir iskelettir.
 */

type AgentRow = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  region: string;
  specialty: string;
  status: "aktif" | "izinli" | "pasif";
};

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status:
    | "yeni"
    | "iletisimde"
    | "nitelikli"
    | "randevu"
    | "teklif"
    | "kazanildi"
    | "kaybedildi";
  source:
    | "web-sitesi"
    | "whatsapp"
    | "instagram"
    | "referans"
    | "portal"
    | "telefon";
  agent_id: string | null;
  score: number;
  budget: number;
  property_interest: string | null;
  last_contact_at: string;
  created_at: string;
  notes: string | null;
  updated_at: string;
};

type LeadInsert = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  status?: LeadRow["status"];
  source: LeadRow["source"];
  agent_id?: string | null;
  score?: number;
  budget?: number;
  property_interest?: string | null;
  last_contact_at?: string;
  created_at?: string;
  notes?: string | null;
  updated_at?: string;
};

type PropertyRow = {
  id: string;
  listing_code: string;
  title: string;
  description: string | null;
  price: number;
  city: string;
  district: string;
  neighborhood: string | null;
  property_type:
    | "daire"
    | "villa"
    | "mustakil-ev"
    | "ofis"
    | "isyeri"
    | "arsa";
  rooms: string;
  area_m2: number;
  status: "aktif" | "pasif" | "satildi" | "kiralandi";
  transaction_type: "satilik" | "kiralik";
  agent_id: string | null;
  created_at?: string;
  updated_at: string;
};

type PropertyInsert = {
  id: string;
  listing_code: string;
  title: string;
  description?: string | null;
  price?: number;
  city: string;
  district: string;
  neighborhood?: string | null;
  property_type: PropertyRow["property_type"];
  transaction_type?: PropertyRow["transaction_type"];
  rooms?: string;
  area_m2: number;
  status?: PropertyRow["status"];
  agent_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

type AppointmentRow = {
  id: string;
  lead_id: string | null;
  lead_name: string;
  agent_id: string | null;
  property_id: string | null;
  property_title: string;
  type: "gösterim" | "görüşme" | "imza";
  status: "planlandi" | "onaylandi" | "tamamlandi" | "iptal" | "gelmedi";
  scheduled_at: string;
  duration_minutes: number;
  note: string | null;
  created_at?: string;
  updated_at?: string;
};

type FollowUpRow = {
  id: string;
  lead_id: string | null;
  lead_name: string;
  agent_id: string | null;
  due_at: string;
  channel: "whatsapp" | "telefon" | "e-posta" | "gorusme" | "manuel-gorev";
  priority: "dusuk" | "normal" | "yuksek" | "acil";
  status: "bekliyor" | "tamamlandi" | "iptal";
  note: string | null;
  history: { id: string; at: string; label: string }[];
  created_at?: string;
  updated_at?: string;
};

type ConversationMessageRow = {
  id: string;
  direction: "inbound" | "outbound";
  content: string;
  sentAt: string;
  read: boolean;
  deliveryStatus?: "gonderildi" | "iletildi" | "okundu";
  automated?: boolean;
  waMessageId?: string;
};

type ConversationRow = {
  id: string;
  lead_id: string | null;
  agent_id: string | null;
  messages: ConversationMessageRow[];
  wa_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

type WhatsAppMessageLogRow = {
  wamid: string;
  conversation_id: string | null;
  created_at?: string;
};

type WhatsAppMessageLogInsert = {
  wamid: string;
  conversation_id?: string | null;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: AgentRow;
        Insert: AgentRow;
        Update: Partial<AgentRow>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      properties: {
        Row: PropertyRow;
        Insert: PropertyInsert;
        Update: Partial<PropertyRow>;
        Relationships: [];
      };
      appointments: {
        Row: AppointmentRow;
        Insert: AppointmentRow;
        Update: Partial<AppointmentRow>;
        Relationships: [];
      };
      followups: {
        Row: FollowUpRow;
        Insert: FollowUpRow;
        Update: Partial<FollowUpRow>;
        Relationships: [];
      };
      conversations: {
        Row: ConversationRow;
        Insert: ConversationRow;
        Update: Partial<ConversationRow>;
        Relationships: [];
      };
      whatsapp_message_log: {
        Row: WhatsAppMessageLogRow;
        Insert: WhatsAppMessageLogInsert;
        Update: Partial<WhatsAppMessageLogRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
