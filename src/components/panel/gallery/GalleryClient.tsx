"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages, faSpinner, faDog, faCat, faDove, faPaw, faCalendarDays, faScissors,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";

interface GroomingRecord {
  id: string; groomingDate: string; servicesPerformed: string[];
  beforePhotoUrl?: string; afterPhotoUrl?: string;
  pet: { name: string; species: string; breed?: string;
    customer: { firstName: string; lastName: string }
  };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function GalleryClient() {
  const [records, setRecords] = useState<GroomingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<GroomingRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/grooming?limit=50");
      if (res.ok) {
        const data = await res.json();
        // Only records with photos
        setRecords(data.records.filter((r: GroomingRecord) => r.beforePhotoUrl || r.afterPhotoUrl));
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
          <FontAwesomeIcon icon={faImages} className="text-purple-500" /> Fotoğraf Galerisi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Bakım öncesi/sonrası fotoğraflar</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-purple-500 animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faImages} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz fotoğraf yok</p>
          <p className="text-sm mt-1">Bakım kayıtlarına fotoğraf ekleyerek galeriyi doldurun.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((r) => (
            <div key={r.id} onClick={() => setSelectedRecord(r)}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
              <div className="grid grid-cols-2 gap-0.5 aspect-square">
                {r.beforePhotoUrl ? (
                  <div className="relative">
                    <img src={r.beforePhotoUrl} alt="Öncesi" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Öncesi</span>
                  </div>
                ) : <div className="bg-muted flex items-center justify-center text-xs text-muted-foreground">Öncesi Yok</div>}
                {r.afterPhotoUrl ? (
                  <div className="relative">
                    <img src={r.afterPhotoUrl} alt="Sonrası" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Sonrası</span>
                  </div>
                ) : <div className="bg-muted flex items-center justify-center text-xs text-muted-foreground">Sonrası Yok</div>}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={speciesIcon(r.pet.species)} className="text-xs text-kp-orange" />
                  <p className="text-sm font-medium">{r.pet.name}</p>
                  <span className="text-[10px] text-muted-foreground">({r.pet.customer.firstName} {r.pet.customer.lastName})</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{new Date(r.groomingDate).toLocaleDateString("tr-TR")}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.servicesPerformed.slice(0, 3).map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] border-0 bg-rose-50 text-rose-600">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRecord(null)}>
          <div className="bg-card rounded-2xl max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faScissors} className="text-rose-500" />
                <div>
                  <p className="font-semibold">{selectedRecord.pet.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(selectedRecord.groomingDate).toLocaleDateString("tr-TR")} • {selectedRecord.servicesPerformed.join(", ")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {selectedRecord.beforePhotoUrl && (
                  <div><p className="text-xs text-center text-muted-foreground mb-1">Öncesi</p><img src={selectedRecord.beforePhotoUrl} alt="Öncesi" className="w-full rounded-xl" /></div>
                )}
                {selectedRecord.afterPhotoUrl && (
                  <div><p className="text-xs text-center text-muted-foreground mb-1">Sonrası</p><img src={selectedRecord.afterPhotoUrl} alt="Sonrası" className="w-full rounded-xl" /></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
