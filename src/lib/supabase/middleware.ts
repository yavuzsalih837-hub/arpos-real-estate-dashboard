import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Middleware içinde çağrılacak oturum yenileme ve route koruma fonksiyonu.
 * Yalnızca NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY
 * kullanır, service role anahtarı KULLANMAZ.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getSession() değil getUser() kullanılmalı — Supabase Auth sunucusuna
  // karşı doğrulama yapar ve süresi dolmuşsa oturumu yeniler.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLoginRoute = pathname === "/login";

  if (!user && isDashboardRoute) {
    return redirectTo(request, supabaseResponse, "/login");
  }

  if (user && isLoginRoute) {
    return redirectTo(request, supabaseResponse, "/dashboard");
  }

  return supabaseResponse;
}

function redirectTo(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirectResponse = NextResponse.redirect(url);
  // Oturum yenileme sırasında güncellenmiş cookie'ler varsa yönlendirme
  // yanıtına da taşınır, aksi halde kaybolabilir.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
