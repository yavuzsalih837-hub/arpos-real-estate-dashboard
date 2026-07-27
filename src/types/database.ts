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
  agent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: AgentRow;
        Insert: AgentRow;
        Update: Partial<AgentRow>;
      };
      leads: {
        Row: LeadRow;
        Insert: LeadRow;
        Update: Partial<LeadRow>;
      };
      properties: {
        Row: PropertyRow;
        Insert: PropertyRow;
        Update: Partial<PropertyRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
