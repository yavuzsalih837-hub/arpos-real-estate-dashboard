-- =====================================================================
-- Migration: public.conversations INSERT/UPDATE policy (authenticated)
-- Not: "WhatsApp Mesajı Gönder" özelliği, wa.me deep-link ile açılan
-- gönderimin geçmiş kaydını dashboard üzerinden gerçek Supabase
-- insert/update işlemiyle yazabilsin diye eklendi. Mevcut
-- conversations_select_authenticated policy'siyle tutarlı şekilde
-- yalnızca authenticated rolüne izin verir. Yıkıcı (destructive)
-- değişiklik içermez, idempotent (exception-guard) şekilde yazılmıştır.
-- Bu dosya henüz canlı Supabase'de çalıştırılmamıştır.
-- =====================================================================

do $$ begin
  create policy "conversations_insert_authenticated"
  on public.conversations
  for insert
  to authenticated
  with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "conversations_update_authenticated"
  on public.conversations
  for update
  to authenticated
  using (true)
  with check (true);
exception when duplicate_object then null;
end $$;
