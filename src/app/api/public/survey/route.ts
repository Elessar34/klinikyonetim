import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sanitize } from "@/lib/security";

export async function POST(request: NextRequest) {
  const { success } = rateLimit(request, { maxAttempts: 5, windowMs: 60 * 60 * 1000, prefix: "survey" });
  if (!success) return rateLimitResponse(3600);

  try {
    const { tenantSlug, rating, comment } = await request.json();

    if (!tenantSlug || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) return NextResponse.json({ error: "İşletme bulunamadı" }, { status: 404 });

    // Store as notification for tenant
    await prisma.notification.create({
      data: {
        type: "customer_feedback",
        channel: "push",
        title: `Müşteri Değerlendirmesi: ${"⭐".repeat(rating)}`,
        message: comment ? sanitize(comment) : `${rating}/5 puan verildi`,
        tenantId: tenant.id,
        metadata: { rating, comment: comment ? sanitize(comment) : null },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Survey error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
