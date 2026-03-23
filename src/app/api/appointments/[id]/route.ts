import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// PATCH — Randevu durumunu güncelle
const updateAppointmentSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW"]).optional(),
  date: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  cancelReason: z.string().optional(),
  assignedToId: z.string().optional(),
  serviceId: z.string().optional(),
})

export async function PATCH(
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
    const validation = updateAppointmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.appointment.findFirst({
      where: { id, tenantId: session.user.tenantId },
    })

    if (!existing) {
      return NextResponse.json({ error: "Randevu bulunamadı" }, { status: 404 })
    }

    const data = validation.data
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        ...(data.status === "CONFIRMED" && { confirmedAt: new Date() }),
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        pet: { select: { name: true } },
        service: { select: { name: true, price: true, category: true } },
      },
    })

    // Auto-create transaction when completed + service has price
    if (data.status === "COMPLETED" && appointment.service?.price) {
      await prisma.transaction.create({
        data: {
          type: "INCOME",
          amount: appointment.service.price,
          category: appointment.service.category || appointment.service.name,
          description: `${appointment.pet.name} — ${appointment.service.name} (${appointment.customer.firstName} ${appointment.customer.lastName})`,
          paymentStatus: "PENDING",
          customerId: appointment.customer.id,
          appointmentId: appointment.id,
          tenantId: session.user.tenantId,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Appointment",
        entityId: id,
        details: { ...data, autoTransaction: data.status === "COMPLETED" && !!appointment.service?.price },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Appointment update error:", error)
    return NextResponse.json({ error: "Randevu güncellenemedi" }, { status: 500 })
  }
}
