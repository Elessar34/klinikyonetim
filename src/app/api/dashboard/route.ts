import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
  }

  const tenantId = session.user.tenantId
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const [
    totalCustomers,
    totalPets,
    monthlyAppointments,
    monthlyIncome,
    monthlyExpense,
    todayAppointments,
    upcomingAppointments,
    recentTransactions,
    lowStockItems,
  ] = await Promise.all([
    prisma.customer.count({ where: { tenantId, isActive: true } }),
    prisma.pet.count({ where: { tenantId, isAlive: true } }),
    prisma.appointment.count({
      where: { tenantId, date: { gte: startOfMonth, lte: endOfMonth } },
    }),
    prisma.transaction.aggregate({
      where: { tenantId, type: "INCOME", createdAt: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { tenantId, type: "EXPENSE", createdAt: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    // Today's appointments
    prisma.appointment.findMany({
      where: { tenantId, date: { gte: startOfDay, lte: endOfDay } },
      include: {
        customer: { select: { firstName: true, lastName: true, phone: true } },
        pet: { select: { id: true, name: true, species: true } },
        service: { select: { name: true, duration: true, price: true } },
      },
      orderBy: { date: "asc" },
    }),
    // Upcoming appointments (next 5)
    prisma.appointment.findMany({
      where: { tenantId, date: { gt: endOfDay }, status: { in: ["PENDING", "CONFIRMED"] } },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        pet: { select: { name: true, species: true } },
        service: { select: { name: true } },
      },
      orderBy: { date: "asc" },
      take: 5,
    }),
    // Recent transactions
    prisma.transaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, description: true, amount: true, type: true, category: true, createdAt: true },
    }),
    // Low stock products (vet supplies)
    prisma.product.findMany({
      where: { tenantId, stockQuantity: { lte: 10 } },
      orderBy: { stockQuantity: "asc" },
      take: 5,
      select: { id: true, name: true, stockQuantity: true, unit: true, expiryDate: true },
    }),
  ])

  // Overdue grooming pets
  const overdueGrooming = await prisma.pet.findMany({
    where: { tenantId, groomingCycleDays: { gt: 0 } },
    include: {
      customer: { select: { firstName: true, lastName: true, phone: true } },
      groomingRecords: { orderBy: { groomingDate: "desc" }, take: 1, select: { groomingDate: true } },
    },
  }).then(pets =>
    pets
      .map(pet => {
        const last = pet.groomingRecords[0]?.groomingDate
        if (!last || !pet.groomingCycleDays) return null
        const nextDate = new Date(new Date(last).getTime() + pet.groomingCycleDays * 86400000)
        const daysOverdue = Math.ceil((now.getTime() - nextDate.getTime()) / 86400000)
        if (daysOverdue <= 0) return null
        return { petId: pet.id, petName: pet.name, species: pet.species, daysOverdue, customer: pet.customer }
      })
      .filter(Boolean)
      .sort((a, b) => b!.daysOverdue - a!.daysOverdue)
      .slice(0, 5)
  )

  // Weekly trend (last 7 days appointment count)
  const weeklyTrend = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      return prisma.appointment.count({
        where: { tenantId, date: { gte: dayStart, lte: dayEnd } },
      }).then(count => ({
        date: dayStart.toISOString().split("T")[0],
        label: dayStart.toLocaleDateString("tr-TR", { weekday: "short" }),
        count,
      }))
    })
  )

  // Monthly revenue chart (last 6 months)
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1)
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      return Promise.all([
        prisma.transaction.aggregate({
          where: { tenantId, type: "INCOME", createdAt: { gte: mStart, lte: mEnd } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { tenantId, type: "EXPENSE", createdAt: { gte: mStart, lte: mEnd } },
          _sum: { amount: true },
        }),
      ]).then(([inc, exp]) => ({
        month: mStart.toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }),
        income: inc._sum.amount || 0,
        expense: exp._sum.amount || 0,
      }))
    })
  )

  // Service distribution (top services)
  const serviceDistribution = await prisma.appointment.groupBy({
    by: ["serviceId"],
    where: { tenantId, serviceId: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  }).then(async (groups) => {
    const serviceIds = groups.map(g => g.serviceId).filter(Boolean) as string[]
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    })
    const sMap = Object.fromEntries(services.map(s => [s.id, s.name]))
    return groups.map(g => ({ name: sMap[g.serviceId!] || "Bilinmeyen", count: g._count.id }))
  })

  // Customer segmentation
  const allCustomers = await prisma.customer.findMany({
    where: { tenantId, isActive: true },
    select: { id: true },
    // Get last appointment per customer
  })
  const lastAppointments = await prisma.appointment.groupBy({
    by: ["customerId"],
    where: { tenantId },
    _max: { date: true },
  })
  const lastMap = Object.fromEntries(lastAppointments.map(a => [a.customerId, a._max.date]))
  const day90ago = new Date(now.getTime() - 90 * 86400000)
  const day30ago = new Date(now.getTime() - 30 * 86400000)
  let activeCount = 0, inactiveCount = 0, lostCount = 0, newCount = 0
  for (const c of allCustomers) {
    const lastDate = lastMap[c.id]
    if (!lastDate) { newCount++; continue }
    if (lastDate > day30ago) activeCount++
    else if (lastDate > day90ago) inactiveCount++
    else lostCount++
  }
  const customerSegmentation = { active: activeCount, inactive: inactiveCount, lost: lostCount, new: newCount, total: allCustomers.length }

  return NextResponse.json({
    stats: {
      totalCustomers,
      totalPets,
      monthlyAppointments,
      monthlyIncome: monthlyIncome._sum.amount || 0,
      monthlyExpense: monthlyExpense._sum.amount || 0,
      monthlyProfit: (monthlyIncome._sum.amount || 0) - (monthlyExpense._sum.amount || 0),
      todayAppointmentCount: todayAppointments.length,
    },
    todayAppointments,
    upcomingAppointments,
    recentTransactions,
    lowStockItems,
    overdueGrooming,
    weeklyTrend,
    monthlyRevenue,
    serviceDistribution,
    customerSegmentation,
  })
}

