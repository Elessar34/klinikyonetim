"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faGear,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    icon: faUserPlus,
    title: "Kayıt Olun",
    description: "İş tipinizi (veteriner veya pet kuaför) seçin ve 2 dakikada hesabınızı oluşturun. Kredi kartı gerekmez.",
    iconColor: "text-kp-green",
    badgeBg: "bg-kp-green",
    bgColor: "bg-emerald-50",
  },
  {
    number: "02",
    icon: faGear,
    title: "İşletmenizi Kurun",
    description: "Personel, hizmetler ve çalışma saatlerinizi tanımlayın. Müşteri ve pet verilerinizi kolayca aktarın.",
    iconColor: "text-kp-orange",
    badgeBg: "bg-kp-orange",
    bgColor: "bg-amber-50",
  },
  {
    number: "03",
    icon: faRocket,
    title: "Yönetmeye Başlayın",
    description: "Randevu alın, hizmet verin, faturalandırın. Tüm iş süreçleriniz artık dijitalde ve kontrolünüzde.",
    iconColor: "text-kp-coral",
    badgeBg: "bg-kp-coral",
    bgColor: "bg-rose-50",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="nasil-calisir" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-kp-orange bg-kp-orange/10 border-0">
            Nasıl Çalışır?
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            <span className="gradient-text">3 adımda</span> dijitalleşin
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kurulum dakikalar sürer. Hemen kullanmaya başlayabilirsiniz.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-kp-green via-kp-orange to-kp-coral" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Step number circle */}
              <div className="relative mx-auto mb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${step.bgColor} flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all group-hover:scale-110`}>
                  <FontAwesomeIcon
                    icon={step.icon}
                    className={`${step.iconColor} text-2xl`}
                  />
                </div>
                <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${step.badgeBg} text-white text-xs font-bold flex items-center justify-center shadow`}>
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
