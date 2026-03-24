import type { Metadata } from "next";
import StockClient from "@/components/panel/stock/StockClient";

export const metadata: Metadata = {
  title: "Stok Yönetimi | Klinik Yönetim",
  description: "Ürün stok yönetimi, barkod ile arama, stok hareketleri",
};

export default function StockPage() {
  return <StockClient />;
}
