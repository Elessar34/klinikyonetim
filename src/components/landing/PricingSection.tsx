"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Başlangıç",
    price: { monthly: 399, yearly: 319 },
    description: "Tek kişilik işletmeler için ideal başlangıç paketi",
    features: [
      "1 kullanıcı",
      "Temel modüller (CRM, Randevu, Muhasebe)",
      "500 MB dosya depolama",
      "Email bildirimleri",
      "Temel raporlama",
      "Email destek",
    ],
    cta: "Ücretsiz Dene",
    popular: false,
    color: "border-border",
  },
  {
    name: "Profesyonel",
    price: { monthly: 799, yearly: 639 },
    description: "Büyüyen işletmeler için profesyonel çözüm",
    features: [
      "5 kullanıcı",
      "Tüm modüller",
      "5 GB dosya depolama",
      "SMS bildirimleri (100/ay)",
      "Gelişmiş raporlama & analitik",
      "Müşteri portalı (subdomain)",
      "WhatsApp entegrasyonu",
      "Öncelikli destek",
    ],
    cta: "Ücretsiz Dene",
    popular: true,
    color: "border-kp-green shadow-lg shadow-kp-green/10",
  },
  {
    name: "İşletme",
    price: { monthly: 1499, yearly: 1199 },
    description: "Büyük klinikler ve mağazalar için kurumsal çözüm",
    features: [
      "Sınırsız kullanıcı",
      "Tüm modüller + API erişimi",
      "50 GB dosya depolama",
      "Sınırsız SMS bildirimi",
      "Özel raporlama & dashboard",
      "Müşteri portalı + QR kod",
      "WhatsApp Bot",
      "Çoklu şube desteği",
      "Öncelikli telefon desteği",
      "SLA garantisi",
    ],
    cta: "İletişime Geç",
    popular: false,
    color: "border-border",
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="fiyatlandirma" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-kp-green bg-kp-green/10 border-0">
            Fiyatlandırma
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            İşletmenize uygun{" "}
            <span className="gradient-text">şeffaf fiyatlandırma</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            14 gün ücretsiz deneme. Kredi kartı gerekmez. İstediğiniz zaman iptal edin.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Aylık
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isYearly ? "bg-kp-green" : "bg-muted"
              }`}
              aria-label="Yıllık fiyatlandırmaya geç"
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  isYearly ? "translate-x-7" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yıllık
            </span>
            {isYearly && (
              <Badge className="bg-kp-green/10 text-kp-green border-0 text-xs animate-scale-in">
                %20 İndirim
              </Badge>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card border-2 ${plan.color} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary text-white border-0 shadow-md px-4 py-1">
                    En Popüler
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-[family-name:var(--font-heading)]">
                    ₺{isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground text-sm">/ay</span>
                </div>
                {isYearly && (
                  <p className="text-xs text-kp-green mt-1">
                    Yıllık ₺{plan.price.yearly * 12} (₺{(plan.price.monthly * 12) - (plan.price.yearly * 12)} tasarruf)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className={`mt-0.5 flex-shrink-0 ${plan.popular ? "text-kp-green" : "text-muted-foreground"}`}
                    />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/kayit" className="block">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "gradient-primary text-white border-0 shadow-md hover:shadow-lg"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Kurumsal */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Zincir işletmeler ve özel ihtiyaçlar için{" "}
            <Link href="#iletisim" className="text-kp-green font-medium hover:underline">
              Kurumsal Teklif
            </Link>{" "}
            alın.
          </p>
        </div>
      </div>
    </section>
  );
}
