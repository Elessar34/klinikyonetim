import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import type { BusinessType } from "@/generated/prisma/client"

// GET — Hizmetler listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const services = await prisma.service.findMany({
    where: {
      tenantId: session.user.tenantId,
      isActive: true,
    },
    orderBy: { category: "asc" },
  })

  return NextResponse.json({ services })
}

// POST — Yeni hizmet
const createServiceSchema = z.object({
  name: z.string().min(1, "Hizmet adı gerekli"),
  description: z.string().optional(),
  duration: z.number().min(1, "Süre gerekli"),
  price: z.number().min(0, "Fiyat gerekli"),
  category: z.string().min(1, "Kategori gerekli"),
  applicableTo: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createServiceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        price: data.price,
        category: data.category,
        applicableTo: (data.applicableTo || [session.user.businessType]) as BusinessType[],
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Service create error:", error)
    return NextResponse.json({ error: "Hizmet oluşturulamadı" }, { status: 500 })
  }
}
