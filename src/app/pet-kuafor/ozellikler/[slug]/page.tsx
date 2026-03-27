import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScissors, faClockRotateLeft, faImages, faCalendarDays,
  faRoute, faChartLine, faArrowLeft, faCircleCheck, faSprayCanSparkles,
  faArrowRight, faLightbulb, faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FeatureData {
  title: string; icon: IconDefinition; desc: string;
  benefits: string[]; details: string;
  useCases: { title: string; desc: string }[];
  stats: { value: string; label: string }[];
  faq: { q: string; a: string }[];
}

const features: Record<string, FeatureData> = {
  "bakim-hizmetleri": {
    title: "Bakım Hizmetleri", icon: faScissors,
    desc: "Hizmet menünüzü oluşturun, fiyatları belirleyin ve bakım süreçlerini yönetin.",
    benefits: ["Özelleştirilebilir hizmet menüsü", "Fiyat ve süre belirleme", "Hizmet kategorileri", "Paket oluşturma", "İndirim tanımlama", "Hizmet bazlı raporlama"],
    details: "Yıkama, tıraş, tırnak kesimi, kulak temizliği ve tüm bakım hizmetlerinizi sisteme tanımlayın. Her hizmet için fiyat, süre ve açıklama belirleyin. Paket hizmetler oluşturup kampanya düzenleyin. Cins bazlı fiyatlandırma ile küçük ve büyük ırk ayrımı yapın.",
    useCases: [
      { title: "Hizmet Menüsü", desc: "Tüm hizmetlerinizi kategorize edin: yıkama, kesim, SPA, özel bakım. Her biri için ayrı fiyat ve süre tanımlayın." },
      { title: "Paket Hizmetler", desc: "Yıkama + Kesim + Tırnak gibi paket oluşturun. Paketlere özel indirim tanımlayın." },
      { title: "Irk Bazlı Fiyat", desc: "Golden Retriever ile Chihuahua'nın bakım süresi farklıdır. Irk bazlı otomatik fiyatlandırma yapın." },
    ],
    stats: [
      { value: "Sınırsız", label: "Hizmet tanımı" },
      { value: "Otomatik", label: "Fiyat hesaplama" },
      { value: "%30", label: "Paket satış artışı" },
    ],
    faq: [
      { q: "Kaç farklı hizmet tanımlayabilirim?", a: "Sınırsız sayıda hizmet ve kategori tanımlayabilirsiniz." },
      { q: "Irk bazlı fiyat farkı uygulayabilir miyim?", a: "Evet, hayvan boyutu ve ırkına göre farklı fiyatlar belirleyebilirsiniz." },
      { q: "Paket indirim tanımlayabilir miyim?", a: "Evet, birden fazla hizmeti paket olarak tanımlayıp özel fiyat verebilirsiniz." },
    ],
  },
  "bakim-gecmisi": {
    title: "Bakım Geçmişi", icon: faClockRotateLeft,
    desc: "Her pet için detaylı bakım geçmişi, tercihler ve hassasiyet notları.",
    benefits: ["Detaylı bakım kaydı", "Cilt/tüy hassasiyet notları", "Tercih edilen ürünler", "Önceki bakım detayları", "Davranış notları", "Bakım periyodu takibi"],
    details: "Her hayvan için detaylı bakım geçmişi tutun. Cilt hassasiyetleri, tercih edilen şampuanlar, tüy kesim tercihleri ve davranış notlarını kaydedin. Bir sonraki bakımda bu bilgilere kolayca erişin. Bakım periyodunu takip edin, süresi gelen petler için otomatik hatırlatma alın.",
    useCases: [
      { title: "Hassasiyet Takibi", desc: "Alerjik reaksiyon gösteren petleri işaretleyin. Hangi ürünlerden kaçınılacağını bakım notlarına ekleyin." },
      { title: "Tercih Kaydı", desc: "Sahipler her seferinde anlatmak zorunda kalmasın. Kesim uzunluğu, şampuan tercihi, özel istekler kalıcı olarak kaydedilir." },
      { title: "Periyodik Hatırlatma", desc: "Her pet için bakım periyodu belirleyin. Süresi gelen petlerin sahiplerine otomatik bildirim gönderin." },
    ],
    stats: [
      { value: "%100", label: "Müşteri memnuniyeti" },
      { value: "Kalıcı", label: "Tercih hafızası" },
      { value: "Otomatik", label: "Periyod hatırlatma" },
    ],
    faq: [
      { q: "Eski bakım kayıtlarına erişebilir miyim?", a: "Evet, tüm geçmiş bakım kayıtları sınırsız süre saklanır." },
      { q: "Davranış notu nedir?", a: "Bakım sırasında korkak, saldırgan veya sakin gibi notlar ekleyerek sonraki bakıma hazırlıklı olmanızı sağlar." },
      { q: "Bakım periyodu hatırlatması nasıl çalışır?", a: "Her pet için belirlenen gün sayısı dolunca sahibe otomatik bildirim gönderilir." },
    ],
  },
  "galeri": {
    title: "Öncesi / Sonrası Fotoğraf", icon: faImages,
    desc: "Bakım öncesi ve sonrası fotoğraf arşivi oluşturun, portfolyonuzu paylaşın.",
    benefits: ["Öncesi/sonrası karşılaştırma", "Fotoğraf arşivi", "Portfolyo oluşturma", "Müşteriye paylaşım", "Sosyal medya içeriği", "Bakım kalitesi kanıtı"],
    details: "Her bakım için öncesi ve sonrası fotoğraflarını çekin ve arşivleyin. Harika sonuçlarınız portfolyonuz olsun. Müşterilerinize bakım sonuçlarını gösterin, sosyal medyada paylaşım için hazır içerik oluşturun. Yeni müşterilere işinizin kalitesini görsel olarak kanıtlayın.",
    useCases: [
      { title: "Portfolyo Oluşturma", desc: "En iyi bakım sonuçlarınızı seçip portfolyo oluşturun. Yeni müşterilere referans olarak gösterin." },
      { title: "Müşteri Paylaşımı", desc: "Bakım sonrası fotoğrafı WhatsApp veya e-posta ile sahibe gönderin. Müşteri sadakati artıran bir deneyim." },
      { title: "Sosyal Medya İçeriği", desc: "Before/after fotoğraflarını Instagram ve Facebook'ta paylaşmak için otomatik kolaj oluşturun." },
    ],
    stats: [
      { value: "2x", label: "Müşteri kazanımı" },
      { value: "Sınırsız", label: "Fotoğraf depolama" },
      { value: "Otomatik", label: "Kolaj oluşturma" },
    ],
    faq: [
      { q: "Fotoğraflar ne kadar süre saklanır?", a: "Tüm fotoğraflar sınırsız süre saklanır." },
      { q: "Müşteriye fotoğraf gönderebilir miyim?", a: "Evet, bakım sonrası fotoğrafları tek tıkla müşteriye iletebilirsiniz." },
      { q: "Fotoğrafları sosyal medyada paylaşabilir miyim?", a: "Evet, optimum boyutlarda hazır görsel oluşturabilirsiniz." },
    ],
  },
  "kuafor-takvimi": {
    title: "Kuaför Takvimi", icon: faCalendarDays,
    desc: "Kuaför bazlı randevu yönetimi ile takvimi profesyonelce planlayın.",
    benefits: ["Kuaför bazlı takvim", "Günlük/haftalık görünüm", "Çakışma önleme", "Kapasite yönetimi", "Sürükle-bırak randevu", "Boş slot gösterimi"],
    details: "Her kuaför için ayrı takvim görünümü. Randevuları sürükle-bırak ile düzenleyin, çakışmaları otomatik önleyin ve boş slotları müşterilere gösterin. Günlük ve haftalık görünüm ile ekibinizin yoğunluğunu anlık takip edin.",
    useCases: [
      { title: "Ekip Yönetimi", desc: "Her kuaför için ayrı takvim görünümü. Kim ne zaman müsait, hangi randevular atanmış; tek ekranda görün." },
      { title: "Akıllı Randevu", desc: "Hizmet süresine göre otomatik slot belirleme. 30 dakikalık bakım için 1 saatlik slot açılmaz." },
      { title: "Müşteri Self-Servis", desc: "Müşteri online boş slotları görsün ve kendi randevusunu alsın. Telefon trafiği azalır." },
    ],
    stats: [
      { value: "Sıfır", label: "Çakışan randevu" },
      { value: "%50", label: "Telefon azalması" },
      { value: "Anlık", label: "Doluluk takibi" },
    ],
    faq: [
      { q: "Birden fazla kuaför aynı anda kullanabilir mi?", a: "Evet, her kuaförün kendi takvimi ve randevuları vardır." },
      { q: "Müşteriler online randevu alabilir mi?", a: "Evet, boş slotları görüp web üzerinden randevu alabilirler." },
      { q: "Çakışma olursa ne olur?", a: "Sistem otomatik olarak çakışan zamanları engeller, uyarı verir." },
    ],
  },
  "mobil-kuafor": {
    title: "Mobil Kuaför Rota", icon: faRoute,
    desc: "Gezici kuaför hizmeti için rota planlaması ve müşteri konum yönetimi.",
    benefits: ["Harita üzerinde planlama", "Rota optimizasyonu", "Müşteri adresleri", "Günlük rota planı", "Navigasyon entegrasyonu", "Yakıt tasarrufu hesaplama"],
    details: "Gezici pet kuaförü olarak müşterilerinizin adreslerini harita üzerinde görün. Günlük rotanızı optimize edin, en verimli güzergahı belirleyin. Navigasyon entegrasyonu ile randevudan randevuya sorunsuz geçiş.",
    useCases: [
      { title: "Günlük Planlama", desc: "Günlük randevularınızı harita üzerinde görün. En kısa güzergahı otomatik hesaplayın." },
      { title: "Bölge Bazlı Çalışma", desc: "Belirli günlerde belirli bölgelere randevu alın. Gereksiz yol yapmayın." },
      { title: "Navigasyon", desc: "Bir randevudan diğerine tek tıkla navigasyon başlatın. Google Maps / Apple Maps entegrasyonu." },
    ],
    stats: [
      { value: "%40", label: "Yakıt tasarrufu" },
      { value: "Akıllı", label: "Rota planlama" },
      { value: "1 tık", label: "Navigasyon" },
    ],
    faq: [
      { q: "Google Maps ile çalışıyor mu?", a: "Evet, Google Maps ve Apple Maps ile entegre navigasyon desteği vardır." },
      { q: "Günlük kaç randevu planlanabilir?", a: "Sınırsız sayıda randevu planlanabilir, sistem en verimli rotayı hesaplar." },
      { q: "Bölge kısıtlaması eklenebilir mi?", a: "Evet, hangi günlerde hangi bölgelere hizmet verildiğini belirleyebilirsiniz." },
    ],
  },
  "randevu-yonetimi": {
    title: "Online Randevu", icon: faSprayCanSparkles,
    desc: "Müşterileriniz online randevu alsın, hatırlatmalarla gelmeme oranını düşürün.",
    benefits: ["Online randevu formu", "SMS/e-posta hatırlatma", "Randevu teyidi", "İptal yönetimi", "Müşteri self-servis", "Bekleme listesi"],
    details: "Müşterileriniz web siteniz üzerinden 7/24 randevu alabilsin. Randevu öncesinde otomatik hatırlatma gönderin, gelmeme oranını %60'a kadar düşürün. Bekleme listesi ile iptal durumunda otomatik dolma.",
    useCases: [
      { title: "7/24 Randevu", desc: "Mesai dışında bile müşterileriniz randevu alabilir. Sabah uyandığınızda takvminiz dolu." },
      { title: "Otomatik Hatırlatma", desc: "Randevudan 24 saat ve 2 saat önce otomatik hatırlatma gönderin." },
      { title: "Bekleme Listesi", desc: "İptal olan randevuyu bekleme listesindeki ilk kişiye otomatik teklif edin." },
    ],
    stats: [
      { value: "7/24", label: "Online erişim" },
      { value: "%60", label: "Gelmeme azalması" },
      { value: "Otomatik", label: "Bekleme listesi" },
    ],
    faq: [
      { q: "Müşteriler kendileri randevu iptal edebilir mi?", a: "Evet, belirlediğiniz zaman aralığında iptal ve değişiklik yapabilirler." },
      { q: "Hatırlatmalar nasıl gönderilir?", a: "SMS, e-posta veya WhatsApp üzerinden otomatik bildirim gönderilir." },
      { q: "Bekleme listesi nasıl çalışır?", a: "İptal olduğunda sıradaki müşteriye otomatik teklif gider." },
    ],
  },
  "stok-yonetimi": {
    title: "Ürün & Stok Takibi", icon: faSprayCanSparkles,
    desc: "Bakım ürünleri stok takibi, barkodlu satış ve tüketim analizi.",
    benefits: ["Ürün stok takibi", "Barkodlu satış", "Tüketim analizi", "Düşük stok uyarısı", "Tedarikçi yönetimi", "Karlılık raporu"],
    details: "Şampuan, losyon, tırnak bakım ürünleri ve tüm malzemelerinizin stokunu takip edin. Barkod okuyucu ile hızlı satış, tüketim analizi ile hangi ürünün ne kadar kullanıldığını görün. POS kasa ile satışları kaydedin, stok otomatik düşsün.",
    useCases: [
      { title: "Hızlı Kasa", desc: "Barkod okutarak anında satış. Müşteri beklemez, stok otomatik güncellenir." },
      { title: "Tüketim Analizi", desc: "Hangi şampuan ne kadar kullanıldı? Her bakımda harcanan malzemeyi görün." },
      { title: "Sipariş Önerisi", desc: "Düşük stoktaki ürünler için otomatik sipariş önerisi alın." },
    ],
    stats: [
      { value: "Anlık", label: "Stok bilgisi" },
      { value: "Otomatik", label: "Stok düşüm" },
      { value: "%20", label: "Maliyet tasarrufu" },
    ],
    faq: [
      { q: "Barkod okuyucu gerekli mi?", a: "Hayır, ürünleri adıyla da arayabilirsiniz. Ama barkod okuyucu ile çok daha hızlı." },
      { q: "Satış ve stok entegre mi?", a: "Evet, her satışta stok otomatik düşer." },
      { q: "Tüketim raporu alabilir miyim?", a: "Evet, ürün bazlı tüketim ve maliyet raporu oluşturabilirsiniz." },
    ],
  },
  "raporlama": {
    title: "Raporlama & Analitik", icon: faChartLine,
    desc: "Gelir, müşteri ve hizmet istatistikleri ile işletmenizin performansını izleyin.",
    benefits: ["Gelir raporları", "Müşteri analizi", "Hizmet istatistikleri", "Kuaför performansı", "Dönemsel karşılaştırma", "Excel dışa aktarma"],
    details: "Günlük, haftalık ve aylık gelir raporları, en popüler hizmetler, en değerli müşteriler ve kuaför bazlı performans metrikleri ile işletmenizi veri odaklı yönetin. Excel dışa aktarma ile muhasebeciye hazır veri.",
    useCases: [
      { title: "Günlük Kasa Raporu", desc: "Gün sonunda nakit, kart ve havale bazlı toplam geliri tek ekranda görün." },
      { title: "En Popüler Hizmetler", desc: "Hangi hizmetler en çok talep görüyor? Buna göre fiyatlandırma stratejisi oluşturun." },
      { title: "Kuaför Performansı", desc: "Her kuaförün kaç bakım yaptığını, ne kadar gelir getirdiğini karşılaştırın." },
    ],
    stats: [
      { value: "Anlık", label: "Dashboard" },
      { value: "Excel", label: "Dışa aktarma" },
      { value: "Detaylı", label: "Performans raporu" },
    ],
    faq: [
      { q: "Raporları indirebilir miyim?", a: "Evet, tüm raporlar Excel ve CSV formatında indirilebilir." },
      { q: "Dönemsel karşılaştırma yapılabiliyor mu?", a: "Evet, geçen ay / geçen yıl ile karşılaştırmalı raporlar oluşturabilirsiniz." },
      { q: "Kuaför bazlı rapor var mı?", a: "Evet, her kuaförün bakım sayısı, gelir ve müşteri memnuniyeti raporlanır." },
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
    title: `${f.title} | Pet Kuaför Yazılımı | Klinik Yönetim`,
    description: f.desc,
  };
}

export default async function PetKuaforFeatureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = features[slug];
  if (!feature) notFound();

  const otherFeatures = allFeatures.filter((f) => f.slug !== slug);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#F5A623] to-orange-700 text-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <Link href="/pet-kuafor" className="text-white/60 hover:text-white text-sm flex items-center gap-2 mb-6 transition">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Tüm Pet Kuaför Özellikleri
            </Link>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <FontAwesomeIcon icon={feature.icon} className="text-3xl md:text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">{feature.title}</h1>
                <p className="text-white/70 mt-3 text-lg max-w-2xl">{feature.desc}</p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Link href="/kayit" className="bg-white text-[#F5A623] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2">
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
                  <div className="text-3xl md:text-4xl font-bold text-[#F5A623]">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Details + Benefits */}
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
                    <FontAwesomeIcon icon={faCircleCheck} className="text-[#F5A623] mt-1 flex-shrink-0" />
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
                  <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center mb-4">
                    <span className="text-[#F5A623] font-bold">{i + 1}</span>
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
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-[#F5A623] text-sm mt-1 flex-shrink-0" />
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
            <h2 className="text-3xl font-bold mb-4">İşletmenizi büyütün</h2>
            <p className="text-white/60 mb-8">14 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
            <Link href="/kayit" className="bg-[#F5A623] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d9921f] transition inline-flex items-center gap-2">
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
                  href={`/pet-kuafor/ozellikler/${f.slug}`}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:text-[#F5A623] hover:border-[#F5A623]/30 transition"
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
