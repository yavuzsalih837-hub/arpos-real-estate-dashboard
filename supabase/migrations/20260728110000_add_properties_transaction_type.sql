-- =====================================================================
-- Migration: public.properties.transaction_type kolonu
-- Not: "Portföy Ekle" formu satılık/kiralık işlem tipini ayırt edebilsin
-- diye eklendi. Mevcut property_status enum'u yaşam döngüsü durumunu
-- (aktif/pasif/satildi/kiralandi) temsil ettiği için işlem tipiyle
-- karıştırılmadı, ayrı bir enum ve kolon olarak eklendi. Yıkıcı
-- (destructive) değişiklik içermez, idempotent (if not exists /
-- exception-guard) şekilde yazılmıştır. Bu dosya henüz canlı Supabase'de
-- çalıştırılmamıştır.
-- =====================================================================

do $$ begin
  create type property_transaction_type as enum ('satilik', 'kiralik');
exception when duplicate_object then null;
end $$;

alter table public.properties
  add column if not exists transaction_type property_transaction_type not null default 'satilik';
