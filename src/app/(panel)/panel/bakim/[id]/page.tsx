import GroomingDetailClient from "@/components/panel/grooming/GroomingDetailClient";

export default async function GroomingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroomingDetailClient groomingId={id} />;
}
