"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faCalendarDays, faClock, faUser, faPhone, faEnvelope,
  faDog, faSpinner, faCircleCheck, faLocationDot, faArrowRight, faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tenant {
  id: string; name: string; businessType: string; logoUrl?: string;
  phone?: string; address?: string;
}
interface Service {
  id: string; name: string; duration: number; price: number; category?: string;
}

export default function OnlineBookingClient({ tenant, services }: { tenant: Tenant; services: Service[] }) {
  const [step, setStep] = useState(1); // 1: Service, 2: DateTime, 3: Info, 4: Success
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", petName: "", petSpecies: "Köpek", notes: "" });

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
  const businessLabel = tenant.businessType === "VETERINER" ? "Veteriner Kliniği" : "Pet Kuaför";

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !form.firstName || !form.phone || !form.petName) {
      setError("Lütfen tüm zorunlu alanları doldurun"); return;
    }
    setIsLoading(true); setError("");
    try {
      const res = await fetch("/api/public/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          serviceId: selectedService.id,
          date: `${selectedDate}T${selectedTime}:00`,
          ...form,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Hata oluştu"); return; }
      setStep(4);
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-12 h-12 mx-auto rounded-xl gradient-primary flex items-center justify-center shadow-md mb-2">
            <FontAwesomeIcon icon={faPaw} className="text-white text-xl" />
          </div>
          <h1 className="text-lg font-bold font-[family-name:var(--font-heading)]">{tenant.name}</h1>
          <p className="text-xs text-muted-foreground">{businessLabel} — Online Randevu</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? "bg-kp-green text-white" : "bg-muted text-muted-foreground"}`}>{s}</div>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-kp-green" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        )}

        {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-xl text-xs mb-4">{error}</div>}

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-lg font-bold text-center">Hizmet Seçin</h2>
            <div className="space-y-2">
              {services.map((s) => (
                <button key={s.id} onClick={() => { setSelectedService(s); setStep(2); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedService?.id === s.id ? "border-kp-green bg-kp-green/5" : "border-border bg-white hover:border-kp-green/30"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />{s.duration} dk
                        {s.category && ` • ${s.category}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-kp-green">{s.price.toLocaleString("tr-TR")} ₺</p>
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs text-muted-foreground mt-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {services.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">Henüz hizmet tanımlanmamış</p>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-lg font-bold text-center">Tarih & Saat</h2>
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Tarih *</label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Saat *</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${selectedTime === t ? "bg-kp-green text-white" : "bg-muted hover:bg-muted/80"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Geri</Button>
              <Button onClick={() => { if (selectedDate && selectedTime) setStep(3); }}
                disabled={!selectedDate || !selectedTime} className="flex-[2] gradient-primary text-white border-0 rounded-xl">Devam <FontAwesomeIcon icon={faArrowRight} className="ml-2" /></Button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Info */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-lg font-bold text-center">Bilgileriniz</h2>
            <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ad *</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="Adınız" className="pl-9 rounded-xl h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Soyad *</label>
                  <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Soyadınız" className="rounded-xl h-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Telefon *</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                  <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+90 5XX" className="pl-9 rounded-xl h-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                  <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@" className="pl-9 rounded-xl h-9 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Pet Adı *</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faDog} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <Input value={form.petName} onChange={(e) => setForm((f) => ({ ...f, petName: e.target.value }))} placeholder="Boncuk" className="pl-9 rounded-xl h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tür</label>
                  <select value={form.petSpecies} onChange={(e) => setForm((f) => ({ ...f, petSpecies: e.target.value }))}
                    className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card">
                    <option>Köpek</option><option>Kedi</option><option>Kuş</option><option>Tavşan</option><option>Diğer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Not</label>
                <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Ek bilgi..." className="rounded-xl h-9 text-sm" />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-kp-green/5 border border-kp-green/20 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Randevu Özeti</p>
              <p className="text-sm font-semibold">{selectedService?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />{selectedDate} • {selectedTime}
                {selectedService && ` • ${selectedService.price.toLocaleString("tr-TR")} ₺`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-xl"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Geri</Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-[2] gradient-primary text-white border-0 rounded-xl">
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Randevu Al"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-12 animate-fade-in-up space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-kp-green/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleCheck} className="text-kp-green text-4xl" />
            </div>
            <h2 className="text-xl font-bold">Randevunuz Alındı!</h2>
            <div className="bg-white rounded-2xl border border-border p-5 max-w-xs mx-auto">
              <p className="font-semibold text-sm">{selectedService?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedDate} • {selectedTime}</p>
              <p className="text-sm text-muted-foreground">{form.petName} ({form.petSpecies})</p>
            </div>
            <p className="text-sm text-muted-foreground">İşletme sizinle teyit için iletişime geçecektir.</p>
            {tenant.phone && (
              <p className="text-xs text-muted-foreground">
                <FontAwesomeIcon icon={faLocationDot} className="mr-1" />{tenant.address && `${tenant.address} • `}<FontAwesomeIcon icon={faPhone} className="mr-1" />{tenant.phone}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
