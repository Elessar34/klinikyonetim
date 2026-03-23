"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner, faClock, faTag } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AppointmentFormProps {
  defaultDate?: string;
  onClose: () => void;
  onSaved: () => void;
}

interface Customer { id: string; firstName: string; lastName: string; phone: string; pets: { id: string; name: string; species: string }[] }
interface Service { id: string; name: string; duration: number; price: number; category?: string }

export default function AppointmentFormModal({ defaultDate, onClose, onSaved }: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    customerId: "", petId: "",
    date: defaultDate || new Date().toISOString().split("T")[0],
    time: "09:00", notes: "", serviceId: "",
  });

  useEffect(() => {
    fetch("/api/customers?limit=200").then((r) => r.json()).then((d) => setCustomers(d.customers || [])).catch(console.error);
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services || [])).catch(console.error);
  }, []);

  const filteredCustomers = customers.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.pets.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setForm((f) => ({ ...f, customerId: c.id, petId: c.pets.length === 1 ? c.pets[0].id : "" }));
    setSearchTerm("");
  };

  const selectService = (s: Service) => {
    setSelectedService(s);
    setForm((f) => ({ ...f, serviceId: s.id }));
  };

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerId) { setError("Müşteri seçiniz"); return; }
    if (!form.petId) { setError("Pet seçiniz"); return; }
    setIsLoading(true);

    try {
      const dateTime = `${form.date}T${form.time}:00`;
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: form.customerId, petId: form.petId,
          date: dateTime, notes: form.notes,
          serviceId: form.serviceId || undefined,
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
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)]">Yeni Randevu</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">{error}</div>}

          {/* Customer Search */}
          <div>
            <Label className="text-xs mb-2 block">Müşteri *</Label>
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-kp-green bg-kp-green/5">
                <div>
                  <p className="text-sm font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.phone} • {selectedCustomer.pets.length} pet</p>
                </div>
                <button type="button" onClick={() => { setSelectedCustomer(null); setForm((f) => ({ ...f, customerId: "", petId: "" })); }}
                  className="text-xs text-muted-foreground hover:text-foreground">Değiştir</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input placeholder="Müşteri adı, telefon veya pet adı ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-xl" />
                {searchTerm && (
                  <div className="border border-border rounded-xl max-h-40 overflow-y-auto divide-y divide-border">
                    {filteredCustomers.slice(0, 5).map((c) => {
                      const matchingPets = c.pets.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                      return (
                        <button key={c.id} type="button" onClick={() => selectCustomer(c)}
                          className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors">
                          <span>{c.firstName} {c.lastName}</span> <span className="text-xs text-muted-foreground">{c.phone}</span>
                          {matchingPets.length > 0 && (
                            <span className="text-xs text-kp-orange ml-1">🐾 {matchingPets.map(p => p.name).join(", ")}</span>
                          )}
                        </button>
                      );
                    })}
                    {filteredCustomers.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">Sonuç bulunamadı</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pet Selection */}
          {selectedCustomer && selectedCustomer.pets.length > 0 && (
            <div>
              <Label className="text-xs mb-2 block">Pet *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedCustomer.pets.map((p) => (
                  <button key={p.id} type="button" onClick={() => setForm((f) => ({ ...f, petId: p.id }))}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                      form.petId === p.id ? "border-kp-orange bg-kp-orange/5 font-medium" : "border-border hover:bg-muted"
                    }`}>
                    {p.name} <span className="text-xs text-muted-foreground">({p.species})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Selection */}
          {services.length > 0 && (
            <div>
              <Label className="text-xs mb-2 block">Hizmet <span className="text-muted-foreground">(opsiyonel)</span></Label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {services.map((s) => (
                  <button key={s.id} type="button" onClick={() => selectService(selectedService?.id === s.id ? null as unknown as Service : s)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedService?.id === s.id ? "border-blue-500 bg-blue-50" : "border-border hover:bg-muted"
                    }`}>
                    <p className="text-sm font-medium">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><FontAwesomeIcon icon={faClock} className="text-[10px]" /> {s.duration}dk</span>
                      <Badge variant="secondary" className="text-[10px] border-0 bg-kp-green/10 text-kp-green font-semibold">
                        <FontAwesomeIcon icon={faTag} className="mr-0.5 text-[8px]" />{fmt(s.price)}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tarih *</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Saat *</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="rounded-xl" required />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs mb-2 block">Not</Label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Randevu hakkında not..." className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
          </div>

          {/* Summary */}
          {selectedCustomer && form.petId && (
            <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50">
              <p className="text-xs text-muted-foreground mb-1">Randevu Özeti</p>
              <p className="text-sm font-medium">
                {selectedCustomer.firstName} {selectedCustomer.lastName} — {selectedCustomer.pets.find((p) => p.id === form.petId)?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(form.date + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })} saat {form.time}
              </p>
              {selectedService && (
                <p className="text-xs text-kp-green font-semibold mt-1">
                  {selectedService.name} — {fmt(selectedService.price)} ({selectedService.duration}dk)
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>İptal</Button>
            <Button type="submit" className="gradient-primary text-white border-0 shadow-md rounded-xl min-w-[140px]" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Randevu Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
