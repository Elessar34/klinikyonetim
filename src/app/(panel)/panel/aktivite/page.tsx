import type { Metadata } from "next";
import ActivityLogClient from "@/components/panel/activity/ActivityLogClient";

export const metadata: Metadata = { title: "Aktivite Logları" };

export default function ActivityLogPage() {
  return <ActivityLogClient />;
}
