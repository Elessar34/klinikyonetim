import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "@/lib/fontawesome";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Klinik Yönetim — Veteriner & Pet Kuaför Yönetim Sistemi",
    template: "%s | Klinik Yönetim",
  },
  description:
    "Veteriner klinikleri ve pet kuaförleri için hepsi bir arada ERP/CRM çözümü. Randevu, hasta takibi, müşteri ilişkileri ve daha fazlası tek platformda.",
  keywords: [
    "veteriner yazılımı",
    "pet kuaför yazılımı",
    "pet kuaför yazılımı",
    "veteriner klinik programı",
    "hayvan hastanesi yazılımı",
    "pet grooming software",
    "veteriner CRM",
    "pet ERP",
    "randevu yönetimi",
    "hasta takip sistemi",
  ],
  authors: [{ name: "Klinik Yönetim" }],
  creator: "Klinik Yönetim",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://klinikyonetim.net",
    siteName: "Klinik Yönetim",
    title: "Klinik Yönetim — Veteriner & Pet Kuaför Yönetim Sistemi",
    description:
      "Veteriner klinikleri ve pet kuaförleri için hepsi bir arada ERP/CRM çözümü.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik Yönetim — Veteriner & Pet Kuaför Yönetim Sistemi",
    description:
      "Veteriner klinikleri ve pet kuaförleri için hepsi bir arada ERP/CRM çözümü.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2D9F6F" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Klinik Yönetim",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "description": "Veteriner klinikleri ve pet kuaförleri için hepsi bir arada ERP/CRM çözümü.",
                  "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "TRY",
                    "lowPrice": "0",
                    "highPrice": "2499",
                    "offerCount": "3"
                  },
                  "featureList": [
                    "Randevu Yönetimi",
                    "Müşteri Yönetimi (CRM)",
                    "Hasta Dosyası (EMR)",
                    "Stok Yönetimi",
                    "Gelir/Gider Takibi",
                    "SMS & WhatsApp Bildirimleri",
                    "Aşı Takibi",
                    "Pet Bakım Geçmişi"
                  ]
                },
                {
                  "@type": "Organization",
                  "name": "Klinik Yönetim",
                  "url": "https://klinikyonetim.net",
                  "logo": "https://klinikyonetim.net/logo.png",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "availableLanguage": "Turkish"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Klinik Yönetim hangi işletmelere uygun?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Klinik Yönetim veteriner klinikleri ve pet kuaförleri için özel olarak tasarlanmış bir yönetim sistemidir."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Ücretsiz deneme var mı?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Evet, Klinik Yönetim 14 günlük ücretsiz deneme süresi sunmaktadır. Kredi kartı gerekmez."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Verilerim güvende mi?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Evet, tüm veriler SSL şifreleme, veritabanı şifreleme ve düzenli yedekleme ile korunmaktadır."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
