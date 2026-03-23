"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faCalendarDays, faClock, faDog, faUser, faSpinner,
  faChevronLeft, faChevronRight, faCircleCheck, faHourglass,
  faCircleXmark, faPlay, faCheck, faEyeSlash, faList, faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppointmentFormModal from "@/components/panel/appointments/AppointmentFormModal";

interface Appointment {
  id: string; date: string; endDate?: string; status: string; notes?: string;
  customer: { id: string; firstName: string; lastName: string; phone: string };
  pet: { id: string; name: string; species: string; breed?: string };
  service?: { id: string; name: string; duration: number; price: number };
  assignedTo?: { id: string; firstName: string; lastName: string };
}

const statusConfig: Record<string, { label: string; icon: typeof faHourglass; color: string; bg: string }> = {
  PENDING: { label: "Beklemede", icon: faHourglass, color: "text-amber-600", bg: "bg-amber-50" },
  CONFIRMED: { label: "Onaylı", icon: faCircleCheck, color: "text-kp-green", bg: "bg-kp-green/10" },
  IN_PROGRESS: { label: "Devam Ediyor", icon: faPlay, color: "text-blue-600", bg: "bg-blue-50" },
  COMPLETED: { label: "Tamamlandı", icon: faCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  CANCELED: { label: "İptal", icon: faCircleXmark, color: "text-destructive", bg: "bg-destructive/10" },
  NO_SHOW: { label: "Gelmedi", icon: faEyeSlash, color: "text-muted-foreground", bg: "bg-muted" },
};

const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export default function AppointmentsClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formDefaultDate, setFormDefaultDate] = useState("");

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const start = new Date(year, month, 1).toISOString();
      const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      const res = await fetch(`/api/appointments?startDate=${start}&endDate=${end}&limit=200`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, [currentMonth]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const changeMonth = (offset: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const formatTime = (d: string) => new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchAppointments();
  };

  const openNewAppt = (date?: string) => {
    setFormDefaultDate(date || new Date().toISOString().split("T")[0]);
    setShowForm(true);
  };

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday=0
  const totalDays = lastDay.getDate();
  const today = new Date().toISOString().split("T")[0];

  const getApptsByDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter((a) => a.date.startsWith(dateStr));
  };

  const selectedDayAppts = appointments.filter((a) => a.date.startsWith(selectedDate));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Randevular</h1>
          <p className="text-sm text-muted-foreground mt-1">{MONTHS_TR[month]} {year}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-xl p-0.5">
            <button onClick={() => setView("calendar")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "calendar" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              <FontAwesomeIcon icon={faTableCells} className="mr-1" /> Takvim
            </button>
            <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "list" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              <FontAwesomeIcon icon={faList} className="mr-1" /> Liste
            </button>
          </div>
          <Button className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2" onClick={() => openNewAppt()}>
            <FontAwesomeIcon icon={faPlus} /> Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors border border-border">
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
        </button>
        <h2 className="text-lg font-semibold">{MONTHS_TR[month]} {year}</h2>
        <button onClick={() => changeMonth(1)} className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors border border-border">
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>
      ) : view === "calendar" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-px">
              {/* Day headers */}
              {DAYS_TR.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
              ))}
              {/* Empty cells before month start */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`e${i}`} className="p-1 min-h-[80px]" />
              ))}
              {/* Day cells */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayAppts = getApptsByDate(day);
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                return (
                  <button key={day} onClick={() => setSelectedDate(dateStr)}
                    className={`p-1.5 min-h-[80px] rounded-xl text-left transition-all border-2 ${
                      isSelected ? "border-kp-green bg-kp-green/5" : isToday ? "border-blue-300 bg-blue-50/50" : "border-transparent hover:bg-muted/50"
                    }`}>
                    <span className={`text-xs font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayAppts.slice(0, 3).map((a) => {
                        const conf = statusConfig[a.status] || statusConfig.PENDING;
                        return (
                          <div key={a.id} className={`text-[9px] px-1 py-0.5 rounded ${conf.bg} ${conf.color} truncate`}>
                            {formatTime(a.date)} {a.pet.name}
                          </div>
                        );
                      })}
                      {dayAppts.length > 3 && <div className="text-[9px] text-muted-foreground px-1">+{dayAppts.length - 3} daha</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Detail */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}
              </h3>
              <Button variant="outline" size="sm" className="rounded-lg text-xs h-7" onClick={() => openNewAppt(selectedDate)}>
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Ekle
              </Button>
            </div>
            {selectedDayAppts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FontAwesomeIcon icon={faCalendarDays} className="text-3xl text-muted-foreground/30 mb-2" />
                <p className="text-sm">Bu gün randevu yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayAppts.map((appt) => {
                  const conf = statusConfig[appt.status] || statusConfig.PENDING;
                  return (
                    <div key={appt.id} className="p-3 rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faClock} className="text-xs text-blue-500" /> {formatTime(appt.date)}
                        </span>
                        <Badge variant="secondary" className={`border-0 text-[10px] ${conf.bg} ${conf.color}`}>
                          <FontAwesomeIcon icon={conf.icon} className="mr-1 text-[8px]" />{conf.label}
                        </Badge>
                      </div>
                      <p className="text-sm flex items-center gap-1.5"><FontAwesomeIcon icon={faUser} className="text-[10px] text-muted-foreground" />{appt.customer.firstName} {appt.customer.lastName}</p>
                      <p className="text-sm flex items-center gap-1.5"><FontAwesomeIcon icon={faDog} className="text-[10px] text-muted-foreground" />{appt.pet.name} ({appt.pet.species})</p>
                      {appt.notes && <p className="text-xs text-muted-foreground">{appt.notes}</p>}
                      <div className="flex gap-1 pt-1">
                        {appt.status === "PENDING" && <Button size="sm" variant="outline" className="text-[10px] rounded-lg h-6 px-2" onClick={(e) => { e.stopPropagation(); updateStatus(appt.id, "CONFIRMED"); }}>Onayla</Button>}
                        {(appt.status === "CONFIRMED" || appt.status === "IN_PROGRESS") && <Button size="sm" variant="outline" className="text-[10px] rounded-lg h-6 px-2 text-emerald-600" onClick={(e) => { e.stopPropagation(); updateStatus(appt.id, "COMPLETED"); }}>Tamamla</Button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
              <FontAwesomeIcon icon={faCalendarDays} className="text-4xl text-muted-foreground/30 mb-3" />
              <p className="font-medium">Bu ay randevu yok</p>
            </div>
          ) : appointments.map((appt) => {
            const conf = statusConfig[appt.status] || statusConfig.PENDING;
            return (
              <div key={appt.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 sm:w-32 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faClock} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold">{formatTime(appt.date)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(appt.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium"><FontAwesomeIcon icon={faUser} className="text-xs text-muted-foreground mr-1" />{appt.customer.firstName} {appt.customer.lastName}</p>
                  <p className="text-sm"><FontAwesomeIcon icon={faDog} className="text-xs text-muted-foreground mr-1" />{appt.pet.name} ({appt.pet.species})</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant="secondary" className={`border-0 text-xs ${conf.bg} ${conf.color}`}>
                    <FontAwesomeIcon icon={conf.icon} className="mr-1 text-[10px]" />{conf.label}
                  </Badge>
                  <div className="flex gap-1">
                    {appt.status === "PENDING" && <Button size="sm" variant="outline" className="text-xs rounded-lg h-7 px-2" onClick={() => updateStatus(appt.id, "CONFIRMED")}>Onayla</Button>}
                    {(appt.status === "CONFIRMED" || appt.status === "IN_PROGRESS") && <Button size="sm" variant="outline" className="text-xs rounded-lg h-7 px-2 text-emerald-600" onClick={() => updateStatus(appt.id, "COMPLETED")}>Tamamla</Button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <AppointmentFormModal defaultDate={formDefaultDate} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchAppointments(); }} />}
    </div>
  );
}
