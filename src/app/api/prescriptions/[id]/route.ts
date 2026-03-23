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

  const prescription = await prisma.prescription.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      pet: {
        include: {
          customer: {
            select: { firstName: true, lastName: true, phone: true },
          },
        },
      },
      tenant: {
        select: { name: true, phone: true, email: true, address: true, city: true },
      },
    },
  })

  if (!prescription) {
    return NextResponse.json({ error: "Reçete bulunamadı" }, { status: 404 })
  }

  return NextResponse.json(prescription)
}
