import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16'da "middleware" dosya kuralı deprecated olup "proxy" olarak
 * yeniden adlandırıldı (bkz. node_modules/next/dist/docs/.../proxy.md).
 * Bu dosya olmadan updateSession() hiç çalışmıyordu; Supabase access
 * token'ı süresi dolduğunda hiçbir zaman yenilenmiyor, bu da RLS'e tabi
 * tüm sorguların (leads/agents/properties/appointments) sessizce mock
 * veriye düşmesine yol açıyordu.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
