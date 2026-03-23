"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faArrowUp, faArrowDown, faWallet, faSpinner, faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TransactionFormModal from "@/components/panel/finance/TransactionFormModal";

interface Transaction {
  id: string; type: string; category: string; amount: number; description?: string;
  paymentMethod?: string; paymentStatus: string;
  customer?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export default function FinanceClient({ businessType }: { businessType: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0 });
  const [typeFilter, setTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ ...(typeFilter && { type: typeFilter }) });
      const res = await fetch(`/api/transactions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setSummary(data.summary);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, [typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Gelir / Gider</h1>
          <p className="text-sm text-muted-foreground mt-1">Finansal durumunuz</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni İşlem
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-kp-green/10 flex items-center justify-center"><FontAwesomeIcon icon={faArrowUp} className="text-kp-green" /></div>
            <span className="text-sm text-muted-foreground">Toplam Gelir</span>
          </div>
          <p className="text-2xl font-bold text-kp-green">{fmt(summary.income)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><FontAwesomeIcon icon={faArrowDown} className="text-destructive" /></div>
            <span className="text-sm text-muted-foreground">Toplam Gider</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{fmt(summary.expense)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><FontAwesomeIcon icon={faWallet} className="text-blue-600" /></div>
            <span className="text-sm text-muted-foreground">Net Kar</span>
          </div>
          <p className={`text-2xl font-bold ${summary.profit >= 0 ? "text-kp-green" : "text-destructive"}`}>{fmt(summary.profit)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {([["", "Tümü"], ["INCOME", "Gelir"], ["EXPENSE", "Gider"]] as const).map(([val, label]) => (
          <Button key={val} variant={typeFilter === val ? "default" : "outline"} size="sm" className={`rounded-xl ${typeFilter === val ? "gradient-primary text-white border-0" : ""}`} onClick={() => setTypeFilter(val)}>{label}</Button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-4xl text-muted-foreground/30 mb-3" />
            <p className="font-medium">Henüz işlem yok</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">İşlem</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Kategori</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tutar</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Tarih</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4"><div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === "INCOME" ? "bg-kp-green/10" : "bg-destructive/10"}`}>
                        <FontAwesomeIcon icon={t.type === "INCOME" ? faArrowUp : faArrowDown} className={`text-xs ${t.type === "INCOME" ? "text-kp-green" : "text-destructive"}`} />
                      </div>
                      <div><p className="text-sm font-medium">{t.description || t.category}</p>{t.paymentMethod && <p className="text-xs text-muted-foreground">{t.paymentMethod}</p>}</div>
                    </div></td>
                    <td className="px-5 py-4 hidden md:table-cell"><Badge variant="secondary" className="text-xs border-0">{t.category}</Badge></td>
                    <td className="px-5 py-4 text-right"><span className={`font-semibold ${t.type === "INCOME" ? "text-kp-green" : "text-destructive"}`}>{t.type === "INCOME" ? "+" : "-"}{fmt(t.amount)}</span></td>
                    <td className="px-5 py-4 text-right text-sm text-muted-foreground hidden md:table-cell">{new Date(t.createdAt).toLocaleDateString("tr-TR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <TransactionFormModal businessType={businessType} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchData(); }} />}
    </div>
  );
}
