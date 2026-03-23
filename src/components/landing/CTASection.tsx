"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaw } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kp-green/5 via-transparent to-kp-orange/5" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-kp-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-kp-orange/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-lg mb-8">
          <FontAwesomeIcon icon={faPaw} className="text-white text-2xl" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-6">
          İşletmenizi{" "}
          <span className="gradient-text">dijitalleştirmeye</span>{" "}
          hazır mısınız?
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          14 gün ücretsiz deneyin. Kredi kartı gerekmez. Dakikalar içinde kurulumu tamamlayın ve
          profesyonel yönetim deneyimine geçin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/kayit">
            <Button size="lg" className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] px-10 text-base">
              Hemen Başla
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </Link>
          <Link href="#iletisim">
            <Button size="lg" variant="outline" className="text-base px-10">
              Bize Ulaşın
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Kurulum süresi yalnızca <span className="font-semibold text-foreground">2 dakika</span>. Hemen deneyin!
        </p>
      </div>
    </section>
  );
}
