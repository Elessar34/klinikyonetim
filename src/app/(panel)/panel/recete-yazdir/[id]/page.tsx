"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionDetail {
  id: string;
  prescriptionDate: string;
  medications: Medication[];
  notes?: string;
  pet: {
    name: string;
    species: string;
    breed?: string;
    customer: { firstName: string; lastName: string; phone: string };
  };
  tenant: { name: string; phone?: string; email?: string; address?: string; city?: string };
}

export default function PrescriptionPrintPage() {
  const params = useParams();
  const [rx, setRx] = useState<PrescriptionDetail | null>(null);

  useEffect(() => {
    fetch(`/api/prescriptions/${params.id}`)
      .then((r) => r.json())
      .then(setRx)
      .catch(console.error);
  }, [params.id]);

  if (!rx) return <div className="flex items-center justify-center min-h-screen"><p>Yükleniyor...</p></div>;

  const meds: Medication[] = Array.isArray(rx.medications) ? rx.medications : [];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white min-h-screen">
      {/* Print button */}
      <div className="print:hidden mb-6 flex gap-3">
        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          🖨️ Yazdır / PDF
        </button>
        <button onClick={() => window.history.back()} className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          ← Geri
        </button>
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-blue-800 pb-4 mb-6">
        <h1 className="text-xl font-bold text-blue-800">{rx.tenant.name}</h1>
        {rx.tenant.address && <p className="text-sm text-gray-600">{rx.tenant.address}{rx.tenant.city ? `, ${rx.tenant.city}` : ""}</p>}
        {rx.tenant.phone && <p className="text-sm text-gray-600">Tel: {rx.tenant.phone}</p>}
        <h2 className="text-lg font-bold text-blue-800 mt-4 tracking-wider">REÇETE</h2>
        <p className="text-sm text-gray-600">Tarih: {new Date(rx.prescriptionDate).toLocaleDateString("tr-TR")}</p>
      </div>

      {/* Patient & Owner */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hasta Bilgileri</h3>
          <p className="text-sm font-semibold">{rx.pet.name}</p>
          <p className="text-sm text-gray-600">{rx.pet.species}{rx.pet.breed ? ` • ${rx.pet.breed}` : ""}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sahip Bilgileri</h3>
          <p className="text-sm font-semibold">{rx.pet.customer.firstName} {rx.pet.customer.lastName}</p>
          <p className="text-sm text-gray-600">Tel: {rx.pet.customer.phone}</p>
        </div>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">İlaçlar</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-blue-800 uppercase">#</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-blue-800 uppercase">İlaç Adı</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-blue-800 uppercase">Dozaj</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-blue-800 uppercase">Kullanım</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-blue-800 uppercase">Süre</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((med, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-3 px-4 text-sm text-gray-500">{i + 1}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{med.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{med.dosage}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{med.frequency}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{med.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {rx.notes && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">Notlar</h3>
          <p className="text-sm text-gray-700">{rx.notes}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-16 flex justify-end">
        <div className="text-center w-48">
          <div className="border-b border-gray-400 mb-2 h-12"></div>
          <p className="text-xs text-gray-500">Veteriner Hekim</p>
          <p className="text-xs text-gray-500">Kaşe / İmza</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
        <p>{rx.tenant.name} — Bu reçete bilgisayar ortamında oluşturulmuştur.</p>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
