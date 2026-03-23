import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Randevu onay/red API
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, token } = await request.json();

    if (!["confirm", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { customer: true, pet: true, service: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Randevu bulunamadı" }, { status: 404 });
    }

    // Simple token validation — appointment ID hash
    const expectedToken = Buffer.from(id).toString("base64").slice(0, 12);
    if (token !== expectedToken) {
      return NextResponse.json({ error: "Geçersiz token" }, { status: 403 });
    }

    if (appointment.status !== "PENDING") {
      return NextResponse.json({ error: "Bu randevu zaten işlenmiş", status: appointment.status }, { status: 409 });
    }

    const newStatus = action === "confirm" ? "CONFIRMED" : "CANCELED";
    await prisma.appointment.update({ where: { id }, data: { status: newStatus } });

    // Create notification
    await prisma.notification.create({
      data: {
        type: action === "confirm" ? "appointment_confirmed" : "appointment_canceled",
        channel: "push",
        title: action === "confirm" ? "Randevu Onaylandı" : "Randevu İptal Edildi",
        message: `${appointment.customer.firstName} ${appointment.customer.lastName} — ${appointment.pet.name} (${new Date(appointment.date).toLocaleString("tr-TR")})`,
        tenantId: appointment.tenantId,
      },
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Appointment confirmation error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
