import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const saleItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
});

const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "En az bir ürün gerekli"),
  customerId: z.string().optional(),
  paymentMethod: z.enum(["NAKIT", "KART", "HAVALE"]).default("NAKIT"),
  discountAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { tenantId: session.user.tenantId };

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: { include: { product: { select: { name: true, barcode: true } } } },
        customer: { select: { firstName: true, lastName: true } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Daily summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = await prisma.sale.aggregate({
      where: {
        tenantId: session.user.tenantId,
        createdAt: { gte: today },
      },
      _sum: { netAmount: true },
      _count: true,
    });

    return NextResponse.json({
      sales,
      todaySummary: {
        total: todaySales._sum.netAmount || 0,
        count: todaySales._count || 0,
      },
    });
  } catch (error) {
    console.error("Sales GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = saleSchema.parse(body);

    // Calculate totals
    let totalAmount = 0;
    const itemsToCreate = data.items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice - item.discount;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        totalPrice: itemTotal,
      };
    });

    const netAmount = totalAmount - data.discountAmount;

    // Generate sale number
    const lastSale = await prisma.sale.findFirst({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
      select: { saleNumber: true },
    });
    const lastNum = lastSale ? parseInt(lastSale.saleNumber.replace("SLS-", "")) : 0;
    const saleNumber = `SLS-${String(lastNum + 1).padStart(4, "0")}`;

    // Create sale with items in transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create sale
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          totalAmount,
          discountAmount: data.discountAmount,
          taxAmount: 0,
          netAmount,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          customerId: data.customerId || undefined,
          userId: session.user.id,
          tenantId: session.user.tenantId,
          items: { create: itemsToCreate },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      });

      // Reduce stock for each item
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        // Stock movement
        await tx.stockMovement.create({
          data: {
            type: "OUT",
            quantity: -item.quantity,
            reason: `Satış: ${saleNumber}`,
            productId: item.productId,
            userId: session.user.id,
            tenantId: session.user.tenantId,
          },
        });
      }

      return newSale;
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Sale",
        entityId: sale.id,
        details: { saleNumber, totalAmount: netAmount, itemCount: data.items.length },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    // Create INCOME transaction for accounting/dashboard
    const itemNames = sale.items.map((i) => i.product.name).join(", ");
    await prisma.transaction.create({
      data: {
        type: "INCOME",
        amount: netAmount,
        category: "Ürün Satışı",
        description: `${saleNumber} — ${itemNames}`,
        paymentMethod: data.paymentMethod === "NAKIT" ? "CASH" : data.paymentMethod === "KART" ? "CREDIT_CARD" : "BANK_TRANSFER",
        tenantId: session.user.tenantId,
      },
    });

    // Check low stock after sale
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product && product.stockQuantity <= product.minStockLevel) {
        await prisma.notification.create({
          data: {
            type: "stock_low",
            channel: "push",
            title: "Düşük Stok Uyarısı",
            message: `${product.name} stok seviyesi (${product.stockQuantity}) minimum seviyenin (${product.minStockLevel}) altına düştü.`,
            tenantId: session.user.tenantId,
          },
        });
      }
    }

    return NextResponse.json({ sale }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Sales POST error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
