import type { Metadata } from "next";
import AppointmentConfirmClient from "@/components/public/AppointmentConfirmClient";

export const metadata: Metadata = {
  title: "Randevu Onayı — Klinik Yönetim",
  description: "Randevunuzu onaylayın veya iptal edin.",
};

export default function AppointmentConfirmPage() {
  return <AppointmentConfirmClient />;
}
