"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faBars, faXmark, faChevronDown,
  faStethoscope, faSyringe, faPrescription, faFlask, faUserDoctor,
  faPills, faCalendarDays, faChartLine,
  faScissors, faClockRotateLeft, faImages, faRoute, faSprayCanSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const vetFeatures = [
  { href: "/veteriner/ozellikler/hasta-dosyasi", label: "Hasta Dosyası (EMR)", icon: faStethoscope, desc: "Dijital hasta kayıtları" },
  { href: "/veteriner/ozellikler/asi-takibi", label: "Aşı Takibi", icon: faSyringe, desc: "Otomatik aşı takvimi" },
  { href: "/veteriner/ozellikler/recete-yonetimi", label: "Reçete Yönetimi", icon: faPrescription, desc: "Dijital reçete sistemi" },
  { href: "/veteriner/ozellikler/laboratuvar", label: "Laboratuvar", icon: faFlask, desc: "Test sonuçları takibi" },
  { href: "/veteriner/ozellikler/ameliyat-kayitlari", label: "Ameliyat Kayıtları", icon: faUserDoctor, desc: "Operasyon & anestezi" },
  { href: "/veteriner/ozellikler/ilac-stok", label: "İlaç & Stok", icon: faPills, desc: "Stok ve SKT takibi" },
];

const petFeatures = [
  { href: "/pet-kuafor/ozellikler/bakim-hizmetleri", label: "Bakım Hizmetleri", icon: faScissors, desc: "Hizmet menüsü yönetimi" },
  { href: "/pet-kuafor/ozellikler/bakim-gecmisi", label: "Bakım Geçmişi", icon: faClockRotateLeft, desc: "Pet bazlı kayıtlar" },
  { href: "/pet-kuafor/ozellikler/galeri", label: "Öncesi/Sonrası", icon: faImages, desc: "Fotoğraf portfolyosu" },
  { href: "/pet-kuafor/ozellikler/kuafor-takvimi", label: "Kuaför Takvimi", icon: faCalendarDays, desc: "Randevu & kapasite" },
  { href: "/pet-kuafor/ozellikler/mobil-kuafor", label: "Mobil Kuaför Rota", icon: faRoute, desc: "Rota optimizasyonu" },
  { href: "/pet-kuafor/ozellikler/stok-yonetimi", label: "Ürün & Stok", icon: faSprayCanSparkles, desc: "Barkodlu satış & stok" },
];

const commonFeatures = [
  { href: "/veteriner/ozellikler/randevu-yonetimi", label: "Randevu Yönetimi", icon: faCalendarDays, desc: "Online randevu alma" },
  { href: "/veteriner/ozellikler/muhasebe", label: "Gelir/Gider & Raporlama", icon: faChartLine, desc: "Finansal analiz" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

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
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-sm border-b border-border"
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
            {/* Özellikler — Mega Menu Trigger */}
            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-kp-green transition-colors rounded-lg hover:bg-kp-green/5 flex items-center gap-1">
                Özellikler
                <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-[720px] transition-all duration-200 ${
                  megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 overflow-hidden">
                  {/* Decorative top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D9F6F] via-[#F5A623] to-[#2D9F6F]" />

                  <div className="grid grid-cols-2 gap-6">
                    {/* Veteriner Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-[#2D9F6F]/10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faStethoscope} className="text-[#2D9F6F] text-xs" />
                        </div>
                        <Link href="/veteriner" className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#2D9F6F] transition">
                          Veteriner Klinik
                        </Link>
                      </div>
                      <div className="space-y-0.5">
                        {vetFeatures.map((f) => (
                          <Link
                            key={f.href}
                            href={f.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group transition"
                            onClick={() => setMegaOpen(false)}
                          >
                            <FontAwesomeIcon icon={f.icon} className="text-[#2D9F6F]/60 group-hover:text-[#2D9F6F] text-sm w-4" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 group-hover:text-[#2D9F6F]">{f.label}</div>
                              <div className="text-xs text-gray-400">{f.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Pet Kuaför Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-[#F5A623]/10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faScissors} className="text-[#F5A623] text-xs" />
                        </div>
                        <Link href="/pet-kuafor" className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#F5A623] transition">
                          Pet Kuaför
                        </Link>
                      </div>
                      <div className="space-y-0.5">
                        {petFeatures.map((f) => (
                          <Link
                            key={f.href}
                            href={f.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group transition"
                            onClick={() => setMegaOpen(false)}
                          >
                            <FontAwesomeIcon icon={f.icon} className="text-[#F5A623]/60 group-hover:text-[#F5A623] text-sm w-4" />
                            <div>
                              <div className="text-sm font-medium text-gray-700 group-hover:text-[#F5A623]">{f.label}</div>
                              <div className="text-xs text-gray-400">{f.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom — Ortak Özellikler */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ortak Özellikler</div>
                    <div className="grid grid-cols-2 gap-1">
                      {commonFeatures.map((f) => (
                        <Link
                          key={f.href}
                          href={f.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group transition"
                          onClick={() => setMegaOpen(false)}
                        >
                          <FontAwesomeIcon icon={f.icon} className="text-blue-500/60 group-hover:text-blue-600 text-sm w-4" />
                          <div>
                            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{f.label}</div>
                            <div className="text-xs text-gray-400">{f.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/fiyatlandirma" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-kp-green transition-colors rounded-lg hover:bg-kp-green/5">
              Fiyatlandırma
            </Link>
            <Link href="/blog" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-kp-green transition-colors rounded-lg hover:bg-kp-green/5">
              Blog
            </Link>
            <Link href="/hakkimizda" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-kp-green transition-colors rounded-lg hover:bg-kp-green/5">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-kp-green transition-colors rounded-lg hover:bg-kp-green/5">
              İletişim
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/giris">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-kp-green">
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
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="text-foreground text-lg"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-border px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
          {/* Veteriner */}
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">🩺 Veteriner</div>
          {vetFeatures.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="block px-6 py-2 text-sm text-muted-foreground hover:text-kp-green hover:bg-kp-green/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={f.icon} className="mr-2 w-4 text-gray-400" />
              {f.label}
            </Link>
          ))}

          {/* Pet Kuaför */}
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase mt-2">✂️ Pet Kuaför</div>
          {petFeatures.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="block px-6 py-2 text-sm text-muted-foreground hover:text-kp-green hover:bg-kp-green/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={f.icon} className="mr-2 w-4 text-gray-400" />
              {f.label}
            </Link>
          ))}

          <div className="border-t my-2" />

          {[
            { href: "/fiyatlandirma", label: "Fiyatlandırma" },
            { href: "/blog", label: "Blog" },
            { href: "/hakkimizda", label: "Hakkımızda" },
            { href: "/iletisim", label: "İletişim" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-kp-green hover:bg-kp-green/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 space-y-2 border-t mt-2">
            <Link href="/giris" className="block">
              <Button variant="outline" className="w-full" size="sm">Giriş Yap</Button>
            </Link>
            <Link href="/kayit" className="block">
              <Button className="w-full gradient-primary text-white border-0" size="sm">Ücretsiz Başla</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
