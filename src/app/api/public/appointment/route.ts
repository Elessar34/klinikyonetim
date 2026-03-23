import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sanitize, normalizePhone } from "@/lib/security";

const bookingSchema = z.object({
  tenantId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  petName: z.string().min(1),
  petSpecies: z.string().default("Köpek"),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit: 10 bookings per hour per IP
  const { success } = rateLimit(request, { maxAttempts: 10, windowMs: 60 * 60 * 1000, prefix: "public-booking" });
  if (!success) return rateLimitResponse(3600);

  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Sanitize user inputs
    data.firstName = sanitize(data.firstName);
    if (data.lastName) data.lastName = sanitize(data.lastName);
    data.petName = sanitize(data.petName);
    if (data.notes) data.notes = sanitize(data.notes);
    data.phone = normalizePhone(data.phone);

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        tenantId: data.tenantId,
        phone: { contains: data.phone.replace(/\s/g, "").slice(-10) },
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName || "",
          phone: data.phone,
          email: data.email || undefined,
          tenantId: data.tenantId,
        },
      });
    }

    // Find or create pet
    let pet = await prisma.pet.findFirst({
      where: {
        customerId: customer.id,
        name: data.petName,
        tenantId: data.tenantId,
      },
    });

    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          name: data.petName,
          species: data.petSpecies,
          customerId: customer.id,
          tenantId: data.tenantId,
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(data.date),
        status: "PENDING",
        notes: data.notes || undefined,
        serviceId: data.serviceId,
        customerId: customer.id,
        petId: pet.id,
        tenantId: data.tenantId,
      },
    });

    // Create notification for tenant
    await prisma.notification.create({
      data: {
        type: "new_online_appointment",
        channel: "push",
        title: "Yeni Online Randevu",
        message: `${data.firstName} ${data.lastName || ""} — ${data.petName} (${data.petSpecies}) için online randevu talebi`,
        tenantId: data.tenantId,
        metadata: {
          appointmentId: appointment.id,
          customerName: `${data.firstName} ${data.lastName || ""}`,
          petName: data.petName,
          date: data.date,
        },
      },
    });

    return NextResponse.json({ success: true, appointmentId: appointment.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Public appointment error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
