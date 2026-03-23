"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faStethoscope, faSpinner, faWeightScale, faTemperatureHalf,
  faHeartPulse, faLungs, faNotesMedical, faCalendarDays, faPrint, faPaw, faDog, faCat, faDove,
  faSave, faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MedicalRecord {
  id: string; visitDate: string; chiefComplaint?: string; diagnosis?: string;
  treatment?: string; notes?: string; weight?: number; temperature?: number;
  heartRate?: number; respiratoryRate?: number; followUpDate?: string;
  pet: { id: string; name: string; species: string; breed?: string;
    customer: { id: string; firstName: string; lastName: string; phone: string } };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

export default function MedicalRecordDetailClient() {
  const params = useParams();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    diagnosis: "", treatment: "", notes: "",
    weight: "", temperature: "", heartRate: "", respiratoryRate: "", followUpDate: "",
  });

  const fetchRecord = async () => {
    try {
      const res = await fetch(`/api/medical-records/${params.id}`);
      const d = await res.json();
      setRecord(d.record);
      if (d.record) {
        setEditForm({
          diagnosis: d.record.diagnosis || "",
          treatment: d.record.treatment || "",
          notes: d.record.notes || "",
          weight: d.record.weight?.toString() || "",
          temperature: d.record.temperature?.toString() || "",
          heartRate: d.record.heartRate?.toString() || "",
          respiratoryRate: d.record.respiratoryRate?.toString() || "",
          followUpDate: d.record.followUpDate?.split("T")[0] || "",
        });
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchRecord(); }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        diagnosis: editForm.diagnosis || undefined,
        treatment: editForm.treatment || undefined,
        notes: editForm.notes || undefined,
        weight: editForm.weight ? parseFloat(editForm.weight) : undefined,
        temperature: editForm.temperature ? parseFloat(editForm.temperature) : undefined,
        heartRate: editForm.heartRate ? parseInt(editForm.heartRate) : undefined,
        respiratoryRate: editForm.respiratoryRate ? parseInt(editForm.respiratoryRate) : undefined,
        followUpDate: editForm.followUpDate || undefined,
      };
      await fetch(`/api/medical-records/${params.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      await fetchRecord();
      setEditing(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-500 animate-spin" />
    </div>
  );

  if (!record) return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="font-medium">Kayıt bulunamadı</p>
      <Link href="/panel/hasta-dosyasi" className="text-sm text-blue-500 hover:underline mt-2 inline-block">← Geri dön</Link>
    </div>
  );

  const vitals = [
    { icon: faWeightScale, label: "Ağırlık", value: record.weight ? `${record.weight} kg` : null, color: "text-blue-500", bg: "bg-blue-50", field: "weight", unit: "kg" },
    { icon: faTemperatureHalf, label: "Sıcaklık", value: record.temperature ? `${record.temperature} °C` : null, color: "text-red-500", bg: "bg-red-50", field: "temperature", unit: "°C" },
    { icon: faHeartPulse, label: "Nabız", value: record.heartRate ? `${record.heartRate} /dk` : null, color: "text-pink-500", bg: "bg-pink-50", field: "heartRate", unit: "/dk" },
    { icon: faLungs, label: "Solunum", value: record.respiratoryRate ? `${record.respiratoryRate} /dk` : null, color: "text-teal-500", bg: "bg-teal-50", field: "respiratoryRate", unit: "/dk" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/panel/hasta-dosyasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 inline-flex items-center gap-1.5">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Hasta Dosyası
          </Link>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faStethoscope} className="text-blue-500" /> Muayene Detayı
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs border-0 bg-blue-50 text-blue-600 px-3 py-1.5">
            <FontAwesomeIcon icon={faCalendarDays} className="mr-1.5" />
            {new Date(record.visitDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </Badge>
          {!editing ? (
            <Button variant="outline" className="rounded-xl gap-2 text-sm" onClick={() => setEditing(true)}>
              <FontAwesomeIcon icon={faPen} /> Düzenle
            </Button>
          ) : (
            <Button className="rounded-xl gap-2 text-sm bg-blue-500 hover:bg-blue-600 text-white border-0" onClick={handleSave} disabled={saving}>
              {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />} Kaydet
            </Button>
          )}
          <Button variant="outline" className="rounded-xl gap-2 text-sm" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} /> Yazdır
          </Button>
        </div>
      </div>

      {/* Pet Info */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-kp-orange/10 flex items-center justify-center">
            <FontAwesomeIcon icon={speciesIcon(record.pet.species)} className="text-kp-orange text-xl" />
          </div>
          <div>
            <Link href={`/panel/petler/${record.pet.id}`} className="text-lg font-bold hover:text-blue-500 transition-colors">
              {record.pet.name}
            </Link>
            <p className="text-sm text-muted-foreground">{record.pet.species}{record.pet.breed ? ` • ${record.pet.breed}` : ""}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sahip: {record.pet.customer.firstName} {record.pet.customer.lastName} • {record.pet.customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Vitals */}
      {editing ? (
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
          <p className="text-sm font-semibold text-blue-600">Vital Bulgular</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vitals.map((v) => (
              <div key={v.field} className="space-y-1">
                <Label className="text-xs">{v.label} ({v.unit})</Label>
                <Input type="number" step="0.1" value={editForm[v.field as keyof typeof editForm]}
                  onChange={(e) => setEditForm((f) => ({ ...f, [v.field]: e.target.value }))}
                  className="rounded-lg h-9 text-sm" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vitals.map((v) => (
            <div key={v.label} className={`${v.bg} rounded-2xl p-4 text-center`}>
              <FontAwesomeIcon icon={v.icon} className={`${v.color} text-xl mb-2`} />
              <p className="text-xl font-bold">{v.value || "−"}</p>
              <p className="text-xs text-muted-foreground mt-1">{v.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chief Complaint */}
      {record.chiefComplaint && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Başvuru Şikayeti</h3>
          <p className="text-sm leading-relaxed">{record.chiefComplaint}</p>
        </div>
      )}

      {/* Diagnosis & Treatment */}
      {editing ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
            <Label className="text-sm font-semibold text-blue-500 flex items-center gap-2"><FontAwesomeIcon icon={faNotesMedical} /> Teşhis</Label>
            <textarea value={editForm.diagnosis} onChange={(e) => setEditForm((f) => ({ ...f, diagnosis: e.target.value }))}
              placeholder="Teşhis giriniz..."
              className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-300" />
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
            <Label className="text-sm font-semibold text-kp-green flex items-center gap-2"><FontAwesomeIcon icon={faNotesMedical} /> Tedavi</Label>
            <textarea value={editForm.treatment} onChange={(e) => setEditForm((f) => ({ ...f, treatment: e.target.value }))}
              placeholder="Tedavi planını giriniz..."
              className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-kp-green/30 focus:border-kp-green" />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faNotesMedical} /> Teşhis
            </h3>
            <p className="text-sm leading-relaxed">{record.diagnosis || <span className="text-muted-foreground italic">Teşhis kaydedilmemiş — düzenle butonuna tıklayarak ekleyebilirsiniz</span>}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-kp-green mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faNotesMedical} /> Tedavi
            </h3>
            <p className="text-sm leading-relaxed">{record.treatment || <span className="text-muted-foreground italic">Tedavi kaydedilmemiş — düzenle butonuna tıklayarak ekleyebilirsiniz</span>}</p>
          </div>
        </div>
      )}

      {/* SOAP Notes */}
      {editing ? (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground">SOAP Notları</Label>
          <textarea value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Subjektif, Objektif, Değerlendirme, Plan..."
            className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-300" />
        </div>
      ) : record.notes ? (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">SOAP Notları</h3>
          <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4">{record.notes}</div>
        </div>
      ) : null}

      {/* Follow-up */}
      {editing ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
          <Label className="text-sm font-semibold text-amber-700">Kontrol Tarihi</Label>
          <Input type="date" value={editForm.followUpDate} onChange={(e) => setEditForm((f) => ({ ...f, followUpDate: e.target.value }))} className="rounded-xl max-w-xs" />
        </div>
      ) : record.followUpDate ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <FontAwesomeIcon icon={faCalendarDays} className="text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-700">Kontrol Tarihi</p>
            <p className="text-sm text-amber-600">{new Date(record.followUpDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
