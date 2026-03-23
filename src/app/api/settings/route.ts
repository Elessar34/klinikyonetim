import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Tenant ayarları
export async function GET() {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: {
      name: true, slug: true, businessType: true, phone: true, email: true,
      address: true, city: true, district: true, logoUrl: true,
      website: true, taxNumber: true,
    },
  })

  return NextResponse.json(tenant)
}

// PUT — Tenant ayarları güncelle
export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  // Only ADMIN or OWNER can update
  if (!["ADMIN", "OWNER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 })
  }

  try {
    const body = await request.json()

    const tenant = await prisma.tenant.update({
      where: { id: session.user.tenantId },
      data: {
        name: body.name || undefined,
        phone: body.phone || undefined,
        email: body.email || undefined,
        address: body.address || undefined,
        city: body.city || undefined,
        district: body.district || undefined,
        website: body.website || undefined,
        taxNumber: body.taxNumber || undefined,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Tenant",
        entityId: tenant.id,
        details: { updatedFields: Object.keys(body) },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
  }
}
