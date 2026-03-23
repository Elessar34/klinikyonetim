import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import type { AppointmentStatus } from "@/generated/prisma/client"

// GET — Randevular listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || ""
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const status = searchParams.get("status") || ""
  const assignedToId = searchParams.get("assignedToId") || ""
  const customerId = searchParams.get("customerId") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const where = {
    tenantId: session.user.tenantId,
    ...(status && { status: status as AppointmentStatus }),
    ...(assignedToId && { assignedToId }),
    ...(customerId && { customerId }),
    ...(date && {
      date: {
        gte: new Date(`${date}T00:00:00`),
        lt: new Date(`${date}T23:59:59`),
      },
    }),
    ...(startDate && endDate && !date && {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }),
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        pet: { select: { id: true, name: true, species: true, breed: true } },
        service: { select: { id: true, name: true, duration: true, price: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ])

  return NextResponse.json({
    appointments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

// POST — Yeni randevu
const createAppointmentSchema = z.object({
  date: z.string().min(1, "Tarih gerekli"),
  endDate: z.string().optional(),
  customerId: z.string().min(1, "Müşteri seçimi gerekli"),
  petId: z.string().min(1, "Pet seçimi gerekli"),
  serviceId: z.string().optional(),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW"]).default("PENDING"),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createAppointmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const tenantId = session.user.tenantId

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        notes: data.notes || null,
        customerId: data.customerId,
        petId: data.petId,
        serviceId: data.serviceId || null,
        assignedToId: data.assignedToId || null,
        createdById: session.user.id,
        tenantId,
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        pet: { select: { name: true } },
        service: { select: { name: true } },
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Appointment",
        entityId: appointment.id,
        details: {
          date: data.date,
          customer: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
          pet: appointment.pet.name,
        },
        userId: session.user.id,
        tenantId,
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Appointment create error:", error)
    return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 })
  }
}
