import type { Metadata } from "next";
import SettingsClient from "@/components/panel/settings/SettingsClient";

export const metadata: Metadata = { title: "Ayarlar" };

export default function SettingsPage() {
  return <SettingsClient />;
}
