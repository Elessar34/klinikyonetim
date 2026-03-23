import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [customers, pets, appointments] = await Promise.all([
    prisma.customer.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, firstName: true, lastName: true, phone: true },
    }),
    prisma.pet.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { breed: { contains: q, mode: "insensitive" } },
          { microchipNo: { contains: q } },
        ],
      },
      take: 5,
      select: {
        id: true, name: true, species: true, breed: true,
        customer: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.appointment.findMany({
      where: {
        tenantId,
        OR: [
          { customer: { OR: [{ firstName: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }] } },
          { pet: { name: { contains: q, mode: "insensitive" } } },
          { service: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true, date: true, status: true,
        customer: { select: { firstName: true, lastName: true } },
        pet: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
  ]);

  return NextResponse.json({
    results: [
      ...customers.map((c) => ({ type: "customer" as const, id: c.id, title: `${c.firstName} ${c.lastName}`, subtitle: c.phone, href: `/panel/musteriler/${c.id}` })),
      ...pets.map((p) => ({ type: "pet" as const, id: p.id, title: p.name, subtitle: `${p.species}${p.breed ? ` • ${p.breed}` : ""} — ${p.customer.firstName} ${p.customer.lastName}`, href: `/panel/petler/${p.id}` })),
      ...appointments.map((a) => ({ type: "appointment" as const, id: a.id, title: `${a.customer.firstName} ${a.customer.lastName} — ${a.pet.name}`, subtitle: `${a.service?.name || "Randevu"} • ${new Date(a.date).toLocaleDateString("tr-TR")}`, href: `/panel/randevular` })),
    ],
  });
}
