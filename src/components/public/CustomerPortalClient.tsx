"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock, faSpinner, faPaw, faCalendarDays, faDog, faCat, faDove,
  faArrowRightFromBracket, faSyringe, faScissors, faMoneyBillTrendUp,
  faStar, faHouse, faClock, faCheck, faHourglass, faCalendarPlus,
  faFileInvoiceDollar, faStethoscope, faPills, faChevronDown, faChevronUp,
  faShieldHeart, faPhone, faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

type Tab = "dashboard" | "pets" | "appointments" | "booking" | "billing";

const speciesIcon = (s: string) => {
  if (s?.toLowerCase().includes("köpek")) return faDog;
  if (s?.toLowerCase().includes("kedi")) return faCat;
  if (s?.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

const statusLabels: Record<string, { label: string; color: string; icon: typeof faCheck }> = {
  PENDING: { label: "Beklemede", color: "bg-amber-100 text-amber-700", icon: faHourglass },
  CONFIRMED: { label: "Onaylı", color: "bg-emerald-100 text-emerald-700", icon: faCheck },
  IN_PROGRESS: { label: "Devam Ediyor", color: "bg-blue-100 text-blue-700", icon: faClock },
  COMPLETED: { label: "Tamamlandı", color: "bg-gray-100 text-gray-600", icon: faCheck },
  CANCELED: { label: "İptal", color: "bg-red-100 text-red-700", icon: faClock },
};

export default function CustomerPortalClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [step, setStep] = useState<"login" | "portal">("login");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [customerNo, setCustomerNo] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [customerInfo, setCustomerInfo] = useState<Record<string, unknown> | null>(null);
  const [tenantInfo, setTenantInfo] = useState<Record<string, unknown> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  // Booking state
  const [bookingData, setBookingData] = useState<{ services: any[]; pets: any[]; availableSlots: string[] } | null>(null);
  const [bookingForm, setBookingForm] = useState({ petId: "", serviceId: "", date: "", time: "", notes: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Pet expanded sections
  const [expandedPet, setExpandedPet] = useState<string | null>(null);
  const [petSection, setPetSection] = useState<string>("vaccinations");

  useEffect(() => {
    const saved = sessionStorage.getItem(`portal-${slug}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.exp > Date.now()) {
        setToken(parsed.token); setCustomerInfo(parsed.customer); setTenantInfo(parsed.tenant); setStep("portal");
      }
    }
  }, [slug]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      const res = await fetch("/api/public/portal-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNo, password, tenantSlug: slug }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error); return; }
      setToken(d.token); setCustomerInfo(d.customer); setTenantInfo(d.tenant); setStep("portal");
      sessionStorage.setItem(`portal-${slug}`, JSON.stringify({
        token: d.token, customer: d.customer, tenant: d.tenant, exp: Date.now() + 23 * 60 * 60 * 1000,
      }));
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  const logout = () => {
    sessionStorage.removeItem(`portal-${slug}`);
    setStep("login"); setToken(""); setCustomerInfo(null); setData(null);
  };

  const fetchData = useCallback(async (section: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/public/portal-data?section=${section}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setData(await res.json()); }
      else if (res.status === 401) { logout(); }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (step === "portal" && token) {
      if (tab === "booking") {
        fetchBookingData();
      } else {
        fetchData(tab);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, token, tab]);

  const fetchBookingData = async () => {
    setIsLoading(true);
    try {
      const dateParam = bookingForm.date ? `?date=${bookingForm.date}` : "";
      const res = await fetch(`/api/public/portal-booking${dateParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBookingData(await res.json());
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  // Re-fetch slots when date changes
  useEffect(() => {
    if (tab === "booking" && bookingForm.date && token) {
      fetchBookingData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingForm.date]);

  const submitBooking = async () => {
    if (!bookingForm.petId || !bookingForm.serviceId || !bookingForm.date || !bookingForm.time) {
      setBookingError("Tüm alanları doldurun"); return;
    }
    setBookingLoading(true); setBookingError(""); setBookingSuccess("");
    try {
      const dateTime = `${bookingForm.date}T${bookingForm.time}:00`;
      const res = await fetch("/api/public/portal-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          petId: bookingForm.petId, serviceId: bookingForm.serviceId,
          date: dateTime, notes: bookingForm.notes || undefined,
        }),
      });
      if (res.ok) {
        setBookingSuccess("Randevunuz başarıyla oluşturuldu! Onay bekliyor.");
        setBookingForm({ petId: "", serviceId: "", date: "", time: "", notes: "" });
      } else {
        const d = await res.json();
        setBookingError(d.error || "Bir hata oluştu");
      }
    } catch { setBookingError("Bağlantı hatası"); }
    finally { setBookingLoading(false); }
  };

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  // ============ LOGIN ============
  if (step === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <FontAwesomeIcon icon={faPaw} className="text-white text-2xl" />
            </div>
            {tenantInfo && <p className="text-sm font-medium text-gray-700 mt-3">{tenantInfo.businessName as string}</p>}
            <h1 className="text-2xl font-bold mt-2">Müşteri Portalı</h1>
            <p className="text-sm text-gray-500 mt-1">Petlerinizi takip edin, online randevu alın</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Müşteri No</label>
              <input type="text" value={customerNo} onChange={(e) => setCustomerNo(e.target.value)}
                placeholder="M0001" required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••" required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <><FontAwesomeIcon icon={faLock} className="mr-2" /> Giriş Yap</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============ PORTAL ============
  const cust = customerInfo as Record<string, unknown> | null;
  const tenant = tenantInfo as Record<string, unknown> | null;

  const tabs: { key: Tab; icon: typeof faHouse; label: string }[] = [
    { key: "dashboard", icon: faHouse, label: "Özet" },
    { key: "pets", icon: faPaw, label: "Petlerim" },
    { key: "appointments", icon: faCalendarDays, label: "Randevular" },
    { key: "booking", icon: faCalendarPlus, label: "Randevu Al" },
    { key: "billing", icon: faFileInvoiceDollar, label: "Hesabım" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faPaw} className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-bold">{tenant?.businessName as string}</p>
              <p className="text-[10px] text-white/70">Hoş geldin, {cust?.firstName as string} 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(tenant?.phone as string) && (
              <a href={`tel:${tenant?.phone}`} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="text-xs" />
              </a>
            )}
            <button onClick={logout} className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1.5">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-0.5">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-3 text-[11px] font-medium transition-colors border-b-2 whitespace-nowrap ${
                  tab === t.key ? "border-teal-500 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <FontAwesomeIcon icon={t.icon} className="mr-1" />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-teal-500 animate-spin" />
          </div>

        ) : tab === "dashboard" ? (
          /* ============ DASHBOARD ============ */
          <div className="space-y-5">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-5 text-white">
              <p className="text-lg font-bold">{cust?.firstName as string} {cust?.lastName as string}</p>
              <p className="text-xs text-white/70 mt-0.5">Müşteri No: {data?.customer?.customerNo} • Kayıt: {data?.customer?.createdAt ? fmtDate(data.customer.createdAt) : "-"}</p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center">
                  <p className="text-xl font-bold">{data?.customer?._count?.pets || 0}</p>
                  <p className="text-[9px] text-white/70">Pet</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center">
                  <p className="text-xl font-bold">{data?.customer?._count?.appointments || 0}</p>
                  <p className="text-[9px] text-white/70">Randevu</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center">
                  <p className="text-xl font-bold">{data?.customer?.loyaltyPoints || 0}</p>
                  <p className="text-[9px] text-white/70">Puan</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center">
                  <p className="text-xl font-bold">{data?.totalVisits || 0}</p>
                  <p className="text-[9px] text-white/70">Ziyaret</p>
                </div>
              </div>
            </div>

            {/* Next Vaccination Alert */}
            {data?.nextVaccination && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faSyringe} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Aşı Hatırlatma</p>
                  <p className="text-xs text-amber-600">{data.nextVaccination.petName} — {data.nextVaccination.vaccineName} •  {fmtDate(data.nextVaccination.dueDate)}</p>
                </div>
              </div>
            )}

            {/* Quick Action */}
            <button onClick={() => setTab("booking")} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:border-teal-200 transition-all group">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                <FontAwesomeIcon icon={faCalendarPlus} className="text-teal-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Online Randevu Al</p>
                <p className="text-xs text-gray-500">Hızlıca uygun saat seçin</p>
              </div>
            </button>

            {/* Upcoming */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-teal-500" /> Yaklaşan Randevular
              </h3>
              {!data?.upcomingAppointments?.length ? (
                <p className="text-sm text-gray-400 text-center py-6">Yaklaşan randevunuz yok</p>
              ) : (
                <div className="space-y-2">
                  {data.upcomingAppointments.map((a: any) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                      <FontAwesomeIcon icon={speciesIcon(a.pet?.species)} className="text-teal-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.pet?.name}{a.service?.name ? ` — ${a.service.name}` : ""}</p>
                        <p className="text-xs text-gray-500">{fmtDate(a.date)} · {fmtTime(a.date)}{a.service?.duration ? ` · ${a.service.duration} dk` : ""}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${statusLabels[a.status]?.color || "bg-gray-100"}`}>
                        {statusLabels[a.status]?.label || a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className="text-emerald-500" /> Son Ziyaretler
              </h3>
              {!data?.recentAppointments?.length ? (
                <p className="text-sm text-gray-400 text-center py-6">Henüz geçmiş randevu yok</p>
              ) : (
                <div className="space-y-2">
                  {data.recentAppointments.map((a: any) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <FontAwesomeIcon icon={speciesIcon(a.pet?.species)} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm">{a.pet?.name}{a.service?.name ? ` — ${a.service.name}` : ""}</p>
                        <p className="text-xs text-gray-500">{fmtDate(a.date)}</p>
                      </div>
                      {a.service?.price > 0 && <span className="text-xs font-medium text-emerald-600">{fmt(a.service.price)}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Spent */}
            {data?.totalSpent > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-emerald-500 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Toplam Harcama</p>
                  <p className="text-lg font-bold text-emerald-600">{fmt(data.totalSpent)}</p>
                </div>
              </div>
            )}
          </div>

        ) : tab === "pets" ? (
          /* ============ PETS ============ */
          <div className="space-y-4">
            {!data?.pets?.length ? (
              <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400 shadow-sm">
                <FontAwesomeIcon icon={faPaw} className="text-3xl mb-2" /><p className="text-sm">Kayıtlı pet bulunamadı</p>
              </div>
            ) : data.pets.map((pet: any) => (
              <div key={pet.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Pet Header */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {pet.imageUrl ? (
                      <img src={pet.imageUrl} alt={pet.name} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
                        <FontAwesomeIcon icon={speciesIcon(pet.species)} className="text-teal-500 text-xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-lg">{pet.name}</p>
                      <p className="text-xs text-gray-500">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}{pet.gender ? ` • ${pet.gender}` : ""}</p>
                      {pet.dateOfBirth && <p className="text-[10px] text-gray-400 mt-0.5">Doğum: {fmtDate(pet.dateOfBirth)}{pet.weight ? ` • ${pet.weight} kg` : ""}</p>}
                    </div>
                    <FontAwesomeIcon icon={faShieldHeart} className={`text-lg ${pet.isAlive ? "text-emerald-400" : "text-gray-300"}`} />
                  </div>

                  {/* Pet Stats */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: faCalendarDays, count: pet._count?.appointments, label: "Randevu", color: "bg-blue-50 text-blue-600" },
                      { icon: faSyringe, count: pet._count?.vaccinations, label: "Aşı", color: "bg-amber-50 text-amber-600" },
                      { icon: faStethoscope, count: pet._count?.medicalRecords, label: "Muayene", color: "bg-purple-50 text-purple-600" },
                      { icon: faScissors, count: pet._count?.groomingRecords, label: "Bakım", color: "bg-rose-50 text-rose-600" },
                    ].map((s) => (
                      <div key={s.label} className={`rounded-xl p-2 text-center ${s.color}`}>
                        <FontAwesomeIcon icon={s.icon} className="text-sm" />
                        <p className="text-sm font-bold mt-0.5">{s.count || 0}</p>
                        <p className="text-[8px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expand Button */}
                <button onClick={() => setExpandedPet(expandedPet === pet.id ? null : pet.id)}
                  className="w-full py-2 border-t border-gray-100 text-xs text-teal-600 hover:bg-teal-50/50 transition-colors flex items-center justify-center gap-1.5 font-medium">
                  <FontAwesomeIcon icon={expandedPet === pet.id ? faChevronUp : faChevronDown} />
                  {expandedPet === pet.id ? "Kapat" : "Detayları Gör"}
                </button>

                {/* Expanded Sections */}
                {expandedPet === pet.id && (
                  <div className="border-t border-gray-100">
                    {/* Section Tabs */}
                    <div className="flex border-b border-gray-100 px-2">
                      {[
                        { key: "vaccinations", label: "Aşılar", icon: faSyringe },
                        { key: "medical", label: "Muayeneler", icon: faStethoscope },
                        { key: "grooming", label: "Bakımlar", icon: faScissors },
                        { key: "prescriptions", label: "Reçeteler", icon: faPills },
                      ].map((s) => (
                        <button key={s.key} onClick={() => setPetSection(s.key)}
                          className={`flex-1 py-2.5 text-[10px] font-medium transition-colors border-b-2 ${
                            petSection === s.key ? "border-teal-500 text-teal-600" : "border-transparent text-gray-400"
                          }`}>
                          <FontAwesomeIcon icon={s.icon} className="mr-1" />{s.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4">
                      {petSection === "vaccinations" && (
                        <div className="space-y-2">
                          {!pet.vaccinations?.length ? <p className="text-xs text-gray-400 text-center py-4">Aşı kaydı yok</p> :
                            pet.vaccinations.map((v: any) => (
                              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                                <FontAwesomeIcon icon={faSyringe} className="text-amber-500 text-sm" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{v.vaccineName}</p>
                                  <p className="text-[10px] text-gray-500">Yapıldı: {fmtDate(v.administeredDate)}{v.nextDueDate ? ` • Sonraki: ${fmtDate(v.nextDueDate)}` : ""}</p>
                                </div>
                                {v.nextDueDate && new Date(v.nextDueDate) < new Date() && (
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">Gecikmiş</span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {petSection === "medical" && (
                        <div className="space-y-2">
                          {!pet.medicalRecords?.length ? <p className="text-xs text-gray-400 text-center py-4">Muayene kaydı yok</p> :
                            pet.medicalRecords.map((m: any) => (
                              <div key={m.id} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium">{m.chiefComplaint || "Muayene"}</p>
                                  <p className="text-[10px] text-gray-500">{fmtDate(m.visitDate)}</p>
                                </div>
                                {m.diagnosis && <p className="text-xs text-purple-600">Teşhis: {m.diagnosis}</p>}
                                {m.treatment && <p className="text-xs text-gray-500 mt-0.5">Tedavi: {m.treatment}</p>}
                              </div>
                            ))}
                        </div>
                      )}

                      {petSection === "grooming" && (
                        <div className="space-y-2">
                          {!pet.groomingRecords?.length ? <p className="text-xs text-gray-400 text-center py-4">Bakım kaydı yok</p> :
                            pet.groomingRecords.map((g: any) => (
                              <div key={g.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium">{Array.isArray(g.servicesPerformed) ? g.servicesPerformed.join(", ") : "Bakım"}</p>
                                  <p className="text-[10px] text-gray-500">{fmtDate(g.groomingDate)}</p>
                                </div>
                                {g.notes && <p className="text-xs text-gray-500">{g.notes}</p>}
                                {g.nextSuggestedDate && <p className="text-[10px] text-rose-600 mt-1">Sonraki bakım: {fmtDate(g.nextSuggestedDate)}</p>}
                              </div>
                            ))}
                        </div>
                      )}

                      {petSection === "prescriptions" && (
                        <div className="space-y-2">
                          {!pet.prescriptions?.length ? <p className="text-xs text-gray-400 text-center py-4">Reçete yok</p> :
                            pet.prescriptions.map((rx: any) => {
                              const meds = Array.isArray(rx.medications) ? rx.medications : [];
                              return (
                                <div key={rx.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium flex items-center gap-1.5">
                                      <FontAwesomeIcon icon={faPills} className="text-blue-500 text-xs" />
                                      {meds.length} İlaç
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[9px] px-2 py-0.5 rounded font-medium ${rx.isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                                        {rx.isActive ? "Aktif" : "Pasif"}
                                      </span>
                                      <p className="text-[10px] text-gray-500">{fmtDate(rx.prescriptionDate)}</p>
                                    </div>
                                  </div>
                                  {meds.map((m: any, i: number) => (
                                    <p key={i} className="text-xs text-gray-600 ml-5">• {m.name} — {m.dosage} • {m.frequency} • {m.duration}</p>
                                  ))}
                                  {rx.notes && <p className="text-[10px] text-gray-400 mt-1 ml-5">{rx.notes}</p>}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        ) : tab === "appointments" ? (
          /* ============ APPOINTMENTS ============ */
          <div className="space-y-3">
            {!data?.appointments?.length ? (
              <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400 shadow-sm">
                <FontAwesomeIcon icon={faCalendarDays} className="text-3xl mb-2" /><p className="text-sm">Randevu kaydı yok</p>
              </div>
            ) : data.appointments.map((a: any) => {
              const st = statusLabels[a.status] || { label: a.status, color: "bg-gray-100", icon: faClock };
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={speciesIcon(a.pet?.species)} className="text-teal-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.pet?.name}{a.service?.name ? ` — ${a.service.name}` : ""}</p>
                      <p className="text-xs text-gray-500">{fmtDate(a.date)} · {fmtTime(a.date)}{a.service?.duration ? ` · ${a.service.duration} dk` : ""}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-medium whitespace-nowrap ${st.color}`}>{st.label}</span>
                      {a.service?.price > 0 && <p className="text-xs font-medium text-emerald-600 mt-1">{fmt(a.service.price)}</p>}
                    </div>
                  </div>
                  {a.notes && <p className="text-xs text-gray-400 mt-2 pl-13">{a.notes}</p>}
                </div>
              );
            })}
          </div>

        ) : tab === "booking" ? (
          /* ============ BOOKING ============ */
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarPlus} className="text-teal-500" /> Online Randevu
              </h3>
              <p className="text-xs text-gray-500 mb-5">Petiniz için uygun tarih ve saat seçerek randevu oluşturun.</p>

              {bookingSuccess && <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><FontAwesomeIcon icon={faCheck} /> {bookingSuccess}</div>}
              {bookingError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{bookingError}</div>}

              <div className="space-y-4">
                {/* Pet select */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Petiniz *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingData?.pets?.map((p: any) => (
                      <button key={p.id} type="button" onClick={() => setBookingForm(f => ({ ...f, petId: p.id }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          bookingForm.petId === p.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <FontAwesomeIcon icon={speciesIcon(p.species)} className={`mr-1.5 ${bookingForm.petId === p.id ? "text-teal-500" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">{p.name}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{p.species}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service select */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Hizmet *</label>
                  <select value={bookingForm.serviceId} onChange={(e) => setBookingForm(f => ({ ...f, serviceId: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="">Hizmet seçin...</option>
                    {bookingData?.services?.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} {s.price > 0 ? `— ${fmt(s.price)}` : ""}{s.duration ? ` (${s.duration} dk)` : ""}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Tarih *</label>
                  <input type="date" value={bookingForm.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingForm(f => ({ ...f, date: e.target.value, time: "" }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>

                {/* Time slots */}
                {bookingForm.date && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Saat *</label>
                    {bookingData?.availableSlots?.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">Bu tarihte müsait saat yok</p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {bookingData?.availableSlots?.map((slot: string) => (
                          <button key={slot} type="button" onClick={() => setBookingForm(f => ({ ...f, time: slot }))}
                            className={`py-2 rounded-lg text-xs font-medium transition-all ${
                              bookingForm.time === slot
                                ? "bg-teal-500 text-white shadow-sm"
                                : "bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200"
                            }`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Not (opsiyonel)</label>
                  <textarea value={bookingForm.notes} onChange={(e) => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Özel isteklerinizi belirtin..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>

                {/* Submit */}
                <button onClick={submitBooking} disabled={bookingLoading || !bookingForm.petId || !bookingForm.serviceId || !bookingForm.date || !bookingForm.time}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md">
                  {bookingLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <><FontAwesomeIcon icon={faCalendarPlus} className="mr-2" /> Randevu Oluştur</>}
                </button>
              </div>
            </div>

            {/* Info note */}
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-600 text-center">
              💡 Online randevunuz &quot;Beklemede&quot; olarak oluşturulur ve klinik tarafından onaylandıktan sonra kesinleşir.
            </div>
          </div>

        ) : tab === "billing" ? (
          /* ============ BILLING ============ */
          <div className="space-y-4">
            {/* Invoices */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-teal-500" /> Faturalarım
              </h3>
              {!data?.invoices?.length ? (
                <p className="text-sm text-gray-400 text-center py-6">Henüz faturanız yok</p>
              ) : (
                <div className="space-y-2">
                  {data.invoices.map((inv: any) => (
                    <a key={inv.id} href={`/panel/fatura/${inv.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-teal-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{inv.invoiceNo}</p>
                        <p className="text-[10px] text-gray-500">{fmtDate(inv.issueDate)} • {inv.items?.length || 0} kalem</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-600">{fmt(inv.totalAmount + inv.taxAmount)}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-medium ${
                          inv.status === "paid" ? "bg-emerald-100 text-emerald-600" :
                          inv.status === "canceled" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          {inv.status === "paid" ? "Ödendi" : inv.status === "sent" ? "Gönderildi" : inv.status === "canceled" ? "İptal" : "Taslak"}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-emerald-500" /> Ödeme Geçmişi
              </h3>
              {!data?.transactions?.length ? (
                <p className="text-sm text-gray-400 text-center py-6">Ödeme kaydı yok</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.transactions.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm">{t.description}</p>
                        <p className="text-[10px] text-gray-500">{fmtDate(t.createdAt)}{t.category ? ` • ${t.category}` : ""}</p>
                      </div>
                      <span className={`text-sm font-semibold ${t.type === "INCOME" ? "text-emerald-600" : "text-red-500"}`}>
                        {t.type === "INCOME" ? "" : "-"}{fmt(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Contact Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-6 text-xs text-gray-500">
          {(tenant?.phone as string) && (
            <a href={`tel:${tenant?.phone}`} className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
              <FontAwesomeIcon icon={faPhone} /> {tenant?.phone as string}
            </a>
          )}
          {(tenant?.email as string) && (
            <a href={`mailto:${tenant?.email}`} className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
              <FontAwesomeIcon icon={faEnvelope} /> {tenant?.email as string}
            </a>
          )}
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">Powered by Klinik Yönetim</p>
      </footer>
    </div>
  );
}
