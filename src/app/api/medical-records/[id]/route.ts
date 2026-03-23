import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const record = await prisma.medicalRecord.findFirst({
      where: { id, tenantId: session.user.tenantId },
      include: {
        pet: {
          include: {
            customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
    });

    if (!record) return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Medical record GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.medicalRecord.findFirst({
      where: { id, tenantId: session.user.tenantId },
    });
    if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(body.diagnosis !== undefined && { diagnosis: body.diagnosis }),
        ...(body.treatment !== undefined && { treatment: body.treatment }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.weight !== undefined && { weight: body.weight }),
        ...(body.temperature !== undefined && { temperature: body.temperature }),
        ...(body.heartRate !== undefined && { heartRate: body.heartRate }),
        ...(body.respiratoryRate !== undefined && { respiratoryRate: body.respiratoryRate }),
        ...(body.followUpDate !== undefined && { followUpDate: body.followUpDate ? new Date(body.followUpDate) : null }),
      },
    });

    return NextResponse.json({ record: updated });
  } catch (error) {
    console.error("Medical record PUT error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
