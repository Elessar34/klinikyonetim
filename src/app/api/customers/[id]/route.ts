import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

// GET — Tek müşteri detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  const customer = await prisma.customer.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      pets: {
        include: {
          _count: { select: { appointments: true, medicalRecords: true, groomingRecords: true } },
        },
      },
      appointments: {
        orderBy: { date: "desc" },
        take: 5,
        include: { service: true, pet: true },
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { pets: true, appointments: true, transactions: true },
      },
    },
  })

  if (!customer) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 })
  }

  return NextResponse.json(customer)
}

// PUT — Müşteri güncelle
const updateCustomerSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  phoneSecondary: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  portalEnabled: z.boolean().optional(),
  portalPassword: z.string().min(4).optional(),
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
    const validation = updateCustomerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Ensure customer belongs to tenant
    const existing = await prisma.customer.findFirst({
      where: { id, tenantId: session.user.tenantId },
    })

    if (!existing) {
      return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 })
    }

    // Hash portal password if provided
    const updateData = { ...validation.data } as Record<string, unknown>;
    if (updateData.portalPassword && typeof updateData.portalPassword === "string") {
      updateData.portalPassword = await bcrypt.hash(updateData.portalPassword as string, 10);
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: { pets: true },
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Customer",
        entityId: id,
        details: validation.data,
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Customer update error:", error)
    return NextResponse.json({ error: "Müşteri güncellenemedi" }, { status: 500 })
  }
}

// DELETE — Müşteri sil (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.customer.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 })
  }

  // Soft delete
  await prisma.customer.update({
    where: { id },
    data: { isActive: false },
  })

  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "Customer",
      entityId: id,
      details: { softDelete: true },
      userId: session.user.id,
      tenantId: session.user.tenantId,
    },
  })

  return NextResponse.json({ message: "Müşteri pasife alındı" })
}
