"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faInstagram, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

const footerLinks = {
  urun: {
    title: "Ürün",
    links: [
      { label: "Özellikler", href: "#ozellikler" },
      { label: "Fiyatlandırma", href: "#fiyatlandirma" },
      { label: "Veteriner Modülleri", href: "/ozellikler/veteriner" },
      { label: "Pet Kuaför Modülleri", href: "/ozellikler/pet-kuafor" },
    ],
  },
  sirket: {
    title: "Şirket",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Blog", href: "/blog" },
      { label: "Referanslar", href: "/referanslar" },
      { label: "İletişim", href: "#iletisim" },
    ],
  },
  destek: {
    title: "Destek",
    links: [
      { label: "SSS", href: "#sss" },
      { label: "Yardım Merkezi", href: "/yardim" },
      { label: "API Dokümantasyonu", href: "/api-docs" },
      { label: "Durum Sayfası", href: "/durum" },
    ],
  },
  yasal: {
    title: "Yasal",
    links: [
      { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
      { label: "KVKK Aydınlatma", href: "/kvkk" },
      { label: "Çerez Politikası", href: "/cerez-politikasi" },
    ],
  },
};

const socialLinks = [
  { icon: faWhatsapp, href: "#", label: "WhatsApp" },
  { icon: faInstagram, href: "#", label: "Instagram" },
  { icon: faFacebook, href: "#", label: "Facebook" },
  { icon: faTwitter, href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer id="iletisim" className="bg-kp-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid lg:grid-cols-5 gap-12 py-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <FontAwesomeIcon icon={faPaw} className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-heading)] text-white">
                Klinik Yönetim
              </span>
            </Link>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Veteriner klinikleri ve pet kuaförleri için hepsi bir arada yönetim platformu.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="mailto:info@klinikyonetim.net" className="flex items-center gap-2 text-white/50 hover:text-kp-green transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 text-xs" />
                info@klinikyonetim.net
              </a>
              <a href="tel:+905001234567" className="flex items-center gap-2 text-white/50 hover:text-kp-green transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-4 text-xs" />
                +90 500 123 45 67
              </a>
              <div className="flex items-center gap-2 text-white/50">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 text-xs" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-kp-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Klinik Yönetim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-kp-green/20 hover:text-kp-green transition-all"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={social.icon} className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
