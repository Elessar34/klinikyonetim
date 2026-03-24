import type { Metadata } from "next";
import AmeliyatClient from "@/components/panel/vet/AmeliyatClient";

export const metadata: Metadata = {
  title: "Ameliyat Kayıtları | Klinik Yönetim",
  description: "Ameliyat planı, anestezi protokolü ve post-operatif takip",
};

export default function AmeliyatlarPage() {
  return <AmeliyatClient />;
}
