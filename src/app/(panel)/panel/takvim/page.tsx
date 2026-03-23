import type { Metadata } from "next";
import GroomerCalendarClient from "@/components/panel/grooming/GroomerCalendarClient";

export const metadata: Metadata = { title: "Kuaför Takvimi" };

export default function GroomerCalendarPage() {
  return <GroomerCalendarClient />;
}
