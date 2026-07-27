-- =====================================================================
-- Seed: Demo/fixture verisi (yalnızca yerel geliştirme ve staging için)
-- Not: Bu dosya `supabase db reset` ile otomatik çalışır; `supabase db
-- push` migration'ları production'a uygularken bu dosyayı ÇALIŞTIRMAZ.
-- Gerçek bir production veritabanına bu dosyayı elle çalıştırmayın —
-- sahte demo kayıtları gerçek verilerle karışır.
--
-- Sıralama foreign key bağımlılıklarına göredir:
-- properties (agents'a bağımlı) -> appointments (leads/agents/properties'e
-- bağımlı) -> followups (leads/agents'a bağımlı) -> conversations
-- (leads/agents'a bağımlı). agents ve leads için seed verisi bu dosyada
-- yer almıyor (agents tablosu zaten elle oluşturulmuş 4 kayıtla geliyor,
-- leads seed verisi daha önce ayrı çalıştırılıp uygulanmıştı).
--
-- agent-1 = 11111111-1111-4111-8111-111111111111
-- agent-2 = 22222222-2222-4222-8222-222222222222
-- agent-3 = 33333333-3333-4333-8333-333333333333
-- agent-4 = 44444444-4444-4444-8444-444444444444
-- =====================================================================

-- ---------------------------------------------------------------------
-- properties (18 kayıt)
-- ---------------------------------------------------------------------
insert into public.properties
  (id, listing_code, title, description, price, city, district, neighborhood, property_type, rooms, area_m2, status, agent_id, updated_at)
values
  ('prop-001', 'ARP-2026-001', 'Deniz Manzaralı 3+1 Daire', 'Caddebostan sahiline yürüme mesafesinde, güney cepheli, geniş balkonlu daire.', 8500000, 'İstanbul', 'Kadıköy', 'Caddebostan', 'daire', '3+1', 145, 'aktif', '11111111-1111-4111-8111-111111111111', '2026-07-20T09:00:00.000Z'),
  ('prop-002', 'ARP-2026-002', 'Boğaz Manzaralı 2+1 Daire', 'Etiler''de site içerisinde, asansörlü, kapalı otoparklı daire.', 4200000, 'İstanbul', 'Beşiktaş', 'Etiler', 'daire', '2+1', 110, 'aktif', '22222222-2222-4222-8222-222222222222', '2026-07-18T10:30:00.000Z'),
  ('prop-003', 'ARP-2026-003', 'Deniz Sıfır Villa', 'Alaçatı''da özel havuzlu, deniz manzaralı müstakil villa.', 15000000, 'İzmir', 'Çeşme', 'Alaçatı', 'villa', '5+2', 320, 'aktif', '33333333-3333-4333-8333-333333333333', '2026-07-19T14:00:00.000Z'),
  ('prop-004', 'ARP-2026-004', 'Aile İçin Geniş 4+1 Daire', 'Barbaros Mahallesi''nde okula ve AVM''ye yakın geniş aile dairesi.', 6300000, 'İstanbul', 'Ataşehir', 'Barbaros', 'daire', '4+1', 180, 'pasif', '11111111-1111-4111-8111-111111111111', '2026-07-05T11:00:00.000Z'),
  ('prop-005', 'ARP-2026-005', 'Şık 2+1 Daire', 'Mecidiyeköy merkezinde, metroya 5 dakika mesafede daire.', 5100000, 'İstanbul', 'Şişli', 'Mecidiyeköy', 'daire', '2+1', 95, 'satildi', '44444444-4444-4444-8444-444444444444', '2026-07-15T09:30:00.000Z'),
  ('prop-006', 'ARP-2026-006', 'Ekonomik 1+1 Daire', 'Yeşilköy''de yatırıma uygun, kiracılı 1+1 daire.', 3000000, 'İstanbul', 'Bakırköy', 'Yeşilköy', 'daire', '1+1', 60, 'aktif', '22222222-2222-4222-8222-222222222222', '2026-07-10T08:00:00.000Z'),
  ('prop-007', 'ARP-2026-007', 'Site İçi 3+1 Daire', 'Kapalı site içerisinde, sosyal tesisli, güvenlikli daire.', 7200000, 'İstanbul', 'Ümraniye', 'Çakmak', 'daire', '3+1', 135, 'aktif', '33333333-3333-4333-8333-333333333333', '2026-07-21T13:00:00.000Z'),
  ('prop-008', 'ARP-2026-008', 'Boğaza Yakın Müstakil Ev', 'Kanlıca''da bahçeli, boğaza yürüme mesafesinde müstakil ev.', 9800000, 'İstanbul', 'Beykoz', 'Kanlıca', 'mustakil-ev', '6+1', 400, 'aktif', '11111111-1111-4111-8111-111111111111', '2026-07-17T10:00:00.000Z'),
  ('prop-009', 'ARP-2026-009', 'Metroya Yakın 2+1 Daire', 'Yakacık''ta yeni yapı, metro hattına yakın daire.', 5600000, 'İstanbul', 'Kartal', 'Yakacık', 'daire', '2+1', 100, 'pasif', '22222222-2222-4222-8222-222222222222', '2026-07-02T09:00:00.000Z'),
  ('prop-010', 'ARP-2026-010', 'Orman Manzaralı Villa', 'Zekeriyaköy''de doğayla iç içe, güvenlikli sitede villa.', 11000000, 'İstanbul', 'Sarıyer', 'Zekeriyaköy', 'villa', '4+1', 280, 'aktif', '33333333-3333-4333-8333-333333333333', '2026-07-20T15:30:00.000Z'),
  ('prop-011', 'ARP-2026-011', 'Tarihi Dokuda 1+1 Daire', 'Balat''ta restore edilmiş binada, tarihi dokuda daire.', 3900000, 'İstanbul', 'Fatih', 'Balat', 'daire', '1+1', 55, 'kiralandi', '44444444-4444-4444-8444-444444444444', '2026-07-16T11:00:00.000Z'),
  ('prop-012', 'ARP-2026-012', 'Yeni Yapı 3+1 Daire', 'Altunizade''de yeni teslim, otoparklı, asansörlü bina.', 7500000, 'İstanbul', 'Üsküdar', 'Altunizade', 'daire', '3+1', 140, 'aktif', '11111111-1111-4111-8111-111111111111', '2026-07-19T09:00:00.000Z'),
  ('prop-013', 'ARP-2026-013', 'Merkezi Ofis Katı', 'Levent''te plazada, tam donanımlı, kiralanabilir ofis katı.', 12500000, 'İstanbul', 'Şişli', 'Levent', 'ofis', '-', 220, 'aktif', '22222222-2222-4222-8222-222222222222', '2026-07-14T10:00:00.000Z'),
  ('prop-014', 'ARP-2026-014', 'Ana Cadde Üzeri Dükkan', 'Bahariye Caddesi üzerinde, yüksek yaya trafiğine sahip dükkan.', 2200000, 'İstanbul', 'Kadıköy', 'Bahariye', 'isyeri', '-', 85, 'kiralandi', '33333333-3333-4333-8333-333333333333', '2026-07-08T09:00:00.000Z'),
  ('prop-015', 'ARP-2026-015', 'Yatırımlık Arsa', 'İmarlı, yola cepheli, yatırıma uygun köşe arsa.', 4800000, 'İstanbul', 'Çekmeköy', 'Merkez', 'arsa', '-', 500, 'aktif', '44444444-4444-4444-8444-444444444444', '2026-06-28T09:00:00.000Z'),
  ('prop-016', 'ARP-2026-016', 'Çankaya''da 4+1 Daire', 'Çayyolu''nda geniş bahçeli sitede, aileler için uygun daire.', 6100000, 'Ankara', 'Çankaya', 'Çayyolu', 'daire', '4+1', 190, 'aktif', '11111111-1111-4111-8111-111111111111', '2026-07-12T09:00:00.000Z'),
  ('prop-017', 'ARP-2026-017', 'Nilüfer''de 3+1 Daire', 'Görükle''de üniversiteye yakın, kiracılı yatırımlık daire.', 3400000, 'Bursa', 'Nilüfer', 'Görükle', 'daire', '3+1', 125, 'pasif', '22222222-2222-4222-8222-222222222222', '2026-06-25T09:00:00.000Z'),
  ('prop-018', 'ARP-2026-018', 'Sahil Şeridi Villa', 'Ilıca sahiline sıfır, özel iskeleli, lüks villa.', 18500000, 'İzmir', 'Çeşme', 'Ilıca', 'villa', '5+1', 350, 'satildi', '33333333-3333-4333-8333-333333333333', '2026-07-11T09:00:00.000Z')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- appointments (24 kayıt)
-- ---------------------------------------------------------------------
insert into public.appointments
  (id, lead_id, lead_name, agent_id, property_id, property_title, type, status, scheduled_at, duration_minutes, note)
values
  ('appt-001', 'lead-001', 'Ahmet Yıldız', '11111111-1111-4111-8111-111111111111', 'prop-001', 'Deniz Manzaralı 3+1 Daire', 'gösterim', 'tamamlandi', '2026-07-06T10:00:00.000', 60, 'Daireyi beğendi, teklif hazırlanacak.'),
  ('appt-002', 'lead-004', 'Derya Kılıç', '11111111-1111-4111-8111-111111111111', 'prop-004', 'Aile İçin Geniş 4+1 Daire', 'görüşme', 'tamamlandi', '2026-07-10T14:00:00.000', 45, 'Bütçe ve kredi seçenekleri konuşuldu.'),
  ('appt-003', 'lead-009', 'Kemal Doğan', '11111111-1111-4111-8111-111111111111', 'prop-008', 'Boğaza Yakın Müstakil Ev', 'gösterim', 'iptal', '2026-07-18T11:00:00.000', 60, 'Müşteri son anda iptal etti, tekrar planlanacak.'),
  ('appt-004', 'lead-013', 'Onur Aslan', '11111111-1111-4111-8111-111111111111', 'prop-012', 'Yeni Yapı 3+1 Daire', 'gösterim', 'planlandi', '2026-07-22T10:00:00.000', 60, 'İlk gösterim, WhatsApp üzerinden teyit alındı.'),
  ('appt-005', 'lead-017', 'Tolga Yaman', '11111111-1111-4111-8111-111111111111', 'prop-016', 'Çankaya''da 4+1 Daire', 'görüşme', 'onaylandi', '2026-07-22T10:30:00.000', 60, 'Karşı teklif detayları görüşülecek.'),
  ('appt-006', 'lead-021', 'Zehra Güneş', '11111111-1111-4111-8111-111111111111', 'prop-001', 'Deniz Manzaralı 3+1 Daire', 'gösterim', 'planlandi', '2026-07-29T09:00:00.000', 45, 'Otopark kriterini yerinde kontrol edecek.'),
  ('appt-007', 'lead-002', 'Selin Aydın', '22222222-2222-4222-8222-222222222222', 'prop-002', 'Boğaz Manzaralı 2+1 Daire', 'gösterim', 'tamamlandi', '2026-07-08T13:00:00.000', 60, 'Olumlu geçti, ikinci görüşme planlanacak.'),
  ('appt-008', 'lead-006', 'Gizem Aksoy', '22222222-2222-4222-8222-222222222222', 'prop-006', 'Ekonomik 1+1 Daire', 'görüşme', 'gelmedi', '2026-07-14T15:00:00.000', 45, 'Randevuya gelmedi, telefonla ulaşılamadı.'),
  ('appt-009', 'lead-010', 'Leyla Turan', '22222222-2222-4222-8222-222222222222', 'prop-009', 'Metroya Yakın 2+1 Daire', 'gösterim', 'tamamlandi', '2026-07-20T10:00:00.000', 60, 'İkinci gösterim istendi, hafta sonu planlanacak.'),
  ('appt-010', 'lead-014', 'Pınar Yalçın', '22222222-2222-4222-8222-222222222222', 'prop-013', 'Merkezi Ofis Katı', 'gösterim', 'planlandi', '2026-07-22T14:30:00.000', 60, 'Ofis katı için yatırımcı gösterimi.'),
  ('appt-011', 'lead-018', 'Ufuk Bozkurt', '22222222-2222-4222-8222-222222222222', 'prop-017', 'Nilüfer''de 3+1 Daire', 'görüşme', 'onaylandi', '2026-07-25T09:30:00.000', 45, 'Hafta sonu gösterim sonrası değerlendirme görüşmesi.'),
  ('appt-012', 'lead-022', 'Berk Demirtaş', '22222222-2222-4222-8222-222222222222', 'prop-002', 'Boğaz Manzaralı 2+1 Daire', 'imza', 'planlandi', '2026-08-03T11:00:00.000', 45, 'Satış sözleşmesi imzası için noter randevusu.'),
  ('appt-013', 'lead-003', 'Caner Öztürk', '33333333-3333-4333-8333-333333333333', 'prop-003', 'Deniz Sıfır Villa', 'gösterim', 'onaylandi', '2026-07-22T11:00:00.000', 60, 'İkinci kez gösterim, eş de katılacak.'),
  ('appt-014', 'lead-007', 'Hakan Er', '33333333-3333-4333-8333-333333333333', 'prop-007', 'Site İçi 3+1 Daire', 'görüşme', 'tamamlandi', '2026-07-12T10:00:00.000', 45, 'Kredi hesaplama detayları paylaşıldı.'),
  ('appt-015', 'lead-011', 'Murat Sezer', '33333333-3333-4333-8333-333333333333', 'prop-010', 'Orman Manzaralı Villa', 'gösterim', 'planlandi', '2026-07-23T10:00:00.000', 60, 'Villa gösterimi, ulaşım bilgisi paylaşıldı.'),
  ('appt-016', 'lead-015', 'Rıza Kurt', '33333333-3333-4333-8333-333333333333', 'prop-014', 'Ana Cadde Üzeri Dükkan', 'gösterim', 'iptal', '2026-07-16T09:00:00.000', 60, 'Bütçe uyuşmadığı için görüşme iptal edildi.'),
  ('appt-017', 'lead-019', 'Vildan Er', '33333333-3333-4333-8333-333333333333', 'prop-018', 'Sahil Şeridi Villa', 'gösterim', 'planlandi', '2026-08-01T13:00:00.000', 90, 'Uzun gösterim, sahil ve iskele dahil tur yapılacak.'),
  ('appt-018', 'lead-023', 'Ceyda Aktaş', '33333333-3333-4333-8333-333333333333', 'prop-003', 'Deniz Sıfır Villa', 'görüşme', 'onaylandi', '2026-07-24T13:00:00.000', 45, 'İkinci gösterim sonrası değerlendirme.'),
  ('appt-019', 'lead-005', 'Emre Polat', '44444444-4444-4444-8444-444444444444', 'prop-005', 'Şık 2+1 Daire', 'imza', 'onaylandi', '2026-07-22T16:00:00.000', 45, 'Tapu devri için son evraklar hazır.'),
  ('appt-020', 'lead-008', 'İrem Şahin', '44444444-4444-4444-8444-444444444444', 'prop-011', 'Tarihi Dokuda 1+1 Daire', 'gösterim', 'tamamlandi', '2026-07-15T10:00:00.000', 60, 'Restorasyon detayları hakkında bilgi verildi.'),
  ('appt-021', 'lead-012', 'Nazlı Çelik', '44444444-4444-4444-8444-444444444444', 'prop-015', 'Yatırımlık Arsa', 'görüşme', 'gelmedi', '2026-07-19T11:00:00.000', 45, 'İkinci kez ulaşılamadı, takip edilecek.'),
  ('appt-022', 'lead-016', 'Sibel Arslan', '44444444-4444-4444-8444-444444444444', 'prop-005', 'Şık 2+1 Daire', 'gösterim', 'planlandi', '2026-07-26T10:00:00.000', 60, 'Okula yakınlık kriteri nedeniyle tekrar gösterim.'),
  ('appt-023', 'lead-020', 'Yasin Koç', '44444444-4444-4444-8444-444444444444', 'prop-011', 'Tarihi Dokuda 1+1 Daire', 'gösterim', 'planlandi', '2026-08-05T14:00:00.000', 60, 'Site içi daire alternatifleri de sunulacak.'),
  ('appt-024', 'lead-024', 'Doğukan Ay', '44444444-4444-4444-8444-444444444444', 'prop-015', 'Yatırımlık Arsa', 'görüşme', 'planlandi', '2026-07-31T09:00:00.000', 45, 'Arkadaş tavsiyesiyle gelen ilk görüşme.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- followups (20 kayıt)
-- ---------------------------------------------------------------------
insert into public.followups
  (id, lead_id, lead_name, agent_id, due_at, channel, priority, status, note, history)
values
  ('fu-001', 'lead-007', 'Hakan Er', '33333333-3333-4333-8333-333333333333', '2026-07-18T12:00:00.000', 'whatsapp', 'acil', 'bekliyor', 'Kredi hesaplama sonucunu paylaş.',
    '[{"id":"fu-001-h1","at":"2026-07-14T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-002', 'lead-012', 'Nazlı Çelik', '44444444-4444-4444-8444-444444444444', '2026-07-19T15:00:00.000', 'telefon', 'yuksek', 'bekliyor', 'Fiyat karşılaştırma sonrası geri dönüş yapılacak.',
    '[{"id":"fu-002-h1","at":"2026-07-15T10:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-002-h2","at":"2026-07-17T11:00:00.000","label":"1 gün ertelendi."}]'::jsonb),
  ('fu-003', 'lead-006', 'Gizem Aksoy', '22222222-2222-4222-8222-222222222222', '2026-07-20T10:00:00.000', 'e-posta', 'normal', 'bekliyor', 'Kayıp lead için son bir teklif e-postası gönderilecek.',
    '[{"id":"fu-003-h1","at":"2026-07-16T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-004', 'lead-015', 'Rıza Kurt', '33333333-3333-4333-8333-333333333333', '2026-07-21T09:00:00.000', 'telefon', 'dusuk', 'bekliyor', 'İptal sonrası nezaket araması yapılacak.',
    '[{"id":"fu-004-h1","at":"2026-07-17T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-005', 'lead-010', 'Leyla Turan', '22222222-2222-4222-8222-222222222222', '2026-07-22T09:00:00.000', 'e-posta', 'normal', 'bekliyor', 'İkinci görüşme için tarih teyidi alınacak.',
    '[{"id":"fu-005-h1","at":"2026-07-18T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-006', 'lead-021', 'Zehra Güneş', '11111111-1111-4111-8111-111111111111', '2026-07-22T11:00:00.000', 'telefon', 'yuksek', 'bekliyor', 'Otopark kriteri netleştirilecek.',
    '[{"id":"fu-006-h1","at":"2026-07-19T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-007', 'lead-024', 'Doğukan Ay', '44444444-4444-4444-8444-444444444444', '2026-07-22T14:00:00.000', 'whatsapp', 'normal', 'bekliyor', 'Arkadaş tavsiyesiyle gelen ilk takip mesajı gönderilecek.',
    '[{"id":"fu-007-h1","at":"2026-07-21T18:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-008', 'lead-002', 'Selin Aydın', '22222222-2222-4222-8222-222222222222', '2026-07-22T17:00:00.000', 'gorusme', 'acil', 'bekliyor', 'Web sitesinden gelen talebe ilk dönüş yapılacak.',
    '[{"id":"fu-008-h1","at":"2026-07-22T08:10:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-009', 'lead-020', 'Yasin Koç', '44444444-4444-4444-8444-444444444444', '2026-07-23T10:00:00.000', 'whatsapp', 'normal', 'bekliyor', 'Site içi ilan seçenekleri gönderilecek.',
    '[{"id":"fu-009-h1","at":"2026-07-20T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-010', 'lead-014', 'Pınar Yalçın', '22222222-2222-4222-8222-222222222222', '2026-07-24T13:00:00.000', 'e-posta', 'dusuk', 'bekliyor', 'Ofis katı teklifi sonrası takip yapılacak.',
    '[{"id":"fu-010-h1","at":"2026-07-21T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-011', 'lead-019', 'Vildan Er', '33333333-3333-4333-8333-333333333333', '2026-07-26T09:00:00.000', 'gorusme', 'yuksek', 'bekliyor', 'Villa gösterimi sonrası değerlendirme görüşmesi.',
    '[{"id":"fu-011-h1","at":"2026-07-22T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-012', 'lead-016', 'Sibel Arslan', '44444444-4444-4444-8444-444444444444', '2026-07-28T11:00:00.000', 'telefon', 'normal', 'bekliyor', 'Okula yakınlık kriteri hakkında ek bilgi verilecek.',
    '[{"id":"fu-012-h1","at":"2026-07-22T10:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-013', 'lead-004', 'Derya Kılıç', '11111111-1111-4111-8111-111111111111', '2026-08-01T10:00:00.000', 'manuel-gorev', 'dusuk', 'bekliyor', 'Kredi başvuru evraklarını kontrol et.',
    '[{"id":"fu-013-h1","at":"2026-07-22T09:00:00.000","label":"Takip oluşturuldu."}]'::jsonb),
  ('fu-014', 'lead-001', 'Ahmet Yıldız', '11111111-1111-4111-8111-111111111111', '2026-07-15T10:00:00.000', 'whatsapp', 'yuksek', 'tamamlandi', 'Teklif detayları paylaşıldı.',
    '[{"id":"fu-014-h1","at":"2026-07-12T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-014-h2","at":"2026-07-15T10:20:00.000","label":"Tamamlandı olarak işaretlendi."}]'::jsonb),
  ('fu-015', 'lead-005', 'Emre Polat', '44444444-4444-4444-8444-444444444444', '2026-07-14T09:00:00.000', 'telefon', 'normal', 'tamamlandi', 'Tapu randevusu teyit edildi.',
    '[{"id":"fu-015-h1","at":"2026-07-11T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-015-h2","at":"2026-07-14T09:15:00.000","label":"Tamamlandı olarak işaretlendi."}]'::jsonb),
  ('fu-016', 'lead-022', 'Berk Demirtaş', '22222222-2222-4222-8222-222222222222', '2026-07-16T14:00:00.000', 'e-posta', 'normal', 'tamamlandi', 'Sözleşme taslağı gönderildi.',
    '[{"id":"fu-016-h1","at":"2026-07-13T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-016-h2","at":"2026-07-16T14:30:00.000","label":"Tamamlandı olarak işaretlendi."}]'::jsonb),
  ('fu-017', 'lead-003', 'Caner Öztürk', '33333333-3333-4333-8333-333333333333', '2026-07-17T11:00:00.000', 'gorusme', 'dusuk', 'tamamlandi', 'İkinci gösterim planlandı.',
    '[{"id":"fu-017-h1","at":"2026-07-13T10:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-017-h2","at":"2026-07-17T11:10:00.000","label":"Tamamlandı olarak işaretlendi."}]'::jsonb),
  ('fu-018', 'lead-009', 'Kemal Doğan', '11111111-1111-4111-8111-111111111111', '2026-07-18T10:00:00.000', 'telefon', 'normal', 'iptal', 'Müşteri süreci durdurdu.',
    '[{"id":"fu-018-h1","at":"2026-07-14T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-018-h2","at":"2026-07-18T10:05:00.000","label":"İptal edildi."}]'::jsonb),
  ('fu-019', 'lead-011', 'Murat Sezer', '33333333-3333-4333-8333-333333333333', '2026-07-19T09:00:00.000', 'whatsapp', 'dusuk', 'iptal', 'Lead başka danışmana yönlendirildi.',
    '[{"id":"fu-019-h1","at":"2026-07-15T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-019-h2","at":"2026-07-19T09:05:00.000","label":"İptal edildi."}]'::jsonb),
  ('fu-020', 'lead-008', 'İrem Şahin', '44444444-4444-4444-8444-444444444444', '2026-07-15T13:00:00.000', 'manuel-gorev', 'normal', 'iptal', 'Görev gereksiz hale geldi.',
    '[{"id":"fu-020-h1","at":"2026-07-12T09:00:00.000","label":"Takip oluşturuldu."},{"id":"fu-020-h2","at":"2026-07-15T13:05:00.000","label":"İptal edildi."}]'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- conversations (12 kayıt)
-- ---------------------------------------------------------------------
insert into public.conversations (id, lead_id, agent_id, messages)
values
  ('conv-001', 'lead-001', '11111111-1111-4111-8111-111111111111', '[
    {"id":"conv-001-m1","direction":"inbound","content":"Merhaba, Kadıköy''deki daire için teklifimi ilettim, ne zaman dönüş alabilirim?","sentAt":"2026-07-20T09:00:00.000","read":true},
    {"id":"conv-001-m2","direction":"outbound","content":"Merhaba! Mesajınız alındı, danışmanınız en kısa sürede size dönüş yapacaktır.","sentAt":"2026-07-20T09:02:00.000","read":true,"deliveryStatus":"okundu","automated":true},
    {"id":"conv-001-m3","direction":"outbound","content":"Merhaba Ahmet Bey, teklifinizi ilettik, satıcı ile görüşüyoruz. Yarın size dönüş yapacağım.","sentAt":"2026-07-20T11:30:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-001-m4","direction":"inbound","content":"Teşekkürler, bekliyorum.","sentAt":"2026-07-21T15:00:00.000","read":true},
    {"id":"conv-001-m5","direction":"outbound","content":"Ahmet Bey merhaba, satıcı teklifinizi kabul etti. Sözleşme için randevu ayarlayalım mı?","sentAt":"2026-07-22T10:00:00.000","read":true,"deliveryStatus":"iletildi"}
  ]'::jsonb),
  ('conv-002', 'lead-009', '11111111-1111-4111-8111-111111111111', '[
    {"id":"conv-002-m1","direction":"inbound","content":"Müstakil ev için sunduğunuz teklifi değerlendiriyoruz, birkaç gün içinde dönüş yapacağız.","sentAt":"2026-07-21T10:00:00.000","read":true},
    {"id":"conv-002-m2","direction":"outbound","content":"Tabii ki Kemal Bey, aceleniz yok. Sorularınız olursa buradayım.","sentAt":"2026-07-21T10:05:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-002-m3","direction":"inbound","content":"Merhaba, evi bir kez daha görebilir miyiz, eşimle birlikte?","sentAt":"2026-07-22T09:00:00.000","read":false}
  ]'::jsonb),
  ('conv-003', 'lead-021', '11111111-1111-4111-8111-111111111111', '[
    {"id":"conv-003-m1","direction":"inbound","content":"Otopark durumu hakkında bilgi alabilir miyim?","sentAt":"2026-07-19T14:00:00.000","read":true},
    {"id":"conv-003-m2","direction":"outbound","content":"Merhaba Zehra Hanım, sitede 1 kapalı otopark hakkı bulunuyor.","sentAt":"2026-07-19T14:20:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-003-m3","direction":"inbound","content":"Harika, teşekkürler.","sentAt":"2026-07-19T14:25:00.000","read":true}
  ]'::jsonb),
  ('conv-004', 'lead-010', '22222222-2222-4222-8222-222222222222', '[
    {"id":"conv-004-m1","direction":"inbound","content":"İkinci gösterim için hafta sonu uygun musunuz?","sentAt":"2026-07-20T13:00:00.000","read":true},
    {"id":"conv-004-m2","direction":"outbound","content":"Merhaba Leyla Hanım, cumartesi 11:00 uygun, size uyar mı?","sentAt":"2026-07-20T13:10:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-004-m3","direction":"inbound","content":"Uyar, görüşürüz.","sentAt":"2026-07-20T13:15:00.000","read":true},
    {"id":"conv-004-m4","direction":"inbound","content":"Merhaba, cumartesi saat biraz erken olabilir mi, 10:00 gibi?","sentAt":"2026-07-22T08:00:00.000","read":false}
  ]'::jsonb),
  ('conv-005', 'lead-014', '22222222-2222-4222-8222-222222222222', '[
    {"id":"conv-005-m1","direction":"inbound","content":"Sözleşme imzalandı, teşekkür ederim ilginiz için!","sentAt":"2026-07-16T09:00:00.000","read":true},
    {"id":"conv-005-m2","direction":"outbound","content":"Rica ederim Pınar Hanım, hayırlı olsun! Herhangi bir sorunuz olursa yazabilirsiniz.","sentAt":"2026-07-16T09:10:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-005-m3","direction":"inbound","content":"Elbette, teşekkürler.","sentAt":"2026-07-16T09:12:00.000","read":true}
  ]'::jsonb),
  ('conv-006', 'lead-022', '22222222-2222-4222-8222-222222222222', '[
    {"id":"conv-006-m1","direction":"inbound","content":"Villa için karşı teklifi değerlendiriyoruz.","sentAt":"2026-07-21T16:00:00.000","read":true},
    {"id":"conv-006-m2","direction":"outbound","content":"Anlaşıldı Berk Bey, yanıtınızı bekliyorum.","sentAt":"2026-07-21T16:10:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-006-m3","direction":"inbound","content":"Karşı teklifi kabul ediyoruz, sözleşme sürecini başlatabilir miyiz?","sentAt":"2026-07-22T11:00:00.000","read":false}
  ]'::jsonb),
  ('conv-007', 'lead-003', '33333333-3333-4333-8333-333333333333', '[
    {"id":"conv-007-m1","direction":"inbound","content":"Yarınki randevu saatini teyit edebilir misiniz?","sentAt":"2026-07-22T09:00:00.000","read":true},
    {"id":"conv-007-m2","direction":"outbound","content":"Merhaba! Talebiniz danışmanınıza iletildi.","sentAt":"2026-07-22T09:05:00.000","read":true,"deliveryStatus":"okundu","automated":true},
    {"id":"conv-007-m3","direction":"outbound","content":"Merhaba Caner Bey, yarın 11:00''da villa gösterimimiz teyitlidir.","sentAt":"2026-07-22T10:30:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-007-m4","direction":"inbound","content":"Teşekkürler, görüşmek üzere.","sentAt":"2026-07-22T10:32:00.000","read":true}
  ]'::jsonb),
  ('conv-008', 'lead-007', '33333333-3333-4333-8333-333333333333', '[
    {"id":"conv-008-m1","direction":"inbound","content":"Kredi hesaplama sonucu ne zaman gelir?","sentAt":"2026-07-18T10:00:00.000","read":true},
    {"id":"conv-008-m2","direction":"outbound","content":"Merhaba Hakan Bey, bankadan teyit bekliyoruz, bugün içinde döneceğim.","sentAt":"2026-07-18T10:30:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-008-m3","direction":"inbound","content":"Merhaba, bir gelişme var mı acaba?","sentAt":"2026-07-21T09:00:00.000","read":false}
  ]'::jsonb),
  ('conv-009', 'lead-019', '33333333-3333-4333-8333-333333333333', '[
    {"id":"conv-009-m1","direction":"inbound","content":"Merhaba, Sultanbeyli''de 2+1 daire ile ilgileniyorum.","sentAt":"2026-07-22T05:30:00.000","read":false},
    {"id":"conv-009-m2","direction":"outbound","content":"Merhaba! ARPOS''a hoş geldiniz, talebiniz danışmanımıza iletildi, kısa süre içinde dönüş yapılacaktır.","sentAt":"2026-07-22T05:32:00.000","read":true,"deliveryStatus":"iletildi","automated":true}
  ]'::jsonb),
  ('conv-010', 'lead-005', '44444444-4444-4444-8444-444444444444', '[
    {"id":"conv-010-m1","direction":"inbound","content":"Tapu işlemleri için evraklar tamam mı?","sentAt":"2026-07-15T10:00:00.000","read":true},
    {"id":"conv-010-m2","direction":"outbound","content":"Merhaba Emre Bey, evraklar hazır, randevu saatinde buluşalım.","sentAt":"2026-07-15T10:15:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-010-m3","direction":"inbound","content":"Süper, teşekkürler.","sentAt":"2026-07-15T10:20:00.000","read":true}
  ]'::jsonb),
  ('conv-011', 'lead-008', '44444444-4444-4444-8444-444444444444', '[
    {"id":"conv-011-m1","direction":"inbound","content":"Merhaba, Maltepe''deki 1+1 daire ilanınızla ilgileniyorum.","sentAt":"2026-07-22T07:40:00.000","read":false},
    {"id":"conv-011-m2","direction":"outbound","content":"Merhaba! Mesajınız alındı, danışmanımız kısa süre içinde sizinle iletişime geçecektir.","sentAt":"2026-07-22T07:42:00.000","read":true,"deliveryStatus":"iletildi","automated":true}
  ]'::jsonb),
  ('conv-012', 'lead-020', '44444444-4444-4444-8444-444444444444', '[
    {"id":"conv-012-m1","direction":"inbound","content":"Site içi daire seçenekleri var mı?","sentAt":"2026-07-18T13:40:00.000","read":true},
    {"id":"conv-012-m2","direction":"outbound","content":"Merhaba Yasin Bey, birkaç seçenek hazırlıyorum, yarın paylaşırım.","sentAt":"2026-07-18T14:00:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-012-m3","direction":"outbound","content":"Merhaba, seçenekleri e-posta ile ilettim, inceleyebilir misiniz?","sentAt":"2026-07-19T10:00:00.000","read":true,"deliveryStatus":"okundu"},
    {"id":"conv-012-m4","direction":"inbound","content":"Teşekkürler, inceleyip dönüş yapacağım.","sentAt":"2026-07-19T15:00:00.000","read":true}
  ]'::jsonb)
on conflict (id) do nothing;
