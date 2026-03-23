import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelTopbar from "@/components/panel/PanelTopbar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris");
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <PanelSidebar user={session.user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
