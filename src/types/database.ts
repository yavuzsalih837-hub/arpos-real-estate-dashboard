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

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: AgentRow;
        Insert: AgentRow;
        Update: Partial<AgentRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
