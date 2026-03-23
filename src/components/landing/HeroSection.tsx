"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPlay,
  faStethoscope,
  faStore,
  faScissors,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "2", label: "Sektör, Tek Platform" },
  { value: "50+", label: "Modül & Özellik" },
  { value: "7/24", label: "Teknik Destek" },
  { value: "99.9%", label: "Uptime Garantisi" },
];

const highlights = [
  "Veteriner kliniği ve pet kuaför tek çatı altında",
  "Online randevu, otomatik hatırlatma, WhatsApp entegrasyonu",
  "Güvenli, KVKK uyumlu, Türkiye altyapısı",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-kp-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-kp-orange/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-kp-coral/5 rounded-full blur-3xl" />

      {/* Floating paw prints */}
      <div className="absolute top-32 left-[15%] text-kp-green/10 animate-float" style={{ animationDelay: "0s" }}>
        <svg width="40" height="40" viewBox="0 0 512 512" fill="currentColor">
          <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z"/>
        </svg>
      </div>
      <div className="absolute top-60 right-[20%] text-kp-orange/10 animate-float" style={{ animationDelay: "1s" }}>
        <svg width="32" height="32" viewBox="0 0 512 512" fill="currentColor">
          <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z"/>
        </svg>
      </div>
      <div className="absolute bottom-40 left-[25%] text-kp-coral/8 animate-float" style={{ animationDelay: "2s" }}>
        <svg width="24" height="24" viewBox="0 0 512 512" fill="currentColor">
          <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kp-green/10 text-kp-green text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-kp-green animate-pulse" />
              Türkiye&apos;nin İlk 2-in-1 Pet Yönetim Platformu
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
              Veteriner &{" "}
              <span className="gradient-text">Pet Kuaför</span>{" "}
              için Tek Platform
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Randevu yönetimi, hasta takibi, stok kontrolü ve müşteri ilişkilerinizi
              tek bir profesyonel platformda yönetin.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/kayit">
                <Button size="lg" className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] px-8 text-base">
                  14 Gün Ücretsiz Dene
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="group border-border hover:border-kp-green/30 text-base">
                <FontAwesomeIcon icon={faPlay} className="mr-2 text-kp-green group-hover:scale-110 transition-transform" />
                Demo İzle
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] text-kp-green">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="animate-fade-in relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main card */}
              <div className="glass rounded-2xl p-6 shadow-xl">
                {/* Mini dashboard preview */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-kp-coral" />
                  <div className="w-3 h-3 rounded-full bg-kp-orange" />
                  <div className="w-3 h-3 rounded-full bg-kp-green" />
                  <span className="ml-2 text-sm text-muted-foreground">Klinik Yönetim Dashboard</span>
                </div>

                {/* Card content */}
                <div className="space-y-4">
                  {/* Business type cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-kp-green/10 flex items-center justify-center mb-2 group-hover:bg-kp-green group-hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faStethoscope} className="text-kp-green group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs font-medium text-foreground/80">Veteriner</span>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-10 h-10 mx-auto rounded-lg bg-kp-coral/10 flex items-center justify-center mb-2 group-hover:bg-kp-coral group-hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faScissors} className="text-kp-coral group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs font-medium text-foreground/80">Pet Kuaför</span>
                    </div>
                  </div>

                  {/* Appointment preview */}
                  <div className="bg-white rounded-xl p-4 border border-border">
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
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-1 h-8 rounded-full ${apt.color}`} />
                          <span className="text-xs text-muted-foreground w-12">{apt.time}</span>
                          <span className="text-sm font-medium flex-1">{apt.pet}</span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">{apt.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue mini chart */}
                  <div className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">Aylık Gelir</span>
                      <span className="text-xs text-kp-green font-medium">+23%</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[40, 55, 35, 65, 50, 75, 60, 80, 70, 85, 90, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-kp-green/20 rounded-t hover:bg-kp-green/40 transition-colors"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
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
    </section>
  );
}
