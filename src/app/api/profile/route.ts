import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// PUT — Profil güncelle
export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: body.firstName || undefined,
        lastName: body.lastName || undefined,
        phone: body.phone || undefined,
      },
    })

    return NextResponse.json({ message: "Profil güncellendi", user: { firstName: user.firstName, lastName: user.lastName } })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Profil güncellenemedi" }, { status: 500 })
  }
}
