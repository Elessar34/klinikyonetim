import type { Metadata } from "next";
import CustomersClient from "@/components/panel/customers/CustomersClient";

export const metadata: Metadata = {
  title: "Müşteriler",
};

export default function CustomersPage() {
  return <CustomersClient />;
}
