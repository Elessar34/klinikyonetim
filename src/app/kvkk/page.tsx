import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Klinik Yönetim",
  description: "Klinik Yönetim KVKK (Kişisel Verilerin Korunması Kanunu) Aydınlatma Metni",
};

export default function KVKKPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-green">
          <h1>KVKK Aydınlatma Metni</h1>
          <p className="lead">Son güncelleme: 25 Mart 2026</p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz;
            veri sorumlusu olarak Klinik Yönetim Yazılım Hizmetleri (&quot;Şirket&quot;) tarafından aşağıda
            açıklanan kapsamda işlenebilecektir.
          </p>

          <h2>2. İşlenen Kişisel Veriler</h2>
          <ul>
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası</li>
            <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres</li>
            <li><strong>İşlem Güvenliği:</strong> IP adresi, log kayıtları, şifreli erişim bilgileri</li>
            <li><strong>Finansal Bilgiler:</strong> Fatura ve ödeme bilgileri</li>
            <li><strong>Müşteri İşlem:</strong> Hizmet geçmişi, randevu bilgileri, pet bilgileri</li>
          </ul>

          <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul>
            <li>Hizmetlerin sunulması ve iyileştirilmesi</li>
            <li>Müşteri ilişkileri yönetimi (CRM)</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>İşletme güvenliğinin sağlanması</li>
            <li>Fatura ve ödeme süreçlerinin yürütülmesi</li>
            <li>İletişim faaliyetlerinin yürütülmesi</li>
            <li>Bilgi güvenliği süreçlerinin yürütülmesi</li>
          </ul>

          <h2>4. Kişisel Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz; yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve
            kuruluşlarına, hizmet sağlayıcılarımıza (hosting, e-posta, ödeme) ve iş ortaklarımıza
            aktarılabilir. Veriler yurt dışında bulunan sunucularda (AB/ABD) saklanabilir.
          </p>

          <h2>5. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama
            süresince muhafaza edilir. Hesap silme talebiniz halinde verileriniz yasal sürelere
            uygun olarak silinir veya anonim hale getirilir.
          </p>

          <h2>6. Veri Güvenliği</h2>
          <ul>
            <li>SSL/TLS ile şifreli veri iletimi</li>
            <li>AES-256 ile hassas veri şifreleme</li>
            <li>bcrypt ile şifre hashleme</li>
            <li>Düzenli güvenlik denetimleri</li>
            <li>Erişim kontrolleri ve yetkilendirme</li>
          </ul>

          <h2>7. Haklarınız (KVKK m.11)</h2>
          <p>KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>

          <h2>8. Başvuru</h2>
          <p>
            Yukarıda belirtilen haklarınızı kullanmak için <a href="/iletisim">iletişim sayfamız</a> üzerinden
            veya <strong>info@klinikyonetim.net</strong> e-posta adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
