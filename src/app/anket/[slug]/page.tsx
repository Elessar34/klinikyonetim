import type { Metadata } from "next";
import SatisfactionSurveyClient from "@/components/public/SatisfactionSurveyClient";

export const metadata: Metadata = {
  title: "Memnuniyet Anketi — Klinik Yönetim",
  description: "Hizmetimizi değerlendirin.",
};

export default function SurveyPage() {
  return <SatisfactionSurveyClient />;
}
