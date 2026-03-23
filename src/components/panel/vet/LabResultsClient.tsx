"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faFlask, faSpinner, faDog, faCat, faDove, faPaw, faCalendarDays,
  faXmark, faFileAlt, faCheckCircle, faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface LabParam { parameter: string; value: string; unit?: string; referenceRange?: string }
interface LabResult {
  id: string; testName: string; testDate: string; results?: LabParam[];
  notes?: string; fileUrl?: string; status: string;
  pet: { id: string; name: string; species: string; customer: { id: string; firstName: string; lastName: string } };
}
interface Pet { id: string; name: string; species: string }

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function LabResultsClient() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSearch, setPetSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ petId: "", testName: "", notes: "", status: "pending" as string });
  const [params, setParams] = useState<LabParam[]>([{ parameter: "", value: "", unit: "", referenceRange: "" }]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/lab-results?page=${page}&limit=15`);
      const d = await res.json();
      setResults(d.results); setTotal(d.pagination.total);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const searchPets = async (q: string) => {
    setPetSearch(q);
    if (q.length < 2) { setPets([]); return; }
    const res = await fetch(`/api/pets?search=${q}&limit=10`);
    const d = await res.json(); setPets(d.pets || []);
  };

  const addParam = () => setParams((p) => [...p, { parameter: "", value: "", unit: "", referenceRange: "" }]);
  const updateParam = (i: number, f: keyof LabParam, v: string) => setParams((p) => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x));

  const handleSubmit = async () => {
    if (!form.petId || !form.testName) return;
    setSaving(true);
    try {
      const validParams = params.filter((p) => p.parameter && p.value);
      const res = await fetch("/api/lab-results", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, results: validParams.length > 0 ? validParams : undefined }),
      });
      if (res.ok) { setShowForm(false); fetchData(); setForm({ petId: "", testName: "", notes: "", status: "pending" }); setParams([{ parameter: "", value: "", unit: "", referenceRange: "" }]); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faFlask} className="text-teal-500" /> Laboratuvar Sonuçları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} test</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-md rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Test
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-teal-500 animate-spin" /></div>
      ) : results.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faFlask} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz lab sonucu yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:w-48 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                      <FontAwesomeIcon icon={speciesIcon(r.pet.species)} className="text-kp-orange" />
                    </div>
                    <div>
                      <a href={`/panel/petler/${r.pet.id}`} className="font-semibold text-sm hover:text-teal-500 transition-colors" onClick={(e) => e.stopPropagation()}>{r.pet.name}</a>
                      <p className="text-xs text-muted-foreground">{r.pet.customer.firstName} {r.pet.customer.lastName}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.testName}</p>
                    {r.fileUrl && <a href={r.fileUrl} target="_blank" className="text-xs text-teal-500 hover:underline flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}><FontAwesomeIcon icon={faFileAlt} className="text-[10px]" /> Dosya</a>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] border-0 ${r.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      <FontAwesomeIcon icon={r.status === "completed" ? faCheckCircle : faClock} className="mr-1" />
                      {r.status === "completed" ? "Tamamlandı" : "Beklemede"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(r.testDate).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              </div>
              {expanded === r.id && r.results && (r.results as LabParam[]).length > 0 && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <table className="w-full text-xs">
                    <thead><tr className="text-muted-foreground border-b">
                      <th className="text-left py-1.5">Parametre</th><th className="text-left py-1.5">Değer</th><th className="text-left py-1.5">Birim</th><th className="text-left py-1.5">Referans</th>
                    </tr></thead>
                    <tbody>
                      {(r.results as LabParam[]).map((p, i) => (
                        <tr key={i} className="border-b border-border/50"><td className="py-1.5 font-medium">{p.parameter}</td><td className="py-1.5">{p.value}</td><td className="py-1.5 text-muted-foreground">{p.unit || "-"}</td><td className="py-1.5 text-muted-foreground">{p.referenceRange || "-"}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Yeni Lab Sonucu</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-xs mb-2 block">Pet *</Label>
                <Input placeholder="Pet adı..." value={petSearch} onChange={(e) => searchPets(e.target.value)} className="rounded-xl" />
                {pets.length > 0 && <div className="border border-border rounded-xl mt-1 max-h-32 overflow-y-auto divide-y divide-border">{pets.map((p) => <button key={p.id} type="button" onClick={() => { setForm((f) => ({ ...f, petId: p.id })); setPetSearch(p.name); setPets([]); }} className="w-full text-left px-3 py-2 hover:bg-muted text-sm">{p.name}</button>)}</div>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Test Adı *</Label><Input value={form.testName} onChange={(e) => setForm((f) => ({ ...f, testName: e.target.value }))} placeholder="Hemogram, Biyokimya..." className="rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Durum</Label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-xl text-sm">
                    <option value="pending">Beklemede</option><option value="completed">Tamamlandı</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><Label className="text-xs">Parametreler</Label><button type="button" onClick={addParam} className="text-xs text-teal-500 font-medium">+ Ekle</button></div>
                {params.map((p, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <Input placeholder="Parametre" value={p.parameter} onChange={(e) => updateParam(i, "parameter", e.target.value)} className="rounded-lg h-8 text-xs" />
                    <Input placeholder="Değer" value={p.value} onChange={(e) => updateParam(i, "value", e.target.value)} className="rounded-lg h-8 text-xs" />
                    <Input placeholder="Birim" value={p.unit} onChange={(e) => updateParam(i, "unit", e.target.value)} className="rounded-lg h-8 text-xs" />
                    <Input placeholder="Referans" value={p.referenceRange} onChange={(e) => updateParam(i, "referenceRange", e.target.value)} className="rounded-lg h-8 text-xs" />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Not</Label><Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="rounded-xl" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-md rounded-xl min-w-[100px]" onClick={handleSubmit} disabled={saving || !form.petId || !form.testName}>
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
