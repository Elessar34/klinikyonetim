import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

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

const bookingSchema = z.object({
  petId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().min(1), // ISO date string
  notes: z.string().optional(),
});

// GET — Available services and time slots
export async function GET(request: NextRequest) {
  const auth = verifyPortalToken(request);
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    // Get available services
    const services = await prisma.service.findMany({
      where: { tenantId: auth.tenantId, isActive: true },
      select: { id: true, name: true, price: true, duration: true, category: true },
      orderBy: { name: "asc" },
    });

    // Get customer's pets
    const pets = await prisma.pet.findMany({
      where: { customerId: auth.customerId, tenantId: auth.tenantId, isAlive: true },
      select: { id: true, name: true, species: true },
    });

    // Get busy slots for a specific date
    let busySlots: string[] = [];
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59);
      const existing = await prisma.appointment.findMany({
        where: {
          tenantId: auth.tenantId,
          date: { gte: dayStart, lte: dayEnd },
          status: { notIn: ["CANCELED", "NO_SHOW"] },
        },
        select: { date: true },
      });
      busySlots = existing.map(a => new Date(a.date).toTimeString().slice(0, 5));
    }

    // Available time slots (09:00 - 18:00, 30 min intervals)
    const allSlots = [];
    for (let h = 9; h < 18; h++) {
      allSlots.push(`${String(h).padStart(2, "0")}:00`);
      allSlots.push(`${String(h).padStart(2, "0")}:30`);
    }
    const availableSlots = allSlots.filter(s => !busySlots.includes(s));

    return NextResponse.json({ services, pets, availableSlots, busySlots });
  } catch (error) {
    console.error("Portal booking GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST — Create appointment from portal
export async function POST(request: NextRequest) {
  const auth = verifyPortalToken(request);
  if (!auth) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });


  const { success } = rateLimit(request, { maxAttempts: 5, windowMs: 60000, prefix: "portal-booking" });
  if (!success) return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });

  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Verify pet belongs to customer
    const pet = await prisma.pet.findFirst({
      where: { id: data.petId, customerId: auth.customerId, tenantId: auth.tenantId },
    });
    if (!pet) return NextResponse.json({ error: "Pet bulunamadı" }, { status: 404 });

    // Verify service exists
    const service = await prisma.service.findFirst({
      where: { id: data.serviceId, tenantId: auth.tenantId, isActive: true },
    });
    if (!service) return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(data.date),
        status: "PENDING",
        notes: data.notes ? `[Portal] ${data.notes}` : "[Portal] Online randevu",
        customerId: auth.customerId,
        petId: data.petId,
        serviceId: data.serviceId,
        tenantId: auth.tenantId,
      },
      include: {
        service: { select: { name: true, price: true } },
        pet: { select: { name: true } },
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: "online_booking",
        channel: "push",
        title: "Yeni Online Randevu",
        message: `${pet.name} için ${service.name} hizmetine online randevu oluşturuldu. Tarih: ${new Date(data.date).toLocaleString("tr-TR")}`,
        customerId: auth.customerId,
        tenantId: auth.tenantId,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }
    console.error("Portal booking error:", error);
    return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 });
  }
}
