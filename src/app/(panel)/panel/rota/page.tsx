import type { Metadata } from "next";
import MobileRouteClient from "@/components/panel/grooming/MobileRouteClient";

export const metadata: Metadata = { title: "Mobil Rota" };

export default function MobileRoutePage() {
  return <MobileRouteClient />;
}
