import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicPetClient from "@/components/public/PublicPetClient";

interface PageProps {
  params: Promise<{ qrCode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { qrCode } = await params;
  const pet = await prisma.pet.findFirst({
    where: { qrCode },
    select: { name: true, species: true },
  });
  return {
    title: pet ? `${pet.name} — Pet Kimliği | Klinik Yönetim` : "Pet Kimliği | Klinik Yönetim",
    description: pet ? `${pet.name} (${pet.species}) pet bilgileri ve aşı geçmişi` : "Pet kimlik bilgileri",
  };
}

export default async function PublicPetPage({ params }: PageProps) {
  const { qrCode } = await params;

  const pet = await prisma.pet.findFirst({
    where: { qrCode },
    include: {
      customer: { select: { firstName: true, lastName: true, phone: true } },
      vaccinations: {
        orderBy: { administeredDate: "desc" },
        take: 10,
        select: { vaccineName: true, vaccineType: true, administeredDate: true, nextDueDate: true },
      },
    },
  });

  if (!pet) notFound();

  return <PublicPetClient pet={JSON.parse(JSON.stringify(pet))} />;
}
