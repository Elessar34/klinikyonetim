import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Bakım kayıtları listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const petId = searchParams.get("petId") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = {
    tenantId: session.user.tenantId,
    ...(petId && { petId }),
    ...(startDate && endDate && {
      groomingDate: { gte: new Date(startDate), lte: new Date(endDate) },
    }),
  }

  const [records, total] = await Promise.all([
    prisma.groomingRecord.findMany({
      where,
      include: {
        pet: {
          select: { id: true, name: true, species: true, breed: true, color: true, coatType: true, skinSensitivity: true,
            customer: { select: { id: true, firstName: true, lastName: true, phone: true } }
          },
        },
      },
      orderBy: { groomingDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.groomingRecord.count({ where }),
  ])

  return NextResponse.json({
    records,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

// POST — Yeni bakım kaydı
const createGroomingSchema = z.object({
  petId: z.string().min(1, "Pet seçimi gerekli"),
  servicesPerformed: z.array(z.string()).min(1, "En az bir hizmet seçiniz"),
  notes: z.string().optional(),
  beforePhotoUrl: z.string().optional(),
  afterPhotoUrl: z.string().optional(),
  productsUsed: z.array(z.object({ product: z.string(), quantity: z.number() })).optional(),
  nextSuggestedDate: z.string().optional(),
  groomingDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createGroomingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const tenantId = session.user.tenantId

    // Verify pet belongs to tenant
    const pet = await prisma.pet.findFirst({
      where: { id: data.petId, tenantId },
      include: { customer: { select: { firstName: true, lastName: true } } },
    })

    if (!pet) {
      return NextResponse.json({ error: "Pet bulunamadı" }, { status: 404 })
    }

    const record = await prisma.groomingRecord.create({
      data: {
        petId: data.petId,
        servicesPerformed: data.servicesPerformed,
        notes: data.notes || null,
        beforePhotoUrl: data.beforePhotoUrl || null,
        afterPhotoUrl: data.afterPhotoUrl || null,
        productsUsed: data.productsUsed || undefined,
        nextSuggestedDate: data.nextSuggestedDate ? new Date(data.nextSuggestedDate) : null,
        groomingDate: data.groomingDate ? new Date(data.groomingDate) : new Date(),
        tenantId,
      },
      include: { pet: { select: { name: true } } },
    })

    // Update pet's grooming cycle
    if (data.nextSuggestedDate) {
      const diffDays = Math.ceil((new Date(data.nextSuggestedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (diffDays > 0) {
        await prisma.pet.update({
          where: { id: data.petId },
          data: { groomingCycleDays: diffDays },
        })
      }
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "GroomingRecord",
        entityId: record.id,
        details: {
          pet: pet.name,
          owner: `${pet.customer.firstName} ${pet.customer.lastName}`,
          services: data.servicesPerformed,
        },
        userId: session.user.id,
        tenantId,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error("Grooming create error:", error)
    return NextResponse.json({ error: "Bakım kaydı oluşturulamadı" }, { status: 500 })
  }
}
