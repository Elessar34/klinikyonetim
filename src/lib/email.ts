// Email şablon sistemi — Resend entegrasyonu için hazır
// Şu an console.log(), Resend API key eklenince aktif olacak

const BRAND = {
  name: "Klinik Yönetim",
  color: "#2D9F6F",
  logo: "🐾",
  url: "https://klinikyonetim.net",
};

function baseLayout(content: string, preheader?: string) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>` : ""}
  <style>
    body { margin:0; padding:0; background:#f4f4f5; font-family:'Inter',Arial,sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.05); }
    .header { background:linear-gradient(135deg,${BRAND.color},#16a34a); padding:32px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:24px; }
    .header .logo { font-size:40px; display:block; margin-bottom:8px; }
    .content { padding:32px; color:#374151; line-height:1.6; }
    .content h2 { color:#1a1a2e; margin-top:0; }
    .btn { display:inline-block; background:${BRAND.color}; color:#fff!important; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:600; margin:16px 0; }
    .footer { background:#f9fafb; padding:24px 32px; text-align:center; color:#9ca3af; font-size:12px; border-top:1px solid #e5e7eb; }
    .info-box { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px; margin:16px 0; }
    .warning-box { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:16px; margin:16px 0; }
    table.details { width:100%; border-collapse:collapse; margin:16px 0; }
    table.details td { padding:8px 12px; border-bottom:1px solid #e5e7eb; }
    table.details td:first-child { color:#6b7280; width:40%; }
    table.details td:last-child { font-weight:600; }
    @media (max-width:600px) { .container { margin:0!important; border-radius:0!important; } .content { padding:20px!important; } }
  </style>
</head>
<body style="margin:0;padding:20px 0;background:#f4f4f5;">
  <div class="container">
    <div class="header">
      <span class="logo">${BRAND.logo}</span>
      <h1>${BRAND.name}</h1>
    </div>
    ${content}
    <div class="footer">
      <p>${BRAND.name} — Veteriner & Pet Kuaför Yönetim Sistemi</p>
      <p><a href="${BRAND.url}" style="color:${BRAND.color};">klinikyonetim.net</a></p>
      <p style="margin-top:8px;">Bu e-posta ${BRAND.name} tarafından gönderilmiştir.</p>
    </div>
  </div>
</body>
</html>`;
}

// =============================================
// EMAIL TEMPLATES
// =============================================

export function welcomeEmail(data: { name: string; businessName: string; loginUrl: string }) {
  return baseLayout(`
    <div class="content">
      <h2>Hoş Geldiniz, ${data.name}! 🎉</h2>
      <p><strong>${data.businessName}</strong> hesabınız başarıyla oluşturuldu.</p>
      <p>Artık ${BRAND.name} ile işletmenizi profesyonelce yönetebilirsiniz:</p>
      <ul>
        <li>📋 Müşteri ve pet profillerini yönetin</li>
        <li>📅 Randevuları kolayca planlayın</li>
        <li>💰 Gelir-gider takibinizi yapın</li>
        <li>📊 Detaylı raporlara ulaşın</li>
      </ul>
      <div style="text-align:center;">
        <a href="${data.loginUrl}" class="btn">Panele Giriş Yap</a>
      </div>
      <p style="color:#6b7280;font-size:13px;">Herhangi bir sorunuz varsa bize iletişim sayfamızdan ulaşabilirsiniz.</p>
    </div>
  `, `${data.businessName} hesabınız hazır!`);
}

export function appointmentReminderEmail(data: {
  customerName: string; petName: string; date: string;
  time: string; service: string; businessName: string; businessPhone?: string;
}) {
  return baseLayout(`
    <div class="content">
      <h2>Randevu Hatırlatması 🕐</h2>
      <p>Sayın ${data.customerName},</p>
      <p><strong>${data.petName}</strong> için randevunuzu hatırlatmak isteriz:</p>
      <div class="info-box">
        <table class="details">
          <tr><td>İşletme</td><td>${data.businessName}</td></tr>
          <tr><td>Tarih</td><td>${data.date}</td></tr>
          <tr><td>Saat</td><td>${data.time}</td></tr>
          <tr><td>Hizmet</td><td>${data.service}</td></tr>
          <tr><td>Pet</td><td>${data.petName}</td></tr>
        </table>
      </div>
      ${data.businessPhone ? `<p>İptal veya değişiklik için: <strong>${data.businessPhone}</strong></p>` : ""}
      <p style="color:#6b7280;font-size:13px;">Lütfen randevu saatinizden 10 dakika önce hazır olunuz.</p>
    </div>
  `, `${data.petName} için randevunuz yarın`);
}

export function appointmentConfirmationEmail(data: {
  customerName: string; petName: string; date: string;
  time: string; service: string; businessName: string;
}) {
  return baseLayout(`
    <div class="content">
      <h2>Randevunuz Onaylandı ✅</h2>
      <p>Sayın ${data.customerName},</p>
      <p><strong>${data.petName}</strong> için randevunuz onaylanmıştır:</p>
      <div class="info-box">
        <table class="details">
          <tr><td>Tarih</td><td>${data.date}</td></tr>
          <tr><td>Saat</td><td>${data.time}</td></tr>
          <tr><td>Hizmet</td><td>${data.service}</td></tr>
        </table>
      </div>
      <p>Sizi ${data.businessName}&apos;da görmekten mutluluk duyacağız!</p>
    </div>
  `, `Randevunuz onaylandı: ${data.date} ${data.time}`);
}

export function vaccinationReminderEmail(data: {
  customerName: string; petName: string; vaccineName: string;
  dueDate: string; businessName: string; bookingUrl?: string;
}) {
  return baseLayout(`
    <div class="content">
      <h2>Aşı Hatırlatması 💉</h2>
      <p>Sayın ${data.customerName},</p>
      <p><strong>${data.petName}</strong> için aşı zamanı yaklaşıyor:</p>
      <div class="warning-box">
        <table class="details">
          <tr><td>Aşı</td><td>${data.vaccineName}</td></tr>
          <tr><td>Son Tarih</td><td>${data.dueDate}</td></tr>
          <tr><td>Pet</td><td>${data.petName}</td></tr>
        </table>
      </div>
      <p>Hayvanınızın sağlığı için lütfen en kısa sürede randevu alınız.</p>
      ${data.bookingUrl ? `<div style="text-align:center;"><a href="${data.bookingUrl}" class="btn">Randevu Al</a></div>` : ""}
    </div>
  `, `${data.petName} için ${data.vaccineName} aşısı zamanı`);
}

export function groomingReminderEmail(data: {
  customerName: string; petName: string; lastGroomingDate: string;
  suggestedDate: string; businessName: string; bookingUrl?: string;
}) {
  return baseLayout(`
    <div class="content">
      <h2>Bakım Hatırlatması ✂️</h2>
      <p>Sayın ${data.customerName},</p>
      <p><strong>${data.petName}</strong> için bakım zamanı geldi!</p>
      <div class="info-box">
        <table class="details">
          <tr><td>Son Bakım</td><td>${data.lastGroomingDate}</td></tr>
          <tr><td>Önerilen Tarih</td><td>${data.suggestedDate}</td></tr>
        </table>
      </div>
      <p>Düzenli bakım hayvanınızın sağlığı ve mutluluğu için önemlidir.</p>
      ${data.bookingUrl ? `<div style="text-align:center;"><a href="${data.bookingUrl}" class="btn">Randevu Al</a></div>` : ""}
    </div>
  `, `${data.petName} için bakım zamanı`);
}

export function invoiceEmail(data: {
  customerName: string; invoiceNumber: string; date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number; businessName: string;
}) {
  const itemRows = data.items.map((i) =>
    `<tr><td>${i.name}</td><td style="text-align:center;">${i.quantity}</td><td style="text-align:right;">₺${i.price.toLocaleString("tr-TR")}</td></tr>`
  ).join("");

  return baseLayout(`
    <div class="content">
      <h2>Fatura 📄</h2>
      <p>Sayın ${data.customerName},</p>
      <p>İşleminize ait fatura bilgileri aşağıdadır:</p>
      <div class="info-box">
        <table class="details">
          <tr><td>Fatura No</td><td>${data.invoiceNumber}</td></tr>
          <tr><td>Tarih</td><td>${data.date}</td></tr>
          <tr><td>İşletme</td><td>${data.businessName}</td></tr>
        </table>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead><tr style="background:#f9fafb;"><th style="padding:8px;text-align:left;border-bottom:2px solid #e5e7eb;">Hizmet/Ürün</th><th style="padding:8px;text-align:center;border-bottom:2px solid #e5e7eb;">Adet</th><th style="padding:8px;text-align:right;border-bottom:2px solid #e5e7eb;">Tutar</th></tr></thead>
        <tbody>${itemRows}</tbody>
        <tfoot><tr><td colspan="2" style="padding:12px 8px;text-align:right;font-weight:700;border-top:2px solid #e5e7eb;">TOPLAM</td><td style="padding:12px 8px;text-align:right;font-weight:700;font-size:18px;color:${BRAND.color};border-top:2px solid #e5e7eb;">₺${data.total.toLocaleString("tr-TR")}</td></tr></tfoot>
      </table>
      <p style="color:#6b7280;font-size:13px;">Ödemeniz için teşekkür ederiz.</p>
    </div>
  `, `Fatura: ${data.invoiceNumber} — ₺${data.total}`);
}

export function passwordResetEmail(data: { name: string; resetUrl: string; expiresInMinutes: number }) {
  return baseLayout(`
    <div class="content">
      <h2>Şifre Sıfırlama 🔐</h2>
      <p>Sayın ${data.name},</p>
      <p>Hesabınız için bir şifre sıfırlama talebi aldık. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
      <div style="text-align:center;">
        <a href="${data.resetUrl}" class="btn">Şifremi Sıfırla</a>
      </div>
      <div class="warning-box">
        <p style="margin:0;font-size:13px;">⚠️ Bu bağlantı <strong>${data.expiresInMinutes} dakika</strong> içinde geçerliliğini yitirecektir.</p>
      </div>
      <p style="color:#6b7280;font-size:13px;">Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.</p>
    </div>
  `, "Şifre sıfırlama talebiniz");
}

// =============================================
// EMAIL SENDER (Resend ready)
// =============================================

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[EMAIL] Resend API key yok — email gönderilmedi:", {
      to: options.to,
      subject: options.subject,
    });
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Klinik Yönetim <noreply@klinikyonetim.net>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("[EMAIL] Gönderim hatası:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[EMAIL] Gönderim hatası:", error);
    return false;
  }
}
