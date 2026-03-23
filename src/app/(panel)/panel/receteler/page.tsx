import type { Metadata } from "next";
import PrescriptionsClient from "@/components/panel/vet/PrescriptionsClient";

export const metadata: Metadata = { title: "Reçeteler" };

export default function PrescriptionsPage() {
  return <PrescriptionsClient />;
}
