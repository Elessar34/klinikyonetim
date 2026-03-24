import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScissors, faClockRotateLeft, faImages, faCalendarDays,
  faRoute, faChartLine, faArrowLeft, faCircleCheck, faSprayCanSparkles,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FeatureData {
  title: string; icon: IconDefinition; desc: string;
  benefits: string[]; details: string;
}

const features: Record<string, FeatureData> = {
  "bakim-hizmetleri": {
    title: "Bakım Hizmetleri", icon: faScissors,
    desc: "Hizmet menünüzü oluşturun, fiyatları belirleyin ve bakım süreçlerini yönetin.",
    benefits: ["Özelleştirilebilir hizmet menüsü", "Fiyat ve süre belirleme", "Hizmet kategorileri", "Paket oluşturma", "İndirim tanımlama", "Hizmet bazlı raporlama"],
    details: "Yıkama, tıraş, tırnak kesimi, kulak temizliği ve tüm bakım hizmetlerinizi sisteme tanımlayın. Her hizmet için fiyat, süre ve açıklama belirleyin. Paket hizmetler oluşturup kampanya düzenleyin.",
  },
  "bakim-gecmisi": {
    title: "Bakım Geçmişi", icon: faClockRotateLeft,
    desc: "Her pet için detaylı bakım geçmişi, tercihler ve hassasiyet notları.",
    benefits: ["Detaylı bakım kaydı", "Cilt/tüy hassasiyet notları", "Tercih edilen ürünler", "Önceki bakım detayları", "Davranış notları", "Bakım periyodu takibi"],
    details: "Her hayvan için detaylı bakım geçmişi tutun. Cilt hassasiyetleri, tercih edilen şampuanlar, tüy kesim tercihleri ve davranış notlarını kaydedin. Bir sonraki bakımda bu bilgilere kolayca erişin.",
  },
  "galeri": {
    title: "Öncesi/Sonrası Fotoğraf", icon: faImages,
    desc: "Bakım öncesi ve sonrası fotoğraf arşivi oluşturun, portfolyonuzu paylaşın.",
    benefits: ["Öncesi/sonrası karşılaştırma", "Fotoğraf arşivi", "Portfolyo oluşturma", "Müşteriye paylaşım", "Sosyal medya içeriği", "Bakım kalitesi kanıtı"],
    details: "Her bakım için öncesi ve sonrası fotoğraflarını çekin ve arşivleyin. Harika sonuçlarınız portfolyonuz olsun. Müşterilerinize bakım sonuçlarını gösterin, sosyal medyada paylaşım için hazır içerik oluşturun.",
  },
  "kuafor-takvimi": {
    title: "Kuaför Takvimi", icon: faCalendarDays,
    desc: "Kuaför bazlı randevu yönetimi ile takvimi profesyonelce planlayın.",
    benefits: ["Kuaför bazlı takvim", "Günlük/haftalık görünüm", "Çakışma önleme", "Kapasite yönetimi", "Sürükle-bırak randevu", "Boş slot gösterimi"],
    details: "Her kuaför için ayrı takvim görünümü. Randevuları sürükle-bırak ile düzenleyin, çakışmaları otomatik önleyin ve boş slotları müşterilere gösterin.",
  },
  "mobil-kuafor": {
    title: "Mobil Kuaför Rota", icon: faRoute,
    desc: "Gezici kuaför hizmeti için rota planlaması ve müşteri konum yönetimi.",
    benefits: ["Harita üzerinde planlama", "Rota optimizasyonu", "Müşteri adresleri", "Günlük rota planı", "Navigasyon entegrasyonu", "Yakıt tasarrufu hesaplama"],
    details: "Gezici pet kuaförü olarak müşterilerinizin adreslerini harita üzerinde görün. Günlük rotanızı optimize edin, en verimli güzergahı belirleyin.",
  },
  "randevu-yonetimi": {
    title: "Online Randevu", icon: faSprayCanSparkles,
    desc: "Müşterileriniz online randevu alsın, hatırlatmalarla gelmeme oranını düşürün.",
    benefits: ["Online randevu formu", "SMS/e-posta hatırlatma", "Randevu teyidi", "İptal yönetimi", "Müşteri self-servis", "Bekleme listesi"],
    details: "Müşterileriniz web siteniz üzerinden 7/24 randevu alabilsin. Randevu öncesinde otomatik hatırlatma gönderin, gelmeme oranını %60'a kadar düşürün.",
  },
  "stok-yonetimi": {
    title: "Ürün & Stok Takibi", icon: faSprayCanSparkles,
    desc: "Bakım ürünleri stok takibi, barkodlu satış ve tüketim analizi.",
    benefits: ["Ürün stok takibi", "Barkodlu satış", "Tüketim analizi", "Düşük stok uyarısı", "Tedarikçi yönetimi", "Kârlılık raporu"],
    details: "Şampuan, losyon, tırnak bakım ürünleri ve tüm malzemelerinizin stokunu takip edin. Barkod okuyucu ile hızlı satış, tüketim analizi ile hangi ürünün ne kadar kullanıldığını görün.",
  },
  "raporlama": {
    title: "Raporlama & Analitik", icon: faChartLine,
    desc: "Gelir, müşteri ve hizmet istatistikleri ile işletmenizin performansını izleyin.",
    benefits: ["Gelir raporları", "Müşteri analizi", "Hizmet istatistikleri", "Kuaför performansı", "Dönemsel karşılaştırma", "Excel dışa aktarma"],
    details: "Günlük, haftalık ve aylık gelir raporları, en popüler hizmetler, en değerli müşteriler ve kuaför bazlı performans metrikleri ile işletmenizi veri odaklı yönetin.",
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
    title: `${f.title} | Pet Kuaför Yazılımı | Klinik Yönetim`,
    description: f.desc,
  };
}

export default async function PetKuaforFeatureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = features[slug];
  if (!feature) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#F5A623] to-orange-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link href="/pet-kuafor" className="text-white/70 hover:text-white text-sm flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faArrowLeft} /> Tüm Pet Kuaför Özellikleri
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
                <Link href="/kayit" className="bg-[#F5A623] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d9921f] transition inline-block">
                  Ücretsiz Deneyin
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Özellikler</h2>
              <ul className="space-y-3">
                {feature.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-[#F5A623] mt-1 flex-shrink-0" />
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
