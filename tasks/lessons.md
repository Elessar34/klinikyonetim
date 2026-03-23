# Lessons Learned — PetVet ERP/CRM

## 1. Tailwind CSS — Dinamik Class Oluşturmayın
**Hata:** `text-${variable}` gibi dinamik class kullanımı Tailwind JIT'te çalışmaz.
**Çözüm:** Class'ları tam string olarak saklayın: `iconColor: "text-petvet-green"`, sonra `className={bt.iconColor}`.

## 2. Prisma Import Yolu
**Hata:** Yeni API route'larda `@/lib/prisma` kullandık ama proje `@/lib/db` (default export) kullanıyor.
**Çözüm:** Yeni dosya oluşturmadan önce mevcut çalışan bir API route'un import'unu kontrol et.

## 3. File Module Path Kontrolü
**Kural:** Yeni dosya oluşturmadan önce mutlaka `grep_search` ile mevcut import pattern'ını kontrol et.
