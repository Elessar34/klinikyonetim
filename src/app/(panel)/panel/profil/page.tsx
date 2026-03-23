import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/panel/profile/ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profilim" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  return (
    <ProfileClient
      user={{
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        phone: "",
        role: session.user.role || "",
        tenantName: session.user.tenantName || "",
        businessType: session.user.businessType || "",
      }}
    />
  );
}
