import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Ürün adı zorunlu"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  costPrice: z.number().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  minStockLevel: z.number().int().min(0).default(5),
  unit: z.string().default("adet"),
  expiryDate: z.string().optional(),
  supplierId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const filter = searchParams.get("filter") || "all"; // all, low, expired
    const barcode = searchParams.get("barcode") || "";

    // Barcode lookup — hızlı tek ürün sorgusu
    if (barcode) {
      const product = await prisma.product.findFirst({
        where: {
          tenantId: session.user.tenantId,
          barcode: barcode,
          isActive: true,
        },
        include: { supplier: { select: { name: true } } },
      });

      if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
      return NextResponse.json({ product });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      tenantId: session.user.tenantId,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    let products = await prisma.product.findMany({
      where,
      include: { supplier: { select: { name: true } } },
      orderBy: { name: "asc" },
    });

    // Client-side filters
    if (filter === "low") {
      products = products.filter((p) => p.stockQuantity <= p.minStockLevel);
    } else if (filter === "expired") {
      products = products.filter((p) => p.expiryDate && new Date(p.expiryDate) < new Date());
    }

    // Get unique categories for filter dropdown
    const categories = await prisma.product.groupBy({
      by: ["category"],
      where: { tenantId: session.user.tenantId, isActive: true, category: { not: null } },
    });

    return NextResponse.json({
      products,
      categories: categories.map((c) => c.category).filter(Boolean),
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = productSchema.parse(body);

    // Check barcode uniqueness within tenant
    if (data.barcode) {
      const existing = await prisma.product.findFirst({
        where: { barcode: data.barcode, tenantId: session.user.tenantId },
      });
      if (existing) {
        return NextResponse.json({ error: "Bu barkod zaten kayıtlı" }, { status: 409 });
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        category: data.category,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        stockQuantity: data.stockQuantity,
        minStockLevel: data.minStockLevel,
        unit: data.unit,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        supplierId: data.supplierId || undefined,
        imageUrl: data.imageUrl,
        tenantId: session.user.tenantId,
      },
    });

    // Stock movement — initial stock
    if (data.stockQuantity > 0) {
      await prisma.stockMovement.create({
        data: {
          type: "IN",
          quantity: data.stockQuantity,
          reason: "İlk stok girişi",
          productId: product.id,
          userId: session.user.id,
          tenantId: session.user.tenantId,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Product",
        entityId: product.id,
        details: { name: data.name, barcode: data.barcode },
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    const data = productSchema.partial().parse(rest);

    const product = await prisma.product.update({
      where: { id, tenantId: session.user.tenantId },
      data: {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Product",
        entityId: product.id,
        details: data,
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Products PUT error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
