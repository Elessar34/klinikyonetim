import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FinanceClient from "@/components/panel/finance/FinanceClient";

export const metadata: Metadata = { title: "Gelir / Gider" };

export default async function FinancePage() {
  const session = await auth();
  if (!session?.user) redirect("/giris");
  return <FinanceClient businessType={session.user.businessType} />;
}
