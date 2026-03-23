"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faSpinner, faArrowUp, faArrowDown, faPaw, faUsers, faCalendarDays,
  faMoneyBillTrendUp, faMinus, faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

interface ReportData {
  totalIncome: number; totalExpense: number; netProfit: number;
  incomeByCategory: { category: string; amount: number }[];
  monthlyTrend: { month: string; income: number; expense: number }[];
  customerCount: number; petCount: number; appointmentCount: number;
  topPets: { name: string; species: string; count: number }[];
  appointmentsByStatus: { status: string; count: number }[];
}

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede", CONFIRMED: "Teyitli", IN_PROGRESS: "Devam",
  COMPLETED: "Tamamlandı", CANCELED: "İptal", NO_SHOW: "Gelmedi",
};
const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700", CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-cyan-100 text-cyan-700", COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELED: "bg-red-100 text-red-700", NO_SHOW: "bg-gray-100 text-gray-600",
};

export default function ReportsClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${period}`);
      const d = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" />
    </div>
  );
  if (!data) return null;

  const maxTrend = Math.max(...data.monthlyTrend.flatMap((m) => [m.income, m.expense]), 1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="text-kp-green" /> Raporlar & Analitik
          </h1>
          <p className="text-sm text-muted-foreground mt-1">İşletme performansınızı izleyin</p>
        </div>
        <div className="flex gap-2">
          {[
            { v: "month", l: "Bu Ay" }, { v: "quarter", l: "Bu Çeyrek" }, { v: "year", l: "Bu Yıl" },
          ].map((p) => (
            <button key={p.v} onClick={() => setPeriod(p.v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === p.v ? "bg-kp-green text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">Toplam Gelir</span>
            <FontAwesomeIcon icon={faArrowUp} className="text-kp-green text-xs" />
          </div>
          <p className="text-2xl font-bold text-kp-green">{fmt(data.totalIncome)} ₺</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">Toplam Gider</span>
            <FontAwesomeIcon icon={faArrowDown} className="text-destructive text-xs" />
          </div>
          <p className="text-2xl font-bold text-destructive">{fmt(data.totalExpense)} ₺</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">Net Kar</span>
            <FontAwesomeIcon icon={data.netProfit >= 0 ? faArrowUp : faArrowDown} className={`text-xs ${data.netProfit >= 0 ? "text-kp-green" : "text-destructive"}`} />
          </div>
          <p className={`text-2xl font-bold ${data.netProfit >= 0 ? "text-kp-green" : "text-destructive"}`}>{fmt(data.netProfit)} ₺</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">Randevu</span>
            <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500 text-xs" />
          </div>
          <p className="text-2xl font-bold text-blue-500">{data.appointmentCount}</p>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kp-orange/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-kp-orange" />
          </div>
          <div>
            <p className="text-lg font-bold">{data.customerCount}</p>
            <p className="text-xs text-muted-foreground">Aktif Müşteri</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kp-coral/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faPaw} className="text-kp-coral" />
          </div>
          <div>
            <p className="text-lg font-bold">{data.petCount}</p>
            <p className="text-xs text-muted-foreground">Kayıtlı Pet</p>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-kp-green" /> Aylık Gelir / Gider Trendi
        </h3>
        <div className="flex items-end gap-2 h-40">
          {data.monthlyTrend.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 justify-center items-end h-32">
                <div className="w-3 bg-kp-green/70 rounded-t transition-all hover:bg-kp-green"
                  style={{ height: `${(m.income / maxTrend) * 100}%`, minHeight: "4px" }}
                  title={`Gelir: ${fmt(m.income)} ₺`} />
                <div className="w-3 bg-red-400/70 rounded-t transition-all hover:bg-red-400"
                  style={{ height: `${(m.expense / maxTrend) * 100}%`, minHeight: "4px" }}
                  title={`Gider: ${fmt(m.expense)} ₺`} />
              </div>
              <span className="text-[10px] text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-kp-green/70" /> Gelir
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded bg-red-400/70" /> Gider
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Income By Category */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Gelir Dağılımı (Hizmet)</h3>
          {data.incomeByCategory.length > 0 ? (
            <div className="space-y-3">
              {data.incomeByCategory.map((c, i) => {
                const pct = data.totalIncome > 0 ? (c.amount / data.totalIncome) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{c.category}</span>
                      <span className="text-sm font-semibold">{fmt(c.amount)} ₺</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-kp-green transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Veri yok</p>
          )}
        </div>

        {/* Appointment Status */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Randevu Durumu</h3>
          {data.appointmentsByStatus.length > 0 ? (
            <div className="space-y-3">
              {data.appointmentsByStatus.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/30">
                  <Badge variant="secondary" className={`text-xs border-0 ${statusColors[a.status] || ""}`}>
                    {statusLabels[a.status] || a.status}
                  </Badge>
                  <span className="text-sm font-semibold">{a.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Veri yok</p>
          )}
        </div>
      </div>

      {/* Top Pets */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faTrophy} className="text-amber-500" /> En Sık Gelen Petler
        </h3>
        {data.topPets.length > 0 ? (
          <div className="space-y-2">
            {data.topPets.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-600"}`}>
                  {i + 1}
                </span>
                <FontAwesomeIcon icon={faPaw} className="text-kp-orange text-xs" />
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.species}</span>
                <Badge variant="secondary" className="text-xs border-0">{p.count} ziyaret</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FontAwesomeIcon icon={faMinus} className="text-xl mb-2" />
            <p className="text-sm">Bu dönemde veri yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
