"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faUser, faSpinner, faCalendarDays, faSyringe, faScissors,
  faPhone, faEnvelope, faLocationDot, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tenant {
  id: string; name: string; businessType: string; logoUrl?: string;
  phone?: string; email?: string; address?: string;
}

interface PetData {
  id: string; name: string; species: string; breed?: string;
  groomingRecords: { groomingDate: string; servicesPerformed: string[]; notes?: string }[];
  vaccinations: { vaccineName: string; administeredDate: string; nextDueDate?: string }[];
  appointments: { date: string; status: string; service?: { name: string } }[];
}

interface CustomerData {
  firstName: string; lastName: string;
  pets: PetData[];
}

export default function PortalClient({ tenant }: { tenant: Tenant }) {
  const [customerNo, setCustomerNo] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  const handleLogin = async () => {
    if (!customerNo || !phone) { setError("Müşteri no ve telefon gerekli"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await fetch(`/api/public/portal?tenantId=${tenant.id}&customerNo=${customerNo}&phone=${phone}`);
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Giriş başarısız"); return; }
      setCustomer(d.customer);
      if (d.customer.pets.length > 0) setSelectedPet(d.customer.pets[0]);
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  const businessLabel = tenant.businessType === "VETERINER" ? "Veteriner Kliniği" : "Pet Kuaför";

  // Login Screen
  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-lg mb-4">
              <FontAwesomeIcon icon={faPaw} className="text-white text-2xl" />
            </div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-heading)]">{tenant.name}</h1>
            <p className="text-sm text-muted-foreground">{businessLabel} — Müşteri Portalı</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-border p-6 space-y-4">
            <h2 className="text-sm font-semibold text-center">Bilgilerinizle Giriş Yapın</h2>
            {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-xl text-xs">{error}</div>}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Müşteri No</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <Input value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} placeholder="MÜŞ-001" className="pl-10 rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telefon</label>
              <div className="relative">
                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5XX XXX XX XX" className="pl-10 rounded-xl" />
              </div>
            </div>
            <Button onClick={handleLogin} disabled={isLoading} className="w-full gradient-primary text-white border-0 rounded-xl h-11">
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Giriş Yap"}
            </Button>
          </div>

          {/* Contact */}
          <div className="text-center space-y-1">
            {tenant.phone && <p className="text-xs text-muted-foreground"><FontAwesomeIcon icon={faPhone} className="mr-1.5" />{tenant.phone}</p>}
            {tenant.email && <p className="text-xs text-muted-foreground"><FontAwesomeIcon icon={faEnvelope} className="mr-1.5" />{tenant.email}</p>}
            {tenant.address && <p className="text-xs text-muted-foreground"><FontAwesomeIcon icon={faLocationDot} className="mr-1.5" />{tenant.address}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="bg-white/80 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <FontAwesomeIcon icon={faPaw} className="text-white text-sm" />
            </div>
            <span className="text-sm font-bold">{tenant.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">Merhaba, {customer.firstName}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Pet Selector */}
        {customer.pets.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {customer.pets.map((p) => (
              <button key={p.id} onClick={() => setSelectedPet(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedPet?.id === p.id ? "bg-kp-green text-white shadow-sm" : "bg-white border border-border text-muted-foreground hover:bg-muted"}`}>
                <FontAwesomeIcon icon={faPaw} className="mr-1.5" />{p.name}
              </button>
            ))}
          </div>
        )}

        {selectedPet && (
          <>
            {/* Pet Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-kp-green/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPaw} className="text-kp-green text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedPet.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedPet.species}{selectedPet.breed ? ` • ${selectedPet.breed}` : ""}</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-500" /> Randevular
              </h3>
              {selectedPet.appointments.length > 0 ? (
                <div className="space-y-2">
                  {selectedPet.appointments.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50">
                      <div>
                        <p className="text-sm font-medium">{a.service?.name || "Randevu"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("tr-TR")} — {new Date(a.date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${a.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                        {a.status === "COMPLETED" ? "Tamamlandı" : a.status === "CONFIRMED" ? "Teyitli" : "Beklemede"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-4">Randevu yok</p>}
            </div>

            {/* Vaccinations */}
            {tenant.businessType === "VETERINER" && (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faSyringe} className="text-kp-green" /> Aşılar
                </h3>
                {selectedPet.vaccinations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPet.vaccinations.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50">
                        <p className="text-sm font-medium">{v.vaccineName}</p>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{new Date(v.administeredDate).toLocaleDateString("tr-TR")}</p>
                          {v.nextDueDate && <p className="text-[10px] text-kp-green">Sonraki: {new Date(v.nextDueDate).toLocaleDateString("tr-TR")}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">Aşı kaydı yok</p>}
              </div>
            )}

            {/* Grooming Records */}
            {tenant.businessType === "PET_KUAFOR" && (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faScissors} className="text-kp-coral" /> Bakım Geçmişi
                </h3>
                {selectedPet.groomingRecords.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPet.groomingRecords.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-rose-50/50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{g.servicesPerformed.join(", ")}</p>
                          <p className="text-xs text-muted-foreground">{new Date(g.groomingDate).toLocaleDateString("tr-TR")}</p>
                        </div>
                        {g.notes && <p className="text-xs text-muted-foreground mt-1">{g.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">Bakım kaydı yok</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
