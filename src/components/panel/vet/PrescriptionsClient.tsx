"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPrescriptionBottleMedical, faSpinner, faPaw, faDog, faCat, faDove,
  faCalendarDays, faXmark, faPills, faTrash, faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Medication { name: string; dosage: string; frequency: string; duration: string }
interface Prescription {
  id: string; prescriptionDate: string; medications: Medication[]; notes?: string; isActive: boolean;
  pet: { id: string; name: string; species: string; customer: { id: string; firstName: string; lastName: string } };
}
interface Pet { id: string; name: string; species: string }

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function PrescriptionsClient() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSearch, setPetSearch] = useState("");
  const [form, setForm] = useState({ petId: "", notes: "" });
  const [meds, setMeds] = useState<Medication[]>([{ name: "", dosage: "", frequency: "", duration: "" }]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/prescriptions?limit=20");
      const d = await res.json();
      setPrescriptions(d.prescriptions); setTotal(d.pagination.total);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const searchPets = async (q: string) => {
    setPetSearch(q);
    if (q.length < 2) { setPets([]); return; }
    const res = await fetch(`/api/pets?search=${q}&limit=10`);
    const d = await res.json(); setPets(d.pets || []);
  };

  const addMed = () => setMeds((m) => [...m, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMed = (i: number) => setMeds((m) => m.filter((_, idx) => idx !== i));
  const updateMed = (i: number, field: keyof Medication, value: string) =>
    setMeds((m) => m.map((med, idx) => idx === i ? { ...med, [field]: value } : med));

  const handleSubmit = async () => {
    const validMeds = meds.filter((m) => m.name);
    if (!form.petId || validMeds.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId: form.petId, medications: validMeds, notes: form.notes || undefined }),
      });
      if (res.ok) {
        setShowForm(false); fetchData();
        setForm({ petId: "", notes: "" });
        setMeds([{ name: "", dosage: "", frequency: "", duration: "" }]);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="text-purple-500" /> Reçeteler
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} reçete</p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-md rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Reçete
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-purple-500 animate-spin" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faPrescriptionBottleMedical} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz reçete yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={speciesIcon(rx.pet.species)} className="text-kp-orange" />
                  </div>
                  <div>
                    <a href={`/panel/petler/${rx.pet.id}`} className="font-semibold text-sm hover:text-purple-500 transition-colors">{rx.pet.name}</a>
                    <p className="text-xs text-muted-foreground">{rx.pet.customer.firstName} {rx.pet.customer.lastName}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {(rx.medications as Medication[]).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-100">
                      <FontAwesomeIcon icon={faPills} className="text-[10px] text-purple-500" />
                      <span className="text-sm font-medium text-purple-700">{m.name}</span>
                      <span className="text-xs text-muted-foreground">• {m.dosage} • {m.frequency} • {m.duration}</span>
                    </div>
                  ))}
                  {rx.notes && <p className="text-xs text-muted-foreground mt-2">{rx.notes}</p>}
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-sm font-medium flex items-center sm:justify-end gap-1.5">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-purple-500" />
                    {new Date(rx.prescriptionDate).toLocaleDateString("tr-TR")}
                  </p>
                  <Badge variant="secondary" className={`text-[10px] border-0 mt-1 ${rx.isActive ? "bg-kp-green/10 text-kp-green" : "bg-muted"}`}>
                    {rx.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                  <a href={`/panel/recete-yazdir/${rx.id}`} target="_blank" rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-[10px] text-purple-500 hover:text-purple-700 font-medium transition-colors">
                    <FontAwesomeIcon icon={faPrint} /> Yazdır
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Yeni Reçete</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-xs mb-2 block">Pet Ara *</Label>
                <Input placeholder="Pet adı..." value={petSearch} onChange={(e) => searchPets(e.target.value)} className="rounded-xl" />
                {pets.length > 0 && (
                  <div className="border border-border rounded-xl mt-1 max-h-32 overflow-y-auto divide-y divide-border">
                    {pets.map((p) => (
                      <button key={p.id} type="button"
                        onClick={() => { setForm((f) => ({ ...f, petId: p.id })); setPetSearch(p.name); setPets([]); }}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm">{p.name}</button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">İlaçlar *</Label>
                  <button type="button" onClick={addMed} className="text-xs text-purple-500 hover:text-purple-600 font-medium">+ İlaç Ekle</button>
                </div>
                <div className="space-y-3">
                  {meds.map((med, i) => (
                    <div key={i} className="p-3 rounded-xl border border-purple-100 bg-purple-50/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-purple-600">İlaç {i + 1}</span>
                        {meds.length > 1 && (
                          <button type="button" onClick={() => removeMed(i)} className="text-destructive text-xs">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="İlaç adı" value={med.name} onChange={(e) => updateMed(i, "name", e.target.value)} className="rounded-lg h-8 text-xs" />
                        <Input placeholder="Doz (500mg)" value={med.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} className="rounded-lg h-8 text-xs" />
                        <Input placeholder="Sıklık (2x1)" value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} className="rounded-lg h-8 text-xs" />
                        <Input placeholder="Süre (7 gün)" value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} className="rounded-lg h-8 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Not</Label>
                <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="rounded-xl" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-md rounded-xl min-w-[100px]"
                  onClick={handleSubmit} disabled={saving || !form.petId}>
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
