"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faDog, faCat, faDove, faPaw, faPhone, faCalendarDays,
  faVenusMars, faWeight, faPalette, faMicrochip, faNoteSticky, faSpinner,
  faSyringe, faStethoscope, faScissors, faCamera, faFlask, faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp as fabWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PetDetail {
  id: string; name: string; species: string; breed?: string; gender: string;
  dateOfBirth?: string; weight?: number; color?: string; microchipNo?: string;
  notes?: string; allergies?: string; bloodType?: string; coatType?: string;
  skinSensitivity?: string; groomingCycleDays?: number; imageUrl?: string;
  isAlive: boolean; createdAt: string;
  customer: { id: string; firstName: string; lastName: string; phone: string; email?: string };
  medicalRecords: { id: string; visitDate: string; diagnosis?: string; treatment?: string; vet?: string }[];
  vaccinations: { id: string; vaccineName: string; administeredDate: string; nextDueDate?: string }[];
  groomingRecords: { id: string; groomingDate: string; servicesPerformed: string[]; notes?: string; nextSuggestedDate?: string }[];
  labResults: { id: string; testName: string; testDate: string; results?: unknown; notes?: string; fileUrl?: string; status: string }[];
  appointments: { id: string; date: string; status: string; service?: { name: string; price: number } }[];
}

const genderLabels: Record<string, string> = { MALE: "Erkek", FEMALE: "Dişi", UNKNOWN: "Bilinmiyor" };
const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-amber-50 text-amber-600" },
  CONFIRMED: { label: "Onaylı", color: "bg-kp-green/10 text-kp-green" },
  IN_PROGRESS: { label: "Devam", color: "bg-blue-50 text-blue-600" },
  COMPLETED: { label: "Tamamlandı", color: "bg-emerald-50 text-emerald-600" },
  CANCELED: { label: "İptal", color: "bg-destructive/10 text-destructive" },
};

export default function PetDetailClient({ petId, businessType }: { petId: string; businessType: string }) {
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchPet = () => {
    setIsLoading(true);
    fetch(`/api/pets/${petId}`)
      .then((r) => r.json())
      .then((d) => { setPet(d); setNotes(d.notes || ""); })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchPet(); }, [petId]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/pets/${petId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
  };

  const getAge = (dob?: string) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const y = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const m = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return y > 0 ? `${y} yaş ${m} ay` : `${m} ay`;
  };

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  const sendWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "90");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const sendEmail = (email: string, subject: string, body: string) => {
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>;
  if (!pet) return <div className="text-center py-20 text-muted-foreground">Pet bulunamadı</div>;

  const isKuafor = businessType === "PET_KUAFOR";
  const isVet = businessType === "VETERINER";

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      // Convert to base64 data URL for now (production would use Supabase storage)
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const imageUrl = ev.target?.result as string;
        await fetch(`/api/pets/${petId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });
        setPet((prev) => prev ? { ...prev, imageUrl } : prev);
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={() => window.location.href = "/panel/petler"}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" /> Geri
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <label className="relative w-16 h-16 rounded-2xl overflow-hidden cursor-pointer group shrink-0">
              {pet.imageUrl ? (
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-kp-orange/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={speciesIcon(pet.species)} className="text-2xl text-kp-orange" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingPhoto ? (
                  <FontAwesomeIcon icon={faSpinner} className="text-white animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">{pet.name}</h1>
              <p className="text-sm text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}</p>
              <div className="flex gap-2 mt-1">
                {!pet.isAlive && <Badge variant="secondary" className="text-xs border-0 bg-destructive/10 text-destructive">Vefat</Badge>}
                {pet.allergies && <Badge variant="secondary" className="text-xs border-0 bg-amber-50 text-amber-600">⚠️ Alerji</Badge>}
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => sendWhatsApp(pet.customer.phone, `Merhaba ${pet.customer.firstName} Bey/Hanım, ${pet.name} ile ilgili bilgilendirme yapmak istiyoruz.`)}>
            <FontAwesomeIcon icon={fabWhatsapp} className="mr-1.5" /> WhatsApp
          </Button>
          {pet.customer.email && (
            <Button variant="outline" size="sm" className="rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => sendEmail(pet.customer.email!, `${pet.name} - Bilgilendirme`, `Sayın ${pet.customer.firstName} ${pet.customer.lastName},\n\n${pet.name} ile ilgili bilgilendirme:\n\n`)}>
              ✉️ Email
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Info */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bilgiler</h3>
            <div className="space-y-2.5">
              <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faVenusMars} className="text-xs w-4 text-purple-500" /> {genderLabels[pet.gender]}</p>
              {pet.dateOfBirth && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faCalendarDays} className="text-xs w-4 text-blue-500" /> {getAge(pet.dateOfBirth)} <span className="text-xs text-muted-foreground">({new Date(pet.dateOfBirth).toLocaleDateString("tr-TR")})</span></p>}
              {pet.weight && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faWeight} className="text-xs w-4 text-kp-green" /> {pet.weight} kg</p>}
              {pet.color && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faPalette} className="text-xs w-4 text-kp-orange" /> {pet.color}</p>}
              {pet.microchipNo && <p className="flex items-center gap-2 text-sm"><FontAwesomeIcon icon={faMicrochip} className="text-xs w-4 text-gray-500" /> {pet.microchipNo}</p>}
              {isVet && pet.bloodType && <p className="text-sm">Kan Grubu: <span className="font-medium">{pet.bloodType}</span></p>}
              {isKuafor && pet.coatType && <p className="text-sm">Tüy Tipi: <span className="font-medium">{pet.coatType}</span></p>}
              {isKuafor && pet.skinSensitivity && <p className="text-sm">Cilt Hassasiyeti: <span className="font-medium text-amber-600">{pet.skinSensitivity}</span></p>}
              {isKuafor && pet.groomingCycleDays && <p className="text-sm">Bakım Periyodu: <span className="font-medium">{pet.groomingCycleDays} gün</span></p>}
              {pet.allergies && <div className="pt-2 border-t border-border"><p className="text-xs font-semibold text-destructive mb-1">⚠️ Alerjiler</p><p className="text-sm">{pet.allergies}</p></div>}
            </div>
          </div>

          {/* Owner */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sahip</h3>
            <a href={`/panel/musteriler/${pet.customer.id}`} className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-muted transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-kp-green/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-kp-green">{pet.customer.firstName[0]}{pet.customer.lastName[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-kp-green transition-colors">{pet.customer.firstName} {pet.customer.lastName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="text-[10px]" /> {pet.customer.phone}</p>
              </div>
            </a>
          </div>

          {/* Grooming Cycle Settings — for PET_KUAFOR */}
          {isKuafor && (
            <GroomingCycleEditor pet={pet} petId={petId} />
          )}

          {/* Notes */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faNoteSticky} className="text-xs" /> Notlar
            </h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Pet hakkında notlar..."
              className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
            <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> : null} Kaydet
            </Button>
          </div>
        </div>

        {/* Middle — Business-type specific */}
        <div className="space-y-4">
          {/* Grooming section — for PET_KUAFOR */}
          {isKuafor && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faScissors} className="text-xs text-rose-500" /> Bakım Geçmişi
                </h3>
                <Badge variant="secondary" className="text-[10px] border-0">{pet.groomingRecords.length} kayıt</Badge>
              </div>
              {pet.groomingRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz bakım kaydı yok</p>
              ) : (
                <div className="space-y-3">
                  {pet.groomingRecords.map((g) => {
                    const nextInfo = g.nextSuggestedDate ? (() => {
                      const diff = Math.ceil((new Date(g.nextSuggestedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return { days: diff, overdue: diff < 0 };
                    })() : null;
                    return (
                      <div key={g.id} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{new Date(g.groomingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                          {nextInfo && (
                            <Badge variant="secondary" className={`text-[10px] border-0 ${nextInfo.overdue ? "bg-destructive/10 text-destructive" : "bg-blue-50 text-blue-600"}`}>
                              {nextInfo.overdue ? `${Math.abs(nextInfo.days)} gün gecikmiş` : `${nextInfo.days} gün sonra`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {g.servicesPerformed.map((s, i) => <Badge key={i} variant="secondary" className="text-[10px] border-0 bg-rose-100 text-rose-600">{s}</Badge>)}
                        </div>
                        {g.notes && <p className="text-xs text-muted-foreground">{g.notes}</p>}
                        {/* WhatsApp sonraki bakım hatırlatma */}
                        {nextInfo && nextInfo.days <= 3 && (
                          <Button variant="outline" size="sm" className="rounded-lg text-[10px] h-6 px-2 text-green-600 border-green-200"
                            onClick={() => sendWhatsApp(pet.customer.phone, `Merhaba ${pet.customer.firstName} Bey/Hanım, ${pet.name}'in bakım zamanı geldi! Randevu almak ister misiniz?`)}>
                            <FontAwesomeIcon icon={fabWhatsapp} className="mr-1" /> Hatırlat
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Vaccinations — for VETERINER */}
          {isVet && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faSyringe} className="text-xs text-amber-500" /> Aşı Takibi
              </h3>
              {pet.vaccinations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz aşı kaydı yok</p>
              ) : (
                <div className="space-y-2">
                  {pet.vaccinations.map((v) => {
                    const nextDue = v.nextDueDate ? Math.ceil((new Date(v.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                    return (
                      <div key={v.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{v.vaccineName}</p>
                          {nextDue !== null && nextDue <= 7 && (
                            <Button variant="outline" size="sm" className="rounded-lg text-[10px] h-6 px-2 text-green-600 border-green-200"
                              onClick={() => sendWhatsApp(pet.customer.phone, `Merhaba ${pet.customer.firstName} Bey/Hanım, ${pet.name}'in ${v.vaccineName} aşı zamanı geldi! Randevu almak ister misiniz?`)}>
                              <FontAwesomeIcon icon={fabWhatsapp} className="mr-1" /> Hatırlat
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Yapılma: {new Date(v.administeredDate).toLocaleDateString("tr-TR")}
                          {v.nextDueDate && ` • Sonraki: ${new Date(v.nextDueDate).toLocaleDateString("tr-TR")}`}
                          {nextDue !== null && nextDue < 0 && <span className="text-destructive font-medium"> ({Math.abs(nextDue)} gün gecikmiş!)</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Medical Records — for VETERINER */}
          {isVet && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faStethoscope} className="text-xs text-blue-500" /> Muayene Kayıtları
              </h3>
              {pet.medicalRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz muayene kaydı yok</p>
              ) : (
                <div className="space-y-2">
                  {pet.medicalRecords.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{r.diagnosis || "Muayene"}</p>
                        <span className="text-[10px] text-muted-foreground">{new Date(r.visitDate).toLocaleDateString("tr-TR")}</span>
                      </div>
                      {r.treatment && <p className="text-xs text-muted-foreground">{r.treatment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lab Results — for VETERINER */}
          {isVet && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFlask} className="text-xs text-purple-500" /> Laboratuvar Sonuçları
              </h3>
              {(!pet.labResults || pet.labResults.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz laboratuvar sonucu yok</p>
              ) : (
                <div className="space-y-2">
                  {pet.labResults.map((lab) => (
                    <div key={lab.id} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{lab.testName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-[10px] border-0 ${lab.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                            {lab.status === "completed" ? "Tamamlandı" : "Beklemede"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{new Date(lab.testDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                      {lab.notes && <p className="text-xs text-muted-foreground">{lab.notes}</p>}
                      {lab.fileUrl && (
                        <a href={lab.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                          <FontAwesomeIcon icon={faFileDownload} className="text-[10px]" /> Sonuç dosyasını görüntüle
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grooming for non-kuaför (basic view) */}
          {!isKuafor && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faScissors} className="text-xs text-rose-500" /> Bakım Kayıtları
              </h3>
              {pet.groomingRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Henüz bakım kaydı yok</p>
              ) : (
                <div className="space-y-2">
                  {pet.groomingRecords.map((g) => (
                    <div key={g.id} className="p-3 rounded-xl bg-muted/30 space-y-1">
                      <p className="text-xs text-muted-foreground">{new Date(g.groomingDate).toLocaleDateString("tr-TR")}</p>
                      <div className="flex flex-wrap gap-1">
                        {g.servicesPerformed.map((s, i) => <Badge key={i} variant="secondary" className="text-[10px] border-0">{s}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — Appointments */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-blue-500" /> Randevular
            </h3>
            {pet.appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Henüz randevu yok</p>
            ) : (
              <div className="space-y-2">
                {pet.appointments.map((a) => {
                  const conf = statusLabels[a.status] || statusLabels.PENDING;
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-blue-500 w-4" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{a.service?.name || "Randevu"}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(a.date).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                        {a.service?.price && <p className="text-[10px] text-kp-green font-medium">{fmt(a.service.price)}</p>}
                      </div>
                      <Badge variant="secondary" className={`text-[10px] border-0 ${conf.color}`}>{conf.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Randevu hatırlatma */}
          {pet.appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bildirim Gönder</h3>
              {pet.appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").map((a) => (
                <div key={a.id} className="flex items-center gap-2 mb-2">
                  <span className="text-xs flex-1">
                    {new Date(a.date).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} — {a.service?.name || "Randevu"}
                  </span>
                  <Button variant="outline" size="sm" className="rounded-lg text-[10px] h-6 px-2 text-green-600 border-green-200"
                    onClick={() => sendWhatsApp(pet.customer.phone,
                      `Merhaba ${pet.customer.firstName} Bey/Hanım, ${pet.name}'in ${new Date(a.date).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} tarihli ${a.service?.name || "randevusu"} hakkında hatırlatma yapmak istiyoruz.`)}>
                    <FontAwesomeIcon icon={fabWhatsapp} className="mr-1" /> WA
                  </Button>
                  {pet.customer.email && (
                    <Button variant="outline" size="sm" className="rounded-lg text-[10px] h-6 px-2 text-blue-600 border-blue-200"
                      onClick={() => sendEmail(pet.customer.email!, `${pet.name} - Randevu Hatırlatma`,
                        `Sayın ${pet.customer.firstName} ${pet.customer.lastName},\n\n${pet.name}'in ${new Date(a.date).toLocaleString("tr-TR")} tarihli randevusu hakkında hatırlatma.\n\nSaygılarımızla`)}>
                      ✉️
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Grooming Cycle Editor Sub-Component --- */
function GroomingCycleEditor({ pet, petId }: { pet: PetDetail; petId: string }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    coatType: pet.coatType || "",
    skinSensitivity: pet.skinSensitivity || "",
    groomingCycleDays: pet.groomingCycleDays || 30,
  });

  const coatTypes = ["Kısa Tüylü", "Orta Tüylü", "Uzun Tüylü", "Kıvırcık", "Sert Tüylü", "İpek Tüylü", "Çift Katlı"];
  const sensitivities = ["Normal", "Hassas", "Çok Hassas", "Alerjik"];

  // Breed-based default cycles
  const breedDefaults: Record<string, number> = {
    "Golden Retriever": 42, "Poodle": 28, "Bichon Frise": 28, "Shih Tzu": 21,
    "Yorkshire Terrier": 28, "Maltese": 21, "Cocker Spaniel": 35, "Labrador": 56,
    "Husky": 56, "Pomeranian": 28, "Schnauzer": 35, "Persian": 14,
    "Maine Coon": 21, "Ragdoll": 21, "British Shorthair": 42,
  };

  const suggestedDays = pet.breed ? breedDefaults[pet.breed] : null;

  const lastGrooming = pet.groomingRecords.length > 0
    ? new Date(pet.groomingRecords[0].groomingDate)
    : null;
  const nextGroomingDate = lastGrooming && form.groomingCycleDays
    ? new Date(lastGrooming.getTime() + form.groomingCycleDays * 24 * 60 * 60 * 1000)
    : null;
  const daysUntilNext = nextGroomingDate ? Math.ceil((nextGroomingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/pets/${petId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <FontAwesomeIcon icon={faScissors} className="text-xs text-rose-500" /> Bakım Döngüsü
        </h3>
        <button onClick={() => setEditing(!editing)} className="text-xs text-kp-green hover:underline">
          {editing ? "İptal" : "Düzenle"}
        </button>
      </div>

      {/* Next Grooming Alert */}
      {daysUntilNext !== null && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${daysUntilNext <= 0 ? "bg-destructive/10 text-destructive" : daysUntilNext <= 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
          <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
          {daysUntilNext <= 0
            ? `${Math.abs(daysUntilNext)} gün gecikmiş!`
            : `Sonraki bakıma ${daysUntilNext} gün kaldı (${nextGroomingDate!.toLocaleDateString("tr-TR")})`}
        </div>
      )}

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tüy Tipi</label>
            <select value={form.coatType} onChange={(e) => setForm((f) => ({ ...f, coatType: e.target.value }))}
              className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card">
              <option value="">Seçiniz</option>
              {coatTypes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Cilt Hassasiyeti</label>
            <select value={form.skinSensitivity} onChange={(e) => setForm((f) => ({ ...f, skinSensitivity: e.target.value }))}
              className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card">
              <option value="">Seçiniz</option>
              {sensitivities.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Bakım Periyodu (gün)
              {suggestedDays && <span className="text-kp-green ml-1 cursor-pointer" onClick={() => setForm((f) => ({ ...f, groomingCycleDays: suggestedDays }))}>
                • Önerilen: {suggestedDays} gün
              </span>}
            </label>
            <input type="number" min={7} max={120} value={form.groomingCycleDays}
              onChange={(e) => setForm((f) => ({ ...f, groomingCycleDays: parseInt(e.target.value) || 30 }))}
              className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-kp-green/20" />
          </div>
          <Button size="sm" className="rounded-xl text-xs gradient-primary text-white border-0 w-full" onClick={handleSave} disabled={saving}>
            {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> : null} Kaydet
          </Button>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          {form.coatType && <p>Tüy Tipi: <span className="font-medium">{form.coatType}</span></p>}
          {form.skinSensitivity && <p>Cilt: <span className={`font-medium ${form.skinSensitivity === "Çok Hassas" || form.skinSensitivity === "Alerjik" ? "text-amber-600" : ""}`}>{form.skinSensitivity}</span></p>}
          <p>Periyod: <span className="font-medium">{form.groomingCycleDays} gün</span>
            {suggestedDays && form.groomingCycleDays !== suggestedDays && <span className="text-xs text-muted-foreground ml-1">(cins önerisi: {suggestedDays})</span>}
          </p>
          {!form.coatType && !form.skinSensitivity && <p className="text-muted-foreground text-xs">Bilgi girilmemiş — düzenle butonuna tıklayın</p>}
        </div>
      )}
    </div>
  );
}
