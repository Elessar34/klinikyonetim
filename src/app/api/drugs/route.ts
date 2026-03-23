import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const drugSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0),
  costPrice: z.number().optional(),
  stockQuantity: z.number().int().min(0),
  minStockLevel: z.number().int().min(0).default(5),
  unit: z.string().default("adet"),
  expiryDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";

    const where: Record<string, unknown> = {
      tenantId: session.user.tenantId,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const drugs = await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
    });

    let filtered = drugs;
    if (filter === "low") {
      filtered = drugs.filter((d) => d.stockQuantity <= d.minStockLevel);
    }

    return NextResponse.json({ drugs: filtered });
  } catch (error) {
    console.error("Drugs GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = drugSchema.parse(body);

    const drug = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category || "İlaç",
        price: data.price,
        costPrice: data.costPrice,
        stockQuantity: data.stockQuantity,
        minStockLevel: data.minStockLevel,
        unit: data.unit,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        tenantId: session.user.tenantId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Product",
        entityId: drug.id,
        details: { name: data.name, category: data.category },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    // Auto-create notification if low stock
    if (data.stockQuantity <= data.minStockLevel) {
      await prisma.notification.create({
        data: {
          type: "stock_low",
          channel: "push",
          title: "Düşük Stok Uyarısı",
          message: `${data.name} ürününün stok seviyesi (${data.stockQuantity}) minimum seviyenin (${data.minStockLevel}) altında.`,
          tenantId: session.user.tenantId,
        },
      });
    }

    return NextResponse.json({ drug }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Drugs POST error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
