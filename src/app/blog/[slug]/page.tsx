import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";

// Static blog data — ileride DB'den gelecek
const posts: Record<string, { title: string; date: string; readTime: string; tags: string[]; content: string }> = {
  "veteriner-klinik-yonetimi-ipuclari": {
    title: "Veteriner Klinik Yönetimi İçin 10 İpucu",
    date: "2026-03-20", readTime: "5 dk", tags: ["veteriner", "yönetim"],
    content: `
## 1. Dijital Hasta Dosyasına Geçin
Kağıt dosyalardan dijital hasta dosyalarına geçiş, hem zamandan tasarruf sağlar hem de hasta bilgilerine anında erişim imkanı verir.

## 2. Online Randevu Sistemi Kullanın
Müşterilerinizin 7/24 online randevu alabilmesini sağlayın. Bu, telefonla randevu alma yükünü %60'a kadar azaltabilir.

## 3. Otomatik Hatırlatmalar Gönderin
Aşı, kontrol ve randevu hatırlatmalarını otomatikleştirin. Bu hem müşteri memnuniyetini artırır hem de gelmeme oranını düşürür.

## 4. Stok Yönetiminizi Optimize Edin
İlaç ve malzeme stokunu düzenli takip edin. Son kullanma tarihi yaklaşan ürünleri önceden tespit edin.

## 5. Müşteri İlişkilerini Güçlendirin
Her hayvanın doğum gününde tebrik mesajı gönderin, düzenli bakım hatırlatmaları yapın.

## 6. Personel Eğitimine Yatırım Yapın
Ekibinizi yazılım kullanımı, müşteri iletişimi ve yeni tedavi yöntemleri konusunda eğitin.

## 7. Finansal Raporları Düzenli Takip Edin
Aylık gelir-gider analizleri yapın, karlılığı takip edin ve maliyet optimize edin.

## 8. Güvenlik ve KVKK Uyumuna Dikkat Edin
Hasta verilerini güvenli şekilde saklayın, KVKK uyumluluğunu sağlayın.

## 9. Sosyal Medyayı Aktif Kullanın
Tedavi başarı hikayelerinizi sosyal medyada paylaşın (hasta sahiplerinin izniyle).

## 10. Teknolojiyi Takip Edin
Veteriner yazılımları, telemedisin ve yeni tanı teknolojilerine açık olun.
    `,
  },
  "pet-kuafor-bakim-rehberi": {
    title: "Pet Kuaför: Irklara Göre Bakım Rehberi",
    date: "2026-03-15", readTime: "7 dk", tags: ["pet kuaför", "bakım"],
    content: `
## Golden Retriever
Çift katlı tüy yapısına sahip Golden Retriever'lar düzenli fırçalama gerektirir. Tüy dökme dönemlerinde haftada 3-4 kez fırçalayın. Banyo 6-8 haftada bir yeterlidir.

## Poodle
Kıvırcık tüyleri kolayca keçeleşebilir. Her 4-6 haftada profesyonel bakım şarttır. Farklı kesim stilleri (teddy bear, lamb cut) sunum çeşitliliği sağlar.

## Shih Tzu
Uzun tüylü versiyonda günlük fırçalama gerekir. Göz çevresi ve ağız bölgesi özel dikkat ister. Regular trim her 4-6 haftada yapılmalıdır.

## Yorkshire Terrier
Yere kadar uzayan ipeksi tüyleri vardır. Düzenli bakım ve nemlendirme şarttır. Top knot ve show cut gibi özel stiller popülerdir.

## Genel İpuçları
- Her ırkın tüy tipine uygun şampuan kullanın
- Cilt hassasiyetlerini bakım kartına not edin
- Bakım öncesi/sonrası fotoğraf çekin
- Müşteriyi tercihler hakkında bilgilendirin
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return { title: `${post.title} | Blog | Klinik Yönetim`, description: post.content.substring(0, 160) };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-[#2D9F6F] hover:underline text-sm flex items-center gap-2 mb-6">
            <FontAwesomeIcon icon={faArrowLeft} /> Blog&apos;a Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarDays} /> {new Date(post.date).toLocaleDateString("tr-TR")}
            </span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} /> {post.readTime}
            </span>
            <div className="flex gap-2">
              {post.tags.map((t) => (
                <span key={t} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">{t}</span>
              ))}
            </div>
          </div>
          <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: post.content.replace(/## /g, '<h2>').replace(/\n/g, '<br/>') }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
