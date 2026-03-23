import type { Metadata } from "next";
import StaffClient from "@/components/panel/staff/StaffClient";

export const metadata: Metadata = { title: "Personel" };

export default function StaffPage() {
  return <StaffClient />;
}
