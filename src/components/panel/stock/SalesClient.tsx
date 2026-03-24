"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode, faTrash, faCashRegister, faSpinner, faPlus, faMinus,
  faCartShopping, faReceipt, faMoneyBill, faCreditCard, faBuildingColumns,
  faCircleCheck, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  productId: string;
  name: string;
  barcode?: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  stock: number;
}

interface SaleRecord {
  id: string;
  saleNumber: string;
  netAmount: number;
  paymentMethod: string;
  items: { product: { name: string }; quantity: number; totalPrice: number }[];
  user: { firstName: string; lastName: string };
  createdAt: string;
}

export default function SalesClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"NAKIT" | "KART" | "HAVALE">("NAKIT");
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<SaleRecord | null>(null);
  const [recentSales, setRecentSales] = useState<SaleRecord[]>([]);
  const [todaySummary, setTodaySummary] = useState({ total: 0, count: 0 });
  const barcodeRef = useRef<HTMLInputElement>(null);

  const fetchRecentSales = useCallback(async () => {
    try {
      const res = await fetch("/api/sales?limit=10");
      const d = await res.json();
      setRecentSales(d.sales || []);
      setTodaySummary(d.todaySummary || { total: 0, count: 0 });
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchRecentSales(); }, [fetchRecentSales]);

  // Barkod okutunca ürünü sepete ekle
  const handleBarcodeScan = async (barcode: string) => {
    if (!barcode.trim()) return;

    // Sepette zaten varsa miktarını artır
    const existing = cart.find((c) => c.barcode === barcode);
    if (existing) {
      if (existing.quantity >= existing.stock) {
        alert("Stok yetersiz!");
        return;
      }
      setCart(cart.map((c) =>
        c.barcode === barcode ? { ...c, quantity: c.quantity + 1 } : c
      ));
      setBarcodeInput("");
      barcodeRef.current?.focus();
      return;
    }

    try {
      const res = await fetch(`/api/products?barcode=${encodeURIComponent(barcode)}`);
      if (res.ok) {
        const d = await res.json();
        const p = d.product;
        if (p.stockQuantity <= 0) {
          alert("Bu ürünün stoğu tükendi!");
          return;
        }
        setCart([...cart, {
          productId: p.id,
          name: p.name,
          barcode: p.barcode,
          unitPrice: p.price,
          quantity: 1,
          discount: 0,
          stock: p.stockQuantity,
        }]);
      } else {
        alert("Bu barkod ile kayıtlı ürün bulunamadı.");
      }
    } catch (e) { console.error(e); }
    setBarcodeInput("");
    barcodeRef.current?.focus();
  };

  const updateQuantity = (idx: number, delta: number) => {
    setCart(cart.map((c, i) => {
      if (i !== idx) return c;
      const newQty = Math.max(1, Math.min(c.stock, c.quantity + delta));
      return { ...c, quantity: newQty };
    }));
  };

  const removeItem = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((sum, c) => sum + (c.unitPrice * c.quantity - c.discount), 0);
  const total = Math.max(0, subtotal - extraDiscount);

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
            unitPrice: c.unitPrice,
            discount: c.discount,
          })),
          paymentMethod,
          discountAmount: extraDiscount,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        setLastSale(d.sale);
        setCart([]);
        setExtraDiscount(0);
        fetchRecentSales();
      } else {
        const err = await res.json();
        alert(err.error || "Satış işlemi başarısız");
      }
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--kp-text)]">
            <FontAwesomeIcon icon={faCashRegister} className="mr-2 text-[var(--kp-primary)]" />
            Satış Kasa
          </h1>
          <p className="text-sm text-gray-500">Barkod okutarak hızlı satış</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="text-green-600 font-bold text-lg">₺{todaySummary.total.toLocaleString("tr-TR")}</div>
            <div className="text-green-500 text-xs">{todaySummary.count} satış bugün</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Barcode + Cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Scanner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBarcode} className="text-3xl" />
              <div className="flex-1">
                <Label className="text-white font-medium">Barkod Okut / Yaz</Label>
                <Input
                  ref={barcodeRef}
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleBarcodeScan(barcodeInput);
                    }
                  }}
                  placeholder="Barkod okuyucu ile okutun veya barkod numarasını girin..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg h-12 mt-1"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faCartShopping} className="text-[var(--kp-primary)]" />
                Sepet ({cart.length} ürün)
              </h2>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setCart([])}>
                  Sepeti Temizle
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FontAwesomeIcon icon={faBarcode} className="text-4xl mb-3" />
                <p>Barkod okutarak ürün ekleyin</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.barcode}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      ₺{item.unitPrice.toLocaleString("tr-TR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        onClick={() => updateQuantity(idx, -1)}
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        onClick={() => updateQuantity(idx, 1)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-bold text-sm">
                      ₺{(item.unitPrice * item.quantity).toLocaleString("tr-TR")}
                    </div>
                    <button className="text-red-400 hover:text-red-600" onClick={() => removeItem(idx)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Payment */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
            <h3 className="font-semibold text-lg">Ödeme</h3>

            {/* Payment Method */}
            <div>
              <Label className="text-sm">Ödeme Yöntemi</Label>
              <div className="flex gap-2 mt-1">
                {([
                  { key: "NAKIT", icon: faMoneyBill, label: "Nakit" },
                  { key: "KART", icon: faCreditCard, label: "Kart" },
                  { key: "HAVALE", icon: faBuildingColumns, label: "Havale" },
                ] as const).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className={`flex-1 p-3 rounded-lg border text-center text-sm font-medium transition ${
                      paymentMethod === m.key
                        ? "bg-[var(--kp-primary)] text-white border-[var(--kp-primary)] shadow-md"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={m.icon} className="block text-lg mx-auto mb-1" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <Label className="text-sm">Ek İndirim (₺)</Label>
              <Input
                type="number"
                value={extraDiscount || ""}
                onChange={(e) => setExtraDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ara Toplam</span>
                <span>₺{subtotal.toLocaleString("tr-TR")}</span>
              </div>
              {extraDiscount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>İndirim</span>
                  <span>-₺{extraDiscount.toLocaleString("tr-TR")}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Toplam</span>
                <span className="text-[var(--kp-primary)]">₺{total.toLocaleString("tr-TR")}</span>
              </div>
            </div>

            {/* Complete Sale */}
            <Button
              className="w-full h-14 text-lg"
              disabled={cart.length === 0 || processing}
              onClick={handleCompleteSale}
            >
              {processing ? (
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faReceipt} className="mr-2" />
              )}
              Satışı Tamamla
            </Button>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold mb-3 text-sm">Son Satışlar</h3>
            {recentSales.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Henüz satış yok</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentSales.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{s.saleNumber}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(s.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₺{s.netAmount.toLocaleString("tr-TR")}</div>
                      <Badge variant="outline" className="text-xs">{s.paymentMethod === "NAKIT" ? "💵 Nakit" : s.paymentMethod === "KART" ? "💳 Kart" : "🏦 Havale"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Success Modal */}
      {lastSale && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCircleCheck} className="text-3xl text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-2">Satış Tamamlandı!</h2>
            <p className="text-gray-500 mb-4">{lastSale.saleNumber}</p>
            <div className="text-3xl font-bold text-[var(--kp-primary)] mb-6">
              ₺{lastSale.netAmount.toLocaleString("tr-TR")}
            </div>
            <Button onClick={() => { setLastSale(null); barcodeRef.current?.focus(); }} className="w-full">
              <FontAwesomeIcon icon={faXmark} className="mr-2" /> Kapat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
