-- =====================================================================
-- Migration: public.conversations tablosu (mockConversations şemasına birebir uyumlu)
-- Not: lead_id uuid (canlı public.leads.id tipiyle aynı), agent_id uuid
-- (agents.id ile aynı tip). messages alanı mock'taki iç içe Message[] dizisini birebir
-- yansıtmak için jsonb olarak tanımlandı. Bu dosya production güvenliği
-- için düzeltilmiştir: yıkıcı (destructive) drop ifadeleri kaldırılmış,
-- tüm nesne oluşturma adımları idempotent hale getirilmiştir (if not
-- exists / exception-guard), seed verisi supabase/seed.sql dosyasına
-- taşınmıştır, RLS SELECT policy'si yalnızca authenticated rolüne
-- daraltılmıştır (anon erişimi kaldırıldı).
-- =====================================================================

-- 1) Tablo
create table if not exists public.conversations (
  id                text primary key,
  lead_id           uuid references public.leads(id) on delete set null,
  agent_id          uuid references public.agents(id) on delete set null,
  messages          jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 2) Sorgu paternlerini destekleyen indexler
create index if not exists conversations_lead_id_idx on public.conversations (lead_id);
create index if not exists conversations_agent_id_idx on public.conversations (agent_id);

-- 3) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_conversations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_conversations_updated_at
  before update on public.conversations
  for each row
  execute function public.set_conversations_updated_at();
exception when duplicate_object then null;
end $$;

-- 4) RLS: yalnızca SELECT, authenticated
alter table public.conversations enable row level security;

do $$ begin
  create policy "conversations_select_authenticated"
  on public.conversations
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
