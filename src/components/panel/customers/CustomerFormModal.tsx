"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faSpinner,
  faUser,
  faPhone,
  faEnvelope,
  faLocationDot,
  faNoteSticky,
  faDog,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneSecondary?: string;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
    notes?: string;
  } | null;
  onClose: () => void;
  onSaved: () => void;
}

interface PetEntry {
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  color: string;
  weight: string;
  microchipNo: string;
}

const speciesOptions = ["Köpek", "Kedi", "Kuş", "Hamster", "Tavşan", "Balık", "Sürüngen", "Diğer"];
const genderOptions = [
  { value: "MALE", label: "Erkek" }, { value: "FEMALE", label: "Dişi" }, { value: "UNKNOWN", label: "Bilinmiyor" },
];

const emptyPet: PetEntry = { name: "", species: "Köpek", breed: "", gender: "UNKNOWN", dateOfBirth: "", color: "", weight: "", microchipNo: "" };

export default function CustomerFormModal({ customer, onClose, onSaved }: CustomerFormProps) {
  const isEdit = !!customer;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    phone: customer?.phone || "",
    phoneSecondary: customer?.phoneSecondary || "",
    email: customer?.email || "",
    address: customer?.address || "",
    city: customer?.city || "",
    district: customer?.district || "",
    notes: customer?.notes || "",
  });
  const [pets, setPets] = useState<PetEntry[]>(isEdit ? [] : [{ ...emptyPet }]);
  const [showPets, setShowPets] = useState(!isEdit);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePetChange = (index: number, field: string, value: string) => {
    setPets((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const addPet = () => setPets((prev) => [...prev, { ...emptyPet }]);
  const removePet = (index: number) => setPets((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const url = isEdit ? `/api/customers/${customer.id}` : "/api/customers";
      const method = isEdit ? "PUT" : "POST";

      // Filter out empty pet entries
      const validPets = pets.filter((p) => p.name.trim() !== "");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pets: validPets }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu");
        return;
      }

      onSaved();
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)]">
            {isEdit ? "Müşteri Düzenle" : "Yeni Müşteri"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* ---- MÜŞTERİ BİLGİLERİ ---- */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-xs" /> Müşteri Bilgileri
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs">Ad *</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="Ad" className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs">Soyad *</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Soyad" className="rounded-xl" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Telefon *</Label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="05XX XXX XXXX" className="pl-9 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phoneSecondary" className="text-xs">İkinci Telefon</Label>
                  <Input id="phoneSecondary" value={form.phoneSecondary} onChange={(e) => handleChange("phoneSecondary", e.target.value)} placeholder="Opsiyonel" className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                  <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="ornek@email.com" className="pl-9 rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">Adres</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-3 text-muted-foreground text-xs" />
                  <textarea id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Adres" className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs">İl</Label>
                  <Input id="city" value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="İl" className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs">İlçe</Label>
                  <Input id="district" value={form.district} onChange={(e) => handleChange("district", e.target.value)} placeholder="İlçe" className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs">Notlar</Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faNoteSticky} className="absolute left-3 top-3 text-muted-foreground text-xs" />
                  <textarea id="notes" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Müşteri hakkında notlar..." className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
                </div>
              </div>
            </div>
          </div>

          {/* ---- PET BİLGİLERİ ---- */}
          {!isEdit && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faDog} className="text-xs" /> Pet Bilgileri
                </h3>
                {!showPets && (
                  <Button type="button" variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => { setShowPets(true); if (pets.length === 0) addPet(); }}>
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Pet Ekle
                  </Button>
                )}
              </div>

              {showPets && (
                <div className="space-y-4">
                  {pets.map((pet, index) => (
                    <div key={index} className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-kp-orange">
                          Pet {index + 1}
                        </span>
                        {pets.length > 1 && (
                          <button type="button" onClick={() => removePet(index)} className="text-destructive hover:text-destructive/80 text-xs">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Pet Adı *</Label>
                          <Input value={pet.name} onChange={(e) => handlePetChange(index, "name", e.target.value)} placeholder="Pamuk" className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Tür *</Label>
                          <div className="flex flex-wrap gap-1.5">
                            {speciesOptions.slice(0, 4).map((s) => (
                              <button key={s} type="button" onClick={() => handlePetChange(index, "species", s)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${pet.species === s ? "border-kp-orange bg-kp-orange/10 text-kp-orange" : "border-border text-muted-foreground hover:bg-muted"}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Cins</Label>
                          <Input value={pet.breed} onChange={(e) => handlePetChange(index, "breed", e.target.value)} placeholder="Golden Retriever" className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Cinsiyet</Label>
                          <div className="flex gap-1.5">
                            {genderOptions.map((g) => (
                              <button key={g.value} type="button" onClick={() => handlePetChange(index, "gender", g.value)}
                                className={`flex-1 py-1.5 rounded-lg border text-xs transition-all ${pet.gender === g.value ? "border-purple-400 bg-purple-50 text-purple-600" : "border-border text-muted-foreground hover:bg-muted"}`}>
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Doğum Tarihi</Label>
                          <Input type="date" value={pet.dateOfBirth} onChange={(e) => handlePetChange(index, "dateOfBirth", e.target.value)} className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Renk</Label>
                          <Input value={pet.color} onChange={(e) => handlePetChange(index, "color", e.target.value)} placeholder="Altın" className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Kilo (kg)</Label>
                          <Input type="number" step="0.1" value={pet.weight} onChange={(e) => handlePetChange(index, "weight", e.target.value)} placeholder="15" className="rounded-xl" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Mikroçip No</Label>
                        <Input value={pet.microchipNo} onChange={(e) => handlePetChange(index, "microchipNo", e.target.value)} placeholder="Opsiyonel" className="rounded-xl" />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" size="sm" className="rounded-xl text-xs w-full" onClick={addPet}>
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Bir Pet Daha Ekle
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>İptal</Button>
            <Button type="submit" className="gradient-primary text-white border-0 shadow-md rounded-xl min-w-[120px]" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : isEdit ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
