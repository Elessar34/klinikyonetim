import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params

  const invoice = await prisma.invoice.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      customer: {
        select: {
          firstName: true, lastName: true, phone: true, email: true,
          address: true, city: true, district: true, customerNo: true,
        },
      },
      items: { orderBy: { createdAt: "asc" } },
      tenant: {
        select: { name: true, phone: true, email: true, address: true, city: true, taxNumber: true },
      },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Fatura bulunamadı" }, { status: 404 })
  }

  return NextResponse.json(invoice)
}

// PATCH — Fatura durumunu güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: body.status },
  })

  return NextResponse.json(invoice)
}
