"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faUserDoctor, faSpinner, faXmark, faMagnifyingGlass,
  faNotesMedical, faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Surgery {
  id: string;
  petName: string;
  customerName: string;
  type: string;
  date: string;
  anesthesiaType: string;
  surgeon: string;
  status: string;
  notes: string;
  complications: string;
  postOpNotes: string;
}

export default function AmeliyatClient() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    petId: "", type: "", date: "", anesthesiaType: "Genel",
    notes: "", surgeon: "", complications: "", postOpNotes: "",
  });

  // Placeholder — will connect to API
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = async () => {
    // TODO: API integration
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--kp-text)]">
            <FontAwesomeIcon icon={faUserDoctor} className="mr-2 text-[var(--kp-primary)]" />
            Ameliyat Kayıtları
          </h1>
          <p className="text-sm text-gray-500 mt-1">Operasyon planları ve post-operatif takip</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Yeni Ameliyat Kaydı
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Toplam Ameliyat</div>
          <div className="text-2xl font-bold text-[var(--kp-primary)]">{surgeries.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Bu Ay</div>
          <div className="text-2xl font-bold text-blue-600">0</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Planlanan</div>
          <div className="text-2xl font-bold text-orange-600">0</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Başarı Oranı</div>
          <div className="text-2xl font-bold text-green-600">%100</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Ameliyat kaydı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty state */}
      {surgeries.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FontAwesomeIcon icon={faNotesMedical} className="text-5xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-1">Henüz ameliyat kaydı yok</h3>
          <p className="text-gray-400 text-sm">İlk ameliyat kaydını oluşturmak için yukarıdaki butona tıklayın.</p>
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faHeartPulse} className="text-red-500" />
                Yeni Ameliyat Kaydı
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Ameliyat Tipi *</Label>
                <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Ör: Kısırlaştırma, Tümör Çıkarma" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tarih *</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>Anestezi Tipi</Label>
                  <select value={form.anesthesiaType} onChange={(e) => setForm({ ...form, anesthesiaType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option>Genel</option>
                    <option>Lokal</option>
                    <option>Sedasyon</option>
                    <option>Epidural</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Cerrah</Label>
                <Input value={form.surgeon} onChange={(e) => setForm({ ...form, surgeon: e.target.value })} placeholder="Dr. ..." />
              </div>
              <div>
                <Label>Ameliyat Notları</Label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-20 resize-none" placeholder="Ameliyat sırasındaki notlar..." />
              </div>
              <div>
                <Label>Komplikasyonlar</Label>
                <textarea value={form.complications} onChange={(e) => setForm({ ...form, complications: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-16 resize-none" placeholder="Varsa komplikasyonlar..." />
              </div>
              <div>
                <Label>Post-Op Notlar</Label>
                <textarea value={form.postOpNotes} onChange={(e) => setForm({ ...form, postOpNotes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-16 resize-none" placeholder="Ameliyat sonrası takip notları..." />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} className="flex-1">Kaydet</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>İptal</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
