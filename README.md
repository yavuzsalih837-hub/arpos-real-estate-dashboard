# ARPOS Real Estate OS

Emlak ofisleri ve gayrimenkul danışmanları için geliştirilen operasyon
merkezi dashboard'u. Bu depo yalnızca Next.js tabanlı dashboard arayüzünü
içerir; backend (Supabase, n8n, WhatsApp Cloud API, Telegram) ayrı olarak
yönetilir ve bu dashboard'a entegre edilecektir.

## Proje Durumu

Şu an temel proje altyapısı kurulu durumda. Dashboard ekranları (lead
yönetimi, satış pipeline, portföy yönetimi, randevu takvimi, follow-up
merkezi, WhatsApp mesaj merkezi vb.) sonraki aşamalarda eklenecektir.

## Teknik Yığın

- **Next.js** (App Router, Server Components öncelikli)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** + **lucide-react**
- **next-themes** (koyu/açık tema)
- **@tanstack/react-query**
- **react-hook-form** + **zod**
- **@supabase/supabase-js** + **@supabase/ssr**
- **recharts**, **date-fns**, **sonner**

## Başlarken

Bağımlılıkları yükle:

```bash
npm install
```

Ortam değişkenlerini tanımla:

```bash
cp .env.example .env.local
```

`.env.local` içine Supabase ve n8n webhook değerlerini kendin ekle —
bu depoda gerçek anahtar bulunmaz.

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000)
adresinde çalışır.

## Komutlar

| Komut           | Açıklama                     |
| --------------- | ----------------------------- |
| `npm run dev`   | Geliştirme sunucusunu başlatır |
| `npm run build` | Production build alır          |
| `npm run start` | Production build'i çalıştırır  |
| `npm run lint`  | ESLint kontrolünü çalıştırır    |

## Klasör Yapısı

```
src/
  app/            # Route'lar (App Router)
  components/     # ui / layout / dashboard / shared bileşenleri
  features/       # Modül bazlı iş mantığı (leads, properties, appointments, ...)
  lib/            # supabase istemcileri, validations, utils
  hooks/          # Paylaşılan hook'lar
  types/          # Paylaşılan TypeScript tipleri
  config/         # Site sabitleri
  providers/      # Theme ve React Query provider'ları
```

Proje kuralları ve mimari kararlar için [`CLAUDE.md`](./CLAUDE.md) dosyasına
bakabilirsin.

## Hazır Backend Modülleri

1. Lead Intake
2. Follow-up Engine
3. WhatsApp Incoming Reply Handler
4. Lead & Agent Status Manager
5. Property Matching Engine
6. Appointment Engine
7. Error & Retry Monitor
