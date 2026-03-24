import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faHeart, faRocket, faShieldHalved, faLightbulb, faHandshake } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Hakkımızda | Klinik Yönetim",
  description: "Veteriner klinikleri ve pet kuaförleri için modern, güvenli ve kullanıcı dostu yönetim sistemi.",
};

export default function HakkimizdaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-xl text-white/80">Hayvan dostlarımıza daha iyi hizmet vermek için çalışıyoruz</p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Misyonumuz</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Klinik Yönetim, veteriner klinikleri ve pet kuaförleri için geliştirilen modern bir
                  yönetim platformudur. Amacımız, hayvan sağlığı ve bakım sektöründe dijital dönüşümü
                  hızlandırmak ve işletmelerin daha verimli çalışmasını sağlamaktır.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Tek bir platform üzerinden müşteri yönetimi, randevu takibi, stok kontrolü,
                  finansal raporlama ve daha fazlasını sunan kapsamlı bir çözüm geliştiriyoruz.
                </p>
              </div>
              <div className="text-8xl text-center">🐾</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-12">Değerlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: faHeart, title: "Hayvan Sevgisi", desc: "Her geliştirdiğimiz özellik, hayvanların daha iyi bakım almasını hedefler." },
                { icon: faShieldHalved, title: "Güvenlik", desc: "Verileriniz en üst düzey güvenlik standartlarıyla korunur. KVKK uyumlu." },
                { icon: faLightbulb, title: "İnovasyon", desc: "Sürekli gelişen teknoloji ile sektörün ihtiyaçlarına en modern çözümleri sunarız." },
                { icon: faRocket, title: "Hız & Verimlilik", desc: "İşletmenizin zamandan tasarruf etmesini sağlayan hızlı ve akıcı arayüz." },
                { icon: faHandshake, title: "Güvenilirlik", desc: "%99.9 uptime garantisi ile kesintisiz hizmet sunuyoruz." },
                { icon: faUsers, title: "Müşteri Odaklılık", desc: "Kullanıcı geri bildirimleri ile sürekli gelişen bir platform." },
              ].map((v, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={v.icon} className="text-[#2D9F6F] text-xl" />
                  </div>
                  <h3 className="font-bold text-[#1a1a2e] mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: "500+", label: "İşletme" },
                { num: "50K+", label: "Kayıtlı Pet" },
                { num: "99.9%", label: "Uptime" },
                { num: "7/24", label: "Destek" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-[#2D9F6F]">{s.num}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
