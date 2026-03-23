import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // month, quarter, year

    const now = new Date();
    let startDate: Date;
    if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (period === "quarter") {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Income / Expense totals
    const transactions = await prisma.transaction.findMany({
      where: { tenantId, createdAt: { gte: startDate } },
      select: { type: true, amount: true, category: true, createdAt: true },
    });

    const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    transactions.filter((t) => t.type === "INCOME").forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const incomeByCategory = Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Monthly trend (last 6 months)
    const monthlyTrend: { month: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const mTx = transactions.filter((t) => new Date(t.createdAt) >= mStart && new Date(t.createdAt) <= mEnd);
      monthlyTrend.push({
        month: mStart.toLocaleDateString("tr-TR", { month: "short" }),
        income: mTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
        expense: mTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
      });
    }

    // Counts
    const [customerCount, petCount, appointmentCount] = await Promise.all([
      prisma.customer.count({ where: { tenantId, isActive: true } }),
      prisma.pet.count({ where: { tenantId } }),
      prisma.appointment.count({ where: { tenantId, date: { gte: startDate } } }),
    ]);

    // Top pets (most appointments)
    const topPets = await prisma.appointment.groupBy({
      by: ["petId"],
      where: { tenantId, date: { gte: startDate } },
      _count: { petId: true },
      orderBy: { _count: { petId: "desc" } },
      take: 5,
    });
    const topPetDetails = await prisma.pet.findMany({
      where: { id: { in: topPets.map((p) => p.petId) } },
      select: { id: true, name: true, species: true },
    });
    const topPetsData = topPets.map((p) => {
      const pet = topPetDetails.find((d) => d.id === p.petId);
      return { name: pet?.name || "?", species: pet?.species || "", count: p._count.petId };
    });

    // Appointment status distribution
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      where: { tenantId, date: { gte: startDate } },
      _count: { status: true },
    });

    return NextResponse.json({
      totalIncome, totalExpense, netProfit: totalIncome - totalExpense,
      incomeByCategory, monthlyTrend,
      customerCount, petCount, appointmentCount,
      topPets: topPetsData,
      appointmentsByStatus: appointmentsByStatus.map((a) => ({ status: a.status, count: a._count.status })),
    });
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
