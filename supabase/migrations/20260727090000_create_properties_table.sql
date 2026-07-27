-- =====================================================================
-- Migration: public.properties tablosu (mockProperties şemasına birebir uyumlu)
-- Not: agent_id uuid olarak tanımlandı (agents.id ile aynı tip). Bu dosya
-- production güvenliği için düzeltilmiştir: yıkıcı (destructive) drop
-- ifadeleri kaldırılmış, tüm nesne oluşturma adımları idempotent hale
-- getirilmiştir (if not exists / exception-guard), seed verisi
-- supabase/seed.sql dosyasına taşınmıştır, RLS SELECT policy'si yalnızca
-- authenticated rolüne daraltılmıştır (anon erişimi kaldırıldı).
-- =====================================================================

-- 1) Enum tipleri (idempotent)
do $$ begin
  create type property_status as enum ('aktif', 'pasif', 'satildi', 'kiralandi');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type property_type as enum (
    'daire', 'villa', 'mustakil-ev', 'ofis', 'isyeri', 'arsa'
  );
exception when duplicate_object then null;
end $$;

-- 2) Tablo
create table if not exists public.properties (
  id                text primary key,
  listing_code      text not null unique,
  title             text not null,
  description       text,
  price             numeric(14,2) not null default 0 check (price >= 0),
  city              text not null,
  district          text not null,
  neighborhood      text,
  property_type     property_type not null,
  rooms             text not null default '-',
  area_m2           integer not null check (area_m2 > 0),
  status            property_status not null default 'aktif',
  agent_id          uuid references public.agents(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 3) Sorgu paternlerini destekleyen indexler
create index if not exists properties_agent_id_idx on public.properties (agent_id);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_city_district_idx on public.properties (city, district);

-- 4) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_properties_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_properties_updated_at
  before update on public.properties
  for each row
  execute function public.set_properties_updated_at();
exception when duplicate_object then null;
end $$;

-- 5) RLS: yalnızca SELECT, authenticated
alter table public.properties enable row level security;

do $$ begin
  create policy "properties_select_authenticated"
  on public.properties
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
