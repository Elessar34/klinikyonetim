"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute, faSpinner, faMapLocationDot, faPhone, faClock, faPaw,
  faArrowUp, faArrowDown, faLocationDot, faExternalLink, faDog, faCat, faDove, faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RouteStop {
  id: string;
  date: string;
  status: string;
  notes?: string;
  pet: { id: string; name: string; species: string };
  customer: { id: string; firstName: string; lastName: string; phone: string; address?: string; city?: string; district?: string };
  service?: { name: string; duration: number };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-kp-green/10 text-kp-green",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELED: "bg-red-100 text-red-700",
};
const statusLabels: Record<string, string> = {
  PENDING: "Beklemede", CONFIRMED: "Teyitli", IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı", CANCELED: "İptal",
};

export default function MobileRouteClient() {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  const fetchStops = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appointments?date=${selectedDate}&limit=50`);
      const d = await res.json();
      const filtered = (d.appointments || []).filter((a: RouteStop) => a.status !== "CANCELED");
      // Sort by time
      filtered.sort((a: RouteStop, b: RouteStop) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setStops(filtered);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [selectedDate]);

  useEffect(() => { fetchStops(); }, [fetchStops]);

  const moveStop = (index: number, direction: "up" | "down") => {
    const newStops = [...stops];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newStops.length) return;
    [newStops[index], newStops[target]] = [newStops[target], newStops[index]];
    setStops(newStops);
  };

  const openGoogleMaps = () => {
    const addresses = stops
      .filter((s) => s.customer.address)
      .map((s) => encodeURIComponent(`${s.customer.address}, ${s.customer.district || ""} ${s.customer.city || ""}`));
    if (addresses.length === 0) return;
    const origin = addresses[0];
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(1, -1).join("|");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}`;
    window.open(url, "_blank");
  };

  const totalDuration = stops.reduce((sum, s) => sum + (s.service?.duration || 30), 0);
  const completedCount = stops.filter((s) => s.status === "COMPLETED").length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faRoute} className="text-kp-coral" /> Mobil Rota
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Günlük bakım rotanızı planlayın</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm bg-card focus:ring-2 focus:ring-kp-coral/20 focus:border-kp-coral" />
          <Button className="bg-kp-coral hover:bg-kp-coral/90 text-white border-0 shadow-md rounded-xl gap-2"
            onClick={openGoogleMaps} disabled={stops.filter((s) => s.customer.address).length === 0}>
            <FontAwesomeIcon icon={faMapLocationDot} /> Haritada Aç
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-kp-coral">{stops.length}</p>
          <p className="text-xs text-muted-foreground">Toplam Durak</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-kp-green">{completedCount}</p>
          <p className="text-xs text-muted-foreground">Tamamlanan</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-500">{stops.length - completedCount}</p>
          <p className="text-xs text-muted-foreground">Kalan</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{Math.round(totalDuration / 60)}s {totalDuration % 60}dk</p>
          <p className="text-xs text-muted-foreground">Tahmini Süre</p>
        </div>
      </div>

      {/* Route List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-coral animate-spin" />
        </div>
      ) : stops.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faRoute} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Bu tarihte randevu yok</p>
          <p className="text-sm mt-1">Farklı bir tarih seçin</p>
        </div>
      ) : (
        <div className="space-y-0">
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative">
              {/* Route line */}
              {index < stops.length - 1 && (
                <div className="absolute left-[23px] top-[52px] bottom-0 w-0.5 bg-border z-0" />
              )}
              <div className="relative flex gap-4 pb-4 z-10">
                {/* Stop number */}
                <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ${
                  stop.status === "COMPLETED"
                    ? "bg-kp-green text-white"
                    : stop.status === "IN_PROGRESS"
                    ? "bg-kp-coral text-white animate-pulse"
                    : "bg-card border-2 border-kp-coral text-kp-coral"
                }`}>
                  {index + 1}
                </div>

                {/* Card */}
                <div className="flex-1 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Time & Pet */}
                    <div className="flex items-center gap-3 sm:w-48 shrink-0">
                      <div className="text-sm">
                        <p className="font-semibold flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faClock} className="text-xs text-kp-coral" />
                          {new Date(stop.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-muted-foreground">{stop.service?.name || "Bakım"} • {stop.service?.duration || 30} dk</p>
                      </div>
                    </div>

                    {/* Pet & Customer */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={speciesIcon(stop.pet.species)} className="text-kp-orange text-xs" />
                        <span className="font-semibold text-sm">{stop.pet.name}</span>
                        <span className="text-xs text-muted-foreground">• {stop.customer.firstName} {stop.customer.lastName}</span>
                        <Badge variant="secondary" className={`text-[10px] border-0 ml-auto ${statusColors[stop.status] || ""}`}>
                          {statusLabels[stop.status] || stop.status}
                        </Badge>
                      </div>

                      {/* Address */}
                      {stop.customer.address && (
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5">
                          <FontAwesomeIcon icon={faLocationDot} className="text-[10px] mt-0.5 text-kp-coral" />
                          {stop.customer.address}{stop.customer.district ? `, ${stop.customer.district}` : ""}{stop.customer.city ? ` / ${stop.customer.city}` : ""}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => moveStop(index, "up")} disabled={index === 0}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-xs hover:bg-muted transition-colors disabled:opacity-30">
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                      <button onClick={() => moveStop(index, "down")} disabled={index === stops.length - 1}
                        className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-xs hover:bg-muted transition-colors disabled:opacity-30">
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                      {stop.customer.phone && (
                        <a href={`tel:${stop.customer.phone}`}
                          className="w-7 h-7 rounded-lg bg-kp-green/10 flex items-center justify-center text-xs text-kp-green hover:bg-kp-green/20">
                          <FontAwesomeIcon icon={faPhone} />
                        </a>
                      )}
                      {stop.customer.address && (
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(stop.customer.address)}`} target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-kp-coral/10 flex items-center justify-center text-xs text-kp-coral hover:bg-kp-coral/20">
                          <FontAwesomeIcon icon={faExternalLink} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-kp-coral/5 border border-kp-coral/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faCalendarDays} className="text-kp-coral mt-0.5" />
          <div>
            <p className="text-sm font-medium">Rota İpuçları</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sırayı yukarı/aşağı oklarıyla değiştirin. &quot;Haritada Aç&quot; butonuyla Google Maps&apos;te optimum rotayı görebilirsiniz.
              Müşterilerin adres bilgisi kayıtlı olmalıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
