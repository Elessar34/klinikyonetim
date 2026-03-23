import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortalClient from "@/components/public/PortalClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await prisma.tenant.findFirst({
    where: { slug, isActive: true },
    select: { name: true, businessType: true },
  });
  return {
    title: tenant ? `${tenant.name} — Müşteri Portalı | Klinik Yönetim` : "Müşteri Portalı | Klinik Yönetim",
    description: tenant ? `${tenant.name} müşteri portalı — bakım geçmişi, randevular ve pet bilgileri` : "Müşteri portalı",
  };
}

export default async function PortalPage({ params }: PageProps) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: { slug, isActive: true },
    select: { id: true, name: true, businessType: true, logoUrl: true, phone: true, email: true, address: true },
  });

  if (!tenant) notFound();

  return <PortalClient tenant={JSON.parse(JSON.stringify(tenant))} />;
}
