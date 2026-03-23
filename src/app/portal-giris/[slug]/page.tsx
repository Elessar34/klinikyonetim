import CustomerPortalClient from "@/components/public/CustomerPortalClient";

export const metadata = {
  title: "Müşteri Portalı | Klinik Yönetim",
  description: "Petlerinizi, randevularınızı ve geçmişinizi görüntüleyin",
};

export default function PortalLoginPage() {
  return <CustomerPortalClient />;
}
