import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope, faSyringe, faPrescription, faFlask, faUserDoctor,
  faPills, faCalendarDays, faChartLine, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Veteriner Klinik Yazılımı | Klinik Yönetim",
  description: "Veteriner klinikleri için profesyonel yönetim yazılımı. Hasta dosyası, aşı takibi, reçete, laboratuvar, stok yönetimi.",
};

const features = [
  { slug: "hasta-dosyasi", icon: faStethoscope, title: "Hasta Dosyası (EMR)", desc: "Dijital hasta dosyası, muayene notları, SOAP formatında kayıt, tedavi geçmişi ve detaylı sağlık takibi." },
  { slug: "asi-takibi", icon: faSyringe, title: "Aşı Takibi", desc: "Aşı takvimi yönetimi, otomatik hatırlatmalar, aşı geçmişi ve coming-due aşı bildirimleri." },
  { slug: "recete-yonetimi", icon: faPrescription, title: "Reçete Yönetimi", desc: "Dijital reçete oluşturma, ilaç veritabanı, dozaj hesaplama ve yazdırılabilir reçete çıktısı." },
  { slug: "laboratuvar", icon: faFlask, title: "Laboratuvar Sonuçları", desc: "Test sonuçları kayıt ve takibi, referans değer karşılaştırma, sonuç geçmişi." },
  { slug: "ameliyat-kayitlari", icon: faUserDoctor, title: "Ameliyat Kayıtları", desc: "Operasyon planı, anestezi protokolü, ameliyat notları ve post-operatif takip." },
  { slug: "ilac-stok", icon: faPills, title: "İlaç & Stok Yönetimi", desc: "İlaç ve malzeme stok takibi, son kullanma tarihi uyarıları, minimum stok bildirimleri." },
  { slug: "randevu-yonetimi", icon: faCalendarDays, title: "Randevu Yönetimi", desc: "Online randevu alma, takvim görünümü, otomatik hatırlatmalar ve randevu teyidi." },
  { slug: "muhasebe", icon: faChartLine, title: "Gelir/Gider & Raporlama", desc: "Finansal takip, fatura oluşturma, gelir-gider raporları ve analitik dashboard." },
];

export default function VeterinerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🩺 Veteriner Klinik Yazılımı</h1>
            <p className="text-xl text-white/80">Kliniğinizi profesyonelce yönetin — hasta dosyasından stok takibine</p>
            <Link href="/kayit" className="inline-block mt-6 bg-white text-[#2D9F6F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Ücretsiz Deneyin
            </Link>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1a1a2e] mb-4">Tüm Özellikler</h2>
            <p className="text-center text-gray-500 mb-12">Veteriner kliniğiniz için ihtiyacınız olan her şey tek platformda</p>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((f) => (
                <Link
                  key={f.slug}
                  href={`/veteriner/ozellikler/${f.slug}`}
                  className="group bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg hover:border-[#2D9F6F]/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2D9F6F] group-hover:text-white transition">
                      <FontAwesomeIcon icon={f.icon} className="text-[#2D9F6F] group-hover:text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1a1a2e] mb-1 flex items-center gap-2">
                        {f.title}
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs text-gray-300 group-hover:text-[#2D9F6F] transition" />
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
