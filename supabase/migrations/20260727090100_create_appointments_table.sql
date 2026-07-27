-- =====================================================================
-- Migration: public.appointments tablosu (mockAppointments şemasına birebir uyumlu)
-- Not: lead_id/property_id text (leads.id ve properties.id ile aynı format),
-- agent_id uuid olarak tanımlandı (agents.id ile aynı tip). Bu dosya
-- production güvenliği için düzeltilmiştir: yıkıcı (destructive) drop
-- ifadeleri kaldırılmış, tüm nesne oluşturma adımları idempotent hale
-- getirilmiştir (if not exists / exception-guard), seed verisi
-- supabase/seed.sql dosyasına taşınmıştır, RLS SELECT policy'si yalnızca
-- authenticated rolüne daraltılmıştır (anon erişimi kaldırıldı).
-- =====================================================================

-- 1) Enum tipleri (idempotent)
do $$ begin
  create type appointment_type as enum ('gösterim', 'görüşme', 'imza');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type appointment_status as enum (
    'planlandi', 'onaylandi', 'tamamlandi', 'iptal', 'gelmedi'
  );
exception when duplicate_object then null;
end $$;

-- 2) Tablo
create table if not exists public.appointments (
  id                 text primary key,
  lead_id            text references public.leads(id) on delete set null,
  lead_name          text not null,
  agent_id           uuid references public.agents(id) on delete set null,
  property_id        text references public.properties(id) on delete set null,
  property_title     text not null,
  type               appointment_type not null,
  status             appointment_status not null default 'planlandi',
  scheduled_at       timestamptz not null,
  duration_minutes   integer not null check (duration_minutes > 0),
  note               text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- 3) Sorgu paternlerini destekleyen indexler
create index if not exists appointments_agent_id_idx on public.appointments (agent_id);
create index if not exists appointments_lead_id_idx on public.appointments (lead_id);
create index if not exists appointments_property_id_idx on public.appointments (property_id);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists appointments_scheduled_at_idx on public.appointments (scheduled_at);

-- 4) updated_at otomatik güncelleme trigger'ı
create or replace function public.set_appointments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_appointments_updated_at
  before update on public.appointments
  for each row
  execute function public.set_appointments_updated_at();
exception when duplicate_object then null;
end $$;

-- 5) RLS: yalnızca SELECT, authenticated
alter table public.appointments enable row level security;

do $$ begin
  create policy "appointments_select_authenticated"
  on public.appointments
  for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;
