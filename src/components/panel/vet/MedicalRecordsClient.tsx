"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faStethoscope, faSpinner, faDog, faCat, faDove, faPaw, faCalendarDays,
  faThermometerHalf, faHeartPulse, faWeight, faLungs, faMagnifyingGlass, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MedicalRecord {
  id: string; visitDate: string; chiefComplaint?: string; diagnosis?: string;
  treatment?: string; notes?: string; weight?: number; temperature?: number;
  heartRate?: number; respiratoryRate?: number; followUpDate?: string;
  pet: { id: string; name: string; species: string; breed?: string; customer: { id: string; firstName: string; lastName: string } };
}

interface Pet { id: string; name: string; species: string }

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function MedicalRecordsClient() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSearch, setPetSearch] = useState("");
  const [form, setForm] = useState({
    petId: "", chiefComplaint: "", diagnosis: "", treatment: "", notes: "",
    weight: "", temperature: "", heartRate: "", respiratoryRate: "", followUpDate: "",
  });

  const examTemplates = [
    { label: "Genel Kontrol", complaint: "Genel sağlık kontrolü", notes: "Rutin kontrol muayenesi", temp: "38.5", hr: "80", rr: "18" },
    { label: "Acil", complaint: "Acil başvuru", notes: "", temp: "", hr: "", rr: "" },
    { label: "Aşı Muayenesi", complaint: "Aşı öncesi muayene", notes: "Aşı uygulaması öncesi genel değerlendirme", temp: "38.5", hr: "80", rr: "18" },
    { label: "Diş Kontrolü", complaint: "Diş/ağız problemi", notes: "Oral muayene, diş taşı kontrolü", temp: "", hr: "", rr: "" },
    { label: "Cilt/Alerji", complaint: "Cilt problemleri / kaşıntı", notes: "Cilt muayenesi, alerji testi", temp: "", hr: "", rr: "" },
    { label: "Operasyon Sonrası", complaint: "Post-op kontrol", notes: "Yara bakımı, dikişler kontrol edildi", temp: "38.5", hr: "80", rr: "18" },
  ];

  const applyTemplate = (t: typeof examTemplates[0]) => {
    setForm((f) => ({
      ...f,
      chiefComplaint: t.complaint,
      notes: t.notes,
      temperature: t.temp,
      heartRate: t.hr,
      respiratoryRate: t.rr,
    }));
  };

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/medical-records?page=${page}&limit=15`);
      const d = await res.json();
      setRecords(d.records); setTotal(d.pagination.total);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const searchPets = async (q: string) => {
    setPetSearch(q);
    if (q.length < 2) { setPets([]); return; }
    const res = await fetch(`/api/pets?search=${q}&limit=10`);
    const d = await res.json(); setPets(d.pets || []);
  };

  const handleSubmit = async () => {
    if (!form.petId) return;
    setSaving(true);
    try {
      const body = {
        petId: form.petId, chiefComplaint: form.chiefComplaint || undefined,
        diagnosis: form.diagnosis || undefined, treatment: form.treatment || undefined,
        notes: form.notes || undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        temperature: form.temperature ? parseFloat(form.temperature) : undefined,
        heartRate: form.heartRate ? parseInt(form.heartRate) : undefined,
        respiratoryRate: form.respiratoryRate ? parseInt(form.respiratoryRate) : undefined,
        followUpDate: form.followUpDate || undefined,
      };
      const res = await fetch("/api/medical-records", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { setShowForm(false); fetchRecords(); setForm({ petId: "", chiefComplaint: "", diagnosis: "", treatment: "", notes: "", weight: "", temperature: "", heartRate: "", respiratoryRate: "", followUpDate: "" }); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faStethoscope} className="text-blue-500" /> Hasta Dosyası
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} muayene kaydı</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Muayene
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-500 animate-spin" /></div>
      ) : records.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faStethoscope} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz muayene kaydı yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 sm:w-56 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={speciesIcon(r.pet.species)} className="text-kp-orange" />
                  </div>
                  <div>
                    <a href={`/panel/petler/${r.pet.id}`} className="font-semibold text-sm hover:text-blue-500 transition-colors">{r.pet.name}</a>
                    <p className="text-xs text-muted-foreground">{r.pet.customer.firstName} {r.pet.customer.lastName}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {r.chiefComplaint && <p className="text-sm"><span className="text-muted-foreground">Şikayet:</span> <span className="font-medium">{r.chiefComplaint}</span></p>}
                  {r.diagnosis && <p className="text-sm"><span className="text-muted-foreground">Teşhis:</span> <span className="font-medium text-blue-600">{r.diagnosis}</span></p>}
                  {r.treatment && <p className="text-sm"><span className="text-muted-foreground">Tedavi:</span> {r.treatment}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.weight && <Badge variant="secondary" className="text-[10px] border-0 bg-blue-50 text-blue-600"><FontAwesomeIcon icon={faWeight} className="mr-1" />{r.weight}kg</Badge>}
                    {r.temperature && <Badge variant="secondary" className="text-[10px] border-0 bg-red-50 text-red-600"><FontAwesomeIcon icon={faThermometerHalf} className="mr-1" />{r.temperature}°C</Badge>}
                    {r.heartRate && <Badge variant="secondary" className="text-[10px] border-0 bg-rose-50 text-rose-600"><FontAwesomeIcon icon={faHeartPulse} className="mr-1" />{r.heartRate} bpm</Badge>}
                    {r.respiratoryRate && <Badge variant="secondary" className="text-[10px] border-0 bg-emerald-50 text-emerald-600"><FontAwesomeIcon icon={faLungs} className="mr-1" />{r.respiratoryRate}/dk</Badge>}
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-sm font-medium flex items-center sm:justify-end gap-1.5"><FontAwesomeIcon icon={faCalendarDays} className="text-xs text-blue-500" />{new Date(r.visitDate).toLocaleDateString("tr-TR")}</p>
                  {r.followUpDate && <p className="text-[10px] text-muted-foreground mt-1">Kontrol: {new Date(r.followUpDate).toLocaleDateString("tr-TR")}</p>}
                </div>
              </div>
            </div>
          ))}
          {total > 15 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
            </div>
          )}
        </div>
      )}

      {/* Form Modal — Basit Muayene Kaydı */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Yeni Muayene Kaydı</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-muted-foreground bg-blue-50 text-blue-600 px-3 py-2 rounded-lg">
                💡 Teşhis, tedavi ve vital bulgular muayene detay sayfasında eklenebilir.
              </p>
              {/* Examination Templates */}
              <div>
                <Label className="text-xs mb-1.5 block">Muayene Şablonu</Label>
                <div className="flex flex-wrap gap-1.5">
                  {examTemplates.map((t) => (
                    <button key={t.label} type="button" onClick={() => applyTemplate(t)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-border hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Pet Search */}
              <div>
                <Label className="text-xs mb-2 block">Pet Ara *</Label>
                <Input placeholder="Pet adı ile ara..." value={petSearch} onChange={(e) => searchPets(e.target.value)} className="rounded-xl" />
                {pets.length > 0 && (
                  <div className="border border-border rounded-xl mt-1 max-h-32 overflow-y-auto divide-y divide-border">
                    {pets.map((p) => (
                      <button key={p.id} type="button" onClick={() => { setForm((f) => ({ ...f, petId: p.id })); setPetSearch(p.name); setPets([]); }}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors">
                        <FontAwesomeIcon icon={speciesIcon(p.species)} className="mr-2 text-xs text-kp-orange" />{p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Başvuru Şikayeti *</Label>
                <Input value={form.chiefComplaint} onChange={(e) => setForm((f) => ({ ...f, chiefComplaint: e.target.value }))} placeholder="Ateş, halsizlik, ishal..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Notlar</Label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="İlk gözlem notları..."
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-300" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md rounded-xl min-w-[120px]" onClick={handleSubmit} disabled={saving || !form.petId}>
                  {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Muayene Başlat"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
