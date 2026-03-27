"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faInstagram, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";

const footerLinks = {
  veteriner: {
    title: "Veteriner",
    links: [
      { label: "Tüm Veteriner Özellikleri", href: "/veteriner" },
      { label: "Hasta Dosyası (EMR)", href: "/veteriner/ozellikler/hasta-dosyasi" },
      { label: "Aşı Takibi", href: "/veteriner/ozellikler/asi-takibi" },
      { label: "Reçete Yönetimi", href: "/veteriner/ozellikler/recete-yonetimi" },
      { label: "Laboratuvar", href: "/veteriner/ozellikler/laboratuvar" },
      { label: "Ameliyat Kayıtları", href: "/veteriner/ozellikler/ameliyat-kayitlari" },
      { label: "İlaç & Stok", href: "/veteriner/ozellikler/ilac-stok" },
    ],
  },
  petKuafor: {
    title: "Pet Kuaför",
    links: [
      { label: "Tüm Pet Kuaför Özellikleri", href: "/pet-kuafor" },
      { label: "Bakım Hizmetleri", href: "/pet-kuafor/ozellikler/bakim-hizmetleri" },
      { label: "Bakım Geçmişi", href: "/pet-kuafor/ozellikler/bakim-gecmisi" },
      { label: "Öncesi/Sonrası Fotoğraf", href: "/pet-kuafor/ozellikler/galeri" },
      { label: "Kuaför Takvimi", href: "/pet-kuafor/ozellikler/kuafor-takvimi" },
      { label: "Mobil Kuaför Rota", href: "/pet-kuafor/ozellikler/mobil-kuafor" },
      { label: "Ürün & Stok Takibi", href: "/pet-kuafor/ozellikler/stok-yonetimi" },
    ],
  },
  sirket: {
    title: "Şirket",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
      { label: "Blog", href: "/blog" },
      { label: "Fiyatlandırma", href: "/fiyatlandirma" },
    ],
  },
  yasal: {
    title: "Yasal",
    links: [
      { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
      { label: "KVKK Aydınlatma", href: "/kvkk" },
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
    <footer className="bg-gradient-to-br from-[#2D9F6F] via-[#238c5f] to-emerald-800 text-white">
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
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Veteriner klinikleri ve pet kuaförleri için hepsi bir arada yönetim platformu.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="mailto:info@klinikyonetim.net" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 text-xs" />
                info@klinikyonetim.net
              </a>
              <a href="tel:+905001234567" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faPhone} className="w-4 text-xs" />
                +90 500 123 45 67
              </a>
              <div className="flex items-center gap-2 text-white/70">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 text-xs" />
                <span>Türkiye</span>
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
                      className="text-sm text-white/70 hover:text-white transition-colors"
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
        <div className="border-t border-white/20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Klinik Yönetim. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all"
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
