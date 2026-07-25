/**
 * Bu dosya Supabase şeması bağlandığında `supabase gen types typescript`
 * komutuyla üretilecek gerçek veritabanı tipleriyle değiştirilecektir.
 * Şimdilik yalnızca uygulama genelinde tip güvenliğini bozmayan bir iskelettir.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
