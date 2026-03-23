import type { Metadata } from "next";
import GroomingClient from "@/components/panel/grooming/GroomingClient";

export const metadata: Metadata = { title: "Bakım Kayıtları" };

export default function GroomingPage() {
  return <GroomingClient />;
}
