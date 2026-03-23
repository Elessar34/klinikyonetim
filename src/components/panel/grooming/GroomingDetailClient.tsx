"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faScissors, faPaw, faDog, faCat, faDove, faCalendarDays,
  faClock, faSpinner, faNoteSticky, faChevronLeft, faChevronRight,
  faPhone, faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GroomingDetail {
  id: string; groomingDate: string; servicesPerformed: string[]; notes?: string;
  beforePhotoUrl?: string; afterPhotoUrl?: string;
  productsUsed?: { product: string; quantity: number }[];
  nextSuggestedDate?: string; createdAt: string;
  pet: {
    id: string; name: string; species: string; breed?: string; color?: string;
    coatType?: string; skinSensitivity?: string; weight?: number;
    customer: { id: string; firstName: string; lastName: string; phone: string; email?: string };
  };
  previousGrooming?: { id: string; groomingDate: string; servicesPerformed: string[] };
  nextGrooming?: { id: string; groomingDate: string };
}

const serviceEmojis: Record<string, string> = {
  "Yıkama": "🛁", "Tıraş": "✂️", "Tam Bakım": "🐾", "Tırnak Kesimi": "💅",
  "Kulak Temizliği": "👂", "Diş Fırçalama": "🦷", "Pire/Kene Banyosu": "🧴",
  "SPA Bakımı": "💆", "Cilt Bakımı": "🧼", "Tüy Açma": "🪮",
  "Parfüm/Kolanya": "✨", "Fiyonk/Bandana": "🎀",
};

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function GroomingDetailClient({ groomingId }: { groomingId: string }) {
  const [record, setRecord] = useState<GroomingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchRecord = () => {
    setIsLoading(true);
    fetch(`/api/grooming/${groomingId}`)
      .then((r) => r.json())
      .then((d) => { setRecord(d); setNotes(d.notes || ""); })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchRecord(); }, [groomingId]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/grooming/${groomingId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
  };

  const sendWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "90");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const daysSince = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Bugün";
    if (diff === 1) return "Dün";
    return `${diff} gün önce`;
  };

  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)} gün gecikmiş`, overdue: true };
    if (diff === 0) return { text: "Bugün", overdue: false };
    return { text: `${diff} gün sonra`, overdue: false };
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-rose-500 animate-spin" /></div>;
  if (!record) return <div className="text-center py-20 text-muted-foreground">Bakım kaydı bulunamadı</div>;

  const nextInfo = record.nextSuggestedDate ? daysUntil(record.nextSuggestedDate) : null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={() => window.location.href = "/panel/bakim"}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" /> Geri
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faScissors} className="text-xl text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Bakım Detayı</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                {new Date(record.groomingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" })}
                <span className="text-xs">({daysSince(record.groomingDate)})</span>
              </p>
            </div>
          </div>
        </div>
        {/* Nav between records */}
        <div className="flex gap-1.5">
          {record.previousGrooming && (
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => window.location.href = `/panel/bakim/${record.previousGrooming!.id}`}>
              <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Önceki
            </Button>
          )}
          {record.nextGrooming && (
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => window.location.href = `/panel/bakim/${record.nextGrooming!.id}`}>
              Sonraki <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Pet & Customer */}
        <div className="space-y-4">
          {/* Pet */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pet Bilgileri</h3>
            <a href={`/panel/petler/${record.pet.id}`} className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-muted transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                <FontAwesomeIcon icon={speciesIcon(record.pet.species)} className="text-lg text-kp-orange" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-kp-green transition-colors">{record.pet.name}</p>
                <p className="text-xs text-muted-foreground">{record.pet.species}{record.pet.breed ? ` • ${record.pet.breed}` : ""}</p>
              </div>
            </a>
            <div className="space-y-1.5 mt-3 text-sm">
              {record.pet.color && <p className="text-muted-foreground">Renk: <span className="text-foreground font-medium">{record.pet.color}</span></p>}
              {record.pet.coatType && <p className="text-muted-foreground">Tüy Tipi: <span className="text-foreground font-medium">{record.pet.coatType}</span></p>}
              {record.pet.skinSensitivity && <p className="text-muted-foreground">Cilt: <span className="text-amber-600 font-medium">{record.pet.skinSensitivity}</span></p>}
              {record.pet.weight && <p className="text-muted-foreground">Kilo: <span className="text-foreground font-medium">{record.pet.weight} kg</span></p>}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sahip</h3>
            <a href={`/panel/musteriler/${record.pet.customer.id}`} className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-muted transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-kp-green/10 flex items-center justify-center">
                <span className="text-sm font-bold text-kp-green">{record.pet.customer.firstName[0]}{record.pet.customer.lastName[0]}</span>
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-kp-green transition-colors">{record.pet.customer.firstName} {record.pet.customer.lastName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="text-[10px]" /> {record.pet.customer.phone}</p>
              </div>
            </a>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="rounded-lg text-xs flex-1 text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => sendWhatsApp(record.pet.customer.phone,
                  `Merhaba ${record.pet.customer.firstName} Bey/Hanım, ${record.pet.name}'in bakım raporu hazır. Yapılan işlemler: ${record.servicesPerformed.join(", ")}.${nextInfo ? ` Bir sonraki bakım: ${new Date(record.nextSuggestedDate!).toLocaleDateString("tr-TR")}` : ""}`)}>
                <FontAwesomeIcon icon={faWhatsapp} className="mr-1" /> Rapor Gönder
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => {
                  const text = `${record.pet.name} - Bakım Raporu\nTarih: ${new Date(record.groomingDate).toLocaleDateString("tr-TR")}\nYapılanlar: ${record.servicesPerformed.join(", ")}\n${record.notes ? `Not: ${record.notes}` : ""}`;
                  navigator.clipboard.writeText(text);
                }}>
                <FontAwesomeIcon icon={faShareNodes} className="mr-1" /> Kopyala
              </Button>
            </div>
          </div>

          {/* Next Suggested */}
          {record.nextSuggestedDate && nextInfo && (
            <div className={`rounded-2xl p-5 border-2 ${nextInfo.overdue ? "border-destructive/30 bg-destructive/5" : "border-blue-200 bg-blue-50/50"}`}>
              <h3 className="text-sm font-semibold mb-2">📅 Sonraki Bakım</h3>
              <p className="text-lg font-bold">{new Date(record.nextSuggestedDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p className={`text-sm font-medium mt-1 ${nextInfo.overdue ? "text-destructive" : "text-blue-600"}`}>{nextInfo.text}</p>
              {nextInfo.overdue && (
                <Button variant="outline" size="sm" className="rounded-lg text-xs mt-3 text-green-600 border-green-200 hover:bg-green-50 w-full"
                  onClick={() => sendWhatsApp(record.pet.customer.phone,
                    `Merhaba ${record.pet.customer.firstName} Bey/Hanım, ${record.pet.name}'in bakım zamanı geldi! Son bakımı ${new Date(record.groomingDate).toLocaleDateString("tr-TR")} tarihinde yapılmıştı. Randevu almak ister misiniz? 🐾`)}>
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-1.5" /> Hatırlatma Gönder
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Middle — Services Done */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faScissors} className="text-xs text-rose-500" /> Yapılan İşlemler
            </h3>
            <div className="space-y-2">
              {record.servicesPerformed.map((service, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                  <span className="text-xl">{serviceEmojis[service] || "🐾"}</span>
                  <span className="text-sm font-medium text-rose-700">{service}</span>
                  <span className="ml-auto text-[10px] text-rose-400">✓ Yapıldı</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products Used */}
          {record.productsUsed && record.productsUsed.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">🧴 Kullanılan Ürünler</h3>
              <div className="space-y-2">
                {record.productsUsed.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-sm">{p.product}</span>
                    <Badge variant="secondary" className="text-[10px] border-0">x{p.quantity}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Before / After Photos */}
          {(record.beforePhotoUrl || record.afterPhotoUrl) && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">📸 Öncesi / Sonrası</h3>
              <div className="grid grid-cols-2 gap-3">
                {record.beforePhotoUrl && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">Öncesi</p>
                    <img src={record.beforePhotoUrl} alt="Öncesi" className="w-full rounded-xl border border-border object-cover aspect-square" />
                  </div>
                )}
                {record.afterPhotoUrl && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">Sonrası</p>
                    <img src={record.afterPhotoUrl} alt="Sonrası" className="w-full rounded-xl border border-border object-cover aspect-square" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previous grooming comparison */}
          {record.previousGrooming && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Önceki Bakım Karşılaştırma</h3>
              <a href={`/panel/bakim/${record.previousGrooming.id}`} className="block p-3 rounded-xl hover:bg-muted transition-colors">
                <p className="text-xs text-muted-foreground">
                  <FontAwesomeIcon icon={faClock} className="mr-1 text-[10px]" />
                  {new Date(record.previousGrooming.groomingDate).toLocaleDateString("tr-TR")}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {record.previousGrooming.servicesPerformed.map((s, i) => (
                    <Badge key={i} variant="secondary" className={`text-[10px] border-0 ${record.servicesPerformed.includes(s) ? "bg-rose-50 text-rose-600" : "bg-muted text-muted-foreground"}`}>{s}</Badge>
                  ))}
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Right — Notes */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faNoteSticky} className="text-xs" /> Bakım Notları
            </h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Tüy durumu, cilt gözlemleri, müşteri istekleri, özel notlar..."
              className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-40 focus:outline-none focus:ring-2 focus:ring-rose-300/30 focus:border-rose-300" />
            <Button size="sm" variant="outline" className="rounded-xl text-xs mt-2" onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" /> : null} Notu Kaydet
            </Button>
          </div>

          {/* Share card - future subdomain preview */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-dashed border-rose-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-2">🔗 Müşteri Paylaşım Linki</h3>
            <p className="text-xs text-muted-foreground mb-3">Bu bakım kaydını müşteriyle paylaşmak için subdomain linki oluşturulacak.</p>
            <div className="bg-white/70 border border-rose-100 rounded-xl p-3 text-xs text-muted-foreground">
              <code>https://[tenant].klinikyonetim.net/bakim/{record.id.slice(0, 8)}</code>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">* Subdomain sistemi yakında aktif olacak</p>
          </div>

          {/* Quick summary for sharing */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">📋 Hızlı Özet</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Pet:</strong> {record.pet.name} ({record.pet.species}{record.pet.breed ? ` • ${record.pet.breed}` : ""})</p>
              <p><strong>Tarih:</strong> {new Date(record.groomingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p><strong>İşlemler:</strong> {record.servicesPerformed.join(", ")}</p>
              {record.notes && <p><strong>Not:</strong> {record.notes}</p>}
              {record.nextSuggestedDate && <p><strong>Sonraki:</strong> {new Date(record.nextSuggestedDate).toLocaleDateString("tr-TR")}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
