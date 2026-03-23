import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Lab sonuçları
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const petId = searchParams.get("petId") || ""
  const status = searchParams.get("status") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = { tenantId: session.user.tenantId, ...(petId && { petId }), ...(status && { status }) }
  const [results, total] = await Promise.all([
    prisma.labResult.findMany({
      where, include: { pet: { select: { id: true, name: true, species: true, customer: { select: { id: true, firstName: true, lastName: true } } } } },
      orderBy: { testDate: "desc" }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.labResult.count({ where }),
  ])
  return NextResponse.json({ results, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
}

// POST — Yeni lab sonucu
const schema = z.object({
  petId: z.string().min(1), testName: z.string().min(1),
  results: z.array(z.object({ parameter: z.string(), value: z.string(), unit: z.string().optional(), referenceRange: z.string().optional() })).optional(),
  notes: z.string().optional(), fileUrl: z.string().optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  try {
    const body = await request.json()
    const v = schema.safeParse(body)
    if (!v.success) return NextResponse.json({ error: "Doğrulama hatası", details: v.error.flatten().fieldErrors }, { status: 400 })
    const d = v.data
    const result = await prisma.labResult.create({
      data: { petId: d.petId, testName: d.testName, results: d.results || undefined, notes: d.notes || null, fileUrl: d.fileUrl || null, status: d.status, tenantId: session.user.tenantId },
      include: { pet: { select: { name: true } } },
    })
    await prisma.auditLog.create({ data: { action: "CREATE", entity: "LabResult", entityId: result.id, details: { pet: result.pet.name, test: d.testName }, userId: session.user.id, tenantId: session.user.tenantId } })
    return NextResponse.json(result, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Lab sonucu oluşturulamadı" }, { status: 500 }) }
}
