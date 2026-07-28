"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Başarı durumunda yönlendirmeyi burada yapmıyoruz: signInWithPassword
 * sonrası ayarlanan session cookie'lerinin tarayıcının Supabase istemcisi
 * tarafından güvenilir şekilde okunabilmesi için, yönlendirme çağıran client
 * component tarafından tam sayfa yenilemesiyle (window.location.assign)
 * yapılıyor. Next.js'in kendi redirect()'i yumuşak (RSC) navigasyon olduğu
 * için bu garantiyi vermiyor.
 */
export async function signIn(formData: FormData): Promise<{ error: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  return { error: Boolean(error) };
}
