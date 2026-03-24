import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Kullanım Şartları | Klinik Yönetim",
  description: "Klinik Yönetim platformu kullanım şartları ve koşulları.",
};

export default function KullanimSartlariPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-green">
          <h1>Kullanım Şartları</h1>
          <p className="lead">Son güncelleme: 25 Mart 2026</p>

          <h2>1. Kabul</h2>
          <p>
            Klinik Yönetim platformunu (&quot;Hizmet&quot;) kullanarak bu kullanım şartlarını kabul
            etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen Hizmeti kullanmayınız.
          </p>

          <h2>2. Hizmet Tanımı</h2>
          <p>
            Klinik Yönetim, veteriner klinikleri ve pet kuaförleri için tasarlanmış bulut tabanlı
            bir işletme yönetim platformudur. Müşteri yönetimi, randevu takibi, stok kontrolü,
            finansal raporlama ve daha birçok özellik sunar.
          </p>

          <h2>3. Hesap Oluşturma</h2>
          <ul>
            <li>Hesap oluşturmak için 18 yaşından büyük olmanız gerekir</li>
            <li>Doğru ve güncel bilgiler sağlamakla yükümlüsünüz</li>
            <li>Hesap güvenliğinden siz sorumlusunuz</li>
            <li>Şifrenizi başkalarıyla paylaşmayınız</li>
          </ul>

          <h2>4. Abonelik ve Ödeme</h2>
          <ul>
            <li>Hizmet, aylık veya yıllık abonelik modeli ile sunulur</li>
            <li>Deneme süresi sonunda otomatik ücretlendirme başlamaz</li>
            <li>Fiyatlar KDV dahildir</li>
            <li>İade politikası: İlk 14 gün içinde kayıtsız şartsız iade</li>
            <li>Abonelik iptali, dönem sonuna kadar hizmeti etkilemez</li>
          </ul>

          <h2>5. Kullanım Kuralları</h2>
          <p>Hizmeti kullanırken şunları yapmayı kabul edersiniz:</p>
          <ul>
            <li>Yasalara ve yönetmeliklere uygun hareket etmek</li>
            <li>Başkalarının kişisel verilerini izinsiz işlememek</li>
            <li>Platformun güvenliğini tehlikeye atacak faaliyetler yapmamak</li>
            <li>Zararlı yazılım yüklememek veya dağıtmamak</li>
            <li>Hizmeti aşırı yükleyecek otomatik sorgular yapmamak</li>
          </ul>

          <h2>6. Fikri Mülkiyet</h2>
          <p>
            Klinik Yönetim platformunun tüm hakları (yazılım, tasarım, içerik, logo) saklıdır.
            Platformu kopyalamak, dağıtmak veya tersine mühendislik yapmak yasaktır.
          </p>

          <h2>7. Veri Sahipliği</h2>
          <p>
            Platforma girdiğiniz tüm veriler (müşteri bilgileri, randevular, finansal kayıtlar)
            size aittir. Hesabınızı kapattığınızda verilerinizi dışa aktarma hakkınız bulunur.
          </p>

          <h2>8. Hizmet Düzeyi</h2>
          <ul>
            <li>%99.9 uptime hedefi</li>
            <li>Planlı bakımlar önceden bildirilir</li>
            <li>Günlük otomatik yedekleme</li>
            <li>E-posta ile teknik destek</li>
          </ul>

          <h2>9. Sorumluluk Sınırı</h2>
          <p>
            Hizmet &quot;olduğu gibi&quot; sunulmaktadır. Hizmetin kesintisiz veya hatasız olacağını
            garanti etmiyoruz. Veri kaybı veya iş kaybından dolayı sorumluluğumuz, son 12 ayda
            ödediğiniz toplam abonelik bedeli ile sınırlıdır.
          </p>

          <h2>10. Fesih</h2>
          <p>
            Herhangi bir zamanda hesabınızı kapatarak Hizmeti kullanmayı bırakabilirsiniz.
            Kullanım şartlarının ihlali halinde hesabınız askıya alınabilir veya kapatılabilir.
          </p>

          <h2>11. Uygulanacak Hukuk</h2>
          <p>
            Bu şartlar Kuzey Kıbrıs Türk Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda
            Lefkoşa mahkemeleri yetkilidir.
          </p>

          <h2>12. İletişim</h2>
          <p>
            Kullanım şartlarıyla ilgili sorularınız için: <strong>info@klinikyonetim.net</strong>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
