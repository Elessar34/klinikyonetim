import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

function verifyPortalToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.replace("Bearer ", "");
    const data = JSON.parse(Buffer.from(token, "base64").toString());
    if (data.exp < Date.now()) return null;
    return { customerId: data.customerId as string, tenantId: data.tenantId as string };
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const auth = verifyPortalToken(request);
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "dashboard";

    if (section === "dashboard") {
      const [customer, upcomingAppointments, recentAppointments, totalSpentAgg] = await Promise.all([
        prisma.customer.findFirst({
          where: { id: auth.customerId, tenantId: auth.tenantId },
          select: {
            id: true, firstName: true, lastName: true, phone: true, email: true,
            customerNo: true, loyaltyPoints: true, totalSpent: true, createdAt: true,
            _count: { select: { pets: true, appointments: true } },
          },
        }),
        prisma.appointment.findMany({
          where: { customerId: auth.customerId, tenantId: auth.tenantId, date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
          include: { pet: { select: { name: true, species: true } }, service: { select: { name: true, price: true, duration: true } } },
          orderBy: { date: "asc" },
          take: 5,
        }),
        prisma.appointment.findMany({
          where: { customerId: auth.customerId, tenantId: auth.tenantId, status: "COMPLETED" },
          include: { pet: { select: { name: true, species: true } }, service: { select: { name: true, price: true } } },
          orderBy: { date: "desc" },
          take: 5,
        }),
        prisma.transaction.aggregate({
          where: { tenantId: auth.tenantId, customerId: auth.customerId, type: "INCOME" },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

      // Next vaccination due
      const nextVaccination = await prisma.vaccination.findFirst({
        where: {
          pet: { customerId: auth.customerId, tenantId: auth.tenantId },
          nextDueDate: { gte: new Date() },
        },
        include: { pet: { select: { name: true } } },
        orderBy: { nextDueDate: "asc" },
      });

      return NextResponse.json({
        customer,
        upcomingAppointments,
        recentAppointments,
        totalSpent: totalSpentAgg._sum.amount || 0,
        totalVisits: totalSpentAgg._count.id || 0,
        nextVaccination: nextVaccination ? {
          petName: nextVaccination.pet.name,
          vaccineName: nextVaccination.vaccineName,
          dueDate: nextVaccination.nextDueDate,
        } : null,
      });
    }

    if (section === "pets") {
      const pets = await prisma.pet.findMany({
        where: { customerId: auth.customerId, tenantId: auth.tenantId },
        include: {
          vaccinations: {
            orderBy: { administeredDate: "desc" },
            take: 10,
            select: { id: true, vaccineName: true, administeredDate: true, nextDueDate: true, notes: true },
          },
          groomingRecords: {
            orderBy: { groomingDate: "desc" },
            take: 5,
            select: { id: true, groomingDate: true, servicesPerformed: true, notes: true, nextSuggestedDate: true },
          },
          medicalRecords: {
            orderBy: { visitDate: "desc" },
            take: 5,
            select: { id: true, visitDate: true, chiefComplaint: true, diagnosis: true, treatment: true },
          },
          prescriptions: {
            orderBy: { prescriptionDate: "desc" },
            take: 5,
            select: { id: true, prescriptionDate: true, medications: true, notes: true, isActive: true },
          },
          _count: { select: { medicalRecords: true, appointments: true, vaccinations: true, groomingRecords: true } },
        },
      });
      return NextResponse.json({ pets });
    }

    if (section === "appointments") {
      const appointments = await prisma.appointment.findMany({
        where: { customerId: auth.customerId, tenantId: auth.tenantId },
        include: {
          pet: { select: { name: true, species: true } },
          service: { select: { name: true, price: true, duration: true } },
        },
        orderBy: { date: "desc" },
        take: 30,
      });
      return NextResponse.json({ appointments });
    }

    if (section === "billing") {
      const [invoices, transactions] = await Promise.all([
        prisma.invoice.findMany({
          where: { customerId: auth.customerId, tenantId: auth.tenantId },
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.transaction.findMany({
          where: { tenantId: auth.tenantId, customerId: auth.customerId },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { id: true, description: true, amount: true, type: true, category: true, createdAt: true },
        }),
      ]);
      return NextResponse.json({ invoices, transactions });
    }

    return NextResponse.json({ error: "Geçersiz bölüm" }, { status: 400 });
  } catch (error) {
    console.error("Portal data error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
