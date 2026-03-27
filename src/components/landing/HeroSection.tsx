"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStethoscope,
  faScissors,
  faCircleCheck,
  faPalette,
  faGlobe,
  faChevronLeft,
  faChevronRight,
  faBoxesStacked,
  faCalendarDays,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "2", label: "Sektör, Tek Platform" },
  { value: "50+", label: "Modül & Özellik" },
  { value: "7/24", label: "Teknik Destek" },
  { value: "99.9%", label: "Uptime Garantisi" },
];

interface SlideProps {
  isVisible: boolean;
}

/* ───────── Slide 1: Ana Platform ───────── */
function Slide1({ isVisible }: SlideProps) {
  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"}`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kp-green/10 text-kp-green text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-kp-green animate-pulse" />
            Türkiye&apos;nin İlk 2-in-1 Pet Yönetim Platformu
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
            Veteriner &{" "}
            <span className="gradient-text">Pet Kuaför</span>{" "}
            için Tek Platform
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Randevu yönetimi, hasta takibi, stok kontrolü ve müşteri ilişkilerinizi
            tek bir profesyonel platformda yönetin.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Veteriner kliniği ve pet kuaför tek çatı altında",
              "Online randevu, otomatik hatırlatma, WhatsApp entegrasyonu",
              "Güvenli, KVKK uyumlu, Türkiye altyapısı",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/kayit">
              <Button size="lg" className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] px-8 text-base">
                14 Gün Ücretsiz Dene
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </Link>
            <Link href="/iletisim">
              <Button size="lg" variant="outline" className="border-border hover:border-kp-green/30 text-base">
                Demo Talep Et
              </Button>
            </Link>
          </div>
        </div>
        {/* Dashboard Mockup */}
        <div className="hidden lg:block">
          <div className="relative mx-auto max-w-lg">
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-kp-coral" />
                <div className="w-3 h-3 rounded-full bg-kp-orange" />
                <div className="w-3 h-3 rounded-full bg-kp-green" />
                <span className="ml-2 text-sm text-muted-foreground">Klinik Yönetim Dashboard</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-kp-green/10 flex items-center justify-center mb-2">
                      <FontAwesomeIcon icon={faStethoscope} className="text-kp-green" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">Veteriner</span>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-kp-coral/10 flex items-center justify-center mb-2">
                      <FontAwesomeIcon icon={faScissors} className="text-kp-coral" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">Pet Kuaför</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Bugünkü Randevular</span>
                    <span className="text-xs text-kp-green font-medium bg-kp-green/10 px-2 py-1 rounded-full">8 randevu</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { time: "09:00", pet: "Max (Golden R.)", type: "Aşı", color: "bg-emerald-400" },
                      { time: "10:30", pet: "Pamuk (British S.)", type: "Bakım", color: "bg-amber-400" },
                      { time: "11:00", pet: "Boncuk (Poodle)", type: "Muayene", color: "bg-blue-400" },
                    ].map((apt, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                        <div className={`w-1 h-8 rounded-full ${apt.color}`} />
                        <span className="text-xs text-muted-foreground w-12">{apt.time}</span>
                        <span className="text-sm font-medium flex-1">{apt.pet}</span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{apt.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Aylık Gelir</span>
                    <span className="text-xs text-kp-green font-medium">+23%</span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[40, 55, 35, 65, 50, 75, 60, 80, 70, 85, 90, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-kp-green/20 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-kp-green/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green text-sm" />
                </div>
                <div>
                  <p className="text-xs font-medium">Yeni Randevu</p>
                  <p className="text-[10px] text-muted-foreground">Boncuk - 14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Slide 2: Ücretsiz Web Sitesi ───────── */
function Slide2({ isVisible }: SlideProps) {
  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 absolute inset-0 pointer-events-none"}`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kp-green/10 text-kp-green text-sm font-medium mb-6">
            <FontAwesomeIcon icon={faPalette} className="text-sm" />
            Yıllık Paket Alımlarında Geçerlidir
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
            <span className="gradient-text">Ücretsiz</span>{" "}
            Web Sitesi Tasarımı
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Yıllık paket alımlarınızda kliniğinize veya pet kuaför işletmenize özel,
            profesyonel web sitesi tasarımı hediye ediyoruz.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Mobil uyumlu, modern ve hızlı web sitesi",
              "Online randevu formlu, SEO optimizasyonlu",
              "Kendi markanıza özel tasarım",
              "SSL sertifikası ve hosting dahil",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/kayit">
              <Button size="lg" className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] px-8 text-base">
                Hemen Başvur
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </Link>
            <Link href="/fiyatlandirma">
              <Button size="lg" variant="outline" className="text-base">
                Paketleri İncele
              </Button>
            </Link>
          </div>
        </div>
        {/* Web Sitesi Mockup */}
        <div className="hidden lg:block">
          <div className="relative mx-auto max-w-lg">
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-kp-coral" />
                <div className="w-3 h-3 rounded-full bg-kp-orange" />
                <div className="w-3 h-3 rounded-full bg-kp-green" />
                <span className="ml-2 text-sm text-muted-foreground">klinikadiniz.com</span>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#2D9F6F] to-emerald-600 rounded-xl p-6 text-white text-center">
                  <FontAwesomeIcon icon={faGlobe} className="text-4xl mb-3 opacity-80" />
                  <h3 className="text-lg font-bold mb-1">Profesyonel Web Sitesi</h3>
                  <p className="text-sm text-white/70">Markanıza özel tasarım</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: faCalendarDays, label: "Randevu" },
                    { icon: faUsers, label: "Müşteriler" },
                    { icon: faChartLine, label: "Raporlar" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border text-center">
                      <FontAwesomeIcon icon={item.icon} className="text-kp-green mb-1" />
                      <div className="text-[10px] text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 border text-center">
                  <div className="text-xs text-gray-400 mb-2">Responsive Tasarım</div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-14 bg-gray-100 rounded-md border" />
                    <div className="w-14 h-10 bg-gray-100 rounded-md border" />
                    <div className="w-20 h-12 bg-gray-100 rounded-md border" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -left-3 bg-kp-green text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              BEDAVA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Slide 3: Özellik Tanıtımı (Stok & POS) ───────── */
function Slide3({ isVisible }: SlideProps) {
  return (
    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"}`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <FontAwesomeIcon icon={faBoxesStacked} className="text-sm" />
            Yeni Özellik
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
            Barkodlu{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Satış & Stok</span>{" "}
            Yönetimi
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Barkod okuyucu ile ürün okutun, anında satış yapın. Stok otomatik düşsün,
            gelir otomatik kayıt olsun. Kağıtsız, hatasız, hızlı.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "USB barkod okuyucu ile anında ürün tanıma",
              "POS kasa ekranı: nakit, kart veya havale",
              "Stok düşümü ve gelir kaydı otomatik",
              "Düşük stok ve son kullanma tarihi uyarıları",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/kayit">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] px-8 text-base">
                Hemen Deneyin
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Button>
            </Link>
            <Link href="/veteriner/ozellikler/ilac-stok">
              <Button size="lg" variant="outline" className="text-base">
                Detaylı Bilgi
              </Button>
            </Link>
          </div>
        </div>
        {/* POS Mockup */}
        <div className="hidden lg:block">
          <div className="relative mx-auto max-w-lg">
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-kp-coral" />
                <div className="w-3 h-3 rounded-full bg-kp-orange" />
                <div className="w-3 h-3 rounded-full bg-kp-green" />
                <span className="ml-2 text-sm text-muted-foreground">Satış Kasa</span>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBoxesStacked} className="text-lg" />
                    <span className="text-sm font-medium">Barkod Okut</span>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2 text-white/80 text-sm">8690123456789</div>
                </div>
                <div className="bg-white rounded-xl border">
                  {[
                    { name: "Royal Canin Mama", qty: 2, price: "₺450" },
                    { name: "Aşı - Nobivac", qty: 1, price: "₺280" },
                    { name: "Parazit İlacı", qty: 3, price: "₺195" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">x{item.qty}</span>
                        <span className="text-sm font-bold">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Toplam</span>
                  <span className="text-2xl font-bold text-blue-600">₺1.565</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-float">
              Otomatik Stok Düşüm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDE_COUNT = 3;
const AUTO_INTERVAL = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [current, isPaused, goTo]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-kp-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-kp-orange/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        {/* Slides */}
        <div className="relative min-h-[500px]">
          <Slide1 isVisible={current === 0} />
          <Slide2 isVisible={current === 1} />
          <Slide3 isVisible={current === 2} />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-black/5">
          {stats.map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-kp-green">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => goTo(current - 1)} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition" aria-label="Önceki">
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500 text-sm" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-8 bg-kp-green" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={() => goTo(current + 1)} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition" aria-label="Sonraki">
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
}
