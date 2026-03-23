"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSyringe, faSpinner, faDog, faCat, faDove, faPaw, faCalendarDays,
  faXmark, faExclamationTriangle, faCheck, faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Vaccination {
  id: string; vaccineName: string; vaccineType?: string; batchNumber?: string;
  administeredDate: string; nextDueDate?: string; reminderSent: boolean; notes?: string;
  pet: { id: string; name: string; species: string; customer: { id: string; firstName: string; lastName: string; phone: string } };
}
interface Pet { id: string; name: string; species: string }

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

const vaccineTypes = ["Kuduz", "Karma (DHPPi)", "Leptospirosis", "Bordetella", "İç Parazit", "Dış Parazit", "FeLV", "FIV", "FPV", "Diğer"];

export default function VaccinationsClient() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "due">("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSearch, setPetSearch] = useState("");
  const [form, setForm] = useState({
    petId: "", vaccineName: "", vaccineType: "", batchNumber: "",
    administeredDate: new Date().toISOString().split("T")[0], nextDueDate: "", notes: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/vaccinations?page=${page}&limit=20${filter === "due" ? "&dueOnly=true" : ""}`);
      const d = await res.json();
      setVaccinations(d.vaccinations); setTotal(d.pagination.total);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page, filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const searchPets = async (q: string) => {
    setPetSearch(q);
    if (q.length < 2) { setPets([]); return; }
    const res = await fetch(`/api/pets?search=${q}&limit=10`);
    const d = await res.json(); setPets(d.pets || []);
  };

  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)} gün gecikmiş`, overdue: true };
    if (diff === 0) return { text: "Bugün", overdue: false };
    return { text: `${diff} gün sonra`, overdue: diff <= 7 };
  };

  const sendWhatsApp = (phone: string, msg: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSubmit = async () => {
    if (!form.petId || !form.vaccineName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vaccinations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); fetchData(); setForm({ petId: "", vaccineName: "", vaccineType: "", batchNumber: "", administeredDate: new Date().toISOString().split("T")[0], nextDueDate: "", notes: "" }); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faSyringe} className="text-amber-500" /> Aşı Takibi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} aşı kaydı</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-xl p-0.5">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Tümü</button>
            <button onClick={() => setFilter("due")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "due" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Yaklaşan</button>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md rounded-xl gap-2" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} /> Yeni Aşı
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-amber-500 animate-spin" /></div>
      ) : vaccinations.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faSyringe} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">{filter === "due" ? "Yaklaşan aşı yok" : "Henüz aşı kaydı yok"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vaccinations.map((v) => {
            const nextInfo = v.nextDueDate ? daysUntil(v.nextDueDate) : null;
            return (
              <div key={v.id} className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-all ${
                nextInfo?.overdue ? "border-destructive/30 bg-destructive/[0.02]" : "border-border"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:w-48 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                      <FontAwesomeIcon icon={speciesIcon(v.pet.species)} className="text-kp-orange" />
                    </div>
                    <div>
                      <a href={`/panel/petler/${v.pet.id}`} className="font-semibold text-sm hover:text-amber-500 transition-colors">{v.pet.name}</a>
                      <p className="text-xs text-muted-foreground">{v.pet.customer.firstName} {v.pet.customer.lastName}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-700">{v.vaccineName}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {v.vaccineType && <Badge variant="secondary" className="text-[10px] border-0 bg-amber-50 text-amber-600">{v.vaccineType}</Badge>}
                      {v.batchNumber && <Badge variant="secondary" className="text-[10px] border-0">Lot: {v.batchNumber}</Badge>}
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center sm:justify-end gap-1.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                      Yapıldı: {new Date(v.administeredDate).toLocaleDateString("tr-TR")}
                    </p>
                    {nextInfo && (
                      <div className="flex items-center sm:justify-end gap-2">
                        <Badge variant="secondary" className={`text-[10px] border-0 ${nextInfo.overdue ? "bg-destructive/10 text-destructive" : "bg-blue-50 text-blue-600"}`}>
                          {nextInfo.overdue && <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />}
                          Sonraki: {nextInfo.text}
                        </Badge>
                        {nextInfo.overdue && (
                          <button onClick={() => sendWhatsApp(v.pet.customer.phone, `Merhaba ${v.pet.customer.firstName} Bey/Hanım, ${v.pet.name}'in ${v.vaccineName} aşı zamanı geldi. Randevu almak ister misiniz? 🐾`)}
                            className="text-green-600 hover:text-green-700">
                            <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Yeni Aşı Kaydı</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-xs mb-2 block">Pet Ara *</Label>
                <Input placeholder="Pet adı..." value={petSearch} onChange={(e) => searchPets(e.target.value)} className="rounded-xl" />
                {pets.length > 0 && (
                  <div className="border border-border rounded-xl mt-1 max-h-32 overflow-y-auto divide-y divide-border">
                    {pets.map((p) => (
                      <button key={p.id} type="button" onClick={() => { setForm((f) => ({ ...f, petId: p.id })); setPetSearch(p.name); setPets([]); }}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm">{p.name}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Aşı Adı *</Label>
                <Input value={form.vaccineName} onChange={(e) => setForm((f) => ({ ...f, vaccineName: e.target.value }))} placeholder="Kuduz aşısı..." className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs mb-2 block">Aşı Tipi</Label>
                <div className="flex flex-wrap gap-1.5">
                  {vaccineTypes.map((t) => (
                    <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, vaccineType: f.vaccineType === t ? "" : t }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.vaccineType === t ? "border-amber-500 bg-amber-50 text-amber-700" : "border-border hover:bg-muted"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Yapılma Tarihi</Label><Input type="date" value={form.administeredDate} onChange={(e) => setForm((f) => ({ ...f, administeredDate: e.target.value }))} className="rounded-xl" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Sonraki Tarih</Label>
                  <Input type="date" value={form.nextDueDate} onChange={(e) => setForm((f) => ({ ...f, nextDueDate: e.target.value }))} className="rounded-xl" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-muted-foreground self-center mr-1">Hızlı:</span>
                {[
                  { label: "21 gün", days: 21 },
                  { label: "1 ay", days: 30 },
                  { label: "3 ay", days: 90 },
                  { label: "6 ay", days: 180 },
                  { label: "1 yıl", days: 365 },
                ].map((preset) => (
                  <button key={preset.label} type="button"
                    onClick={() => {
                      const base = form.administeredDate ? new Date(form.administeredDate) : new Date();
                      base.setDate(base.getDate() + preset.days);
                      setForm((f) => ({ ...f, nextDueDate: base.toISOString().split("T")[0] }));
                    }}
                    className="px-2 py-1 rounded-md text-[10px] font-medium border border-border hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors">
                    +{preset.label}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Parti No</Label><Input value={form.batchNumber} onChange={(e) => setForm((f) => ({ ...f, batchNumber: e.target.value }))} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Not</Label><Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="rounded-xl" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md rounded-xl min-w-[100px]" onClick={handleSubmit} disabled={saving || !form.petId || !form.vaccineName}>
                  {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
