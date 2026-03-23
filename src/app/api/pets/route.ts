import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Pet listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const species = searchParams.get("species") || ""
  const customerId = searchParams.get("customerId") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = {
    tenantId: session.user.tenantId,
    isAlive: true,
    ...(species && { species }),
    ...(customerId && { customerId }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { breed: { contains: search, mode: "insensitive" as const } },
            { microchipNo: { contains: search } },
          ],
        }
      : {}),
  }

  const [pets, total] = await Promise.all([
    prisma.pet.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        _count: { select: { appointments: true, medicalRecords: true, vaccinations: true, groomingRecords: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pet.count({ where }),
  ])

  return NextResponse.json({
    pets,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

// POST — Yeni pet
const createPetSchema = z.object({
  name: z.string().min(1, "İsim gerekli"),
  species: z.string().min(1, "Tür seçiniz"),
  breed: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).default("UNKNOWN"),
  dateOfBirth: z.string().optional(),
  weight: z.number().optional(),
  color: z.string().optional(),
  microchipNo: z.string().optional(),
  notes: z.string().optional(),
  allergies: z.string().optional(),
  bloodType: z.string().optional(),
  coatType: z.string().optional(),
  skinSensitivity: z.string().optional(),
  groomingCycleDays: z.number().optional(),
  customerId: z.string().min(1, "Müşteri seçimi gerekli"),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createPetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const tenantId = session.user.tenantId

    // Verify customer belongs to tenant
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, tenantId },
    })

    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 })
    }

    const pet = await prisma.pet.create({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        tenantId,
      },
      include: { customer: { select: { firstName: true, lastName: true } } },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Pet",
        entityId: pet.id,
        details: { name: data.name, species: data.species, owner: `${customer.firstName} ${customer.lastName}` },
        userId: session.user.id,
        tenantId,
      },
    })

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    console.error("Pet create error:", error)
    return NextResponse.json({ error: "Pet oluşturulamadı" }, { status: 500 })
  }
}
