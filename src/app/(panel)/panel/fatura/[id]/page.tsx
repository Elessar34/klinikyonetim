"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface InvoiceDetail {
  id: string; invoiceNo: string; issueDate: string; dueDate?: string;
  totalAmount: number; taxAmount: number; status: string;
  customer: { firstName: string; lastName: string; phone: string; email?: string; address?: string; city?: string; district?: string; customerNo: string };
  tenant: { name: string; phone?: string; email?: string; address?: string; city?: string; taxNumber?: string };
  items: { id: string; description: string; quantity: number; unitPrice: number; totalPrice: number; taxRate: number }[];
}

const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

export default function InvoicePrintPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then((r) => r.json())
      .then(setInvoice)
      .catch(console.error);
  }, [params.id]);

  if (!invoice) return <div className="flex items-center justify-center min-h-screen"><p>Yükleniyor...</p></div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen">
      {/* Print button — hidden on print */}
      <div className="print:hidden mb-6 flex gap-3">
        <button onClick={() => window.print()} className="px-4 py-2 bg-kp-green text-white rounded-xl text-sm font-medium hover:bg-kp-green/90">
          🖨️ Yazdır / PDF
        </button>
        <button onClick={() => window.history.back()} className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          ← Geri
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{invoice.tenant.name}</h1>
          {invoice.tenant.address && <p className="text-sm text-gray-600 mt-1">{invoice.tenant.address}{invoice.tenant.city ? `, ${invoice.tenant.city}` : ""}</p>}
          {invoice.tenant.phone && <p className="text-sm text-gray-600">Tel: {invoice.tenant.phone}</p>}
          {invoice.tenant.email && <p className="text-sm text-gray-600">{invoice.tenant.email}</p>}
          {invoice.tenant.taxNumber && <p className="text-sm text-gray-600">VKN: {invoice.tenant.taxNumber}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">FATURA</h2>
          <p className="text-sm text-gray-600 mt-1">No: <span className="font-semibold">{invoice.invoiceNo}</span></p>
          <p className="text-sm text-gray-600">Tarih: {new Date(invoice.issueDate).toLocaleDateString("tr-TR")}</p>
          {invoice.dueDate && <p className="text-sm text-gray-600">Vade: {new Date(invoice.dueDate).toLocaleDateString("tr-TR")}</p>}
          <p className="text-sm mt-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              invoice.status === "paid" ? "bg-green-100 text-green-700" :
              invoice.status === "sent" ? "bg-blue-100 text-blue-700" :
              invoice.status === "canceled" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {invoice.status === "paid" ? "Ödendi" : invoice.status === "sent" ? "Gönderildi" : invoice.status === "canceled" ? "İptal" : "Taslak"}
            </span>
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-6 mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Müşteri Bilgileri</h3>
        <p className="text-sm font-semibold text-gray-800">{invoice.customer.firstName} {invoice.customer.lastName}</p>
        <p className="text-sm text-gray-600">Müşteri No: {invoice.customer.customerNo}</p>
        {invoice.customer.phone && <p className="text-sm text-gray-600">Tel: {invoice.customer.phone}</p>}
        {invoice.customer.email && <p className="text-sm text-gray-600">{invoice.customer.email}</p>}
        {invoice.customer.address && <p className="text-sm text-gray-600">{invoice.customer.address}{invoice.customer.district ? `, ${invoice.customer.district}` : ""}{invoice.customer.city ? ` / ${invoice.customer.city}` : ""}</p>}
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">#</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Açıklama</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Miktar</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Birim Fiyat</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">KDV %</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Toplam</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3 px-4 text-sm text-gray-500">{i + 1}</td>
              <td className="py-3 px-4 text-sm font-medium text-gray-800">{item.description}</td>
              <td className="py-3 px-4 text-sm text-center text-gray-600">{item.quantity}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">{fmt(item.unitPrice)}</td>
              <td className="py-3 px-4 text-sm text-right text-gray-600">%{item.taxRate}</td>
              <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">{fmt(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ara Toplam:</span>
            <span className="font-medium">{fmt(invoice.totalAmount)}</span>
          </div>
          {invoice.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">KDV:</span>
              <span className="font-medium">{fmt(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t-2 border-gray-800 pt-2">
            <span>Genel Toplam:</span>
            <span className="text-kp-green">{fmt(invoice.totalAmount + invoice.taxAmount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-400">
        <p>{invoice.tenant.name} — Bu belge bilgisayar ortamında oluşturulmuştur.</p>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
