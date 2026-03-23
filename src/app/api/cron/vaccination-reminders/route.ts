import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Cron endpoint: 7 gün içinde aşısı olan petler için bildirim oluşturur
export async function GET() {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dueVaccinations = await prisma.vaccination.findMany({
      where: {
        nextDueDate: { gte: now, lte: sevenDaysLater },
        reminderSent: false,
      },
      include: {
        pet: {
          include: {
            customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
    });

    let created = 0;

    for (const vac of dueVaccinations) {
      // Create notification
      await prisma.notification.create({
        data: {
          type: "vaccination_due",
          channel: "push",
          title: `Aşı Hatırlatma: ${vac.pet.name}`,
          message: `${vac.pet.name} adlı petinizin ${vac.vaccineName} aşısı ${new Date(vac.nextDueDate!).toLocaleDateString("tr-TR")} tarihinde yapılmalıdır.`,
          customerId: vac.pet.customer.id,
          tenantId: vac.tenantId,
          metadata: {
            vaccinationId: vac.id,
            petId: vac.petId,
            petName: vac.pet.name,
            vaccineName: vac.vaccineName,
            dueDate: vac.nextDueDate,
          },
        },
      });

      // Mark as sent
      await prisma.vaccination.update({
        where: { id: vac.id },
        data: { reminderSent: true },
      });

      created++;
    }

    return NextResponse.json({
      success: true,
      message: `${created} aşı hatırlatması oluşturuldu`,
      processed: dueVaccinations.length,
    });
  } catch (error) {
    console.error("Vaccination cron error:", error);
    return NextResponse.json({ error: "Cron hatası" }, { status: 500 });
  }
}
