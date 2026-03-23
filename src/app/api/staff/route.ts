import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Personel listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const staff = await prisma.staff.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ staff })
}

// POST — Yeni personel
const createStaffSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string().min(1, "Pozisyon gerekli"),
  salary: z.number().optional(),
  startDate: z.string().optional(),
  specializations: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createStaffSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const staff = await prisma.staff.create({
      data: {
        ...data,
        email: data.email || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        tenantId: session.user.tenantId,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Staff",
        entityId: staff.id,
        details: { firstName: data.firstName, lastName: data.lastName, role: data.role },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error("Staff create error:", error)
    return NextResponse.json({ error: "Personel oluşturulamadı" }, { status: 500 })
  }
}
