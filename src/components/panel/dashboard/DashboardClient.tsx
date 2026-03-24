"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faDog,
  faCalendarDays,
  faMoneyBillTrendUp,
  faClock,
  faCircleCheck,
  faHourglass,
  faFileExport,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  date: string;
  status: string;
  customer: { firstName: string; lastName: string; phone?: string };
  pet: { id?: string; name: string; species: string };
  service?: { name: string; duration?: number; price?: number };
}

interface DashboardData {
  stats: {
    totalCustomers: number;
    totalPets: number;
    monthlyAppointments: number;
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyProfit: number;
    todayAppointmentCount: number;
  };
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  recentTransactions: { id: string; description: string; amount: number; type: string; category: string; createdAt: string }[];
  lowStockItems: { id: string; name: string; stockQuantity: number; unit: string; expiryDate?: string }[];
  overdueGrooming: { petId: string; petName: string; species: string; daysOverdue: number; customer: { firstName: string; lastName: string } }[];
  weeklyTrend: { date: string; label: string; count: number }[];
  monthlyRevenue?: { month: string; income: number; expense: number }[];
  serviceDistribution?: { name: string; count: number }[];
  customerSegmentation?: { active: number; inactive: number; lost: number; new: number; total: number };
}

interface DashboardClientProps {
  greeting: string;
  firstName: string;
  tenantName: string;
  businessLabel: string;
  businessType: string;
}

const statusBadge: Record<string, { label: string; icon: typeof faHourglass; color: string }> = {
  PENDING: { label: "Beklemede", icon: faHourglass, color: "bg-amber-50 text-amber-600" },
  CONFIRMED: { label: "Onaylı", icon: faCircleCheck, color: "bg-kp-green/10 text-kp-green" },
  IN_PROGRESS: { label: "Devam", icon: faClock, color: "bg-blue-50 text-blue-600" },
  COMPLETED: { label: "Tamamlandı", icon: faCircleCheck, color: "bg-emerald-50 text-emerald-600" },
};

export default function DashboardClient({ greeting, firstName, tenantName, businessLabel, businessType }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  const stats = [
    { label: "Toplam Müşteri", value: data?.stats.totalCustomers ?? "—", icon: faUsers, color: "bg-kp-green/10 text-kp-green" },
    { label: "Kayıtlı Pet", value: data?.stats.totalPets ?? "—", icon: faDog, color: "bg-kp-orange/10 text-kp-orange" },
    { label: "Bugün Randevu", value: data?.stats.todayAppointmentCount ?? "—", icon: faCalendarDays, color: "bg-blue-50 text-blue-600" },
    { label: "Aylık Kazanç", value: data ? fmt(data.stats.monthlyProfit) : "—", icon: faArrowTrendUp, color: "bg-emerald-50 text-emerald-600" },
  ];

  const quickActions = [
    { label: "Yeni Müşteri Ekle", href: "/panel/musteriler?yeni=1", icon: faUsers, color: "bg-kp-green/10 text-kp-green" },
    { label: "Yeni Pet Ekle", href: "/panel/petler?yeni=1", icon: faDog, color: "bg-kp-orange/10 text-kp-orange" },
    { label: "Randevu Oluştur", href: "/panel/randevular?yeni=1", icon: faCalendarDays, color: "bg-blue-50 text-blue-600" },
    ...(businessType === "VETERINER"
      ? [{ label: "Muayene Başlat", href: "/panel/hasta-dosyasi?yeni=1", icon: faCircleCheck, color: "bg-emerald-50 text-emerald-600" }]
      : businessType === "PET_KUAFOR"
      ? [{ label: "Bakım Kaydı Ekle", href: "/panel/bakim?yeni=1", icon: faCircleCheck, color: "bg-rose-50 text-rose-600" }]
      : []),
  ];

  const handleExport = (type: string) => {
    window.open(`/api/export?type=${type}`, "_blank");
  };

  // Combine today + upcoming for the appointments list
  const allAppointments = [...(data?.todayAppointments || []), ...(data?.upcomingAppointments || [])].slice(0, 8);

  const maxTrend = Math.max(...(data?.weeklyTrend?.map((t) => t.count) || [1]), 1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)]">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">{tenantName} — {businessLabel} paneline hoş geldiniz.</p>
        </div>
        {/* CSV Export */}
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={() => handleExport("customers")}>
            <FontAwesomeIcon icon={faFileExport} /> Müşteriler
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={() => handleExport("transactions")}>
            <FontAwesomeIcon icon={faFileExport} /> Finans
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <FontAwesomeIcon icon={stat.icon} className="text-sm" />
            </div>
            <p className="text-2xl font-bold font-[family-name:var(--font-heading)]">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today + Upcoming Appointments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">Bugünkü & Yaklaşan Randevular</h2>
            <a href="/panel/randevular" className="text-sm text-kp-green hover:underline">Tümünü gör</a>
          </div>

          {allAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FontAwesomeIcon icon={faCalendarDays} className="text-4xl text-muted-foreground/30 mb-3" />
              <p className="font-medium">Henüz randevu yok</p>
              <p className="text-sm mt-1">Yeni randevu oluşturmak için Randevular sayfasını kullanın.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allAppointments.map((appt) => {
                const conf = statusBadge[appt.status] || statusBadge.PENDING;
                return (
                  <div key={appt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faClock} className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {appt.customer.firstName} {appt.customer.lastName} — {appt.pet.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appt.date).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        {appt.service && ` • ${appt.service.name}`}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`border-0 text-[10px] ${conf.color}`}>
                      <FontAwesomeIcon icon={conf.icon} className="mr-1 text-[8px]" />
                      {conf.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions + Weekly Trend */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <a key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                    <FontAwesomeIcon icon={action.icon} className="text-sm" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-kp-green transition-colors">{action.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Weekly Trend Mini Chart */}
          {data?.weeklyTrend && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-semibold mb-3">Haftalık Randevu Trendi</h2>
              <div className="flex items-end gap-1.5 h-20">
                {data.weeklyTrend.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-kp-green/20 rounded-t-md min-h-[4px] transition-all hover:bg-kp-green/40"
                      style={{ height: `${Math.max((day.count / maxTrend) * 100, 5)}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        {data?.monthlyRevenue && (
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-4">📊 Aylık Gelir / Gider (Son 6 Ay)</h2>
            <div className="flex items-end gap-2 h-40">
              {data.monthlyRevenue.map((m) => {
                const maxVal = Math.max(...data.monthlyRevenue!.map(r => Math.max(r.income, r.expense)), 1);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end h-28">
                      <div className="flex-1 bg-emerald-400/80 rounded-t-md min-h-[2px] transition-all hover:bg-emerald-500"
                        style={{ height: `${Math.max((m.income / maxVal) * 100, 3)}%` }}
                        title={`Gelir: ${fmt(m.income)}`} />
                      <div className="flex-1 bg-red-400/60 rounded-t-md min-h-[2px] transition-all hover:bg-red-500"
                        style={{ height: `${Math.max((m.expense / maxVal) * 100, 3)}%` }}
                        title={`Gider: ${fmt(m.expense)}`} />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400/80"></span> Gelir</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400/60"></span> Gider</span>
            </div>
          </div>
        )}

        {/* Right Column — Service Distribution + Customer Segmentation */}
        <div className="space-y-6">
          {/* Service Distribution */}
          {data?.serviceDistribution && data.serviceDistribution.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3">🏷️ Popüler Hizmetler</h3>
              <div className="space-y-2">
                {data.serviceDistribution.map((s) => {
                  const maxCount = data.serviceDistribution![0].count;
                  return (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate font-medium">{s.name}</span>
                        <span className="text-muted-foreground">{s.count}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-kp-green rounded-full transition-all" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Segmentation */}
          {data?.customerSegmentation && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3">👥 Müşteri Segmentasyonu</h3>
              <div className="space-y-2">
                {[
                  { label: "Aktif (30 gün)", count: data.customerSegmentation.active, color: "bg-emerald-500" },
                  { label: "Pasif (30-90 gün)", count: data.customerSegmentation.inactive, color: "bg-amber-500" },
                  { label: "Kaybolan (90+ gün)", count: data.customerSegmentation.lost, color: "bg-red-500" },
                  { label: "Yeni (randevusuz)", count: data.customerSegmentation.new, color: "bg-blue-500" },
                ].map((seg) => (
                  <div key={seg.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${seg.color} shrink-0`}></span>
                    <span className="text-xs flex-1">{seg.label}</span>
                    <span className="text-xs font-bold">{seg.count}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border flex justify-between text-xs">
                  <span className="text-muted-foreground">Toplam</span>
                  <span className="font-bold">{data.customerSegmentation.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row — Alerts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overdue Grooming */}
        {data?.overdueGrooming && data.overdueGrooming.length > 0 && (
          <div className="bg-card border border-amber-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-amber-700 mb-3">⚠️ Gecikmiş Bakımlar</h3>
            <div className="space-y-2">
              {data.overdueGrooming.map((g) => (
                <div key={g.petId} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{g.petName} <span className="text-muted-foreground">({g.customer.firstName})</span></span>
                  <Badge variant="secondary" className="border-0 text-[9px] bg-amber-50 text-amber-600">{g.daysOverdue} gün gecikmiş</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock */}
        {data?.lowStockItems && data.lowStockItems.length > 0 && (
          <div className="bg-card border border-red-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-red-700 mb-3">🔴 Düşük Stok</h3>
            <div className="space-y-2">
              {data.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary" className="border-0 text-[9px] bg-red-50 text-red-600">{item.stockQuantity} {item.unit}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {data?.recentTransactions && data.recentTransactions.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">💰 Son İşlemler</h3>
            <div className="space-y-2">
              {data.recentTransactions.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{t.description}</span>
                  <span className={`font-semibold whitespace-nowrap ${t.type === "INCOME" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "INCOME" ? "+" : "-"}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

