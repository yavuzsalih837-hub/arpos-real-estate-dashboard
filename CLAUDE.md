@AGENTS.md

# ARPOS Real Estate OS — Proje Kuralları

ARPOS, emlak ofisleri ve gayrimenkul danışmanları için geliştirilen bir
Real Estate OS dashboard'udur. Backend tarafı (Supabase, n8n, WhatsApp
Cloud API, Telegram, 7 otomasyon workflow'u) ayrı olarak hazırlanmıştır;
bu depo yalnızca Next.js tabanlı dashboard arayüzünü içerir.

## Genel Kurallar

- Kod TypeScript ile yazılmalı; `any` kullanımı mümkün olduğunca yasak.
- Bileşenler küçük ve yeniden kullanılabilir olmalı.
- Gizli anahtarlar (API key, service role key, webhook URL) hiçbir zaman
  kod içine gömülmemeli; yalnızca ortam değişkenleri üzerinden okunmalı.
- Supabase service role key yalnızca sunucu tarafında (`src/lib/supabase/admin.ts`)
  kullanılmalı, hiçbir Client Component'e import edilmemeli.
- Server Component öncelikli mimari kullanılmalı; gereksiz yere
  `"use client"` eklenmemeli. Yalnızca interaktivite (state, event handler,
  browser API) gerektiğinde Client Component kullanılmalı.
- Arayüz metinleri Türkçe olmalı; dosya ve klasör isimleri İngilizce
  (kebab-case) olmalı.
- Mobil uyumluluk zorunludur; her bileşen responsive tasarlanmalı.
- Her geliştirmeden sonra `npm run lint` ve `npm run build` çalıştırılmalı,
  hatasız geçmeden iş tamamlanmış sayılmamalı.
- Mevcut çalışan yapılar bozulmadan, artırımlı şekilde geliştirme yapılmalı.
- Gereksiz animasyon, gradient veya cam efekti (glassmorphism) kullanılmamalı;
  kurumsal ve sade bir SaaS görünümü korunmalı.

## Klasör Mimarisi

```
src/
  app/                  # Next.js App Router route'ları
  components/
    ui/                 # shadcn/ui bileşenleri
    layout/              # Header, sidebar, tema butonu gibi düzen bileşenleri
    dashboard/           # Dashboard'a özel görsel bileşenler
    shared/              # Ortak/paylaşılan küçük bileşenler
  features/              # Modül bazlı iş mantığı (leads, properties, ...)
  lib/
    supabase/            # Supabase istemci iskeletleri (client/server/admin)
    validations/         # zod şemaları
  hooks/                  # Paylaşılan React hook'ları
  types/                  # Paylaşılan TypeScript tipleri
  config/                 # Site/uygulama sabitleri
  providers/              # Theme, React Query gibi global provider'lar
```

## Tasarım Sistemi

- Koyu temada siyaha yakın lacivert arka plan, açık temada kırık beyaz arka plan.
- Bakır/turuncu tonu (`--primary`) yalnızca vurgu (CTA, durum, aktif öğe) için
  kullanılır; geniş yüzeylerde kullanılmaz.
- Renk tokenları `src/app/globals.css` içinde tanımlıdır, doğrudan hex/oklch
  değeri bileşenlere yazılmaz — her zaman Tailwind/shadcn tokenları (`bg-card`,
  `text-muted-foreground`, `border`, vb.) kullanılır.

## Backend Modülleri (referans, bu depoda kod olarak yok)

1. Lead Intake
2. Follow-up Engine
3. WhatsApp Incoming Reply Handler
4. Lead & Agent Status Manager
5. Property Matching Engine
6. Appointment Engine
7. Error & Retry Monitor
