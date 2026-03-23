import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Pet detay
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  const pet = await prisma.pet.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      customer: true,
      medicalRecords: { orderBy: { visitDate: "desc" }, take: 10 },
      vaccinations: { orderBy: { administeredDate: "desc" } },
      prescriptions: { orderBy: { createdAt: "desc" }, take: 5 },
      labResults: { orderBy: { createdAt: "desc" }, take: 5 },
      groomingRecords: { orderBy: { groomingDate: "desc" }, take: 10 },
      appointments: { orderBy: { date: "desc" }, take: 10, include: { service: true } },
    },
  })

  if (!pet) {
    return NextResponse.json({ error: "Pet bulunamadı" }, { status: 404 })
  }

  return NextResponse.json(pet)
}

// PUT — Pet güncelle
const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).optional(),
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
  isAlive: z.boolean().optional(),
  imageUrl: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const validation = updatePetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.pet.findFirst({
      where: { id, tenantId: session.user.tenantId },
    })

    if (!existing) {
      return NextResponse.json({ error: "Pet bulunamadı" }, { status: 404 })
    }

    const data = validation.data
    const pet = await prisma.pet.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Pet",
        entityId: id,
        details: data,
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(pet)
  } catch (error) {
    console.error("Pet update error:", error)
    return NextResponse.json({ error: "Pet güncellenemedi" }, { status: 500 })
  }
}
