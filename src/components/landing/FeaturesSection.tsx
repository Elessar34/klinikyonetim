"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faScissors,
  faCalendarDays,
  faUsers,
  faChartLine,
  faSyringe,
  faBoxesStacked,
  faFileMedical,
  faImages,
  faBell,
  faShieldHalved,
  faQrcode,
  faComments,
  faMobileScreenButton,
  faArrowRight,
  faCircleCheck,
  faHandshake,
  faCloudArrowUp,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

/* ────────── Büyük istatistik verileri ────────── */
const platformStats = [
  { value: "50+", label: "Modül ve Özellik" },
  { value: "2", label: "Sektör, Tek Platform" },
  { value: "%99.9", label: "Uptime Garantisi" },
  { value: "7/24", label: "Teknik Destek" },
];

/* ────────── Sektör bazlı özellikler ────────── */
const businessTypes = [
  {
    title: "Veteriner Klinik",
    icon: faStethoscope,
    bgGradient: "from-emerald-50 to-green-50",
    borderColor: "border-emerald-200/60",
    iconColor: "text-kp-green",
    href: "/veteriner",
    features: [
      { icon: faFileMedical, label: "Elektronik Hasta Dosyası (EMR)" },
      { icon: faSyringe, label: "Aşı Takvimi ve Hatırlatma" },
      { icon: faCalendarDays, label: "Online Randevu Sistemi" },
      { icon: faBoxesStacked, label: "İlaç ve Stok Yönetimi" },
    ],
  },
  {
    title: "Pet Kuaför",
    icon: faScissors,
    bgGradient: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200/60",
    iconColor: "text-kp-orange",
    href: "/pet-kuafor",
    features: [
      { icon: faCalendarDays, label: "Kuaför Takvimi" },
      { icon: faImages, label: "Öncesi / Sonrası Fotoğraf" },
      { icon: faBell, label: "Bakım Periyodu Hatırlatma" },
      { icon: faBoxesStacked, label: "Ürün ve Stok Takibi" },
    ],
  },
];

/* ────────── Ortak platform özellikleri ────────── */
const commonFeatures = [
  {
    icon: faCalendarDays,
    title: "Randevu Yönetimi",
    description: "Online randevu formu, otomatik hatırlatma ve ertesi gün teyit mesajları. Gelmeme oranını minimuma indirin.",
  },
  {
    icon: faUsers,
    title: "CRM ve Müşteri Yönetimi",
    description: "Müşteri profilleri, iletişim geçmişi, pet bilgileri ve bakım detaylarını tek merkezde yönetin.",
  },
  {
    icon: faChartLine,
    title: "Raporlama ve Analitik",
    description: "Gelir, gider, müşteri ve performans raporları ile veriye dayalı kararlar alın.",
  },
  {
    icon: faShieldHalved,
    title: "Güvenlik ve KVKK",
    description: "AES-256 şifreleme, iki faktörlü doğrulama ve KVKK uyumlu veri yönetimi.",
  },
  {
    icon: faQrcode,
    title: "QR Kod Pet Kimliği",
    description: "Her pet için QR kod oluşturun. Tarandığında aşı bilgileri ve acil iletişime ulaşılır.",
  },
  {
    icon: faComments,
    title: "WhatsApp Entegrasyonu",
    description: "Randevu teyidi, bakım hatırlatma ve promosyon mesajları otomatik gönderilir.",
  },
  {
    icon: faMobileScreenButton,
    title: "Müşteri Portalı",
    description: "Müşterilerinize özel panel: randevu alma, bakım geçmişi görme ve online ödeme.",
  },
  {
    icon: faBell,
    title: "Otomatik Bildirimler",
    description: "SMS, email ve WhatsApp ile aşı zamanı, bakım döngüsü ve randevu bildirimleri.",
  },
];

/* ────────── Neden biz? ────────── */
const whyUsItems = [
  {
    icon: faHandshake,
    title: "Sektöre Özel Tasarım",
    desc: "Veteriner ve pet kuaförler için sıfırdan tasarlandı. Genel çözümler değil, sektörün ihtiyaçlarına odaklı araçlar.",
  },
  {
    icon: faCloudArrowUp,
    title: "Bulut Tabanlı Altyapı",
    desc: "Kurulum gerektirmez. İnternet olan her yerden giriş yapın. Verileriniz güvenli sunucularda otomatik yedeklenir.",
  },
  {
    icon: faHeadset,
    title: "Türkçe Destek Ekibi",
    desc: "Sorunlarınız dakikalar içinde çözülür. Türkçe destek ekibimiz hafta içi her gün yanınızda.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="ozellikler" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Platform Rakamları */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] mb-3">
              Rakamlarla <span className="gradient-text">Klinik Yönetim</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Türkiye&apos;nin veteriner ve pet kuaför sektörüne özel geliştirilen profesyonel yönetim platformu.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformStats.map((s, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-kp-green mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* İş Tipi Kartları */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] mb-3">
              İş tipinize özel <span className="gradient-text">güçlü modüller</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Yalnızca sizin sektörünüzle ilgili özellikleri görerek hızlıca çalışmaya başlayın.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {businessTypes.map((bt) => (
              <div
                key={bt.title}
                className={`bg-gradient-to-br ${bt.bgGradient} ${bt.borderColor} border rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                    <FontAwesomeIcon icon={bt.icon} className={`${bt.iconColor} text-xl`} />
                  </div>
                  <h3 className="text-lg font-bold">{bt.title}</h3>
                </div>
                <div className="space-y-3 mb-5">
                  {bt.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <FontAwesomeIcon icon={f.icon} className={`${bt.iconColor} text-xs w-4`} />
                      <span className="text-sm text-foreground/80">{f.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={bt.href}
                  className={`inline-flex items-center gap-2 text-sm font-semibold ${bt.iconColor} hover:opacity-80 transition`}
                >
                  Tüm özellikleri gör <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Ortak Özellikler Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] mb-3">
              Her iş tipi için <span className="gradient-text">ortak özellikler</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hangi sektörde olursanız olun, bu araçlar her zaman yanınızda.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {commonFeatures.map((f, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-xl bg-kp-green/10 flex items-center justify-center mb-4 group-hover:bg-kp-green transition-colors">
                  <FontAwesomeIcon icon={f.icon} className="text-kp-green group-hover:text-white transition-colors text-sm" />
                </div>
                <h4 className="text-sm font-bold mb-1.5">{f.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Neden Klinik Yönetim? */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] mb-3">
              Neden <span className="gradient-text">Klinik Yönetim?</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyUsItems.map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-kp-green/10 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={item.icon} className="text-kp-green text-xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["KVKK Uyumlu", "SSL Sertifikalı", "Günlük Yedekleme", "Cloudflare Korumalı"].map((trust, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green text-xs" />
                  <span>{trust}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
