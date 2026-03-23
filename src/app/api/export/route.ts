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
  const type = searchParams.get("type") || "customers";

  let csv = "";

  if (type === "customers") {
    const data = await prisma.customer.findMany({
      where: { tenantId },
      include: { _count: { select: { pets: true, appointments: true } } },
      orderBy: { createdAt: "desc" },
    });
    csv = "Ad,Soyad,Telefon,Email,Pet Sayısı,Randevu Sayısı,Kayıt Tarihi\n";
    csv += data.map((c) =>
      `"${c.firstName}","${c.lastName}","${c.phone}","${c.email || ""}",${c._count.pets},${c._count.appointments},"${new Date(c.createdAt).toLocaleDateString("tr-TR")}"`
    ).join("\n");
  } else if (type === "pets") {
    const data = await prisma.pet.findMany({
      where: { tenantId },
      include: { customer: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    csv = "Pet Adı,Tür,Cins,Cinsiyet,Sahip,Kayıt Tarihi\n";
    csv += data.map((p) =>
      `"${p.name}","${p.species}","${p.breed || ""}","${p.gender}","${p.customer.firstName} ${p.customer.lastName}","${new Date(p.createdAt).toLocaleDateString("tr-TR")}"`
    ).join("\n");
  } else if (type === "transactions") {
    const data = await prisma.transaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    csv = "Tarih,Açıklama,Tür,Kategori,Tutar\n";
    csv += data.map((t) =>
      `"${new Date(t.createdAt).toLocaleDateString("tr-TR")}","${t.description}","${t.type === "INCOME" ? "Gelir" : "Gider"}","${t.category || ""}",${t.amount}`
    ).join("\n");
  } else if (type === "appointments") {
    const data = await prisma.appointment.findMany({
      where: { tenantId },
      include: { customer: { select: { firstName: true, lastName: true } }, pet: { select: { name: true } }, service: { select: { name: true, price: true } } },
      orderBy: { date: "desc" },
    });
    csv = "Tarih,Müşteri,Pet,Hizmet,Fiyat,Durum\n";
    csv += data.map((a) =>
      `"${new Date(a.date).toLocaleString("tr-TR")}","${a.customer.firstName} ${a.customer.lastName}","${a.pet?.name || "-"}","${a.service?.name || "-"}",${a.service?.price || 0},"${a.status}"`
    ).join("\n");
  } else if (type === "invoices") {
    const data = await prisma.invoice.findMany({
      where: { tenantId },
      include: { customer: { select: { firstName: true, lastName: true } }, items: true },
      orderBy: { createdAt: "desc" },
    });
    csv = "Fatura No,Tarih,Müşteri,Tutar,KDV,Toplam,Durum\n";
    csv += data.map((inv) =>
      `"${inv.invoiceNo}","${new Date(inv.issueDate).toLocaleDateString("tr-TR")}","${inv.customer.firstName} ${inv.customer.lastName}",${inv.totalAmount},${inv.taxAmount},${inv.totalAmount + inv.taxAmount},"${inv.status}"`
    ).join("\n");
  } else {
    return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
  }

  // Add BOM for Turkish character support in Excel
  const bom = "\uFEFF";
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
