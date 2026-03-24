import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScissors, faClockRotateLeft, faImages, faCalendarDays,
  faRoute, faChartLine, faArrowRight, faSprayCanSparkles,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Pet Kuaför Yazılımı | Klinik Yönetim",
  description: "Pet kuaförleri için profesyonel yönetim yazılımı. Bakım takibi, fotoğraf galeri, kuaför takvimi, mobil rota.",
};

const features = [
  { slug: "bakim-hizmetleri", icon: faScissors, title: "Bakım Hizmetleri", desc: "Yıkama, tıraş, tırnak kesimi ve daha fazlası. Hizmet menünüzü özelleştirin, fiyatları belirleyin." },
  { slug: "bakim-gecmisi", icon: faClockRotateLeft, title: "Bakım Geçmişi", desc: "Her pet için detaylı bakım geçmişi, tercihler, hassasiyet notları ve önceki uygulamalar." },
  { slug: "galeri", icon: faImages, title: "Öncesi/Sonrası Fotoğraf", desc: "Bakım öncesi ve sonrası fotoğraf arşivi. Portfolyo oluşturma ve müşteriye paylaşım." },
  { slug: "kuafor-takvimi", icon: faCalendarDays, title: "Kuaför Takvimi", desc: "Kuaför bazlı randevu yönetimi, takvim görünümü, çakışma önleme ve kapasite takibi." },
  { slug: "mobil-kuafor", icon: faRoute, title: "Mobil Kuaför Rota", desc: "Gezici kuaför rota planlaması, harita üzerinde müşteri konumları ve optimum güzergah." },
  { slug: "randevu-yonetimi", icon: faSprayCanSparkles, title: "Online Randevu", desc: "Müşterileriniz online randevu alsın, otomatik SMS/e-posta hatırlatmaları ile gelmeme oranını düşürün." },
  { slug: "stok-yonetimi", icon: faSprayCanSparkles, title: "Ürün & Stok Takibi", desc: "Şampuan, losyon ve bakım ürünleri stok takibi, barkodlu satış ve tüketim analizi." },
  { slug: "raporlama", icon: faChartLine, title: "Raporlama & Analitik", desc: "Gelir raporları, müşteri analizi, hizmet istatistikleri ve performans metrikleri." },
];

export default function PetKuaforPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#F5A623] to-orange-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">✂️ Pet Kuaför Yazılımı</h1>
            <p className="text-xl text-white/80">Pet bakım işletmenizi profesyonelce yönetin</p>
            <Link href="/kayit" className="inline-block mt-6 bg-white text-[#F5A623] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Ücretsiz Deneyin
            </Link>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-4">Tüm Özellikler</h2>
            <p className="text-center text-gray-500 mb-12">Pet kuaförünüz için tasarlanmış profesyonel araçlar</p>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((f) => (
                <Link
                  key={f.slug}
                  href={`/pet-kuafor/ozellikler/${f.slug}`}
                  className="group bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg hover:border-[#F5A623]/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F5A623] transition">
                      <FontAwesomeIcon icon={f.icon} className="text-[#F5A623] group-hover:text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1a1a2e] mb-1 flex items-center gap-2">
                        {f.title}
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs text-gray-300 group-hover:text-[#F5A623] transition" />
                      </h3>
                      <p className="text-gray-600 text-sm">{f.desc}</p>
                    </div>
                  </div>
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
