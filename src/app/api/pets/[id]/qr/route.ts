import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const pet = await prisma.pet.findFirst({
      where: { id, tenantId: session.user.tenantId },
    });

    if (!pet) return NextResponse.json({ error: "Pet bulunamadı" }, { status: 404 });

    // Generate QR code if not exists
    const qrCode = pet.qrCode || randomUUID().slice(0, 12);

    const updated = await prisma.pet.update({
      where: { id },
      data: { qrCode },
    });

    return NextResponse.json({ qrCode: updated.qrCode });
  } catch (error) {
    console.error("QR generate error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
