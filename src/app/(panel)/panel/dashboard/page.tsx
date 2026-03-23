import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/panel/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const { firstName, tenantName, businessType } = session.user;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  const businessLabel =
    businessType === "VETERINER"
      ? "Veteriner Kliniği"
      : "Pet Kuaför";

  return (
    <DashboardClient
      greeting={greeting}
      firstName={firstName}
      tenantName={tenantName}
      businessLabel={businessLabel}
      businessType={businessType}
    />
  );
}
