-- =====================================================================
-- Migration: public.conversations.wa_id kolonu
-- Not: WhatsApp Cloud API webhook'undan gelen bir mesajı, gönderen numara
-- henüz herhangi bir lead ile eşleşmese bile aynı konuşmaya tutarlı şekilde
-- ekleyebilmek için eklendi. lead_id tek başına bir konuşmayı benzersiz
-- belirlemiyor (null olabilir; eşleşmesiz birden fazla numara aynı null
-- değerini paylaşır). wa_id, WhatsApp tarafındaki gerçek konuşma anahtarı
-- (telefon/wa_id) olarak bu boşluğu dolduruyor. Geriye dönük uyumlu:
-- mevcut satırlar wa_id=null ile kalır, wa.me deep-link akışı
-- (features/messages/actions.ts) etkilenmez. Idempotent (if not exists).
-- =====================================================================

alter table public.conversations
  add column if not exists wa_id text;

create index if not exists conversations_wa_id_idx on public.conversations (wa_id);
