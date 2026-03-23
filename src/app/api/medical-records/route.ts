import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Muayene kayıtları
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const petId = searchParams.get("petId") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = { tenantId: session.user.tenantId, ...(petId && { petId }) }
  const [records, total] = await Promise.all([
    prisma.medicalRecord.findMany({
      where, include: { pet: { select: { id: true, name: true, species: true, breed: true, customer: { select: { id: true, firstName: true, lastName: true } } } } },
      orderBy: { visitDate: "desc" }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.medicalRecord.count({ where }),
  ])
  return NextResponse.json({ records, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
}

// POST — Yeni muayene kaydı
const schema = z.object({
  petId: z.string().min(1), chiefComplaint: z.string().optional(), diagnosis: z.string().optional(),
  treatment: z.string().optional(), notes: z.string().optional(),
  weight: z.number().optional(), temperature: z.number().optional(),
  heartRate: z.number().optional(), respiratoryRate: z.number().optional(),
  followUpDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  try {
    const body = await request.json()
    const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ error: "Doğrulama hatası", details: v.error.flatten().fieldErrors }, { status: 400 })
    const d = v.data
    const record = await prisma.medicalRecord.create({
      data: { ...d, followUpDate: d.followUpDate ? new Date(d.followUpDate) : null, tenantId: session.user.tenantId },
      include: { pet: { select: { name: true } } },
    })
    await prisma.auditLog.create({ data: { action: "CREATE", entity: "MedicalRecord", entityId: record.id, details: { pet: record.pet.name, diagnosis: d.diagnosis }, userId: session.user.id, tenantId: session.user.tenantId } })
    return NextResponse.json(record, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Kayıt oluşturulamadı" }, { status: 500 }) }
}
