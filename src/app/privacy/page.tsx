import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Gizlilik Politikası | ${siteConfig.name}`,
  description:
    "ARPOS Real Estate OS gizlilik politikası: toplanan bilgiler, WhatsApp/Meta entegrasyonu, veri saklama ve güvenlik uygulamaları.",
};

const CONTACT_EMAIL = "yavuzsalihistanbul45@gmail.com";
const LAST_UPDATED = "8 Ağustos 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <section className="flex flex-col gap-3 border-b pb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Gizlilik Politikası
          </h1>
          <p className="text-sm text-muted-foreground">
            Son güncelleme: {LAST_UPDATED}
          </p>
          <p className="text-base text-muted-foreground">
            {siteConfig.name} (&quot;ARPOS&quot;, &quot;biz&quot;), emlak ofisleri ve gayrimenkul
            danışmanları için geliştirilen bir operasyon panelidir. Bu
            Gizlilik Politikası, hizmetimizi kullanan emlak ofisleri, onların
            danışmanları ve bu ofislerle iletişime geçen kişilerin
            (potansiyel alıcı/kiracı gibi) bilgilerinin nasıl toplandığını,
            kullanıldığını ve korunduğunu açıklar.
          </p>
        </section>

        <PolicySection title="1. Toplanan Bilgiler">
          <p>
            ARPOS, hizmetin çalışması için gerekli olan aşağıdaki türde
            bilgileri işleyebilir:
          </p>
          <ul>
            <li>
              Emlak ofisi hesabı bilgileri: ad, e-posta, telefon numarası ve
              yetkilendirme (rol) bilgileri.
            </li>
            <li>
              Lead (potansiyel müşteri) bilgileri: ad, telefon numarası,
              iletişim tercihleri, talep ettiği gayrimenkul kriterleri ve
              danışmanla olan yazışma geçmişi.
            </li>
            <li>
              WhatsApp ve Telegram üzerinden gelen mesaj içerikleri ve mesaj
              meta verileri (gönderim zamanı, teslim durumu vb.).
            </li>
            <li>
              Randevu, takip (follow-up) ve portföy eşleştirme kayıtları gibi
              operasyonel veriler.
            </li>
            <li>
              Sistem kullanım ve hata günlükleri (log) — hizmetin güvenilir
              çalışmasını sağlamak amacıyla.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="2. Bilgilerin Kullanımı">
          <p>Toplanan bilgiler yalnızca aşağıdaki amaçlarla kullanılır:</p>
          <ul>
            <li>
              Lead&apos;lerin danışmanlara yönlendirilmesi, takip edilmesi ve
              gayrimenkul portföyü ile eşleştirilmesi.
            </li>
            <li>
              WhatsApp/Telegram üzerinden otomatik veya danışman tarafından
              gönderilen mesajların iletilmesi ve yanıtların işlenmesi.
            </li>
            <li>Randevu planlama ve hatırlatma süreçlerinin yürütülmesi.</li>
            <li>
              Dashboard üzerinde raporlama, durum takibi ve operasyonel
              analiz sağlanması.
            </li>
            <li>
              Hizmetin güvenliğinin sağlanması, hataların tespiti ve sistemin
              iyileştirilmesi.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="3. WhatsApp ve Meta Entegrasyonu">
          <p>
            ARPOS, lead&apos;lerle iletişimi kolaylaştırmak amacıyla WhatsApp Cloud
            API (Meta Platforms, Inc.) ile entegre çalışır. Bu entegrasyon
            kapsamında:
          </p>
          <ul>
            <li>
              Gönderilen ve alınan WhatsApp mesajları, ilgili emlak ofisinin
              danışmanlarına iletilmek üzere sistemimizde işlenir ve
              görüntülenir.
            </li>
            <li>
              Mesaj iletimi teknik olarak Meta&apos;nın WhatsApp Business
              altyapısı üzerinden gerçekleşir; bu nedenle mesaj verileri
              Meta&apos;nın kendi gizlilik politikaları ve hizmet şartlarına da
              tabi olabilir.
            </li>
            <li>
              ARPOS, Meta&apos;nın platform politikalarına uygun şekilde yalnızca
              hizmetin işlevi için gerekli veriyi işler; WhatsApp
              hesabınızın veya numaranızın Meta ile olan ilişkisini
              değiştirmez.
            </li>
          </ul>
          <p>
            Meta&apos;nın kendi veri işleme uygulamaları hakkında bilgi için
            Meta&apos;nın gizlilik politikasına başvurulmalıdır.
          </p>
        </PolicySection>

        <PolicySection title="4. Veri Saklama">
          <p>
            Veriler, hizmetin sağlanması için gerekli olduğu sürece
            saklanır. Lead, mesaj, randevu ve operasyon kayıtları; ilgili
            emlak ofisinin hesabı aktif olduğu ve yasal/operasyonel
            gereklilikler devam ettiği sürece sistemde tutulabilir. Bir emlak
            ofisi hesabının kapatılması veya veri silme talebinde
            bulunulması halinde, geçerli yasal saklama yükümlülükleri
            dışındaki veriler makul bir süre içinde silinir veya anonim hale
            getirilir.
          </p>
        </PolicySection>

        <PolicySection title="5. Veri Güvenliği">
          <p>
            Verilerin güvenliği için erişim kontrolü, yetkilendirme
            (rol bazlı erişim) ve şifreli bağlantılar gibi makul teknik ve
            idari önlemler uygulanır. Servis sağlayıcı (Supabase) tarafındaki
            hassas erişim anahtarları yalnızca sunucu tarafında tutulur ve
            istemci (tarayıcı) tarafına hiçbir zaman aktarılmaz. Buna
            rağmen, internet üzerinden yapılan hiçbir veri iletiminin veya
            elektronik saklamanın %100 güvenli olduğu garanti edilemez;
            güvenlik önlemlerimizi sürekli olarak gözden geçirip
            iyileştiriyoruz.
          </p>
        </PolicySection>

        <PolicySection title="6. Üçüncü Taraf Hizmetler">
          <p>
            Hizmetin çalışması için aşağıdaki gibi üçüncü taraf altyapı ve
            servis sağlayıcıları kullanılabilir. Bu sağlayıcılar, hizmeti
            sunmamız için gerekli olan veri işleyicileridir ve verileri
            kendi gizlilik politikaları çerçevesinde işlerler:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — veritabanı, kimlik doğrulama ve
              depolama altyapısı.
            </li>
            <li>
              <strong>WhatsApp Cloud API / Meta Platforms, Inc.</strong> —
              mesajlaşma altyapısı.
            </li>
            <li>
              <strong>Telegram</strong> — bildirim ve mesajlaşma altyapısı.
            </li>
            <li>
              <strong>Vercel</strong> — uygulama barındırma ve dağıtım
              altyapısı.
            </li>
            <li>
              <strong>n8n</strong> tabanlı otomasyon iş akışları — lead
              alımı, takip, randevu ve hata izleme süreçlerinin
              otomasyonu.
            </li>
          </ul>
          <p>
            Bu servisler dışında, verileriniz hizmetin işleyişi için gerekli
            olmayan üçüncü taraflarla paylaşılmaz. Ancak yasal bir zorunluluk
            (mahkeme kararı, resmi makam talebi vb.) doğması halinde
            gerekli bilgiler ilgili mercilerle paylaşılabilir.
          </p>
        </PolicySection>

        <PolicySection title="7. Kullanıcı Hakları">
          <p>
            Kişisel verileriniz üzerinde, ilgili mevzuat kapsamında aşağıdaki
            haklara sahip olabilirsiniz:
          </p>
          <ul>
            <li>Hangi kişisel verilerin işlendiğini öğrenme.</li>
            <li>Verilerin düzeltilmesini veya güncellenmesini talep etme.</li>
            <li>Verilerin silinmesini talep etme.</li>
            <li>
              Verilerin işlenmesine ilişkin itiraz etme veya sınırlama talep
              etme.
            </li>
          </ul>
          <p>
            Bu haklarınızı kullanmak için bizimle{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            adresi üzerinden iletişime geçebilirsiniz.
          </p>
        </PolicySection>

        <PolicySection title="8. Veri Silme Talebi">
          <p>
            Hesabınıza veya size ait verilere ilişkin silme talebinde bulunmak
            isterseniz, talebinizi kayıtlı olduğunuz e-posta adresinizden{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            adresine iletebilirsiniz. Talebiniz, kimlik doğrulaması yapıldıktan
            ve geçerli yasal saklama yükümlülükleri kontrol edildikten sonra
            makul bir süre içinde işleme alınır.
          </p>
        </PolicySection>

        <PolicySection title="9. İletişim">
          <p>
            Bu Gizlilik Politikası hakkında sorularınız için bizimle{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            adresinden iletişime geçebilirsiniz.
          </p>
        </PolicySection>

        <p className="border-t pt-6 text-sm text-muted-foreground">
          Bu Gizlilik Politikası, hizmet kapsamının veya ilgili mevzuatın
          değişmesi halinde güncellenebilir. Önemli değişiklikler bu sayfa
          üzerinden yayınlanacaktır.
        </p>
      </main>
    </div>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
