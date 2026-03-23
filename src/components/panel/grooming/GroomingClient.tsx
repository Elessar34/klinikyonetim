"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faScissors, faSpinner, faPaw, faDog, faCat, faDove, faCalendarDays, faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GroomingFormModal from "@/components/panel/grooming/GroomingFormModal";

interface GroomingRecord {
  id: string; groomingDate: string; servicesPerformed: string[]; notes?: string;
  beforePhotoUrl?: string; afterPhotoUrl?: string; nextSuggestedDate?: string;
  pet: {
    id: string; name: string; species: string; breed?: string; color?: string; coatType?: string; skinSensitivity?: string;
    customer: { id: string; firstName: string; lastName: string; phone: string };
  };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function GroomingClient() {
  const [records, setRecords] = useState<GroomingRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/grooming?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records);
        setTotal(data.pagination.total);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const daysSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Bugün";
    if (days === 1) return "Dün";
    return `${days} gün önce`;
  };

  const daysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: `${Math.abs(days)} gün gecikmiş`, overdue: true };
    if (days === 0) return { text: "Bugün", overdue: false };
    return { text: `${days} gün sonra`, overdue: false };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faScissors} className="text-rose-500" /> Bakım Kayıtları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} bakım kaydı</p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Bakım
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-rose-500 animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faScissors} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz bakım kaydı yok</p>
          <p className="text-sm mt-1">İlk bakım kaydını oluşturmak için butona tıklayın.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <a key={record.id} href={`/panel/bakim/${record.id}`} className="block bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Pet Info */}
                <div className="flex items-center gap-3 sm:w-64 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={speciesIcon(record.pet.species)} className="text-lg text-kp-orange" />
                  </div>
                  <div>
                    <a href={`/panel/petler/${record.pet.id}`} className="font-semibold text-sm hover:text-kp-green transition-colors">{record.pet.name}</a>
                    <p className="text-xs text-muted-foreground">{record.pet.species}{record.pet.breed ? ` • ${record.pet.breed}` : ""}</p>
                    <a href={`/panel/musteriler/${record.pet.customer.id}`} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                      {record.pet.customer.firstName} {record.pet.customer.lastName}
                    </a>
                  </div>
                </div>

                {/* Services & Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {record.servicesPerformed.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs border-0 bg-rose-50 text-rose-600">{s}</Badge>
                    ))}
                  </div>

                  {record.notes && <p className="text-sm text-muted-foreground">{record.notes}</p>}

                  {record.pet.coatType && (
                    <p className="text-xs text-muted-foreground">
                      Tüy: <span className="font-medium text-foreground">{record.pet.coatType}</span>
                      {record.pet.skinSensitivity && <> • Cilt: <span className="font-medium text-foreground">{record.pet.skinSensitivity}</span></>}
                    </p>
                  )}
                </div>

                {/* Date & Next */}
                <div className="sm:text-right shrink-0 space-y-2">
                  <div>
                    <p className="text-sm font-medium flex items-center sm:justify-end gap-1.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-blue-500" />
                      {new Date(record.groomingDate).toLocaleDateString("tr-TR")}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center sm:justify-end gap-1">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" /> {daysSince(record.groomingDate)}
                    </p>
                  </div>
                  {record.nextSuggestedDate && (() => {
                    const { text, overdue } = daysUntil(record.nextSuggestedDate);
                    return (
                      <div className={`text-xs px-2 py-1 rounded-lg ${overdue ? "bg-destructive/10 text-destructive" : "bg-blue-50 text-blue-600"}`}>
                        Sonraki: {text}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </a>
          ))}

          {total > 20 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
            </div>
          )}
        </div>
      )}

      {showForm && <GroomingFormModal onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchRecords(); }} />}
    </div>
  );
}
