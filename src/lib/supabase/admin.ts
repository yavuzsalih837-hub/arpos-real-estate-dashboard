import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * SADECE SUNUCU TARAFI için service role istemcisi.
 *
 * - Bu dosya hiçbir zaman Client Component içine import edilmemeli.
 * - RLS kurallarını bypass eder, tüm veriye tam erişim sağlar.
 * - Yalnızca Route Handler, Server Action veya trusted backend
 *   entegrasyonlarında (n8n webhook doğrulaması vb.) kullanılmalı.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminClient() istemci tarafında çağrılamaz. Service role anahtarı yalnızca sunucuda kullanılabilir.",
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
