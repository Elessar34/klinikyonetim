# Klinik Yönetim — Eksik & Askıda Kalan İşler

> Son güncelleme: 25 Mart 2026

---

## ⏸️ Askıda (Kullanıcı Kararı Bekleniyor)

- [ ] **SMS Entegrasyonu** — Provider seçilmesi lazım (Netgsm, İletimerkezi, Twilio vs.)
- [ ] **iyzico Ödeme Entegrasyonu** — iyzico hesap ve API key hazır olunca entegre edilecek
- [ ] **WhatsApp Business API** — Her tenant kendi WhatsApp'ıyla müşterilerine ulaşacak. Meta Business API + webhook kurulumu gerekiyor. Tenant bazlı token yönetimi araştırılacak.

---

## 📋 Yapılabilecek Ek İşler

### Sayfa & İçerik
- [ ] `/referanslar` sayfası — Müşteri yorumları / testimonial'lar
- [ ] `/panel/blog` — Admin panelden blog yazısı ekleme/düzenleme (CRUD, draft/publish)
- [ ] Blog yazılarını DB'den çekme (şu an statik data)

### Otomasyon & Bildirim
- [ ] **Otomatik hatırlatmalar (cron job)**
  - Ertesi gün randevu teyidi (SMS/email)
  - Aşı hatırlatma (yaklaşan aşılar)
  - Bakım hatırlatma (pet kuaför periyodik bakım)
  - Pet doğum günü mesajı
- [ ] **E-posta aktifleştirme** — Resend API key alınması + domain verify (klinikyonetim.net)

### Güvenlik
- [ ] **Zod validation sıkılaştırma** — Tüm API POST/PUT/PATCH route'larında input validasyonu
- [ ] **CORS policy** — Strict origin kontrolü
- [ ] **Rate limiting** — API abuse önleme
- [ ] **Security audit** — XSS, CSRF, injection kontrolleri

### POS & Stok
- [ ] **Smart POS entegrasyonu** — Android POS cihazına tutar gönderme (PAX, Ingenico APOS API)
- [ ] **Stok raporları** — Aylık stok hareket raporu, en çok satan ürünler
- [ ] **Tedarikçi yönetimi** — Tedarikçi CRUD + sipariş takibi

### Panel İyileştirmeleri
- [ ] **Ameliyat kayıtları API** — Şu an sadece UI var, backend bağlantısı yapılacak
- [ ] **Fatura PDF oluşturma** — Satış faturası PDF export
- [ ] **Veri dışa aktarma** — Müşteri, satış, stok verilerini Excel/CSV export
