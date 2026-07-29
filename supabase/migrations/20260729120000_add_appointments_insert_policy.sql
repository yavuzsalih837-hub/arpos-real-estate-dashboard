-- =====================================================================
-- Migration: public.appointments INSERT policy (authenticated)
-- Not: "Randevu Oluştur" formu dashboard üzerinden gerçek Supabase insert
-- işlemi yapabilsin diye eklendi. Mevcut appointments_select_authenticated
-- policy'siyle tutarlı şekilde yalnızca authenticated rolüne izin verir.
-- Yıkıcı (destructive) değişiklik içermez, idempotent (exception-guard)
-- şekilde yazılmıştır. Bu dosya henüz canlı Supabase'de çalıştırılmamıştır.
-- =====================================================================

do $$ begin
  create policy "appointments_insert_authenticated"
  on public.appointments
  for insert
  to authenticated
  with check (true);
exception when duplicate_object then null;
end $$;
