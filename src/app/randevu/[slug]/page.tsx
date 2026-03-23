import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OnlineBookingClient from "@/components/public/OnlineBookingClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await prisma.tenant.findFirst({
    where: { slug, isActive: true },
    select: { name: true },
  });
  return {
    title: tenant ? `Online Randevu — ${tenant.name} | Klinik Yönetim` : "Online Randevu | Klinik Yönetim",
    description: tenant ? `${tenant.name} online randevu sistemi` : "Online randevu",
  };
}

export default async function OnlineBookingPage({ params }: PageProps) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: { slug, isActive: true },
    select: { id: true, name: true, businessType: true, logoUrl: true, phone: true, address: true },
  });

  if (!tenant) notFound();

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id, isActive: true },
    select: { id: true, name: true, duration: true, price: true, category: true },
    orderBy: { name: "asc" },
  });

  return <OnlineBookingClient tenant={JSON.parse(JSON.stringify(tenant))} services={JSON.parse(JSON.stringify(services))} />;
}
