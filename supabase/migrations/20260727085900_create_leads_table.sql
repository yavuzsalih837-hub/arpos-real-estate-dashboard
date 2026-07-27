-- =====================================================================
-- Migration: public.leads tablosu
-- Not: Bu şema daha önce ayrı bir geçici migration dosyasıyla oluşturulup
-- çalıştırılmış, sonra o dosya silinmişti. Bu dosya, canlı tabloyla
-- birebir uyumlu şekilde (REST API üzerinden kolon/tip seti doğrulanarak)
-- yeniden oluşturuldu. Gerçek Supabase Auth akışı eklendikten sonra RLS
-- policy'si diğer tablolarla (properties/appointments/followups/
-- conversations) tutarlı olacak şekilde yalnızca authenticated rolüne
-- daraltılmıştır (anon erişimi kaldırıldı). Yıkıcı (destructive) drop veya
-- seed veri İÇERMEZ — yalnızca idempotent (if not exists / exception-guard)
-- ifadeler kullanılmıştır.
-- =====================================================================

-- 1) Enum tipleri (idempotent)
do $$ begin
  create type lead_status as enum (
    'yeni', 'iletisimde', 'nitelikli', 'randevu', 'teklif', 'kazanildi', 'kaybedildi'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type lead_source as enum (
    'web-sitesi', 'whatsapp', 'instagram', 'referans', 'portal', 'telefon'
  );
exception when duplicate_object then null;
end $$;

-- 2) Tablo
create table if not exists public.leads (
  id                 text primary key,
  name               text not null,
  phone              text not null,
  email              text,
  status             lead_status not null default 'yeni',
  source             lead_source not null,
  agent_id           uuid references public.agents(id) on delete set null,
  score              smallint not null default 0 check (score >= 0 and score <= 100),
  budget             numeric(14,2) not null default 0 check (budget >= 0),
  property_interest  text,
  last_contact_at    timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  notes              text,
  updated_at         timestamptz not null default now()
);

-- 3) Sorgu paternlerini destekleyen indexler
create index if not exists leads_agent_id_idx on public.leads (agent_id);
create index if not exists leads_status_idx on public.leads (status);

-- 4) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_leads_updated_at();
exception when duplicate_object then null;
end $$;

-- 5) RLS: yalnızca SELECT, authenticated
alter table public.leads enable row level security;

do $$ begin
  create policy "leads_select_authenticated"
  on public.leads
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
