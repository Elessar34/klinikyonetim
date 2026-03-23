import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

// GET — Gelir/Gider listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "" // INCOME, EXPENSE
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = {
    tenantId: session.user.tenantId,
    ...(type && { type }),
    ...(startDate && endDate && {
      createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
    }),
  }

  const [transactions, total, summary] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: { tenantId: session.user.tenantId },
      _sum: { amount: true },
    }),
  ])

  const income = summary.find((s) => s.type === "INCOME")?._sum.amount || 0
  const expense = summary.find((s) => s.type === "EXPENSE")?._sum.amount || 0

  return NextResponse.json({
    transactions,
    summary: { income, expense, profit: income - expense },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

// POST — Yeni işlem
const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Kategori gerekli"),
  amount: z.number().positive("Tutar pozitif olmalı"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  customerId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = createTransactionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Doğrulama hatası", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        paymentStatus: "COMPLETED",
        paymentDate: new Date(),
        tenantId: session.user.tenantId,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Transaction",
        entityId: transaction.id,
        details: { type: data.type, amount: data.amount, category: data.category },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transaction create error:", error)
    return NextResponse.json({ error: "İşlem oluşturulamadı" }, { status: 500 })
  }
}
