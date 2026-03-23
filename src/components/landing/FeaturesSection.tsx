"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faStore,
  faScissors,
  faCalendarDays,
  faUsers,
  faChartLine,
  faSyringe,
  faBoxesStacked,
  faCashRegister,
  faFileMedical,
  faImages,
  faBone,
  faBell,
  faShieldHalved,
  faQrcode,
  faComments,
  faMobileScreenButton,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

const businessTypes = [
  {
    id: "veteriner",
    title: "Veteriner Kliniği",
    icon: faStethoscope,
    color: "kp-green",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-kp-green/10",
    iconColor: "text-kp-green",
    description: "Hasta dosyası, aşı takibi, reçete ve laboratuvar sonuçları",
    features: [
      { icon: faFileMedical, label: "Elektronik Hasta Dosyası" },
      { icon: faSyringe, label: "Aşı Takibi & Hatırlatma" },
      { icon: faCalendarDays, label: "Randevu Yönetimi" },
      { icon: faChartLine, label: "Gelişmiş Raporlama" },
    ],
  },
  {
    id: "kuafor",
    title: "Pet Kuaför",
    icon: faScissors,
    color: "kp-coral",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconBg: "bg-kp-coral/10",
    iconColor: "text-kp-coral",
    description: "Bakım takvimi, öncesi/sonrası fotoğraf ve online randevu",
    features: [
      { icon: faCalendarDays, label: "Kuaför Takvimi" },
      { icon: faImages, label: "Öncesi/Sonrası Fotoğraf" },
      { icon: faRoute, label: "Mobil Kuaför Rota" },
      { icon: faBell, label: "Bakım Hatırlatma" },
    ],
  },
];

const commonFeatures = [
  {
    icon: faCalendarDays,
    title: "Akıllı Randevu Sistemi",
    description: "Online randevu, otomatik hatırlatma ve ertesi gün teyit mesajları ile randevu kaçırmaları ortadan kaldırın.",
  },
  {
    icon: faUsers,
    title: "CRM & Müşteri Yönetimi",
    description: "Müşteri profilleri, iletişim geçmişi, pet bilgileri ve bakım detaylarını tek merkezde yönetin.",
  },
  {
    icon: faChartLine,
    title: "Raporlama & Analitik",
    description: "Gelir, gider, müşteri ve performans raporları ile veriye dayalı kararlar alın.",
  },
  {
    icon: faShieldHalved,
    title: "Güvenlik & KVKK",
    description: "Endüstri standardı şifreleme, 2FA ve KVKK uyumlu veri yönetimi.",
  },
  {
    icon: faQrcode,
    title: "QR Kod Pet Kimliği",
    description: "Her pet için QR kod oluşturun. Tarandığında aşı bilgileri ve acil iletişime ulaşılır.",
  },
  {
    icon: faComments,
    title: "WhatsApp Entegrasyonu",
    description: "WhatsApp üzerinden randevu alma, otomatik teyit ve bakım hatırlatma mesajları.",
  },
  {
    icon: faMobileScreenButton,
    title: "Müşteri Portalı",
    description: "Müşterilerinize özel subdomain ile randevu alma ve bakım geçmişi görme imkanı.",
  },
  {
    icon: faBell,
    title: "Otomatik Bildirimler",
    description: "SMS, email ve WhatsApp ile aşı zamanı, bakım döngüsü ve randevu hatırlatmaları.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="ozellikler" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge variant="secondary" className="mb-4 text-kp-green bg-kp-green/10 border-0">
            <FontAwesomeIcon icon={faStethoscope} className="mr-2 text-xs" />
            Özellikler
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            İş tipinize özel{" "}
            <span className="gradient-text">güçlü modüller</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Her sektörün kendine özel ihtiyaçlarını karşılayan modüller. Yalnızca işinizle ilgili özellikleri görün.
          </p>
        </div>

        {/* Business Type Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
          {businessTypes.map((type, index) => (
            <div
              key={type.id}
              className={`${type.bgColor} ${type.borderColor} border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${type.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <FontAwesomeIcon icon={type.icon} className={`${type.iconColor} text-xl`} />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">
                  {type.title}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-5">{type.description}</p>

              {/* Feature list */}
              <div className="space-y-3">
                {type.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <FontAwesomeIcon icon={feature.icon} className={`${type.iconColor} text-xs w-4`} />
                    <span className="text-foreground/80">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Common Features */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Tüm iş tipleri için{" "}
            <span className="gradient-text">ortak özellikler</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hangi sektörde olursanız olun, bu güçlü özellikler her zaman yanınızda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commonFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-11 h-11 rounded-xl bg-kp-green/10 flex items-center justify-center mb-4 group-hover:bg-kp-green group-hover:text-white transition-colors">
                <FontAwesomeIcon icon={feature.icon} className="text-kp-green group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-base font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
