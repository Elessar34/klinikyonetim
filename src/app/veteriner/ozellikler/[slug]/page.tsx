import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope, faSyringe, faPrescription, faFlask, faUserDoctor,
  faPills, faCalendarDays, faChartLine, faArrowLeft, faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FeatureData {
  title: string; icon: IconDefinition; desc: string;
  benefits: string[]; details: string;
}

const features: Record<string, FeatureData> = {
  "hasta-dosyasi": {
    title: "Hasta Dosyası (EMR)", icon: faStethoscope,
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
  },
  "asi-takibi": {
    title: "Aşı Takibi", icon: faSyringe,
    desc: "Aşı takvimini otomatik takip edin, yaklaşan aşılar için otomatik hatırlatmalar gönderin.",
    benefits: [
      "Otomatik aşı takvimi oluşturma",
      "Yaklaşan aşı hatırlatmaları",
      "Aşı geçmişi ve sertifika oluşturma",
      "Cins bazlı aşı protokolleri",
      "Toplu aşı kampanyası yönetimi",
      "Müşteriye SMS/e-posta bildirimi",
    ],
    details: "Hayvan türü ve cinsine göre otomatik aşı takvimi oluşturur. Yaklaşan aşılar için müşterilere otomatik hatırlatma gönderir. Aşı geçmişini detaylı takip edin, aşı sertifikası oluşturun.",
  },
  "recete-yonetimi": {
    title: "Reçete Yönetimi", icon: faPrescription,
    desc: "Dijital reçete oluşturun, ilaç dozajlarını hesaplayın ve yazdırılabilir reçete çıktısı alın.",
    benefits: ["Dijital reçete oluşturma", "İlaç veritabanı entegrasyonu", "Dozaj hesaplama", "Yazdırılabilir reçete", "Reçete geçmişi", "İlaç etkileşim uyarıları"],
    details: "İlaç veritabanı ile entegre dijital reçete sistemi. Hayvanın kilosuna göre otomatik dozaj hesaplama, ilaç etkileşim uyarıları ve yazdırılabilir profesyonel reçete çıktısı.",
  },
  "laboratuvar": {
    title: "Laboratuvar Sonuçları", icon: faFlask,
    desc: "Test sonuçlarını kaydedin, referans değerlerle karşılaştırın ve geçmişi takip edin.",
    benefits: ["Test sonuçları girişi", "Referans değer karşılaştırma", "Grafik ile trend takibi", "Sonuç geçmişi", "PDF rapor oluşturma", "Anormal değer uyarıları"],
    details: "Kan tahlili, idrar analizi ve diğer laboratuvar testlerinin sonuçlarını sisteme girin. Referans değerlerle otomatik karşılaştırma, anormal sonuç uyarıları ve zaman içindeki trend grafiği.",
  },
  "ameliyat-kayitlari": {
    title: "Ameliyat Kayıtları", icon: faUserDoctor,
    desc: "Operasyon planı, anestezi protokolü ve post-operatif takip süreçlerini kaydedin.",
    benefits: ["Ameliyat planlama", "Anestezi protokolü kaydı", "Ameliyat notları", "Post-op takip", "Komplikasyon kaydı", "Ameliyat istatistikleri"],
    details: "Ameliyat öncesi hazırlık listesi, anestezi protokolü, ameliyat sırasında notlar ve ameliyat sonrası takip sürecini dijital ortamda yönetin. Ameliyat istatistikleri ve raporlama.",
  },
  "ilac-stok": {
    title: "İlaç & Stok Yönetimi", icon: faPills,
    desc: "İlaç ve malzeme stoğunuzu takip edin, son kullanma tarihi ve minimum stok uyarıları alın.",
    benefits: ["Stok seviyesi takibi", "Min. stok uyarısı", "SKT takibi", "Barkodlu ürün yönetimi", "Tedarikçi yönetimi", "Stok hareket raporu"],
    details: "İlaç, aşı, sarf malzeme ve tüm ürünlerinizin stok seviyesini anlık takip edin. Barkod okuyucu ile hızlı ürün araması, son kullanma tarihi uyarıları ve otomatik düşük stok bildirimleri.",
  },
  "randevu-yonetimi": {
    title: "Randevu Yönetimi", icon: faCalendarDays,
    desc: "Online randevu alma, takvim yönetimi ve otomatik hatırlatmalar ile randevu sürecinizi optimize edin.",
    benefits: ["Online randevu alma", "Takvim görünümü", "Otomatik hatırlatma", "Randevu teyidi", "Çakışma önleme", "Gelmeme takibi"],
    details: "Müşterileriniz online randevu alsın, otomatik SMS ve e-posta hatırlatmaları ile gelmeme oranını düşürün. Takvim görünümüyle günlük/haftalık plan yapın.",
  },
  "muhasebe": {
    title: "Gelir/Gider & Raporlama", icon: faChartLine,
    desc: "Finansal takip, fatura ve gelir-gider raporları ile işletmenizin sağlığını izleyin.",
    benefits: ["Günlük kasa takibi", "Fatura oluşturma", "Gelir-gider raporu", "Aylık karşılaştırma", "Vergi raporu", "Excel dışa aktarma"],
    details: "Günlük kasa hareketleri, fatura oluşturma, gelir-gider karşılaştırma raporları ve analitik dashboard ile işletmenizin finansal durumunu anlık takip edin.",
  },
};

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

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/veteriner" className="text-white/70 hover:text-white text-sm flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faArrowLeft} /> Tüm Veteriner Özellikleri
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <FontAwesomeIcon icon={feature.icon} className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{feature.title}</h1>
                <p className="text-white/80 mt-1">{feature.desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Detaylar</h2>
              <p className="text-gray-600 leading-relaxed">{feature.details}</p>
              <div className="mt-8">
                <Link href="/kayit" className="bg-[#2D9F6F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#248a5f] transition inline-block">
                  Ücretsiz Deneyin
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Özellikler</h2>
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
      </main>
      <Footer />
    </>
  );
}
