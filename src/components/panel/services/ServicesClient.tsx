"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner, faClock, faTag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string; name: string; description?: string; duration: number; price: number; category?: string; isActive: boolean;
}

const defaultCategories = [
  "Yıkama", "Tıraş", "Tam Bakım", "Tırnak Kesimi", "Kulak Temizliği",
  "Diş Fırçalama", "SPA", "Cilt Bakımı", "Pire/Kene",
];

export default function ServicesClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", duration: "30", price: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = () => {
    setIsLoading(true);
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services)).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, duration: parseInt(form.duration), price: parseFloat(form.price) }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Hata"); return; }
      setShowForm(false);
      setForm({ name: "", description: "", duration: "30", price: "", category: "" });
      fetchServices();
    } catch { setError("Hata"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Hizmetler</h1>
          <p className="text-sm text-muted-foreground mt-1">{services.length} hizmet tanımlı</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Hizmet
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faTag} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz hizmet tanımlı değil</p>
          <p className="text-sm mt-1">Hizmet eklemek için butona tıklayın.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  {s.category && <Badge variant="secondary" className="text-[10px] border-0 mt-1">{s.category}</Badge>}
                </div>
                <p className="text-lg font-bold text-kp-green">{fmt(s.price)}</p>
              </div>
              {s.description && <p className="text-sm text-muted-foreground mb-3">{s.description}</p>}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-[10px]" /> {s.duration} dakika
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold font-[family-name:var(--font-heading)]">Yeni Hizmet</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm">{error}</div>}
              <div className="space-y-1.5">
                <Label className="text-xs">Hizmet Adı *</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Tam Bakım" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Kategori</Label>
                <div className="flex flex-wrap gap-1.5">
                  {defaultCategories.map((c) => (
                    <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, category: c }))}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${form.category === c ? "border-kp-green bg-kp-green/10 text-kp-green" : "border-border text-muted-foreground hover:bg-muted"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Süre (dk) *</Label>
                  <Input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Fiyat (₺) *</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-xl" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Açıklama</Label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Hizmet detayı..." className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button type="submit" className="gradient-primary text-white border-0 shadow-md rounded-xl min-w-[100px]" disabled={saving}>
                  {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
