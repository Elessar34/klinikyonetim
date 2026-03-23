import type { Metadata } from "next";
import LabResultsClient from "@/components/panel/vet/LabResultsClient";

export const metadata: Metadata = { title: "Laboratuvar Sonuçları" };

export default function LabResultsPage() {
  return <LabResultsClient />;
}
