"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner, faPaw } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PetFormProps { onClose: () => void; onSaved: () => void }
interface Customer { id: string; firstName: string; lastName: string; phone: string }

const speciesOptions = ["Köpek", "Kedi", "Kuş", "Hamster", "Tavşan", "Balık", "Sürüngen", "Diğer"];
const genderOptions = [
  { value: "MALE", label: "Erkek" }, { value: "FEMALE", label: "Dişi" }, { value: "UNKNOWN", label: "Bilinmiyor" },
];

export default function PetFormModal({ onClose, onSaved }: PetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: "", species: "Köpek", breed: "", gender: "UNKNOWN", dateOfBirth: "", color: "", weight: "", microchipNo: "",
  });

  useEffect(() => {
    fetch("/api/customers?limit=200")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .catch(console.error);
  }, []);

  const filteredCustomers = customers.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedCustomer) { setError("Sahip seçiniz"); return; }
    if (!form.name.trim()) { setError("Pet adı gerekli"); return; }
    setIsLoading(true);

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerId: selectedCustomer.id,
          weight: form.weight ? parseFloat(form.weight) : undefined,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Hata"); return; }
      onSaved();
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faPaw} className="text-kp-orange" /> Yeni Pet Ekle
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">{error}</div>}

          {/* Customer Search */}
          <div>
            <Label className="text-xs mb-2 block">Sahip *</Label>
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-kp-green bg-kp-green/5">
                <p className="text-sm font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName} <span className="text-xs text-muted-foreground">{selectedCustomer.phone}</span></p>
                <button type="button" onClick={() => setSelectedCustomer(null)} className="text-xs text-muted-foreground hover:text-foreground">Değiştir</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input placeholder="Müşteri adı veya telefon ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-xl" />
                {searchTerm && (
                  <div className="border border-border rounded-xl max-h-32 overflow-y-auto divide-y divide-border">
                    {filteredCustomers.slice(0, 5).map((c) => (
                      <button key={c.id} type="button" onClick={() => { setSelectedCustomer(c); setSearchTerm(""); }}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors">
                        {c.firstName} {c.lastName} <span className="text-xs text-muted-foreground">{c.phone}</span>
                      </button>
                    ))}
                    {filteredCustomers.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">Sonuç bulunamadı</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pet Adı *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Pamuk" className="rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tür *</Label>
              <div className="flex flex-wrap gap-1.5">
                {speciesOptions.slice(0, 4).map((s) => (
                  <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, species: s }))}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${form.species === s ? "border-kp-orange bg-kp-orange/10 text-kp-orange" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Cins</Label>
              <Input value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} placeholder="Golden Retriever" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cinsiyet</Label>
              <div className="flex gap-1.5">
                {genderOptions.map((g) => (
                  <button key={g.value} type="button" onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
                    className={`flex-1 py-1.5 rounded-lg border text-xs transition-all ${form.gender === g.value ? "border-purple-400 bg-purple-50 text-purple-600" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Doğum Tarihi</Label>
              <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Renk</Label>
              <Input value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="Altın" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kilo (kg)</Label>
              <Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} placeholder="15" className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Mikroçip No</Label>
            <Input value={form.microchipNo} onChange={(e) => setForm((f) => ({ ...f, microchipNo: e.target.value }))} placeholder="Opsiyonel" className="rounded-xl" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>İptal</Button>
            <Button type="submit" className="gradient-primary text-white border-0 shadow-md rounded-xl min-w-[120px]" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Pet Ekle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
