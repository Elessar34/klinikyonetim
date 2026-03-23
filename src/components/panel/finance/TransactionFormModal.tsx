"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner, faArrowUp, faArrowDown, faReceipt, faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransactionFormProps {
  businessType: string;
  onClose: () => void;
  onSaved: () => void;
}

const categoriesByBusiness: Record<string, { INCOME: string[]; EXPENSE: string[] }> = {
  VETERINER: {
    INCOME: ["Muayene", "Aşılama", "Ameliyat", "Laboratuvar", "Röntgen/Ultrason", "Diş Tedavisi", "İlaç Satışı", "Mama Satışı", "Aksesuar Satışı", "Tırnak Kesimi", "Acil Müdahale", "Hospitalizasyon", "Diğer Gelir"],
    EXPENSE: ["Kira", "Personel Maaşı", "İlaç Alımı", "Tıbbi Malzeme", "Laboratuvar Malzemesi", "Cihaz Bakımı", "Elektrik/Su/Doğalgaz", "İnternet/Telefon", "Muhasebe", "Sigorta", "Reklam/Pazarlama", "Temizlik", "Kırtasiye", "Diğer Gider"],
  },
  PET_KUAFOR: {
    INCOME: ["Yıkama", "Tıraş", "Tam Bakım", "Tırnak Kesimi", "Kulak Temizliği", "Diş Fırçalama", "Pire/Kene Banyosu", "SPA Bakımı", "Cilt Bakımı", "Parfüm/Kolanya", "Fiyonk/Bandana", "Otel/Pansiyon", "Diğer Gelir"],
    EXPENSE: ["Kira", "Personel Maaşı", "Şampuan/Bakım Ürünü", "Makine/Makas Alımı", "Makine Bakımı", "Havlu/Bezle", "Kurutma Makinesi", "Elektrik/Su/Doğalgaz", "İnternet/Telefon", "Muhasebe", "Sigorta", "Reklam/Pazarlama", "Temizlik Malzemesi", "Diğer Gider"],
  },
};

const paymentMethods = [
  { value: "Nakit", icon: faMoneyBill, label: "Nakit" },
  { value: "Kredi Kartı", icon: faCreditCard, label: "Kredi Kartı" },
  { value: "Banka Transferi", icon: faReceipt, label: "Havale/EFT" },
];

export default function TransactionFormModal({ businessType, onClose, onSaved }: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "INCOME" as "INCOME" | "EXPENSE",
    category: "",
    amount: "",
    description: "",
    paymentMethod: "Nakit",
  });

  const cats = categoriesByBusiness[businessType] || categoriesByBusiness.VETERINER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.category) { setError("Kategori seçiniz"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setError("Geçerli bir tutar giriniz"); return; }
    setIsLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Hata"); return; }
      onSaved();
    } catch { setError("Bağlantı hatası"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)]">Yeni İşlem Kaydı</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm animate-scale-in">{error}</div>}

          {/* Type Toggle */}
          <div>
            <Label className="text-xs mb-2 block">İşlem Tipi</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["INCOME", "EXPENSE"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, type: t, category: "" }))}
                  className={`flex items-center justify-center gap-2.5 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.type === t
                      ? t === "INCOME" ? "bg-kp-green/10 border-kp-green text-kp-green shadow-sm" : "bg-destructive/10 border-destructive text-destructive shadow-sm"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  <FontAwesomeIcon icon={t === "INCOME" ? faArrowUp : faArrowDown} />
                  {t === "INCOME" ? "Gelir" : "Gider"}
                </button>
              ))}
            </div>
          </div>

          {/* Category Grid */}
          <div>
            <Label className="text-xs mb-2 block">Kategori *</Label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
              {cats[form.type].map((c) => (
                <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, category: c }))}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-medium transition-all text-center ${
                    form.category === c
                      ? form.type === "INCOME" ? "bg-kp-green/10 border-kp-green text-kp-green" : "bg-destructive/10 border-destructive text-destructive"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label className="text-xs mb-2 block">Tutar *</Label>
            <div className="relative">
              <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="0.00" className="rounded-xl text-lg font-semibold h-12 pr-10" required />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₺</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-xs mb-2 block">Ödeme Yöntemi</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((m) => (
                <button key={m.value} type="button" onClick={() => setForm((f) => ({ ...f, paymentMethod: m.value }))}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                    form.paymentMethod === m.value ? "bg-blue-50 border-blue-500 text-blue-600" : "border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  <FontAwesomeIcon icon={m.icon} className="text-base" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs mb-2 block">Açıklama</Label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="İşlem hakkında not..." className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-kp-green/20 focus:border-kp-green" />
          </div>

          {/* Preview */}
          {form.category && form.amount && (
            <div className={`p-4 rounded-xl border-2 border-dashed ${form.type === "INCOME" ? "border-kp-green/30 bg-kp-green/5" : "border-destructive/30 bg-destructive/5"}`}>
              <p className="text-xs text-muted-foreground mb-1">Özet</p>
              <p className="font-semibold">
                <span className={form.type === "INCOME" ? "text-kp-green" : "text-destructive"}>
                  {form.type === "INCOME" ? "+" : "-"}{parseFloat(form.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                </span>
                <span className="text-muted-foreground font-normal"> — {form.category}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{form.paymentMethod}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>İptal</Button>
            <Button type="submit" className="gradient-primary text-white border-0 shadow-md rounded-xl min-w-[120px]" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
