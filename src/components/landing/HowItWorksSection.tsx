"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faGear,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    number: "1",
    icon: faUserPlus,
    title: "Kayıt Olun",
    description: "İş tipinizi seçin ve 2 dakikada hesabınızı oluşturun. Kredi kartı gerekmez.",
    iconColor: "text-kp-green",
    numberBg: "bg-kp-green",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200/50",
  },
  {
    number: "2",
    icon: faGear,
    title: "İşletmenizi Kurun",
    description: "Personel, hizmetler ve çalışma saatlerinizi tanımlayın. Müşteri verilerinizi kolayca aktarın.",
    iconColor: "text-kp-orange",
    numberBg: "bg-kp-orange",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200/50",
  },
  {
    number: "3",
    icon: faRocket,
    title: "Yönetmeye Başlayın",
    description: "Randevu alın, hizmet verin, faturalandırın. Tüm iş süreçleriniz artık dijitalde.",
    iconColor: "text-kp-coral",
    numberBg: "bg-kp-coral",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200/50",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="nasil-calisir" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kp-orange/10 text-kp-orange text-sm font-medium mb-4">
            Nasıl Çalışır?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            <span className="gradient-text">3 adımda</span> dijitalleşin
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kurulum dakikalar sürer. Hemen kullanmaya başlayabilirsiniz.
          </p>
        </div>

        {/* Steps - Vertical card layout */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${step.bgColor} ${step.borderColor} border rounded-2xl p-6 sm:p-8 flex items-start gap-6 hover:shadow-lg transition-all duration-300`}
            >
              {/* Step number */}
              <div className={`${step.numberBg} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-white text-lg font-bold">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={step.icon} className={`${step.iconColor} text-lg`} />
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
