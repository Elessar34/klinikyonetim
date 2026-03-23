"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faDog,
  faCat,
  faDove,
  faPaw,
  faSpinner,
  faVenusMars,
  faCalendarDays,
  faWeight,
  faEllipsisVertical,
  faEye,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PetFormModal from "@/components/panel/pets/PetFormModal";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  gender: string;
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  microchipNo?: string;
  photoUrl?: string;
  isAlive: boolean;
  customer: { id: string; firstName: string; lastName: string; phone: string };
  _count: { appointments: number; medicalRecords: number; vaccinations: number; groomingRecords: number };
}

const speciesOptions = [
  { value: "", label: "Tümü", icon: faPaw },
  { value: "Köpek", label: "Köpek", icon: faDog },
  { value: "Kedi", label: "Kedi", icon: faCat },
  { value: "Kuş", label: "Kuş", icon: faDove },
  { value: "Diğer", label: "Diğer", icon: faPaw },
];

const genderLabels: Record<string, string> = {
  MALE: "Erkek",
  FEMALE: "Dişi",
  UNKNOWN: "Bilinmiyor",
};

export default function PetsClient() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(speciesFilter && { species: speciesFilter }),
      });
      const res = await fetch(`/api/pets?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPets(data.pets);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, speciesFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPets(), 300);
    return () => clearTimeout(timer);
  }, [fetchPets]);

  const getAge = (dob?: string) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    if (years > 0) return `${years} yaş ${months} ay`;
    return `${months} ay`;
  };

  const getSpeciesIcon = (species: string) => {
    if (species.toLowerCase().includes("köpek")) return faDog;
    if (species.toLowerCase().includes("kedi")) return faCat;
    if (species.toLowerCase().includes("kuş")) return faDove;
    return faPaw;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Petler</h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} pet kayıtlı</p>
        </div>
        <Button
          className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2"
          onClick={() => setShowForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Yeni Pet
        </Button>
      </div>

      {/* Search & Species Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <Input
            placeholder="İsim, cins veya mikroçip no ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {speciesOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={speciesFilter === opt.value ? "default" : "outline"}
              size="sm"
              className={`rounded-xl shrink-0 ${speciesFilter === opt.value ? "gradient-primary text-white border-0" : ""}`}
              onClick={() => setSpeciesFilter(opt.value)}
            >
              <FontAwesomeIcon icon={opt.icon} className="mr-1.5 text-xs" />
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Pet Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" />
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faPaw} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz pet kaydı yok</p>
          <p className="text-sm mt-1">Yeni pet eklemek için butona tıklayın.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => window.location.href = `/panel/petler/${pet.id}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-kp-orange/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={getSpeciesIcon(pet.species)} className="text-lg text-kp-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-kp-green transition-colors">{pet.name}</h3>
                    <p className="text-xs text-muted-foreground">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                      <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={(e) => { e.stopPropagation(); window.location.href = `/panel/petler/${pet.id}`; }}>
                      <FontAwesomeIcon icon={faEye} className="text-xs w-4" /> Detay
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={(e) => { e.stopPropagation(); }}>
                      <FontAwesomeIcon icon={faPen} className="text-xs w-4" /> Düzenle
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm mb-3">
                {pet.dateOfBirth && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs w-3.5" />
                    {getAge(pet.dateOfBirth)}
                  </p>
                )}
                <p className="flex items-center gap-2 text-muted-foreground">
                  <FontAwesomeIcon icon={faVenusMars} className="text-xs w-3.5" />
                  {genderLabels[pet.gender] || pet.gender}
                  {pet.weight && <> • <FontAwesomeIcon icon={faWeight} className="text-xs" /> {pet.weight} kg</>}
                </p>
              </div>

              {/* Owner */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Sahip: <span className="font-medium text-foreground">{pet.customer.firstName} {pet.customer.lastName}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-3 mt-3">
                {pet._count.appointments > 0 && (
                  <Badge variant="secondary" className="text-[10px] border-0 bg-blue-50 text-blue-600">
                    {pet._count.appointments} randevu
                  </Badge>
                )}
                {pet._count.medicalRecords > 0 && (
                  <Badge variant="secondary" className="text-[10px] border-0 bg-kp-green/10 text-kp-green">
                    {pet._count.medicalRecords} muayene
                  </Badge>
                )}
                {pet._count.vaccinations > 0 && (
                  <Badge variant="secondary" className="text-[10px] border-0 bg-amber-50 text-amber-600">
                    {pet._count.vaccinations} aşı
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Önceki
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => p + 1)}>
            Sonraki
          </Button>
        </div>
      )}

      {showForm && <PetFormModal onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchPets(); }} />}
    </div>
  );
}
