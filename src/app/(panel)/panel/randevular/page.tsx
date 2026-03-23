import type { Metadata } from "next";
import AppointmentsClient from "@/components/panel/appointments/AppointmentsClient";

export const metadata: Metadata = {
  title: "Randevular",
};

export default function AppointmentsPage() {
  return <AppointmentsClient />;
}
