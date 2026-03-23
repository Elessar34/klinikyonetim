import CustomerDetailClient from "@/components/panel/customers/CustomerDetailClient";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerDetailClient customerId={id} />;
}
