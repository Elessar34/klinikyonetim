"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPills, faSpinner, faXmark, faTriangleExclamation,
  faBoxesStacked, faCalendarDays, faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Drug {
  id: string; name: string; sku?: string; category?: string;
  price: number; costPrice?: number; stockQuantity: number;
  minStockLevel: number; unit: string; expiryDate?: string; isActive: boolean;
}

export default function DrugStockClient() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low">("all");
  const [form, setForm] = useState({
    name: "", sku: "", category: "İlaç", price: "", costPrice: "",
    stockQuantity: "", minStockLevel: "5", unit: "adet", expiryDate: "",
  });

  const fetchDrugs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/drugs?search=${search}&filter=${filter}`);
      const d = await res.json();
      setDrugs(d.drugs || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [search, filter]);

  useEffect(() => { fetchDrugs(); }, [fetchDrugs]);

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stockQuantity) return;
    setSaving(true);
    try {
      const res = await fetch("/api/drugs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
          stockQuantity: parseInt(form.stockQuantity),
          minStockLevel: parseInt(form.minStockLevel),
          expiryDate: form.expiryDate || undefined,
        }),
      });
      if (res.ok) {
        setShowForm(false); fetchDrugs();
        setForm({ name: "", sku: "", category: "İlaç", price: "", costPrice: "", stockQuantity: "", minStockLevel: "5", unit: "adet", expiryDate: "" });
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const lowStockCount = drugs.filter((d) => d.stockQuantity <= d.minStockLevel).length;
  const expiringSoon = drugs.filter((d) => {
    if (!d.expiryDate) return false;
    const diff = new Date(d.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const categories = ["İlaç", "Aşı", "Serum", "Sarf Malzeme", "Antiseptik", "Anestezik", "Vitamin", "Antibiyotik", "Ağrı Kesici", "Diğer"];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faPills} className="text-teal-500" /> İlaç & Malzeme Stok
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {drugs.length} ürün</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-md rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Ekle
        </Button>
      </div>

      {/* Alerts */}
      {(lowStockCount > 0 || expiringSoon > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-700">Düşük Stok Uyarısı</p>
                <p className="text-xs text-red-500">{lowStockCount} ürün minimum stok seviyesinin altında</p>
              </div>
            </div>
          )}
          {expiringSoon > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <FontAwesomeIcon icon={faCalendarDays} className="text-amber-500" />
              <div>
                <p className="text-sm font-medium text-amber-700">Son Kullanma Uyarısı</p>
                <p className="text-xs text-amber-500">{expiringSoon} ürünün son kullanma tarihi 30 gün içinde</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <Input placeholder="İlaç adı veya SKU ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {(["all", "low"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-teal-500 text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
              {f === "all" ? "Tümü" : "Düşük Stok"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-teal-500 animate-spin" />
        </div>
      ) : drugs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faBoxesStacked} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz ürün yok</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ürün</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategori</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stok</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Satış ₺</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Maliyet ₺</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">SKT</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drugs.map((drug) => {
                  const isLow = drug.stockQuantity <= drug.minStockLevel;
                  const isExpiring = drug.expiryDate && new Date(drug.expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
                  const isExpired = drug.expiryDate && new Date(drug.expiryDate) < new Date();
                  return (
                    <tr key={drug.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{drug.name}</p>
                        {drug.sku && <p className="text-xs text-muted-foreground">{drug.sku}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px] border-0">{drug.category || "İlaç"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${isLow ? "text-red-500" : "text-foreground"}`}>
                          {drug.stockQuantity}
                        </span>
                        <span className="text-xs text-muted-foreground"> / {drug.minStockLevel} min</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{drug.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{drug.costPrice?.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) || "-"}</td>
                      <td className="px-4 py-3 text-center text-xs">
                        {drug.expiryDate ? (
                          <span className={isExpired ? "text-red-500 font-medium" : isExpiring ? "text-amber-500" : "text-muted-foreground"}>
                            {new Date(drug.expiryDate).toLocaleDateString("tr-TR")}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <Badge variant="secondary" className="text-[10px] border-0 bg-red-100 text-red-700">Düşük</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] border-0 bg-kp-green/10 text-kp-green">Yeterli</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold">Yeni İlaç / Malzeme</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs mb-1.5 block">Ürün Adı *</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl" placeholder="Amoksisilin 500mg" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">SKU / Kod</Label>
                  <Input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className="rounded-xl" placeholder="AMX-500" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Kategori</Label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 border border-border rounded-xl text-sm bg-card">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Satış Fiyatı *</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-xl" placeholder="0.00" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Maliyet</Label>
                  <Input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))} className="rounded-xl" placeholder="0.00" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Birim</Label>
                  <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="w-full h-10 px-3 border border-border rounded-xl text-sm bg-card">
                    <option value="adet">Adet</option>
                    <option value="kutu">Kutu</option>
                    <option value="şişe">Şişe</option>
                    <option value="ampul">Ampul</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block">Stok Miktarı *</Label>
                  <Input type="number" value={form.stockQuantity} onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))} className="rounded-xl" placeholder="0" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Min Stok</Label>
                  <Input type="number" value={form.minStockLevel} onChange={(e) => setForm((f) => ({ ...f, minStockLevel: e.target.value }))} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Son Kul. Tar.</Label>
                  <Input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} className="rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>İptal</Button>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-md rounded-xl min-w-[100px]"
                  onClick={handleSubmit} disabled={saving || !form.name || !form.price || !form.stockQuantity}>
                  {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
