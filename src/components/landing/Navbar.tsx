"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faBars, faXmark, faChevronDown,
  faStethoscope, faSyringe, faPrescription, faFlask, faUserDoctor,
  faPills, faCalendarDays, faChartLine,
  faScissors, faClockRotateLeft, faImages, faRoute, faSprayCanSparkles,
  faShieldHalved, faArrowRight, faUsers, faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const vetFeatures = [
  { href: "/veteriner/ozellikler/hasta-dosyasi", label: "Hasta Dosyası (EMR)", icon: faStethoscope, desc: "Dijital hasta kayıtları ve muayene" },
  { href: "/veteriner/ozellikler/asi-takibi", label: "Aşı Takibi", icon: faSyringe, desc: "Otomatik aşı takvimi ve hatırlatma" },
  { href: "/veteriner/ozellikler/recete-yonetimi", label: "Reçete Yönetimi", icon: faPrescription, desc: "Dijital reçete ve dozaj hesaplama" },
  { href: "/veteriner/ozellikler/laboratuvar", label: "Laboratuvar", icon: faFlask, desc: "Test sonuçları ve referans değerler" },
  { href: "/veteriner/ozellikler/ameliyat-kayitlari", label: "Ameliyat Kayıtları", icon: faUserDoctor, desc: "Operasyon ve anestezi takibi" },
  { href: "/veteriner/ozellikler/ilac-stok", label: "İlaç & Stok", icon: faPills, desc: "Stok seviyesi ve SKT takibi" },
];

const petFeatures = [
  { href: "/pet-kuafor/ozellikler/bakim-hizmetleri", label: "Bakım Hizmetleri", icon: faScissors, desc: "Hizmet menüsü ve fiyatlandırma" },
  { href: "/pet-kuafor/ozellikler/bakim-gecmisi", label: "Bakım Geçmişi", icon: faClockRotateLeft, desc: "Pet bazlı detaylı kayıtlar" },
  { href: "/pet-kuafor/ozellikler/galeri", label: "Öncesi / Sonrası", icon: faImages, desc: "Fotoğraf portfolyosu ve arşiv" },
  { href: "/pet-kuafor/ozellikler/kuafor-takvimi", label: "Kuaför Takvimi", icon: faCalendarDays, desc: "Randevu ve kapasite yönetimi" },
  { href: "/pet-kuafor/ozellikler/mobil-kuafor", label: "Mobil Kuaför Rota", icon: faRoute, desc: "Rota optimizasyonu ve planlama" },
  { href: "/pet-kuafor/ozellikler/stok-yonetimi", label: "Ürün & Stok", icon: faSprayCanSparkles, desc: "Barkodlu satış ve stok takibi" },
];

const commonFeatures = [
  { href: "/veteriner/ozellikler/randevu-yonetimi", label: "Randevu Yönetimi", icon: faCalendarDays, desc: "Online randevu alma ve hatırlatma" },
  { href: "/veteriner/ozellikler/muhasebe", label: "Gelir/Gider & Raporlama", icon: faChartLine, desc: "Finansal takip ve analitik" },
  { href: "#musteri-paneli", label: "Müşteri Paneli", icon: faUsers, desc: "Müşterilerinize özel takip paneli" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 250);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <FontAwesomeIcon icon={faPaw} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-heading)] gradient-text">
              Klinik Yönetim
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Özellikler — Mega Menu */}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] transition-colors rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                Özellikler
                <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu — Zapier Style */}
              {megaOpen && (
                <div
                  className="fixed left-0 right-0 top-[80px]"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  {/* Top accent bar */}
                  <div className="h-[3px] bg-gradient-to-r from-[#2D9F6F] via-[#34d399] to-[#F5A623]" />
                  <div className="bg-white border-b border-gray-200 shadow-xl">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                      <div className="grid grid-cols-12 gap-8">
                        {/* Veteriner Column */}
                        <div className="col-span-4">
                          <Link href="/veteriner" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#2D9F6F] transition mb-4 block">
                            Veteriner Klinik Yazılımı
                          </Link>
                          <div className="space-y-1">
                            {vetFeatures.map((f) => (
                              <Link
                                key={f.href}
                                href={f.href}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 group transition-colors"
                                onClick={() => setMegaOpen(false)}
                              >
                                <FontAwesomeIcon icon={f.icon} className="text-[#2D9F6F] text-sm mt-0.5 w-4" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800 group-hover:text-[#2D9F6F] transition-colors">{f.label}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Pet Kuaför Column */}
                        <div className="col-span-4">
                          <Link href="/pet-kuafor" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#F5A623] transition mb-4 block">
                            Pet Kuaför Yazılımı
                          </Link>
                          <div className="space-y-1">
                            {petFeatures.map((f) => (
                              <Link
                                key={f.href}
                                href={f.href}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 group transition-colors"
                                onClick={() => setMegaOpen(false)}
                              >
                                <FontAwesomeIcon icon={f.icon} className="text-[#F5A623] text-sm mt-0.5 w-4" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800 group-hover:text-[#F5A623] transition-colors">{f.label}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Right Column — Ortak + CTA */}
                        <div className="col-span-4 bg-gray-50 rounded-xl p-5">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Ortak Özellikler
                          </div>
                          <div className="space-y-1">
                            {commonFeatures.map((f) => (
                              <Link
                                key={f.href}
                                href={f.href}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white group transition-colors"
                                onClick={() => setMegaOpen(false)}
                              >
                                <FontAwesomeIcon icon={f.icon} className="text-blue-500 text-sm mt-0.5 w-4" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{f.label}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <Link
                              href="/veteriner"
                              className="flex items-center gap-2 text-sm font-medium text-[#2D9F6F] hover:underline"
                              onClick={() => setMegaOpen(false)}
                            >
                              Tüm özellikleri keşfet <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Banner — Ücretsiz Web Sitesi */}
                      <Link
                        href="/fiyatlandirma"
                        className="mt-4 mx-2 block rounded-xl overflow-hidden hover:opacity-90 transition-opacity relative group"
                        onClick={() => setMegaOpen(false)}
                      >
                        <Image src="/images/mega-banner-web.jpeg" alt="Ücretsiz Web Sitesi Tasarımı" width={960} height={100} className="w-full h-auto rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent group-hover:from-purple-600/10 transition rounded-xl" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/fiyatlandirma" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] transition-colors rounded-lg hover:bg-gray-50">
              Fiyatlandırma
            </Link>
            <Link href="/blog" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] transition-colors rounded-lg hover:bg-gray-50">
              Blog
            </Link>
            <Link href="/hakkimizda" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] transition-colors rounded-lg hover:bg-gray-50">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] transition-colors rounded-lg hover:bg-gray-50">
              İletişim
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/giris">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#2D9F6F]">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/kayit">
              <Button size="sm" className="gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="text-gray-700 text-lg" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-200 px-4 py-4 space-y-1 max-h-[75vh] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Veteriner</div>
          {vetFeatures.map((f) => (
            <Link key={f.href} href={f.href} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-[#2D9F6F] hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={f.icon} className="mr-2 w-4 text-gray-400" />{f.label}
            </Link>
          ))}
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-3">Pet Kuaför</div>
          {petFeatures.map((f) => (
            <Link key={f.href} href={f.href} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-[#F5A623] hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <FontAwesomeIcon icon={f.icon} className="mr-2 w-4 text-gray-400" />{f.label}
            </Link>
          ))}
          <div className="border-t my-3" />
          {[
            { href: "/fiyatlandirma", label: "Fiyatlandırma" },
            { href: "/blog", label: "Blog" },
            { href: "/hakkimizda", label: "Hakkımızda" },
            { href: "/iletisim", label: "İletişim" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#2D9F6F] hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2 border-t mt-2">
            <Link href="/giris" className="block"><Button variant="outline" className="w-full" size="sm">Giriş Yap</Button></Link>
            <Link href="/kayit" className="block"><Button className="w-full gradient-primary text-white border-0" size="sm">Ücretsiz Başla</Button></Link>
          </div>
        </div>
      </div>
    </header>
  );
}
