-- =====================================================================
-- Migration: public.whatsapp_message_log (idempotency defteri)
-- Not: WhatsApp mesajları conversations.messages jsonb dizisinde
-- saklanıyor; bu alanda kolon bazlı unique constraint tanımlanamaz. Aynı
-- WhatsApp mesaj id'siyle (wamid) webhook'un eşzamanlı veya tekrar
-- denenen (retry) çağrılarında ikinci bir mesaj kaydının oluşmasını
-- veritabanı seviyesinde (primary key ihlali) kesin olarak engellemek
-- için ayrı, minimal bir defter tablosu eklendi. Yalnızca service role
-- (webhook route handler) tarafından kullanılır: RLS açık ve hiçbir
-- policy tanımlanmadığından authenticated/anon rolleri hiçbir satıra
-- erişemez. Mevcut conversations şemasına dokunmaz, geriye dönük
-- tamamen uyumludur. Idempotent (if not exists), yıkıcı değil.
-- =====================================================================

create table if not exists public.whatsapp_message_log (
  wamid           text primary key,
  conversation_id text references public.conversations(id) on delete cascade,
  created_at      timestamptz not null default now()
);

alter table public.whatsapp_message_log enable row level security;
