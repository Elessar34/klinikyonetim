import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// Yaklaşan bakım gereken petler API
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    // Find pets with grooming cycle set
    const pets = await prisma.pet.findMany({
      where: {
        tenantId,
        groomingCycleDays: { gt: 0 },
      },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        groomingRecords: {
          orderBy: { groomingDate: "desc" },
          take: 1,
          select: { groomingDate: true },
        },
      },
    });

    const now = Date.now();
    const upcoming = pets
      .map((pet) => {
        const lastGrooming = pet.groomingRecords[0]?.groomingDate;
        if (!lastGrooming || !pet.groomingCycleDays) return null;

        const nextDate = new Date(new Date(lastGrooming).getTime() + pet.groomingCycleDays * 24 * 60 * 60 * 1000);
        const daysUntil = Math.ceil((nextDate.getTime() - now) / (1000 * 60 * 60 * 24));

        if (daysUntil > days) return null;

        return {
          petId: pet.id,
          petName: pet.name,
          species: pet.species,
          breed: pet.breed,
          coatType: pet.coatType,
          groomingCycleDays: pet.groomingCycleDays,
          lastGroomingDate: lastGrooming,
          nextGroomingDate: nextDate.toISOString(),
          daysUntil,
          overdue: daysUntil < 0,
          customer: pet.customer,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.daysUntil) - (b!.daysUntil));

    return NextResponse.json({ upcoming });
  } catch (error) {
    console.error("Upcoming grooming error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
