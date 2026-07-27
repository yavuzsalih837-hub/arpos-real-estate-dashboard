-- =====================================================================
-- Migration: public.agents tablosu
-- Not: Bu tablo bu depoda daha önce hiç migration olarak yazılmamıştı,
-- doğrudan Supabase panelinde elle oluşturulmuştu. Bu dosya, canlı tablo
-- REST API üzerinden (anon key ile) örnek veri okunarak geriye dönük
-- olarak yeniden oluşturuldu — id (uuid), name, initials, phone, email,
-- region, specialty, status, created_at, updated_at kolonları canlı
-- veriden doğrulandı. Gerçek Supabase Auth akışı eklendikten sonra RLS
-- policy'si diğer tablolarla (properties/appointments/followups/
-- conversations) tutarlı olacak şekilde yalnızca authenticated rolüne
-- daraltılmıştır (anon erişimi kaldırıldı).
-- Yıkıcı (destructive) drop veya seed veri İÇERMEZ — yalnızca idempotent
-- (if not exists / exception-guard) ifadeler kullanılmıştır.
-- =====================================================================

-- 1) Enum tipi (idempotent)
do $$ begin
  create type agent_status as enum ('aktif', 'izinli', 'pasif');
exception when duplicate_object then null;
end $$;

-- 2) Tablo
create table if not exists public.agents (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  initials     text not null,
  phone        text not null,
  email        text not null,
  region       text not null,
  specialty    text not null,
  status       agent_status not null default 'aktif',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 3) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_agents_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_agents_updated_at
  before update on public.agents
  for each row
  execute function public.set_agents_updated_at();
exception when duplicate_object then null;
end $$;

-- 4) RLS: yalnızca SELECT, authenticated
alter table public.agents enable row level security;

do $$ begin
  create policy "agents_select_authenticated"
  on public.agents
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
