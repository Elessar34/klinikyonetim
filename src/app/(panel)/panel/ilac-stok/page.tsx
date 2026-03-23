import type { Metadata } from "next";
import DrugStockClient from "@/components/panel/vet/DrugStockClient";

export const metadata: Metadata = { title: "İlaç & Malzeme Stok" };

export default function DrugStockPage() {
  return <DrugStockClient />;
}
