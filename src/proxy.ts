import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Oturum yenileme ve /dashboard route koruması burada uygulanır.
 * Mantığın kendisi src/lib/supabase/middleware.ts içindeki updateSession()
 * fonksiyonunda. Next.js 16 ile "middleware" dosya konvansiyonu "proxy"
 * olarak yeniden adlandırıldı, bu dosya adı ve export ismi buna göre.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
