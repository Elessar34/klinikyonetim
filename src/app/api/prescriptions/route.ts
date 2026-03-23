import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Reçeteler
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const petId = searchParams.get("petId") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = { tenantId: session.user.tenantId, ...(petId && { petId }) }
  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where, include: { pet: { select: { id: true, name: true, species: true, customer: { select: { id: true, firstName: true, lastName: true } } } } },
      orderBy: { prescriptionDate: "desc" }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.prescription.count({ where }),
  ])
  return NextResponse.json({ prescriptions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
}

// POST — Yeni reçete
const schema = z.object({
  petId: z.string().min(1),
  medications: z.array(z.object({ name: z.string(), dosage: z.string(), frequency: z.string(), duration: z.string() })).min(1),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  try {
    const body = await request.json()
    const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ error: "Doğrulama hatası", details: v.error.flatten().fieldErrors }, { status: 400 })
    const d = v.data
    const rx = await prisma.prescription.create({
      data: { petId: d.petId, medications: d.medications, notes: d.notes || null, tenantId: session.user.tenantId },
      include: { pet: { select: { name: true } } },
    })
    await prisma.auditLog.create({ data: { action: "CREATE", entity: "Prescription", entityId: rx.id, details: { pet: rx.pet.name, medCount: d.medications.length }, userId: session.user.id, tenantId: session.user.tenantId } })
    return NextResponse.json(rx, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Reçete oluşturulamadı" }, { status: 500 }) }
}
