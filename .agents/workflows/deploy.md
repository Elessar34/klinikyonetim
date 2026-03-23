---
description: Railway'e deploy etme ve klinikyonetim.net domain ayarlama adımları
---

# Railway Deploy Kurulumu

## 1. GitHub Repo Oluştur

```bash
# GitHub'da yeni repo oluştur (web arayüzünden veya CLI ile)
# Repo adı: klinik-yonetim (private olmalı)

# Remote ekle ve push et
cd /Users/basak/Documents/35/Pet_ERP_CRM/petvet
git remote add origin git@github.com:KULLANICI_ADIN/klinik-yonetim.git
git add -A
git commit -m "feat: full application with subdomain routing"
git push -u origin main
```

## 2. Railway Projesi Oluştur

1. https://railway.app adresine git
2. "New Project" → "Deploy from GitHub Repo"
3. `klinik-yonetim` reposunu seç
4. Railway otomatik olarak Next.js'i tanıyacak (Nixpacks)

## 3. Railway PostgreSQL Ekle

1. Railway Dashboard'da projenin içinde "New" → "Database" → "PostgreSQL"
2. PostgreSQL servisine tıkla → "Connect" sekmesi → `DATABASE_URL` değerini kopyala
3. Bu URL'yi Next.js servisinin environment variable'larına ekle

## 4. Environment Variables Ayarla

Railway Dashboard → Next.js servisi → "Variables" sekmesi:

```env
# Zorunlu
DATABASE_URL=postgresql://... (Railway PostgreSQL'den kopyala)
NEXTAUTH_URL=https://klinikyonetim.net
NEXTAUTH_SECRET=<openssl rand -base64 32 ile üret>
NEXT_PUBLIC_APP_NAME=Klinik Yönetim
NEXT_PUBLIC_APP_URL=https://klinikyonetim.net
NEXT_PUBLIC_ROOT_DOMAIN=klinikyonetim.net
CRON_SECRET=<rastgele bir string>

# Opsiyonel (sonra eklenecek)
# RESEND_API_KEY=
# NETGSM_USERCODE=
# NETGSM_PASSWORD=
# R2_ACCOUNT_ID=
# R2_ACCESS_KEY_ID=
# R2_SECRET_ACCESS_KEY=
# R2_BUCKET_NAME=
# R2_PUBLIC_URL=
```

## 5. Build Komutu Ayarla

Railway Dashboard → Next.js servisi → "Settings":

- **Build Command:** `npx prisma generate && npx prisma db push && npm run build`
- **Start Command:** `npm start`
- **Port:** `3000` (otomatik tanınır)

## 6. Domain Ayarları

### 6a. Railway'de Custom Domain Ekle

Railway Dashboard → Next.js servisi → "Settings" → "Networking" → "Custom Domain":

1. `klinikyonetim.net` ekle → Railway size bir CNAME/A kaydı verecek
2. `*.klinikyonetim.net` ekle (wildcard subdomain) → Aynı hedef

### 6b. DNS Ayarları (Domain panel - Cloudflare önerilir)

Domain'ini Cloudflare'a transfer et veya nameserver'ları Cloudflare'a yönlendir. Sonra:

| Tip | İsim | Hedef | Proxy |
|-----|------|-------|-------|
| CNAME | `@` | `<railway-domain>.up.railway.app` | ✅ |
| CNAME | `*` | `<railway-domain>.up.railway.app` | ✅ |
| CNAME | `vet` | `<railway-domain>.up.railway.app` | ✅ |
| CNAME | `pet` | `<railway-domain>.up.railway.app` | ✅ |

> **Not:** Wildcard (`*`) CNAME kaydı Cloudflare Free plan'da SSL ile çalışır.
> Railway'in verdiği domain'i `<railway-domain>.up.railway.app` olarak kopyalayın.

### 6c. SSL

- Cloudflare kullanıyorsanız: SSL/TLS → "Full (strict)" seçin
- Railway otomatik SSL sağlar
- Cloudflare'da "Edge Certificates" → "Always Use HTTPS" açın

## 7. Prisma Migration

İlk deploy'dan sonra veritabanı otomatik oluşturulur (`prisma db push` build komutunda).

Manuel migration gerekirse:
```bash
# Railway CLI ile
railway run npx prisma db push
railway run npx prisma db seed  # Seed varsa
```

## 8. İlk Admin Kullanıcı

Deploy sonrası `https://klinikyonetim.net/kayit` adresinden kayıt olun.

## 9. Doğrulama Kontrol Listesi

- [ ] `https://klinikyonetim.net` → Landing page açılıyor
- [ ] `https://vet.klinikyonetim.net` → Login sayfası (Veteriner teması)
- [ ] `https://pet.klinikyonetim.net` → Login sayfası (Pet Kuaför teması)
- [ ] Kayıt olma çalışıyor
- [ ] Giriş yapma çalışıyor
- [ ] Panel açılıyor
- [ ] `https://[tenant].klinikyonetim.net` → Müşteri portalı
