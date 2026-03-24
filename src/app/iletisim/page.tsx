"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot, faSpinner, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // TODO: API endpoint for contact form
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-[#2D9F6F] to-emerald-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
            <p className="text-xl text-white/80">Size nasıl yardımcı olabiliriz?</p>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Bize Ulaşın</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#2D9F6F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">E-posta</h3>
                    <p className="text-gray-600">info@klinikyonetim.net</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="text-[#2D9F6F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">Telefon</h3>
                    <p className="text-gray-600">+90 (850) 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2D9F6F]/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[#2D9F6F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">Adres</h3>
                    <p className="text-gray-600">Kıbrıs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              {sent ? (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-gray-500">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D9F6F] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D9F6F] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                      type="text" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D9F6F] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj *</label>
                    <textarea
                      required rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D9F6F] focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit" disabled={sending}
                    className="w-full bg-[#2D9F6F] text-white py-3 rounded-lg font-semibold hover:bg-[#248a5f] transition disabled:opacity-50"
                  >
                    {sending ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : null}
                    Gönder
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
