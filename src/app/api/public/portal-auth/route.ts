import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

// POST — Müşteri portal girişi
export async function POST(request: NextRequest) {
  const rl = rateLimit(request, { prefix: "portal-login", maxAttempts: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.success) return rateLimitResponse();

  try {
    const { customerNo, password, tenantSlug } = await request.json();

    if (!customerNo || !password || !tenantSlug) {
      return NextResponse.json({ error: "Müşteri no, şifre ve işletme kodu gerekli" }, { status: 400 });
    }

    // Find tenant by slug
    const tenant = await prisma.tenant.findFirst({
      where: { slug: tenantSlug },
      select: { id: true, name: true, businessType: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });
    }

    // Find customer by customerNo within tenant
    const customer = await prisma.customer.findFirst({
      where: {
        customerNo,
        tenantId: tenant.id,
        portalEnabled: true,
        isActive: true,
      },
      select: {
        id: true, firstName: true, lastName: true, phone: true, email: true,
        customerNo: true, portalPassword: true, loyaltyPoints: true, totalSpent: true,
      },
    });

    if (!customer || !customer.portalPassword) {
      return NextResponse.json({ error: "Müşteri no veya şifre hatalı" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, customer.portalPassword);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Müşteri no veya şifre hatalı" }, { status: 401 });
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({
      customerId: customer.id,
      tenantId: tenant.id,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })).toString("base64");

    return NextResponse.json({
      token,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        email: customer.email,
        customerNo: customer.customerNo,
        loyaltyPoints: customer.loyaltyPoints,
        totalSpent: customer.totalSpent,
      },
      tenant: {
        businessName: tenant.name,
        businessType: tenant.businessType,
      },
    });
  } catch (error) {
    console.error("Portal login error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
