"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faBarcode, faSpinner, faXmark, faTriangleExclamation,
  faBoxesStacked, faCalendarDays, faMagnifyingGlass, faPenToSquare,
  faFilter, faArrowDown, faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string; name: string; sku?: string; barcode?: string;
  category?: string; description?: string; price: number;
  costPrice?: number; stockQuantity: number; minStockLevel: number;
  unit: string; expiryDate?: string; isActive: boolean;
  supplier?: { name: string };
}

export default function StockClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "expired">("all");
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcodeResult, setBarcodeResult] = useState<Product | null>(null);
  const [barcodeSearch, setBarcodeSearch] = useState("");

  const [form, setForm] = useState({
    name: "", sku: "", barcode: "", category: "", description: "",
    price: "", costPrice: "", stockQuantity: "", minStockLevel: "5",
    unit: "adet", expiryDate: "",
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      if (filter) params.set("filter", filter);
      const res = await fetch(`/api/products?${params}`);
      const d = await res.json();
      setProducts(d.products || []);
      setCategories(d.categories || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [search, categoryFilter, filter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Barcode scan — input'a odaklanıp barkod okuyucu ile okutma
  const handleBarcodeScan = async (barcode: string) => {
    if (!barcode) return;
    try {
      const res = await fetch(`/api/products?barcode=${encodeURIComponent(barcode)}`);
      if (res.ok) {
        const d = await res.json();
        setBarcodeResult(d.product);
      } else {
        setBarcodeResult(null);
        alert("Bu barkod ile kayıtlı ürün bulunamadı.");
      }
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
        stockQuantity: parseInt(form.stockQuantity || "0"),
        minStockLevel: parseInt(form.minStockLevel || "5"),
        expiryDate: form.expiryDate || undefined,
      };

      const res = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchProducts();
        resetForm();
      } else {
        const err = await res.json();
        alert(err.error || "Bir hata oluştu");
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const resetForm = () => {
    setForm({
      name: "", sku: "", barcode: "", category: "", description: "",
      price: "", costPrice: "", stockQuantity: "", minStockLevel: "5",
      unit: "adet", expiryDate: "",
    });
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name, sku: p.sku || "", barcode: p.barcode || "",
      category: p.category || "", description: p.description || "",
      price: String(p.price), costPrice: p.costPrice ? String(p.costPrice) : "",
      stockQuantity: String(p.stockQuantity), minStockLevel: String(p.minStockLevel),
      unit: p.unit, expiryDate: p.expiryDate ? p.expiryDate.split("T")[0] : "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;
  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const diff = new Date(p.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  const commonCategories = ["İlaç", "Mama", "Aksesuar", "Şampuan", "Vitamin", "Bakım Ürünü", "Sarf Malzeme", "Diğer"];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--kp-text)]">
            <FontAwesomeIcon icon={faBoxesStacked} className="mr-2 text-[var(--kp-primary)]" />
            Stok Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ürün ve malzeme stok takibi</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Yeni Ürün Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Toplam Ürün</div>
          <div className="text-2xl font-bold text-[var(--kp-primary)]">{products.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-sm text-gray-500">Toplam Stok Değeri</div>
          <div className="text-2xl font-bold text-blue-600">₺{totalValue.toLocaleString("tr-TR")}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 cursor-pointer" onClick={() => setFilter("low")}>
          <div className="text-sm text-gray-500">Düşük Stok</div>
          <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 cursor-pointer" onClick={() => setFilter("expired")}>
          <div className="text-sm text-gray-500">SKT Yaklaşan</div>
          <div className="text-2xl font-bold text-orange-600">{expiringSoon}</div>
        </div>
      </div>

      {/* Barcode Scanner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faBarcode} className="text-2xl" />
          <div className="flex-1">
            <Label className="text-white text-sm font-medium">Barkod ile Ürün Ara</Label>
            <div className="flex gap-2 mt-1">
              <Input
                ref={barcodeRef}
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && barcodeSearch) {
                    handleBarcodeScan(barcodeSearch);
                    setBarcodeSearch("");
                  }
                }}
                placeholder="Barkod okutun veya yazın..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                autoFocus
              />
              <Button
                variant="secondary"
                onClick={() => { handleBarcodeScan(barcodeSearch); setBarcodeSearch(""); }}
              >
                Ara
              </Button>
            </div>
          </div>
        </div>
        {barcodeResult && (
          <div className="mt-3 bg-white/10 rounded-lg p-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{barcodeResult.name}</div>
              <div className="text-sm opacity-80">
                Barkod: {barcodeResult.barcode} | Stok: {barcodeResult.stockQuantity} {barcodeResult.unit} | Fiyat: ₺{barcodeResult.price}
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => startEdit(barcodeResult)}>
              <FontAwesomeIcon icon={faPenToSquare} className="mr-1" /> Düzenle
            </Button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Ürün adı, SKU veya barkod ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="flex gap-1">
          {(["all", "low", "expired"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              <FontAwesomeIcon icon={f === "low" ? faTriangleExclamation : f === "expired" ? faCalendarDays : faFilter} className="mr-1" />
              {f === "all" ? "Tüm" : f === "low" ? "Düşük" : "SKT"}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="text-3xl text-[var(--kp-primary)] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FontAwesomeIcon icon={faBoxesStacked} className="text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Henüz ürün eklenmemiş</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ürün</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Barkod</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Fiyat</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Stok</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">SKT</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => {
                  const isLow = p.stockQuantity <= p.minStockLevel;
                  const isExpiring = p.expiryDate && (new Date(p.expiryDate).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        {p.sku && <div className="text-xs text-gray-400">SKU: {p.sku}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.barcode || "—"}</td>
                      <td className="px-4 py-3">
                        {p.category && <Badge variant="outline">{p.category}</Badge>}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">₺{p.price.toLocaleString("tr-TR")}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-bold ${isLow ? "text-red-600" : "text-green-600"}`}>
                            {p.stockQuantity}
                          </span>
                          <span className="text-gray-400 text-xs">{p.unit}</span>
                          {isLow && (
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-xs" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {p.expiryDate ? (
                          <span className={isExpiring ? "text-orange-600 font-medium" : "text-gray-500"}>
                            {new Date(p.expiryDate).toLocaleDateString("tr-TR")}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }}>
                <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Ürün Adı *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ürün adı" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Barkod</Label>
                  <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="Barkod no" />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Stok kodu" />
                </div>
              </div>

              <div>
                <Label>Kategori</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Kategori seçin</option>
                  {commonCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Satış Fiyatı (₺) *</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Alış Fiyatı (₺)</Label>
                  <Input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Stok Miktarı</Label>
                  <Input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
                </div>
                <div>
                  <Label>Min. Stok</Label>
                  <Input type="number" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })} />
                </div>
                <div>
                  <Label>Birim</Label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="adet">Adet</option>
                    <option value="kg">Kg</option>
                    <option value="litre">Litre</option>
                    <option value="kutu">Kutu</option>
                    <option value="paket">Paket</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Son Kullanma Tarihi</Label>
                <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>

              <div>
                <Label>Açıklama</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm h-20 resize-none"
                  placeholder="Ürün açıklaması..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={saving} className="flex-1">
                  {saving && <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />}
                  {editingId ? "Güncelle" : "Ekle"}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
