"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Klinik Yönetim hangi iş tipleri için uygun?",
    answer: "Klinik Yönetim, veteriner klinikleri ve pet kuaförleri (grooming salonları) için tasarlanmıştır. Tek bir platform üzerinden iki farklı sektöre hizmet verir. Her iş tipi yalnızca kendi modüllerini görür ve kullanır.",
  },
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer: "Evet! Tüm paketlerde 14 gün ücretsiz deneme süresi bulunmaktadır. Deneme süresinde kredi kartı bilgisi istenmez ve tüm özelliklere erişim sağlarsınız.",
  },
  {
    question: "Verilerim güvende mi?",
    answer: "Kesinlikle. Klinik Yönetim, endüstri standardı şifreleme (AES-256), iki faktörlü doğrulama (2FA) ve KVKK uyumlu veri yönetimi sunar. Production ortamında Cloudflare WAF ve DDoS koruması aktiftir. Günlük otomatik yedekleme yapılır.",
  },
  {
    question: "Mevcut verilerimi aktarabilir miyim?",
    answer: "Evet, Excel, CSV veya diğer formatlardaki müşteri, pet ve randevu verilerinizi Klinik Yönetim'e kolayca aktarabilirsiniz. Teknik ekibimiz veri aktarımı sürecinde size yardımcı olur.",
  },
  {
    question: "Müşterilerim online randevu alabilir mi?",
    answer: "Evet! İşletmenize özel bir subdomain (örn: isletmeniz.klinikyonetim.net) alırsınız. Müşterileriniz bu adresten uygun tarih ve saatleri görerek randevu alabilir, geçmiş bakımlarını görebilir ve pet bilgilerine erişebilir.",
  },
  {
    question: "WhatsApp entegrasyonu nasıl çalışır?",
    answer: "WhatsApp Business API entegrasyonu ile müşterilerinize otomatik randevu teyidi, bakım hatırlatması ve aşı zamanı bildirimleri gönderebilirsiniz. Profesyonel paket ve üzerinde kullanılabilir.",
  },
  {
    question: "Birden fazla şubem var, hepsini yönetebilir miyim?",
    answer: "Evet, İşletme paketi ile birden fazla şubenizi tek panelden yönetebilirsiniz. Her şubenin kendi personeli, randevuları ve raporları ayrı tutulur ancak merkezi bir dashboard'dan tüm şubeleri izleyebilirsiniz.",
  },
  {
    question: "İstediğim zaman paketimi değiştirebilir miyim?",
    answer: "Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Yükseltme anında geçerli olur, düşürme ise mevcut dönem sonunda aktif hale gelir.",
  },
];

export default function FAQSection() {
  return (
    <section id="sss" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-kp-coral bg-kp-coral/10 border-0">
            <FontAwesomeIcon icon={faCircleQuestion} className="mr-2 text-xs" />
            Sıkça Sorulan Sorular
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Merak ettikleriniz
          </h2>
          <p className="text-lg text-muted-foreground">
            Sorularınıza hızlı yanıtlar. Bulamazsanız bize ulaşın.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:text-kp-green transition-colors py-5 [&[data-state=open]]:text-kp-green">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
