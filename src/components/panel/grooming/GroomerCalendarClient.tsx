"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays, faSpinner, faChevronLeft, faChevronRight, faPaw, faClock,
  faUser, faScissors, faCheck, faBan,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CalendarAppointment {
  id: string; date: string; status: string; notes?: string;
  pet: { id: string; name: string; species: string; breed?: string };
  customer: { firstName: string; lastName: string; phone: string };
  service?: { name: string; price: number; duration: number };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Beklemede", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  CONFIRMED: { label: "Teyitli", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  IN_PROGRESS: { label: "Devam", color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
  COMPLETED: { label: "Tamamlandı", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  CANCELED: { label: "İptal", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  NO_SHOW: { label: "Gelmedi", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

const hours = Array.from({ length: 20 }, (_, i) => 8 + i * 0.5); // 08:00 to 17:30

export default function GroomerCalendarClient() {
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");

  const getWeekStart = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    const start = view === "week" ? weekStart : currentDate;
    const end = view === "week"
      ? new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7)
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    try {
      const res = await fetch(`/api/appointments?start=${start.toISOString()}&end=${end.toISOString()}`);
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [currentDate, view]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return appointments.filter((a) => {
      const aDate = new Date(a.date);
      return aDate.getDate() === day.getDate() &&
        aDate.getMonth() === day.getMonth() &&
        aDate.getFullYear() === day.getFullYear() &&
        aDate.getHours() === Math.floor(hour) &&
        (hour % 1 === 0 ? aDate.getMinutes() < 30 : aDate.getMinutes() >= 30);
    });
  };

  const isToday = (d: Date) => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const dayLabel = (d: Date) => d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" });

  const todayCount = appointments.filter((a) => {
    const d = new Date(a.date);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  }).length;

  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarDays} className="text-kp-coral" /> Kuaför Takvimi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Günlük ve haftalık randevu takvimi</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-muted rounded-xl p-0.5">
            {(["day", "week"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                {v === "day" ? "Gün" : "Hafta"}
              </button>
            ))}
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="rounded-xl h-8 w-8 p-0" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl h-8 px-3 text-xs" onClick={() => setCurrentDate(new Date())}>
              Bugün
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl h-8 w-8 p-0" onClick={() => navigate(1)}>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-kp-coral">{todayCount}</p>
          <p className="text-[10px] text-muted-foreground">Bugün</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-amber-500">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">Beklemede</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-kp-green">{completedCount}</p>
          <p className="text-[10px] text-muted-foreground">Tamamlandı</p>
        </div>
      </div>

      {/* Date Header */}
      <div className="text-center">
        <p className="text-sm font-semibold">
          {view === "week"
            ? `${weekDays[0].toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} — ${weekDays[6].toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`
            : currentDate.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-coral animate-spin" />
        </div>
      ) : (
        /* Calendar Grid */
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day Headers */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: `60px repeat(${view === "week" ? 7 : 1}, 1fr)` }}>
                <div className="p-2 border-r border-border" />
                {(view === "week" ? weekDays : [currentDate]).map((d, i) => (
                  <div key={i} className={`p-2 text-center border-r border-border last:border-r-0 ${isToday(d) ? "bg-kp-coral/5" : ""}`}>
                    <p className={`text-xs font-semibold ${isToday(d) ? "text-kp-coral" : "text-muted-foreground"}`}>
                      {dayLabel(d)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {hours.map((h) => (
                <div key={h} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: `60px repeat(${view === "week" ? 7 : 1}, 1fr)` }}>
                  <div className="p-1.5 border-r border-border flex items-start">
                    {h % 1 === 0 && <span className="text-[10px] text-muted-foreground">{String(Math.floor(h)).padStart(2, "0")}:00</span>}
                  </div>
                  {(view === "week" ? weekDays : [currentDate]).map((d, di) => {
                    const slotAppts = getAppointmentsForSlot(d, h);
                    return (
                      <div key={di} className={`p-0.5 min-h-[36px] border-r border-border last:border-r-0 ${isToday(d) ? "bg-kp-coral/5" : ""}`}>
                        {slotAppts.map((a) => {
                          const conf = statusConfig[a.status] || statusConfig.PENDING;
                          return (
                            <a key={a.id} href={`/panel/randevular`}
                              className={`block p-1.5 rounded-lg border text-[10px] leading-tight ${conf.bg} hover:opacity-80 transition-opacity mb-0.5`}>
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faPaw} className={`${conf.color} text-[8px]`} />
                                <span className="font-semibold truncate">{a.pet.name}</span>
                              </div>
                              {a.service && <span className="text-muted-foreground truncate block">{a.service.name}</span>}
                            </a>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(statusConfig).map(([key, conf]) => (
          <div key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className={`w-2.5 h-2.5 rounded-sm border ${conf.bg}`} />
            {conf.label}
          </div>
        ))}
      </div>
    </div>
  );
}
