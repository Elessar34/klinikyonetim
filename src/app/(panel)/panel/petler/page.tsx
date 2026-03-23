import type { Metadata } from "next";
import PetsClient from "@/components/panel/pets/PetsClient";

export const metadata: Metadata = {
  title: "Petler",
};

export default function PetsPage() {
  return <PetsClient />;
}
