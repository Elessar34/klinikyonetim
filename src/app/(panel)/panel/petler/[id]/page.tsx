import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PetDetailClient from "@/components/panel/pets/PetDetailClient";

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/giris");
  const { id } = await params;
  return <PetDetailClient petId={id} businessType={session.user.businessType} />;
}
