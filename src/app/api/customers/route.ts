import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Müşteri listele (arama + sayfalama)
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const status = searchParams.get("status") // active, inactive, all

  const where = {
    tenantId: session.user.tenantId,
    ...(status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" as const } },
            { customerNo: { contains: search } },
          ],
        }
      : {}),
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        pets: { select: { id: true, name: true, species: true } },
        _count: { select: { appointments: true, transactions: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ])

  return NextResponse.json({
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// POST — Yeni müşteri oluştur
const petSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).default("UNKNOWN"),
  dateOfBirth: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  microchipNo: z.string().optional(),
})

const createCustomerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
  phoneSecondary: z.string().optional(),
  email: z.string().email("Geçerli bir email girin").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  notes: z.string().optional(),
  pets: z.array(petSchema).optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createCustomerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { pets: petEntries, ...customerData } = validation.data
    const tenantId = session.user.tenantId

    // Generate customer number
    const lastCustomer = await prisma.customer.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: { customerNo: true },
    })

    let nextNo = 1
    if (lastCustomer?.customerNo) {
      const match = lastCustomer.customerNo.match(/(\d+)$/)
      if (match) nextNo = parseInt(match[1]) + 1
    }
    const customerNo = `M${nextNo.toString().padStart(4, "0")}`

    const result = await prisma.$transaction(async (tx) => {
      // Create customer
      const customer = await tx.customer.create({
        data: {
          ...customerData,
          email: customerData.email || null,
          customerNo,
          tenantId,
        },
      })

      // Create pets if provided
      const createdPets = []
      if (petEntries && petEntries.length > 0) {
        for (const pet of petEntries) {
          if (pet.name.trim()) {
            const created = await tx.pet.create({
              data: {
                name: pet.name,
                species: pet.species,
                breed: pet.breed || null,
                gender: pet.gender,
                color: pet.color || null,
                weight: pet.weight ? parseFloat(pet.weight) : null,
                microchipNo: pet.microchipNo || null,
                dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth) : null,
                customerId: customer.id,
                tenantId,
              },
            })
            createdPets.push(created)
          }
        }
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Customer",
          entityId: customer.id,
          details: {
            customerNo,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            petsCreated: createdPets.length,
          },
          userId: session.user.id,
          tenantId,
        },
      })

      return { ...customer, pets: createdPets }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Customer create error:", error)
    return NextResponse.json({ error: "Müşteri oluşturulamadı" }, { status: 500 })
  }
}
