import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Klinik Yönetim",
  description: "Klinik Yönetim gizlilik politikası — kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
};

export default function GizlilikPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-green">
          <h1>Gizlilik Politikası</h1>
          <p className="lead">Son güncelleme: 25 Mart 2026</p>

          <h2>1. Genel Bilgilendirme</h2>
          <p>
            Bu gizlilik politikası, Klinik Yönetim platformunu (&quot;Hizmet&quot;) kullandığınızda
            kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve paylaşıldığını açıklar.
          </p>

          <h2>2. Toplanan Bilgiler</h2>
          <h3>Doğrudan Sağladığınız Bilgiler</h3>
          <ul>
            <li>Hesap oluşturma sırasında: ad, soyad, e-posta, telefon, işletme bilgileri</li>
            <li>Müşteri ve pet kayıtları</li>
            <li>Randevu ve işlem bilgileri</li>
            <li>İletişim formundaki bilgiler</li>
          </ul>
          <h3>Otomatik Toplanan Bilgiler</h3>
          <ul>
            <li>IP adresi, tarayıcı tipi, cihaz bilgileri</li>
            <li>Çerezler (cookies) ve benzeri teknolojiler</li>
            <li>Kullanım istatistikleri ve log kayıtları</li>
          </ul>

          <h2>3. Bilgilerin Kullanım Amaçları</h2>
          <ul>
            <li>Hizmetlerin sunulması ve kişiselleştirilmesi</li>
            <li>Hesap güvenliğinin sağlanması</li>
            <li>Müşteri desteği</li>
            <li>Hizmet iyileştirmeleri ve analiz</li>
            <li>Yasal yükümlülükler</li>
            <li>Bildirim ve hatırlatmalar (izniniz dahilinde)</li>
          </ul>

          <h2>4. Bilgilerin Paylaşılması</h2>
          <p>Kişisel bilgilerinizi üçüncü taraflarla yalnızca şu durumlarda paylaşırız:</p>
          <ul>
            <li><strong>Hizmet sağlayıcılar:</strong> Hosting, e-posta, ödeme işleme (verilerinize yalnızca hizmet sunmak için erişirler)</li>
            <li><strong>Yasal zorunluluk:</strong> Mahkeme kararı veya yasal talep olduğunda</li>
            <li><strong>İzniniz:</strong> Açık onayınız olduğunda</li>
          </ul>

          <h2>5. Çerezler</h2>
          <p>
            Oturum yönetimi ve tercihlerinizi hatırlamak için çerezler kullanırız. Tarayıcı
            ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu bazı özelliklerin
            çalışmamasına neden olabilir.
          </p>

          <h2>6. Veri Güvenliği</h2>
          <p>
            Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
            SSL/TLS şifreleme, güvenli sunucu altyapısı, düzenli güvenlik denetimleri ve
            erişim kontrolleri.
          </p>

          <h2>7. Veri Saklama</h2>
          <p>
            Verilerinizi hesabınız aktif olduğu sürece saklarız. Hesabınızı silmeniz halinde
            verileriniz yasal gereklilikler saklı kalmak kaydıyla 30 gün içinde silinir.
          </p>

          <h2>8. Haklarınız</h2>
          <p>
            Verilerinize erişim, düzeltme, silme ve taşınabilirlik haklarınız bulunmaktadır.
            Bu haklarınızı kullanmak için <a href="/iletisim">bize ulaşabilirsiniz</a>.
            Detaylı bilgi için <a href="/kvkk">KVKK Aydınlatma Metni</a>&apos;ni inceleyebilirsiniz.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
            yapıldığında sizi e-posta yoluyla bilgilendireceğiz.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili sorularınız için: <strong>info@klinikyonetim.net</strong>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
