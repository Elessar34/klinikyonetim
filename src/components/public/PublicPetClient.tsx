"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw, faDog, faCat, faDove, faSyringe, faPhone, faShieldHalved,
  faWeightScale, faDroplet, faMicrochip, faCalendarDays, faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";

interface PublicPetProps {
  pet: {
    name: string; species: string; breed?: string; gender: string;
    dateOfBirth?: string; weight?: number; color?: string;
    microchipNo?: string; allergies?: string; bloodType?: string;
    photoUrl?: string;
    customer: { firstName: string; lastName: string; phone: string };
    vaccinations: {
      vaccineName: string; vaccineType?: string;
      administeredDate: string; nextDueDate?: string;
    }[];
  };
}

const speciesIcon = (s: string) => {
  if (s.toLowerCase().includes("köpek")) return faDog;
  if (s.toLowerCase().includes("kedi")) return faCat;
  if (s.toLowerCase().includes("kuş")) return faDove;
  return faPaw;
};

const genderLabel: Record<string, string> = { MALE: "Erkek", FEMALE: "Dişi", UNKNOWN: "Bilinmiyor" };

export default function PublicPetClient({ pet }: PublicPetProps) {
  const age = pet.dateOfBirth
    ? Math.floor((Date.now() - new Date(pet.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <FontAwesomeIcon icon={faPaw} className="text-white text-sm" />
          </div>
          <span className="text-lg font-bold font-[family-name:var(--font-heading)] gradient-text">Klinik Yönetim</span>
          <span className="text-xs text-muted-foreground ml-auto">Pet Kimliği</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Pet Profile */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-kp-green/10 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={speciesIcon(pet.species)} className="text-kp-green text-3xl" />
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">{pet.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pet.species}{pet.breed ? ` • ${pet.breed}` : ""} • {genderLabel[pet.gender] || pet.gender}
          </p>
          {age !== null && <p className="text-xs text-muted-foreground mt-1">{age} yaşında</p>}
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 space-y-3">
          <h3 className="text-sm font-semibold mb-3">Detaylar</h3>
          <div className="grid grid-cols-2 gap-3">
            {pet.weight && (
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faWeightScale} className="text-blue-500 text-xs w-4" />
                <span className="text-muted-foreground">Ağırlık:</span>
                <span className="font-medium">{pet.weight} kg</span>
              </div>
            )}
            {pet.color && (
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faDroplet} className="text-pink-500 text-xs w-4" />
                <span className="text-muted-foreground">Renk:</span>
                <span className="font-medium">{pet.color}</span>
              </div>
            )}
            {pet.microchipNo && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <FontAwesomeIcon icon={faMicrochip} className="text-gray-500 text-xs w-4" />
                <span className="text-muted-foreground">Çip No:</span>
                <span className="font-medium font-mono text-xs">{pet.microchipNo}</span>
              </div>
            )}
            {pet.bloodType && (
              <div className="flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faDroplet} className="text-red-500 text-xs w-4" />
                <span className="text-muted-foreground">Kan:</span>
                <span className="font-medium">{pet.bloodType}</span>
              </div>
            )}
          </div>
          {pet.allergies && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-xs font-medium text-red-700 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faNotesMedical} /> Alerjiler
              </p>
              <p className="text-sm text-red-600 mt-1">{pet.allergies}</p>
            </div>
          )}
        </div>

        {/* Vaccinations */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faSyringe} className="text-kp-green" /> Aşı Geçmişi
          </h3>
          {pet.vaccinations.length > 0 ? (
            <div className="space-y-2">
              {pet.vaccinations.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50">
                  <div>
                    <p className="text-sm font-medium">{v.vaccineName}</p>
                    {v.vaccineType && <p className="text-xs text-muted-foreground">{v.vaccineType}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                      {new Date(v.administeredDate).toLocaleDateString("tr-TR")}
                    </p>
                    {v.nextDueDate && (
                      <p className="text-[10px] text-kp-green">
                        Sonraki: {new Date(v.nextDueDate).toLocaleDateString("tr-TR")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Aşı kaydı yok</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-red-500" /> Acil İletişim
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{pet.customer.firstName} {pet.customer.lastName}</p>
              <p className="text-xs text-muted-foreground">Pet Sahibi</p>
            </div>
            <a href={`tel:${pet.customer.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-kp-green text-white text-sm font-medium hover:bg-kp-green/90 transition-colors">
              <FontAwesomeIcon icon={faPhone} /> Ara
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Klinik Yönetim tarafından oluşturulmuştur • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
