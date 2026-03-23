import type { Metadata } from "next";
import MedicalRecordsClient from "@/components/panel/vet/MedicalRecordsClient";

export const metadata: Metadata = { title: "Hasta Dosyası" };

export default function MedicalRecordsPage() {
  return <MedicalRecordsClient />;
}
