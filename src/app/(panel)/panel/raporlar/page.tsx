import type { Metadata } from "next";
import ReportsClient from "@/components/panel/reports/ReportsClient";

export const metadata: Metadata = { title: "Raporlar & Analitik" };

export default function ReportsPage() {
  return <ReportsClient />;
}
