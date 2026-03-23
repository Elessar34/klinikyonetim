import type { Metadata } from "next";
import VaccinationsClient from "@/components/panel/vet/VaccinationsClient";

export const metadata: Metadata = { title: "Aşı Takibi" };

export default function VaccinationsPage() {
  return <VaccinationsClient />;
}
