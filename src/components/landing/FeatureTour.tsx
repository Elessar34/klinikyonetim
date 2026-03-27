"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope, faScissors, faBoxesStacked, faUsers,
  faArrowRight, faCircleCheck, faPalette,
} from "@fortawesome/free-solid-svg-icons";

const sections = [
  {
    id: "veteriner-ozel",
    badge: "Veteriner Klinik",
    badgeColor: "bg-emerald-100 text-emerald-700",
    accentColor: "#2D9F6F",
    icon: faStethoscope,
    title: "Veteriner Kliniğinizi Dijitalleştirin",
    description: "Hasta dosyaları, aşı takvimleri, reçete yönetimi ve laboratuvar sonuçları hepsi tek panelde. SOAP formatında muayene kaydı, ilaç etkileşim uyarıları ve anestezi takibi ile profesyonel klinik yönetimi.",
    features: [
      "Dijital hasta dosyası ve muayene kaydı",
      "Aşı takvimi ve otomatik hatırlatma",
      "Reçete oluşturma ve dozaj hesaplama",
      "Laboratuvar sonuçları ve trend takibi",
    ],
    ctaText: "Veteriner Özelliklerini Keşfet",
    ctaHref: "/veteriner",
    imagePosition: "right" as const,
    // Görsel alanı - mockup için placeholder
    mockupSrc: "/images/mockup-veteriner.png",
    mockupAlt: "Veteriner Klinik Dashboard",
  },
  {
    id: "pet-kuafor-ozel",
    badge: "Pet Kuaför",
    badgeColor: "bg-orange-100 text-orange-700",
    accentColor: "#F5A623",
    icon: faScissors,
    title: "Pet Kuaförünüzü Dijital Yönetin",
    description: "Bakım hizmetleri, kuaför takvimi, öncesi-sonrası fotoğraf arşivi ve müşteri tercihleri; tüm pet kuaför operasyonlarınız profesyonel bir sistemde. Mobil kuaför rotası ile gezici hizmeti bile yönetin.",
    features: [
      "Hizmet menüsü ve ırk bazlı fiyatlandırma",
      "Kuaför takvimi ve kapasite yönetimi",
      "Before/after fotoğraf arşivi",
      "Bakım periyodu ve otomatik bildirim",
    ],
    ctaText: "Pet Kuaför Özelliklerini Keşfet",
    ctaHref: "/pet-kuafor",
    imagePosition: "left" as const,
    mockupSrc: "/images/mockup-pet-kuafor.png",
    mockupAlt: "Pet Kuaför Dashboard",
  },
  {
    id: "stok-pos",
    badge: "Stok & POS",
    badgeColor: "bg-blue-100 text-blue-700",
    accentColor: "#3B82F6",
    icon: faBoxesStacked,
    title: "Barkodlu Satış ve Stok Yönetimi",
    description: "USB barkod okuyucu ile ürünleri anında okutup satış yapın. Kasadan satılan her ürün otomatik stok düşer, gelir kaydı oluşur. Düşük stok ve son kullanma tarihi uyarıları ile hiçbir şeyi kaçırmayın.",
    features: [
      "Barkod okuyucu ile hızlı satış",
      "Nakit, kart, havale ödeme seçenekleri",
      "Otomatik stok düşüm ve gelir kaydı",
      "SKT uyarıları ve düşük stok bildirimi",
    ],
    ctaText: "Stok Yönetimini İncele",
    ctaHref: "/veteriner/ozellikler/ilac-stok",
    imagePosition: "right" as const,
    mockupSrc: "/images/mockup-pos.png",
    mockupAlt: "POS Kasa ve Stok Yönetimi",
  },
  {
    id: "musteri-paneli",
    badge: "Müşteri Paneli",
    badgeColor: "bg-sky-100 text-sky-700",
    accentColor: "#0EA5E9",
    icon: faUsers,
    title: "Müşterilerinize Özel Panel",
    description: "Her müşterinize kendi giriş yapabileceği bir panel sunun. Petlerinin sağlık geçmişini görsünler, aşı takvimini takip etsinler, online randevu alsınlar. Müşteri sadakati artıran premium bir hizmet.",
    features: [
      "Pet sağlık geçmişi ve aşı takvimi",
      "Online randevu alma ve takip",
      "Fatura ve ödeme geçmişi",
      "Veteriner ile mesajlaşma",
    ],
    ctaText: "Detaylı Bilgi",
    ctaHref: "/iletisim",
    imagePosition: "left" as const,
    mockupSrc: "/images/mockup-musteri-paneli.png",
    mockupAlt: "Müşteri Paneli",
  },
];

export default function FeatureTour() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-4">
            Platform Özellikleri
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Tüm ihtiyaçlarınız{" "}
            <span className="gradient-text">tek platformda</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veteriner kliniğinden pet kuaföre, stok yönetiminden müşteri paneline
            işletmenizi büyütecek her araç elinizin altında.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-24">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${section.imagePosition === "left" ? "lg:direction-rtl" : ""
                }`}
            >
              {/* Content Side */}
              <div className={section.imagePosition === "left" ? "lg:order-2" : "lg:order-1"}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${section.badgeColor}`}
                  >
                    <FontAwesomeIcon icon={section.icon} className="text-[10px]" />
                    {section.badge}
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {section.title}
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {section.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {section.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: section.accentColor }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={section.ctaHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: section.accentColor }}
                >
                  {section.ctaText}
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </Link>
              </div>

              {/* Image/Mockup Side */}
              <div className={section.imagePosition === "left" ? "lg:order-1" : "lg:order-2"}>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-sm border border-gray-200/60 min-h-[320px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
                  {/* Mockup Image — görseli değiştirebilirsiniz */}
                  <Image
                    src={section.mockupSrc}
                    alt={section.mockupAlt}
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg object-cover w-full h-auto"
                    onError={(e) => {
                      // Placeholder göster if image doesn't exist
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement("div");
                        placeholder.className = "flex flex-col items-center justify-center text-gray-300 gap-3 py-12";
                        placeholder.innerHTML = `
                          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span class="text-sm font-medium">Mockup Alanı</span>
                          <span class="text-xs">${section.mockupAlt}</span>
                        `;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                  {/* Accent decoration */}
                  <div
                    className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: section.accentColor }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ücretsiz Web Sitesi Banner */}
        <div className="mt-24">
          <Link
            href="/fiyatlandirma"
            className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D9F6F] to-emerald-600 p-8 sm:p-12 text-white hover:opacity-95 transition group"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <FontAwesomeIcon icon={faPalette} className="text-3xl" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                  Ücretsiz Web Sitesi Tasarımı
                </h3>
                <p className="text-white/70 max-w-xl">
                  Yıllık paket alımlarınızda kliniğinize veya pet kuaför işletmenize özel,
                  profesyonel ve mobil uyumlu web sitesi tasarımı hediye.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white text-[#2D9F6F] px-6 py-3 rounded-full font-semibold text-sm group-hover:scale-105 transition flex-shrink-0">
                Paketleri İncele
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
