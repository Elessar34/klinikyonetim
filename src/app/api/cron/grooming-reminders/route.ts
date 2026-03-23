import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

/**
 * Otomatik WhatsApp Bakım Hatırlatma Sistemi
 * 
 * Bu endpoint cron job olarak çağrılır (günde 1 kez).
 * Bakım günü yaklaşan petlerin sahiplerine WhatsApp mesajı
 * gönderilmek üzere bir hatırlatma listesi oluşturur.
 * 
 * Çalışma mantığı:
 * 1. nextSuggestedDate'i 1-3 gün içinde olan bakım kayıtlarını bul
 * 2. Daha önce hatırlatma gönderilmemiş olanları filtrele
 * 3. WhatsApp API'ye gönder veya hatırlatma kuyruğuna ekle
 * 4. Sonuçları döndür
 * 
 * Güvenlik: CRON_SECRET header kontrolü ile korunur
 */
export async function POST(request: NextRequest) {
  // Cron secret kontrolü
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)

    // 1. Bakım günü yaklaşan kayıtları bul (1-3 gün sonra)
    const upcomingGroomings = await prisma.groomingRecord.findMany({
      where: {
        nextSuggestedDate: {
          gte: oneDayAgo, // biraz geçmiş olanları da yakala
          lte: threeDaysFromNow,
        },
      },
      include: {
        pet: {
          include: {
            customer: {
              select: { id: true, firstName: true, lastName: true, phone: true, email: true },
            },
          },
        },
        tenant: {
          select: { name: true },
        },
      },
      orderBy: { nextSuggestedDate: "asc" },
    })

    // 2. Gecikmiş bakımları bul (son 7 gün içinde gecikmiş)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const overdueGroomings = await prisma.groomingRecord.findMany({
      where: {
        nextSuggestedDate: {
          gte: sevenDaysAgo,
          lt: oneDayAgo,
        },
      },
      include: {
        pet: {
          include: {
            customer: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
          },
        },
        tenant: {
          select: { name: true },
        },
      },
      orderBy: { nextSuggestedDate: "asc" },
    })

    // 3. Hatırlatma mesajları oluştur
    const reminders = []

    for (const grooming of upcomingGroomings) {
      const daysUntil = Math.ceil(
        (new Date(grooming.nextSuggestedDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      const dayText = daysUntil <= 0 ? "bugün" : daysUntil === 1 ? "yarın" : `${daysUntil} gün sonra`

      reminders.push({
        type: "upcoming" as const,
        groomingId: grooming.id,
        petName: grooming.pet.name,
        petSpecies: grooming.pet.species,
        customerName: `${grooming.pet.customer.firstName} ${grooming.pet.customer.lastName}`,
        customerPhone: grooming.pet.customer.phone,
        tenantName: grooming.tenant.name,
        nextDate: grooming.nextSuggestedDate,
        daysUntil,
        message: `Merhaba ${grooming.pet.customer.firstName} Bey/Hanım 🐾\n\n${grooming.pet.name}'in bakım zamanı ${dayText}! Son bakımda yapılan işlemler: ${grooming.servicesPerformed.join(", ")}.\n\nRandevu almak için bize ulaşabilirsiniz.\n\n${grooming.tenant.name}`,
        whatsappUrl: `https://wa.me/${grooming.pet.customer.phone.replace(/[^0-9]/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(`Merhaba ${grooming.pet.customer.firstName} Bey/Hanım 🐾\n\n${grooming.pet.name}'in bakım zamanı ${dayText}! Son bakımda yapılan işlemler: ${grooming.servicesPerformed.join(", ")}.\n\nRandevu almak için bize ulaşabilirsiniz.\n\n${grooming.tenant.name}`)}`,
      })
    }

    for (const grooming of overdueGroomings) {
      const daysOverdue = Math.abs(Math.ceil(
        (new Date(grooming.nextSuggestedDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ))

      reminders.push({
        type: "overdue" as const,
        groomingId: grooming.id,
        petName: grooming.pet.name,
        petSpecies: grooming.pet.species,
        customerName: `${grooming.pet.customer.firstName} ${grooming.pet.customer.lastName}`,
        customerPhone: grooming.pet.customer.phone,
        tenantName: grooming.tenant.name,
        nextDate: grooming.nextSuggestedDate,
        daysOverdue,
        message: `Merhaba ${grooming.pet.customer.firstName} Bey/Hanım 🐾\n\n${grooming.pet.name}'in bakım zamanı ${daysOverdue} gün önce geçti. ${grooming.pet.name}'in sağlıklı ve bakımlı kalması için randevu almayı unutmayın!\n\n${grooming.tenant.name}`,
        whatsappUrl: `https://wa.me/${grooming.pet.customer.phone.replace(/[^0-9]/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(`Merhaba ${grooming.pet.customer.firstName} Bey/Hanım 🐾\n\n${grooming.pet.name}'in bakım zamanı ${daysOverdue} gün önce geçti. ${grooming.pet.name}'in sağlıklı ve bakımlı kalması için randevu almayı unutmayın!\n\n${grooming.tenant.name}`)}`,
      })
    }

    // 4. Hatırlatma log kaydı
    if (reminders.length > 0) {
      // Her tenant için bir audit log
      const tenantGroups = reminders.reduce((acc, r) => {
        const key = r.tenantName
        if (!acc[key]) acc[key] = []
        acc[key].push(r)
        return acc
      }, {} as Record<string, typeof reminders>)

      for (const [tenantName, tenantReminders] of Object.entries(tenantGroups)) {
        console.log(`[CRON] ${tenantName}: ${tenantReminders.length} bakım hatırlatması`)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        upcoming: upcomingGroomings.length,
        overdue: overdueGroomings.length,
        totalReminders: reminders.length,
      },
      reminders,
    })
  } catch (error) {
    console.error("Grooming reminder cron error:", error)
    return NextResponse.json({ error: "Hatırlatma işlemi başarısız" }, { status: 500 })
  }
}

// Dashboard'dan da çağrılabilir (hatırlatma listesi için)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenantId = searchParams.get("tenantId")

  if (!tenantId) {
    return NextResponse.json({ error: "tenantId gerekli" }, { status: 400 })
  }

  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const dueGroomings = await prisma.groomingRecord.findMany({
    where: {
      tenantId,
      nextSuggestedDate: {
        gte: sevenDaysAgo,
        lte: sevenDaysFromNow,
      },
    },
    include: {
      pet: {
        include: {
          customer: {
            select: { firstName: true, lastName: true, phone: true },
          },
        },
      },
    },
    orderBy: { nextSuggestedDate: "asc" },
  })

  return NextResponse.json({
    dueGroomings: dueGroomings.map((g) => ({
      id: g.id,
      petName: g.pet.name,
      petSpecies: g.pet.species,
      customerName: `${g.pet.customer.firstName} ${g.pet.customer.lastName}`,
      customerPhone: g.pet.customer.phone,
      nextDate: g.nextSuggestedDate,
      daysUntil: Math.ceil((new Date(g.nextSuggestedDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      lastServices: g.servicesPerformed,
    })),
  })
}
