import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit"
import crypto from "crypto"

const resetSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
})

export async function POST(request: NextRequest) {
  // Rate limiting
  const { success } = rateLimit(request)
  if (!success) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const validation = resetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Geçerli bir email adresi girin" },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Always return success to prevent email enumeration
    const user = await prisma.user.findFirst({
      where: { email, isActive: true },
    })

    if (user) {
      // Generate reset token
      const token = crypto.randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 saat

      // Store token
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      // TODO: Email gönderimi (Resend entegrasyonunda aktif edilecek)
      console.log(`[DEV] Password reset token for ${email}: ${token}`)
    }

    // Her durumda başarılı dön (güvenlik - email enumeration önleme)
    return NextResponse.json(
      { message: "Eğer bu email ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}
