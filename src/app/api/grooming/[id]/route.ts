import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Tek bakım kaydı detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  const record = await prisma.groomingRecord.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      pet: {
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true, email: true },
          },
        },
      },
    },
  })

  if (!record) {
    return NextResponse.json({ error: "Bakım kaydı bulunamadı" }, { status: 404 })
  }

  // Get previous grooming for comparison
  const previousGrooming = await prisma.groomingRecord.findFirst({
    where: {
      petId: record.petId,
      tenantId: session.user.tenantId,
      groomingDate: { lt: record.groomingDate },
    },
    orderBy: { groomingDate: "desc" },
    select: { id: true, groomingDate: true, servicesPerformed: true },
  })

  // Get next grooming
  const nextGrooming = await prisma.groomingRecord.findFirst({
    where: {
      petId: record.petId,
      tenantId: session.user.tenantId,
      groomingDate: { gt: record.groomingDate },
    },
    orderBy: { groomingDate: "asc" },
    select: { id: true, groomingDate: true },
  })

  return NextResponse.json({ ...record, previousGrooming, nextGrooming })
}

// PUT — Bakım kaydı güncelle
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

    const existing = await prisma.groomingRecord.findFirst({
      where: { id, tenantId: session.user.tenantId },
    })

    if (!existing) {
      return NextResponse.json({ error: "Bakım kaydı bulunamadı" }, { status: 404 })
    }

    const record = await prisma.groomingRecord.update({
      where: { id },
      data: {
        notes: body.notes !== undefined ? body.notes : undefined,
        servicesPerformed: body.servicesPerformed || undefined,
        beforePhotoUrl: body.beforePhotoUrl !== undefined ? body.beforePhotoUrl : undefined,
        afterPhotoUrl: body.afterPhotoUrl !== undefined ? body.afterPhotoUrl : undefined,
        nextSuggestedDate: body.nextSuggestedDate ? new Date(body.nextSuggestedDate) : undefined,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("Grooming update error:", error)
    return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 })
  }
}
