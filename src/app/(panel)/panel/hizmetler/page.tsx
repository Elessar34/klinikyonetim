import type { Metadata } from "next";
import ServicesClient from "@/components/panel/services/ServicesClient";

export const metadata: Metadata = { title: "Hizmetler" };

export default function ServicesPage() {
  return <ServicesClient />;
}
