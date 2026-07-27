-- =====================================================================
-- Migration: public.followups tablosu (mockFollowUps şemasına birebir uyumlu)
-- Not: lead_id text (leads.id ile aynı format), agent_id uuid (agents.id ile
-- aynı tip). history alanı mock'taki iç içe diziyi birebir yansıtmak için
-- jsonb olarak tanımlandı. Bu dosya production güvenliği için
-- düzeltilmiştir: yıkıcı (destructive) drop ifadeleri kaldırılmış, tüm
-- nesne oluşturma adımları idempotent hale getirilmiştir (if not exists /
-- exception-guard), seed verisi supabase/seed.sql dosyasına taşınmıştır,
-- RLS SELECT policy'si yalnızca authenticated rolüne daraltılmıştır (anon
-- erişimi kaldırıldı).
-- =====================================================================

-- 1) Enum tipleri (idempotent)
do $$ begin
  create type followup_channel as enum (
    'whatsapp', 'telefon', 'e-posta', 'gorusme', 'manuel-gorev'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type followup_priority as enum ('dusuk', 'normal', 'yuksek', 'acil');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type followup_status as enum ('bekliyor', 'tamamlandi', 'iptal');
exception when duplicate_object then null;
end $$;

-- 2) Tablo
create table if not exists public.followups (
  id                text primary key,
  lead_id           text references public.leads(id) on delete set null,
  lead_name         text not null,
  agent_id          uuid references public.agents(id) on delete set null,
  due_at            timestamptz not null,
  channel           followup_channel not null,
  priority          followup_priority not null default 'normal',
  status            followup_status not null default 'bekliyor',
  note              text,
  history           jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 3) Sorgu paternlerini destekleyen indexler
create index if not exists followups_agent_id_idx on public.followups (agent_id);
create index if not exists followups_lead_id_idx on public.followups (lead_id);
create index if not exists followups_status_idx on public.followups (status);
create index if not exists followups_due_at_idx on public.followups (due_at);

-- 4) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_followups_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_followups_updated_at
  before update on public.followups
  for each row
  execute function public.set_followups_updated_at();
exception when duplicate_object then null;
end $$;

-- 5) RLS: yalnızca SELECT, authenticated
alter table public.followups enable row level security;

do $$ begin
  create policy "followups_select_authenticated"
  on public.followups
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
