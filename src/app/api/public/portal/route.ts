import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 20 attempts per hour per IP
  const { success } = rateLimit(request, { maxAttempts: 20, windowMs: 60 * 60 * 1000, prefix: "portal-login" });
  if (!success) return rateLimitResponse(3600);

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const customerNo = searchParams.get("customerNo");
    const phone = searchParams.get("phone");

    if (!tenantId || !customerNo || !phone) {
      return NextResponse.json({ error: "Müşteri no ve telefon gerekli" }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        tenantId,
        customerNo,
        phone: { contains: phone.replace(/\s/g, "").slice(-10) },
        isActive: true,
      },
      select: {
        firstName: true,
        lastName: true,
        pets: {
          select: {
            id: true, name: true, species: true, breed: true,
            groomingRecords: {
              orderBy: { groomingDate: "desc" },
              take: 10,
              select: { groomingDate: true, servicesPerformed: true, notes: true },
            },
            vaccinations: {
              orderBy: { administeredDate: "desc" },
              take: 10,
              select: { vaccineName: true, administeredDate: true, nextDueDate: true },
            },
            appointments: {
              orderBy: { date: "desc" },
              take: 10,
              select: {
                date: true, status: true,
                service: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı. Bilgilerinizi kontrol edin." }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Portal API error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
