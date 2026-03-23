import type { Metadata } from "next";
import MedicalRecordDetailClient from "@/components/panel/vet/MedicalRecordDetailClient";

export const metadata: Metadata = { title: "Muayene Detayı" };

export default function MedicalRecordDetailPage() {
  return <MedicalRecordDetailClient />;
}
