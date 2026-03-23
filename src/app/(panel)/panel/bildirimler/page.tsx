import type { Metadata } from "next";
import NotificationsClient from "@/components/panel/notifications/NotificationsClient";

export const metadata: Metadata = { title: "Bildirimler" };

export default function NotificationsPage() {
  return <NotificationsClient />;
}
