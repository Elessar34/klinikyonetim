import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Blog | Klinik Yönetim",
  description: "Veteriner bakımı, pet kuaför ipuçları ve işletme yönetimi hakkında faydalı yazılar.",
};

// Static blog data — ileride DB'den gelecek
const posts = [
  {
    slug: "veteriner-klinik-yonetimi-ipuclari",
    title: "Veteriner Klinik Yönetimi İçin 10 İpucu",
    excerpt: "Kliniğinizi daha verimli yönetmenin yollarını keşfedin. Dijital dönüşümden müşteri ilişkilerine kadar her şey.",
    date: "2026-03-20",
    tags: ["veteriner", "yönetim"],
    readTime: "5 dk",
  },
  {
    slug: "pet-kuafor-bakim-rehberi",
    title: "Pet Kuaför: Irklara Göre Bakım Rehberi",
    excerpt: "Golden Retriever'dan Poodle'a, her ırk için özel bakım teknikleri ve tüy kesim tavsiyeleri.",
    date: "2026-03-15",
    tags: ["pet kuaför", "bakım"],
    readTime: "7 dk",
  },
  {
    slug: "asi-takvimi-neden-onemli",
    title: "Aşı Takvimi Neden Bu Kadar Önemli?",
    excerpt: "Evcil hayvanınızın sağlığını korumak için düzenli aşılamanın önemi ve aşı takvimi rehberi.",
    date: "2026-03-10",
    tags: ["veteriner", "aşı"],
    readTime: "4 dk",
  },
  {
    slug: "dijital-donusum-veteriner",
    title: "Veteriner Kliniklerinde Dijital Dönüşüm",
    excerpt: "Kağıt dosyalardan dijital hasta dosyalarına geçiş sürecinde bilmeniz gerekenler.",
    date: "2026-03-05",
    tags: ["veteriner", "teknoloji"],
    readTime: "6 dk",
  },
  {
    slug: "musteri-memnuniyeti-artirma",
    title: "Müşteri Memnuniyetini Artırmanın 7 Yolu",
    excerpt: "Randevu hatırlatmalarından kişiselleştirilmiş hizmete, müşterilerinizi mutlu etmenin pratik yolları.",
    date: "2026-02-28",
    tags: ["yönetim", "müşteri"],
    readTime: "5 dk",
  },
  {
    slug: "stok-yonetimi-ipuclari",
    title: "Etkili Stok Yönetimi İçin Pratik İpuçları",
    excerpt: "İlaç ve malzeme stoğunuzu verimli yönetin, israfı önleyin ve maliyetleri düşürün.",
    date: "2026-02-20",
    tags: ["yönetim", "stok"],
    readTime: "4 dk",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-white/80">Veteriner bakımı, pet kuaför ve işletme yönetimi hakkında faydalı yazılar</p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 bg-gradient-to-br from-[#2D9F6F]/20 to-emerald-100 flex items-center justify-center">
                    <span className="text-5xl">📝</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <time>{new Date(post.date).toLocaleDateString("tr-TR")}</time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-bold text-[#1a1a2e] group-hover:text-[#2D9F6F] transition mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
