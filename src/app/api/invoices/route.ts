import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0),
  taxRate: z.number().min(0).max(100).default(0),
})

const createInvoiceSchema = z.object({
  customerId: z.string().min(1),
  dueDate: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
  notes: z.string().optional(),
})

// GET — Fatura listele
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customerId")

  const where: Record<string, unknown> = {
    tenantId: session.user.tenantId,
  }
  if (customerId) where.customerId = customerId

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      customer: { select: { firstName: true, lastName: true, phone: true, email: true, address: true, customerNo: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ invoices })
}

// POST — Fatura oluştur
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createInvoiceSchema.parse(body)
    const tenantId = session.user.tenantId

    // Auto-generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      select: { invoiceNo: true },
    })

    let nextNo = 1
    if (lastInvoice?.invoiceNo) {
      const match = lastInvoice.invoiceNo.match(/(\d+)$/)
      if (match) nextNo = parseInt(match[1]) + 1
    }
    const invoiceNo = `FTR-${new Date().getFullYear()}-${nextNo.toString().padStart(4, "0")}`

    // Calculate totals
    const items = data.items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice
      return { ...item, totalPrice }
    })
    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0)
    const taxAmount = items.reduce((sum, i) => sum + (i.totalPrice * i.taxRate / 100), 0)

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        totalAmount,
        taxAmount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        customerId: data.customerId,
        tenantId,
        items: {
          create: items,
        },
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        items: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Invoice",
        entityId: invoice.id,
        details: { invoiceNo, totalAmount, itemCount: items.length },
        userId: session.user.id,
        tenantId,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 })
    }
    console.error("Invoice create error:", error)
    return NextResponse.json({ error: "Fatura oluşturulamadı" }, { status: 500 })
  }
}
