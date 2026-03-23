import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/db"
import { slugify } from "@/lib/utils"
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit"

const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
    .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
    .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
  businessName: z.string().min(2, "İşletme adı en az 2 karakter olmalı"),
  businessType: z.enum(["VETERINER", "PET_KUAFOR"]),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // Rate limiting
  const { success } = rateLimit(request)
  if (!success) {
    return rateLimitResponse()
  }

  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password, businessName, businessType, phone } =
      validation.data

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 409 }
      )
    }

    // Generate unique slug
    let slug = slugify(businessName)
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    })
    if (existingTenant) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create tenant and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: businessName,
          slug,
          businessType: businessType as "VETERINER" | "PET_KUAFOR",
          email,
          phone,
          subscriptionPlan: "TRIAL",
          subscriptionStatus: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 gün
        },
      })

      // Create owner user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          phone,
          role: "OWNER",
          tenantId: tenant.id,
        },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Tenant",
          entityId: tenant.id,
          details: {
            event: "registration",
            businessName,
            businessType,
          },
          userId: user.id,
          tenantId: tenant.id,
        },
      })

      return { tenant, user }
    })

    return NextResponse.json(
      {
        message: "Kayıt başarılı",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
          businessType: result.tenant.businessType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
