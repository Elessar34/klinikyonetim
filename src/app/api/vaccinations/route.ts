import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Aşı kayıtları
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const petId = searchParams.get("petId") || ""
  const dueOnly = searchParams.get("dueOnly") === "true"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const where = {
    tenantId: session.user.tenantId,
    ...(petId && { petId }),
    ...(dueOnly && { nextDueDate: { lte: sevenDaysFromNow } }),
  }

  const [vaccinations, total] = await Promise.all([
    prisma.vaccination.findMany({
      where, include: { pet: { select: { id: true, name: true, species: true, customer: { select: { id: true, firstName: true, lastName: true, phone: true } } } } },
      orderBy: { administeredDate: "desc" }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.vaccination.count({ where }),
  ])
  return NextResponse.json({ vaccinations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
}

// POST — Yeni aşı kaydı
const schema = z.object({
  petId: z.string().min(1), vaccineName: z.string().min(1), vaccineType: z.string().optional(),
  batchNumber: z.string().optional(), administeredDate: z.string().optional(),
  nextDueDate: z.string().optional(), notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  try {
    const body = await request.json()
    const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ error: "Doğrulama hatası", details: v.error.flatten().fieldErrors }, { status: 400 })
    const d = v.data
    const vacc = await prisma.vaccination.create({
      data: {
        petId: d.petId, vaccineName: d.vaccineName, vaccineType: d.vaccineType || null,
        batchNumber: d.batchNumber || null,
        administeredDate: d.administeredDate ? new Date(d.administeredDate) : new Date(),
        nextDueDate: d.nextDueDate ? new Date(d.nextDueDate) : null,
        notes: d.notes || null, tenantId: session.user.tenantId,
      },
      include: { pet: { select: { name: true } } },
    })
    await prisma.auditLog.create({ data: { action: "CREATE", entity: "Vaccination", entityId: vacc.id, details: { pet: vacc.pet.name, vaccine: d.vaccineName }, userId: session.user.id, tenantId: session.user.tenantId } })
    return NextResponse.json(vacc, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Aşı kaydı oluşturulamadı" }, { status: 500 }) }
}
