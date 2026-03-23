"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faPen, faPhone, faEnvelope, faLocationDot, faDog, faCat, faDove, faPaw,
  faCalendarDays, faMoneyBillTrendUp, faNoteSticky, faSpinner, faPlus, faLock, faCopy, faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerFormModal from "@/components/panel/customers/CustomerFormModal";

interface CustomerDetail {
  id: string; customerNo: string; firstName: string; lastName: string;
  phone: string; phoneSecondary?: string; email?: string;
  address?: string; city?: string; district?: string; notes?: string;
  isActive: boolean; createdAt: string;
  pets: { id: string; name: string; species: string; breed?: string; gender: string; dateOfBirth?: string; color?: string; isAlive: boolean }[];
  appointments: { id: string; date: string; status: string; service?: { name: string }; pet: { name: string } }[];
  transactions: { id: string; type: string; amount: number; category: string; createdAt: string }[];
  portalEnabled?: boolean; portalPassword?: string;
  _count: { appointments: number; transactions: number; pets: number };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function CustomerDetailClient({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [portalPass, setPortalPass] = useState("");
  const [savingPortal, setSavingPortal] = useState(false);
  const [portalCopied, setPortalCopied] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setTenantSlug(d.slug || "")).catch(() => {});
  }, []);

  const fetchCustomer = () => {
    setIsLoading(true);
    fetch(`/api/customers/${customerId}`)
      .then((r) => r.json())
      .then((d) => { setCustomer(d); setNotes(d.notes || ""); })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCustomer(); }, [customerId]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
  };

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  const getAge = (dob?: string) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const y = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const m = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return y > 0 ? `${y} yaş ${m} ay` : `${m} ay`;
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>;
  if (!customer) return <div className="text-center py-20 text-muted-foreground">Müşteri bulunamadı</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={() => window.location.href = "/panel/musteriler"}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" /> Geri
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-kp-green/10 flex items-center justify-center">
              <span className="text-xl font-bold text-kp-green">{customer.firstName[0]}{customer.lastName[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">{customer.firstName} {customer.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs border-0 bg-muted">{customer.customerNo}</Badge>
                <Badge variant="secondary" className={`text-xs border-0 ${customer.isActive ? "bg-kp-green/10 text-kp-green" : "bg-destructive/10 text-destructive"}`}>
                  {customer.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setShowEdit(true)}>
          <FontAwesomeIcon icon={faPen} className="mr-1.5" /> Düzenle
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <FontAwesomeIcon icon={faPaw} className="text-lg text-kp-orange mb-1" />
          <p className="text-2xl font-bold text-kp-orange">{customer._count.pets}</p>
          <p className="text-[10px] text-muted-foreground">Pet</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <FontAwesomeIcon icon={faCalendarDays} className="text-lg text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-blue-600">{customer._count.appointments}</p>
          <p className="text-[10px] text-muted-foreground">Randevu</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-lg text-purple-500 mb-1" />
          <p className="text-2xl font-bold text-purple-600">{customer._count.transactions}</p>
          <p className="text-[10px] text-muted-foreground">İşlem</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-lg text-emerald-500 mb-1" />
          <p className="text-2xl font-bold text-emerald-600 font-[family-name:var(--font-heading)]">
            {fmt(customer.transactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0))}
          </p>
          <p className="text-[10px] text-emerald-600/70">Toplam Gelir</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column — Wide (3/5) — Petler + Randevular + İşlemler */}
        <div className="lg:col-span-3 space-y-4">
          {/* Pets */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Petler</h3>
              <Button variant="outline" size="sm" className="rounded-lg text-xs h-7">
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Pet Ekle
              </Button>
            </div>
            {customer.pets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Henüz pet eklenmemiş</p>
            ) : (
              <div className="space-y-2">
                {customer.pets.map((pet) => (
                  <a key={pet.id} href={`/panel/petler/${pet.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-kp-orange/10 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={speciesIcon(pet.species)} className="text-kp-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-kp-green transition-colors">{pet.name}</p>
                      <p className="text-xs text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}{pet.dateOfBirth ? ` • ${getAge(pet.dateOfBirth)}` : ""}</p>
                    </div>
                    {pet.color && <Badge variant="secondary" className="text-[10px] border-0">{pet.color}</Badge>}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Son Randevular</h3>
            {customer.appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Henüz randevu yok</p>
            ) : (
              <div className="space-y-2">
                {customer.appointments.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-blue-500 w-4" />
                    <div className="flex-1">
                      <p className="text-xs font-medium">{a.pet.name}{a.service ? ` — ${a.service.name}` : ""}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(a.date).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Son İşlemler</h3>
            {customer.transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Henüz işlem yok</p>
            ) : (
              <div className="space-y-2">
                {customer.transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMoneyBillTrendUp} className={`text-xs w-4 ${t.type === "INCOME" ? "text-kp-green" : "text-destructive"}`} />
                      <span className="text-xs">{t.category}</span>
                    </div>
                    <span className={`text-xs font-semibold ${t.type === "INCOME" ? "text-kp-green" : "text-destructive"}`}>{fmt(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Narrow (2/5) — İletişim + Portal + Notlar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">İletişim</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faPhone} className="text-xs w-4 text-kp-green" /> {customer.phone}</p>
              {customer.phoneSecondary && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faPhone} className="text-xs w-4 text-muted-foreground" /> {customer.phoneSecondary}</p>}
              {customer.email && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faEnvelope} className="text-xs w-4 text-blue-500" /> {customer.email}</p>}
              {customer.address && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faLocationDot} className="text-xs w-4 text-kp-orange" /> {customer.address}{customer.district ? `, ${customer.district}` : ""}{customer.city ? ` / ${customer.city}` : ""}</p>}
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">Kayıt: {new Date(customer.createdAt).toLocaleDateString("tr-TR")}</p>
          </div>

          {/* Portal Access */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} className="text-xs" /> Portal Erişimi
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm">{customer.portalEnabled ? "✅ Aktif" : "❌ Devre Dışı"}</p>
            </div>
            <div className="space-y-2">
              <input type="password" value={portalPass} onChange={(e) => setPortalPass(e.target.value)}
                placeholder="Yeni portal şifresi" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kp-green/20" />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl text-xs flex-1" disabled={savingPortal || !portalPass}
                  onClick={async () => {
                    setSavingPortal(true);
                    await fetch(`/api/customers/${customerId}`, {
                      method: "PUT", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ portalPassword: portalPass, portalEnabled: true }),
                    });
                    setPortalPass(""); setSavingPortal(false); fetchCustomer();
                  }}>
                  {savingPortal ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> : <FontAwesomeIcon icon={faLock} className="mr-1" />}
                  {customer.portalEnabled ? "Şifre Güncelle" : "Portal Aç"}
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/portal-giris/${tenantSlug}`);
                    setPortalCopied(true); setTimeout(() => setPortalCopied(false), 2000);
                  }}>
                  <FontAwesomeIcon icon={portalCopied ? faCheck : faCopy} className="mr-1" />
                  {portalCopied ? "Kopyalandı" : "Link"}
                </Button>
              </div>
              {customer.portalEnabled && customer.customerNo && (
                <p className="text-[10px] text-muted-foreground">Giriş: {customer.customerNo} + şifre</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faNoteSticky} className="text-xs" /> Notlar
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Müşteri hakkında notlar..."
              className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green"
            />
            <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> : null} Notu Kaydet
            </Button>
          </div>
        </div>
      </div>

      {showEdit && <CustomerFormModal customer={customer} onClose={() => setShowEdit(false)} onSaved={() => { setShowEdit(false); fetchCustomer(); }} />}
    </div>
  );
}
