import type { Metadata } from "next";
import SalesClient from "@/components/panel/stock/SalesClient";

export const metadata: Metadata = {
  title: "Satış Kasa | Klinik Yönetim",
  description: "Barkodlu satış, POS kasa, fatura oluşturma",
};

export default function SalesPage() {
  return <SalesClient />;
}
