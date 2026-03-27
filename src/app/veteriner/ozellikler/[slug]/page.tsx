import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope, faSyringe, faPrescription, faFlask, faUserDoctor,
  faPills, faCalendarDays, faChartLine, faArrowLeft, faCircleCheck,
  faArrowRight, faLightbulb, faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FeatureData {
  title: string; icon: IconDefinition; desc: string; color: string;
  benefits: string[]; details: string;
  useCases: { title: string; desc: string }[];
  stats: { value: string; label: string }[];
  faq: { q: string; a: string }[];
}

const features: Record<string, FeatureData> = {
  "hasta-dosyasi": {
    title: "Hasta Dosyası (EMR)", icon: faStethoscope, color: "#2D9F6F",
    desc: "Dijital hasta dosyası ile muayene, teşhis ve tedavi süreçlerini profesyonelce yönetin.",
    benefits: [
      "SOAP formatında muayene kaydı",
      "Tedavi geçmişi ve kronik hastalık takibi",
      "Dijital dosya ile kağıt israfına son",
      "Hızlı arama ve filtreleme",
      "Birden fazla veteriner arasında paylaşım",
      "Fotoğraf ve belge ekleme",
    ],
    details: "Klinik Yönetim'in Hasta Dosyası modülü, veteriner hekimlerin hasta kayıtlarını dijital ortamda tutmasını sağlar. SOAP (Subjective, Objective, Assessment, Plan) formatında muayene notları, teşhis kodları, tedavi planları ve reçeteler tek bir yerde. Geçmiş muayenelere hızlıca erişin, tedavi süreçlerini takip edin.",
    useCases: [
      { title: "Rutin Muayene", desc: "Muayene sırasında bulgularınızı hızlıca kaydedin. Vital bulgular, şikayetler ve fizik muayene notlarını SOAP formatında düzenleyin." },
      { title: "Kronik Hasta Takibi", desc: "Diyabet, böbrek yetmezliği gibi kronik hastalıklarda tedavi geçmişini ve ilaç değişikliklerini kronolojik olarak izleyin." },
      { title: "Acil Vaka Yönetimi", desc: "Acil müdahale sırasında hızlı veri girişi ile önceki medikal geçmişe anında erişim sağlayın." },
    ],
    stats: [
      { value: "%85", label: "Kağıt israfı azalması" },
      { value: "3x", label: "Daha hızlı kayıt erişimi" },
      { value: "%40", label: "Zaman tasarrufu" },
    ],
    faq: [
      { q: "Mevcut hasta kayıtlarımı sisteme aktarabilir miyim?", a: "Evet, Excel veya CSV formatında toplu hasta ve pet verisi yükleme özelliğimiz mevcut." },
      { q: "Birden fazla doktor aynı anda kullanabilir mi?", a: "Evet, her doktor kendi hesabıyla giriş yapıp hastalarını yönetebilir." },
      { q: "Eski kayıtlara erişim süresi var mı?", a: "Hayır, tüm kayıtlar sınırsız süre saklanır ve istenildiği zaman erişilebilir." },
    ],
  },
  "asi-takibi": {
    title: "Aşı Takibi", icon: faSyringe, color: "#2D9F6F",
    desc: "Aşı takvimini otomatik takip edin, yaklaşan aşılar için otomatik hatırlatmalar gönderin.",
    benefits: [
      "Otomatik aşı takvimi oluşturma",
      "Yaklaşan aşı hatırlatmaları",
      "Aşı geçmişi ve sertifika oluşturma",
      "Cins bazlı aşı protokolleri",
      "Toplu aşı kampanyası yönetimi",
      "Müşteriye SMS/e-posta bildirimi",
    ],
    details: "Hayvan türü ve cinsine göre otomatik aşı takvimi oluşturur. Yaklaşan aşılar için müşterilere otomatik hatırlatma gönderir. Aşı geçmişini detaylı takip edin, aşı sertifikası oluşturun. Toplu aşı kampanyalarını planlayın ve yönetin.",
    useCases: [
      { title: "Yavru Aşı Programı", desc: "Yeni doğmuş yavruların aşı takvimini cinsine göre otomatik oluşturun. Her aşı sonrası bir sonraki randevuyu otomatik planlayın." },
      { title: "Yıllık Aşı Hatırlatma", desc: "Yıllık tekrar aşıları için müşterilere otomatik bildirim gönderin. Gelmeme durumunda takip mesajları." },
      { title: "Aşı Sertifika Yönetimi", desc: "Seyahat veya pansiyon için gerekli aşı sertifikalarını dijital olarak oluşturun ve müşteriye iletin." },
    ],
    stats: [
      { value: "%95", label: "Aşı randevusu katılım" },
      { value: "0", label: "Kaçırılan aşı bildirimi" },
      { value: "%60", label: "Daha az telefon trafiği" },
    ],
    faq: [
      { q: "Aşı hatırlatmaları nasıl gönderilir?", a: "SMS, e-posta veya WhatsApp üzerinden otomatik bildirimler gönderilir." },
      { q: "Farklı hayvan türleri için farklı takvimler var mı?", a: "Evet, kedi, köpek ve diğer türler için özelleştirilebilir aşı protokolleri mevcuttur." },
      { q: "Aşı sertifikası yazdırabilir miyim?", a: "Evet, kliniğinizin logosu ile profesyonel aşı sertifikası oluşturabilirsiniz." },
    ],
  },
  "recete-yonetimi": {
    title: "Reçete Yönetimi", icon: faPrescription, color: "#2D9F6F",
    desc: "Dijital reçete oluşturun, ilaç dozajlarını hesaplayın ve yazdırılabilir reçete çıktısı alın.",
    benefits: ["Dijital reçete oluşturma", "İlaç veritabanı entegrasyonu", "Dozaj hesaplama", "Yazdırılabilir reçete", "Reçete geçmişi", "İlaç etkileşim uyarıları"],
    details: "İlaç veritabanı ile entegre dijital reçete sistemi. Hayvanın kilosuna göre otomatik dozaj hesaplama, ilaç etkileşim uyarıları ve yazdırılabilir profesyonel reçete çıktısı. Geçmiş reçetelere anında erişim ve tekrarlayan reçeteler için şablon oluşturma.",
    useCases: [
      { title: "Hızlı Reçete", desc: "Sık kullanılan ilaç kombinasyonlarını şablon olarak kaydedin, tek tıkla reçete oluşturun." },
      { title: "Dozaj Hesaplama", desc: "Hayvanın ağırlığına göre otomatik dozaj hesaplayın, hata riskini minimuma indirin." },
      { title: "Etkileşim Kontrolü", desc: "Birlikte kullanılmaması gereken ilaçlar için otomatik uyarı alın." },
    ],
    stats: [
      { value: "%99", label: "Dozaj doğruluk oranı" },
      { value: "30sn", label: "Ortalama reçete süresi" },
      { value: "500+", label: "İlaç veritabanı" },
    ],
    faq: [
      { q: "İlaç veritabanı güncelleniyor mu?", a: "Evet, veteriner ilaç veritabanı düzenli olarak güncellenmektedir." },
      { q: "Reçete yazdırabilir miyim?", a: "Evet, klinik logolu profesyonel reçete çıktısı alabilirsiniz." },
      { q: "Geçmiş reçetelere erişebilir miyim?", a: "Evet, tüm reçete geçmişi hasta dosyasında saklanır." },
    ],
  },
  "laboratuvar": {
    title: "Laboratuvar Sonuçları", icon: faFlask, color: "#2D9F6F",
    desc: "Test sonuçlarını kaydedin, referans değerlerle karşılaştırın ve geçmişi takip edin.",
    benefits: ["Test sonuçları girişi", "Referans değer karşılaştırma", "Grafik ile trend takibi", "Sonuç geçmişi", "PDF rapor oluşturma", "Anormal değer uyarıları"],
    details: "Kan tahlili, idrar analizi ve diğer laboratuvar testlerinin sonuçlarını sisteme girin. Referans değerlerle otomatik karşılaştırma, anormal sonuç uyarıları ve zaman içindeki trend grafiği ile hastalık seyrini takip edin.",
    useCases: [
      { title: "Kan Tahlili Takibi", desc: "Hemogram, biyokimya sonuçlarını girin, referans aralığın dışındaki değerler otomatik olarak vurgulanır." },
      { title: "Kronik Hastalık İzleme", desc: "Böbrek ve karaciğer değerlerini zaman içinde grafik olarak takip edin, tedavi etkinliğini değerlendirin." },
      { title: "Müşteri Raporlama", desc: "Test sonuçlarını profesyonel PDF rapor olarak oluşturup müşterinize e-posta ile gönderin." },
    ],
    stats: [
      { value: "50+", label: "Desteklenen test türü" },
      { value: "Anlık", label: "Referans karşılaştırma" },
      { value: "PDF", label: "Otomatik rapor" },
    ],
    faq: [
      { q: "Hangi test türleri destekleniyor?", a: "Hemogram, biyokimya, idrar, dışkı analizi ve daha fazlası." },
      { q: "Sonuçları müşteriye gönderebilir miyim?", a: "Evet, PDF rapor oluşturup e-posta ile paylaşabilirsiniz." },
      { q: "Trend grafikleri nasıl çalışır?", a: "Aynı testin farklı tarihlerdeki sonuçları otomatik grafikleştirilir." },
    ],
  },
  "ameliyat-kayitlari": {
    title: "Ameliyat Kayıtları", icon: faUserDoctor, color: "#2D9F6F",
    desc: "Operasyon planı, anestezi protokolü ve post-operatif takip süreçlerini kaydedin.",
    benefits: ["Ameliyat planlama", "Anestezi protokolü kaydı", "Ameliyat notları", "Post-op takip", "Komplikasyon kaydı", "Ameliyat istatistikleri"],
    details: "Ameliyat öncesi hazırlık listesi, anestezi protokolü, ameliyat sırasında notlar ve ameliyat sonrası takip sürecini dijital ortamda yönetin. Komplikasyon kayıtları ve ameliyat istatistikleri ile klinik performansınızı analiz edin.",
    useCases: [
      { title: "Kısırlaştırma Operasyonu", desc: "Standart protokol şablonları ile hızlı ameliyat kaydı oluşturun. Pre-op kontrol listesi ile hiçbir adımı atlamayın." },
      { title: "Anestezi Takibi", desc: "Anestezi tipi, dozaj ve vital bulguları kaydedin. Anestezi sırasında anlık not ekleyin." },
      { title: "Post-Op Kontrol", desc: "Ameliyat sonrası kontrol randevularını planlayın, yara iyileşme sürecini fotoğraflarla belgeleyin." },
    ],
    stats: [
      { value: "Sıfır", label: "Kaçırılan kontrol" },
      { value: "%100", label: "Protokol uyum oranı" },
      { value: "Detaylı", label: "Ameliyat raporu" },
    ],
    faq: [
      { q: "Ameliyat şablonları var mı?", a: "Evet, kısırlaştırma, diş çekimi gibi sık yapılan operasyonlar için hazır şablonlar mevcuttur." },
      { q: "Ameliyat fotoğrafı ekleyebilir miyim?", a: "Evet, ameliyat öncesi, sırası ve sonrasına fotoğraf ekleyebilirsiniz." },
      { q: "Post-op randevuları otomatik planlanıyor mu?", a: "Evet, ameliyat türüne göre kontrol randevuları otomatik oluşturulur." },
    ],
  },
  "ilac-stok": {
    title: "İlaç & Stok Yönetimi", icon: faPills, color: "#2D9F6F",
    desc: "İlaç ve malzeme stoğunuzu takip edin, son kullanma tarihi ve minimum stok uyarıları alın.",
    benefits: ["Stok seviyesi takibi", "Min. stok uyarısı", "SKT takibi", "Barkodlu ürün yönetimi", "Tedarikçi yönetimi", "Stok hareket raporu"],
    details: "İlaç, aşı, sarf malzeme ve tüm ürünlerinizin stok seviyesini anlık takip edin. Barkod okuyucu ile hızlı ürün araması, son kullanma tarihi uyarıları ve otomatik düşük stok bildirimleri. Barkodlu satış kasa sistemi ile satış ve stok düşümü otomatik.",
    useCases: [
      { title: "Barkodlu Stok Girişi", desc: "Yeni gelen ürünleri barkod okuyucu ile sisteme ekleyin. Mevcut stok otomatik güncellenir." },
      { title: "SKT Takibi", desc: "Son kullanma tarihi yaklaşan ürünler için otomatik uyarı alın. Atık maliyetlerini minimuma indirin." },
      { title: "Hızlı Satış", desc: "Barkod okutarak POS kasa ekranından anında satış yapın. Stok otomatik düşer, gelir kaydı oluşur." },
    ],
    stats: [
      { value: "%0", label: "SKT atık oranı" },
      { value: "Anlık", label: "Stok bilgisi" },
      { value: "Otomatik", label: "Stok düşüm" },
    ],
    faq: [
      { q: "Barkod okuyucu ile çalışıyor mu?", a: "Evet, USB veya Bluetooth barkod okuyucularla tam uyumludur." },
      { q: "Düşük stok uyarısı nasıl çalışır?", a: "Her ürün için minimum stok seviyesi belirlenir, bu seviyenin altına düşünce bildirim alırsınız." },
      { q: "Satış ve stok entegre mi?", a: "Evet, kasadan yapılan her satışta stok otomatik olarak güncellenir." },
    ],
  },
  "randevu-yonetimi": {
    title: "Randevu Yönetimi", icon: faCalendarDays, color: "#2D9F6F",
    desc: "Online randevu alma, takvim yönetimi ve otomatik hatırlatmalar ile randevu sürecinizi optimize edin.",
    benefits: ["Online randevu alma", "Takvim görünümü", "Otomatik hatırlatma", "Randevu teyidi", "Çakışma önleme", "Gelmeme takibi"],
    details: "Müşterileriniz online randevu alsın, otomatik SMS ve e-posta hatırlatmaları ile gelmeme oranını düşürün. Takvim görünümüyle günlük, haftalık ve aylık plan yapın. Çift randevu önleme ve kapasite yönetimi ile verimli çalışma.",
    useCases: [
      { title: "Online Randevu", desc: "Müşterileriniz 7/24 web üzerinden randevu alabilir. Uygun saatler otomatik gösterilir." },
      { title: "Hatırlatma Sistemi", desc: "Randevu öncesi otomatik SMS/e-posta hatırlatma ile gelmeme oranını %70 azaltın." },
      { title: "Kapasite Yönetimi", desc: "Doktor ve oda bazlı kapasite belirleyin, çakışmaları otomatik engelleyin." },
    ],
    stats: [
      { value: "%70", label: "Gelmeme oranı düşüşü" },
      { value: "7/24", label: "Online randevu" },
      { value: "Sıfır", label: "Çift randevu" },
    ],
    faq: [
      { q: "Müşteriler online randevu alabilir mi?", a: "Evet, klinik web sayfanız üzerinden 7/24 randevu alınabilir." },
      { q: "Randevu hatırlatmaları otomatik mi?", a: "Evet, randevu öncesinde otomatik SMS ve e-posta gönderilir." },
      { q: "İptal ve değişiklik yapılabiliyor mu?", a: "Evet, hem müşteri hem de klinik tarafından kolayca değiştirilebilir." },
    ],
  },
  "muhasebe": {
    title: "Gelir/Gider & Raporlama", icon: faChartLine, color: "#2D9F6F",
    desc: "Finansal takip, fatura ve gelir-gider raporları ile işletmenizin sağlığını izleyin.",
    benefits: ["Günlük kasa takibi", "Fatura oluşturma", "Gelir-gider raporu", "Aylık karşılaştırma", "Vergi raporu", "Excel dışa aktarma"],
    details: "Günlük kasa hareketleri, fatura oluşturma, gelir-gider karşılaştırma raporları ve analitik dashboard ile işletmenizin finansal durumunu anlık takip edin. POS satışları otomatik olarak gelire yansır, aylık ve yıllık karşılaştırmalar ile büyümenizi ölçün.",
    useCases: [
      { title: "Günlük Kasa", desc: "Günün sonunda nakit, kart ve havale bazlı gelirlerinizi tek ekranda görün." },
      { title: "Aylık Analiz", desc: "Geçen ayla karşılaştırmalı gelir-gider raporu ile büyüme trendlerinizi analiz edin." },
      { title: "Vergi Hazırlığı", desc: "Dönemsel rapor çıktıları ile muhasebeciye hazır veri aktarın." },
    ],
    stats: [
      { value: "Anlık", label: "Finansal görünüm" },
      { value: "Otomatik", label: "Gelir kaydı" },
      { value: "Excel", label: "Dışa aktarma" },
    ],
    faq: [
      { q: "POS satışları otomatik gelire ekleniyor mu?", a: "Evet, kasadan yapılan her satış otomatik olarak gelir kaydı olarak işlenir." },
      { q: "Fatura oluşturulabiliyor mu?", a: "Evet, müşteri bazlı fatura oluşturup PDF olarak çıktı alabilirsiniz." },
      { q: "Verileri Excel'e aktarabilir miyim?", a: "Evet, tüm finansal raporlar Excel ve CSV formatında dışa aktarılabilir." },
    ],
  },
};

const allFeatures = Object.entries(features).map(([slug, f]) => ({ slug, title: f.title, icon: f.icon }));

export async function generateStaticParams() {
  return Object.keys(features).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = features[slug];
  if (!f) return {};
  return {
    title: `${f.title} | Veteriner Yazılımı | Klinik Yönetim`,
    description: f.desc,
  };
}

export default async function VeterinerFeatureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = features[slug];
  if (!feature) notFound();

  const otherFeatures = allFeatures.filter((f) => f.slug !== slug);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-800 text-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <Link href="/veteriner" className="text-white/60 hover:text-white text-sm flex items-center gap-2 mb-6 transition">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Tüm Veteriner Özellikleri
            </Link>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <FontAwesomeIcon icon={feature.icon} className="text-3xl md:text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">{feature.title}</h1>
                <p className="text-white/70 mt-3 text-lg max-w-2xl">{feature.desc}</p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link href="/kayit" className="bg-white text-[#2D9F6F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2">
                    Ücretsiz Deneyin <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                  </Link>
                  <Link href="/iletisim" className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
                    Demo Talep Et
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="bg-gray-50 border-b">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {feature.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-[#2D9F6F]">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Details + Benefits Grid */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Neden Bu Özellik?</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{feature.details}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Temel Yetenekler</h2>
              <ul className="space-y-3">
                {feature.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-[#2D9F6F] mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FontAwesomeIcon icon={faLightbulb} className="text-[#F5A623] text-xl" />
              <h2 className="text-2xl font-bold text-gray-900">Kullanım Senaryoları</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {feature.useCases.map((uc, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center mb-4">
                    <span className="text-[#2D9F6F] font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{uc.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {feature.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 flex items-start gap-3">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-[#2D9F6F] text-sm mt-1 flex-shrink-0" />
                    {item.q}
                  </h3>
                  <p className="text-gray-500 mt-2 ml-7 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#1a1a2e] text-white py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Kliniğinizi dijitalleştirin</h2>
            <p className="text-white/60 mb-8">14 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
            <Link href="/kayit" className="bg-[#2D9F6F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#248a5f] transition inline-flex items-center gap-2">
              Hemen Başlayın <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </div>
        </section>

        {/* Other Features */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Diğer Özellikler</h3>
            <div className="flex flex-wrap gap-2">
              {otherFeatures.map((f) => (
                <Link
                  key={f.slug}
                  href={`/veteriner/ozellikler/${f.slug}`}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:text-[#2D9F6F] hover:border-[#2D9F6F]/30 transition"
                >
                  <FontAwesomeIcon icon={f.icon} className="text-xs" /> {f.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
