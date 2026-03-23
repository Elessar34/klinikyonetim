"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner, faScissors, faPaw } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GroomingFormProps { onClose: () => void; onSaved: () => void }

interface Pet { id: string; name: string; species: string; breed?: string; coatType?: string; skinSensitivity?: string;
  customer: { firstName: string; lastName: string; phone: string }
}

const groomingServices = [
  { value: "Yıkama", emoji: "🛁" }, { value: "Tıraş", emoji: "✂️" }, { value: "Tam Bakım", emoji: "🐾" },
  { value: "Tırnak Kesimi", emoji: "💅" }, { value: "Kulak Temizliği", emoji: "👂" }, { value: "Diş Fırçalama", emoji: "🦷" },
  { value: "Pire/Kene Banyosu", emoji: "🧴" }, { value: "SPA Bakımı", emoji: "💆" }, { value: "Cilt Bakımı", emoji: "🧼" },
  { value: "Tüy Açma", emoji: "🪮" }, { value: "Parfüm/Kolanya", emoji: "✨" }, { value: "Fiyonk/Bandana", emoji: "🎀" },
];

export default function GroomingFormModal({ onClose, onSaved }: GroomingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    fetch("/api/pets?limit=200")
      .then((r) => r.json())
      .then((d) => setPets(d.pets || []))
      .catch(console.error);
  }, []);

  const filteredPets = pets.filter((p) =>
    `${p.name} ${p.customer.firstName} ${p.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleService = (service: string) => {
    setSelectedServices((prev) => prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedPet) { setError("Pet seçiniz"); return; }
    if (selectedServices.length === 0) { setError("En az bir hizmet seçiniz"); return; }
    setIsLoading(true);

    try {
      const res = await fetch("/api/grooming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: selectedPet.id,
          servicesPerformed: selectedServices,
          notes: notes || undefined,
          nextSuggestedDate: nextDate || undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Hata"); return; }
      onSaved();
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faScissors} className="text-rose-500" /> Yeni Bakım Kaydı
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">{error}</div>}

          {/* Pet Search */}
          <div>
            <Label className="text-xs mb-2 block">Pet Seçimi *</Label>
            {selectedPet ? (
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-kp-orange bg-kp-orange/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-kp-orange/10 flex items-center justify-center"><FontAwesomeIcon icon={faPaw} className="text-kp-orange" /></div>
                  <div>
                    <p className="font-medium text-sm">{selectedPet.name} <span className="text-xs text-muted-foreground">({selectedPet.species}{selectedPet.breed ? ` • ${selectedPet.breed}` : ""})</span></p>
                    <p className="text-xs text-muted-foreground">Sahip: {selectedPet.customer.firstName} {selectedPet.customer.lastName}</p>
                    {selectedPet.coatType && <p className="text-[10px] text-muted-foreground mt-0.5">Tüy: {selectedPet.coatType}{selectedPet.skinSensitivity ? ` • Cilt: ${selectedPet.skinSensitivity}` : ""}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedPet(null)} className="text-xs text-muted-foreground hover:text-foreground">Değiştir</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input placeholder="Pet adı veya sahip adı ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-xl" />
                {searchTerm && (
                  <div className="border border-border rounded-xl max-h-40 overflow-y-auto divide-y divide-border">
                    {filteredPets.slice(0, 6).map((p) => (
                      <button key={p.id} type="button" onClick={() => { setSelectedPet(p); setSearchTerm(""); }}
                        className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm transition-colors flex items-center gap-3">
                        <FontAwesomeIcon icon={faPaw} className="text-xs text-kp-orange" />
                        <div><span className="font-medium">{p.name}</span> <span className="text-xs text-muted-foreground">({p.species}) — {p.customer.firstName} {p.customer.lastName}</span></div>
                      </button>
                    ))}
                    {filteredPets.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">Sonuç bulunamadı</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Services Grid */}
          <div>
            <Label className="text-xs mb-2 block">Yapılan Hizmetler * <span className="text-muted-foreground">({selectedServices.length} seçili)</span></Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {groomingServices.map((s) => (
                <button key={s.value} type="button" onClick={() => toggleService(s.value)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    selectedServices.includes(s.value) ? "border-rose-400 bg-rose-50 text-rose-600 shadow-sm" : "border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  <span className="text-lg">{s.emoji}</span>
                  {s.value}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs mb-2 block">Bakım Notları</Label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Tüy durumu, cilt hassasiyeti, özel istekler..." className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-rose-300/30 focus:border-rose-300" />
          </div>

          {/* Next Suggested Date */}
          <div>
            <Label className="text-xs mb-2 block">Önerilen Sonraki Bakım Tarihi</Label>
            <Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="rounded-xl" />
          </div>

          {/* Summary */}
          {selectedPet && selectedServices.length > 0 && (
            <div className="p-4 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50">
              <p className="text-xs text-muted-foreground mb-1">Bakım Özeti</p>
              <p className="text-sm font-medium">{selectedPet.name} — {selectedServices.join(", ")}</p>
              {nextDate && <p className="text-xs text-muted-foreground mt-1">Sonraki bakım: {new Date(nextDate + "T00:00:00").toLocaleDateString("tr-TR")}</p>}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>İptal</Button>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-md rounded-xl min-w-[140px]" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Bakım Kaydı Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
