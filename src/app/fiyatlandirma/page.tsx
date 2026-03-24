import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "Fiyatlandırma | Klinik Yönetim",
  description: "Veteriner ve pet kuaför yönetim yazılımı fiyatları. 14 gün ücretsiz deneme, kredi kartı gerektirmez.",
  openGraph: {
    title: "Fiyatlandırma | Klinik Yönetim",
    description: "İşletmenize uygun paketi seçin. 14 gün ücretsiz deneme.",
  },
};

export default function FiyatlandirmaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fiyatlandırma</h1>
            <p className="text-xl text-white/80">İşletmenize uygun paketi seçin — 14 gün ücretsiz deneme</p>
          </div>
        </section>
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
