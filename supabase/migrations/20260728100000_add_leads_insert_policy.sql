-- =====================================================================
-- Migration: public.leads INSERT policy (authenticated)
-- Not: "Yeni Lead Ekle" formu dashboard üzerinden gerçek Supabase insert
-- işlemi yapabilsin diye eklendi. Mevcut leads_select_authenticated
-- policy'siyle tutarlı şekilde yalnızca authenticated rolüne izin verir.
-- Yıkıcı (destructive) değişiklik içermez, idempotent (exception-guard)
-- şekilde yazılmıştır. Bu dosya henüz canlı Supabase'de çalıştırılmamıştır.
-- =====================================================================

do $$ begin
  create policy "leads_insert_authenticated"
  on public.leads
  for insert
  to authenticated
  with check (true);
exception when duplicate_object then null;
end $$;
