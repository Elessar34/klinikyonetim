"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faPhone,
  faEnvelope,
  faDog,
  faCalendarDays,
  faEllipsisVertical,
  faEye,
  faPen,
  faTrash,
  faSpinner,
  faUsers,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomerFormModal from "@/components/panel/customers/CustomerFormModal";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneSecondary?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  notes?: string;
  isActive: boolean;
  customerNo?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: string;
  pets: { id: string; name: string; species: string }[];
  _count: { appointments: number; transactions: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CustomersClient() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 20, total: 0, totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(`/api/customers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(), 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu müşteriyi pasife almak istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) fetchCustomers();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Müşteriler</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Toplam {pagination.total} müşteri kayıtlı
          </p>
        </div>
        <Button
          className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2"
          onClick={() => { setEditingCustomer(null); setShowForm(true); }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Yeni Müşteri
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
          />
          <Input
            placeholder="İsim, telefon, email veya müşteri no ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              className={`rounded-xl ${statusFilter === s ? "gradient-primary text-white border-0" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-1.5 text-xs" />
              {s === "all" ? "Tümü" : s === "active" ? "Aktif" : "Pasif"}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-muted-foreground/30 mb-3" />
            <p className="font-medium">Henüz müşteri kaydı yok</p>
            <p className="text-sm mt-1">Yeni müşteri eklemek için butona tıklayın.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Müşteri</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">İletişim</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Petler</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">İstatistik</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Durum</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => router.push(`/panel/musteriler/${customer.id}`)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-kp-green/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-kp-green">
                              {customer.firstName[0]}{customer.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-xs text-muted-foreground">{customer.customerNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} className="text-xs text-muted-foreground w-3" />
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-sm flex items-center gap-2 text-muted-foreground">
                              <FontAwesomeIcon icon={faEnvelope} className="text-xs w-3" />
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {customer.pets.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {customer.pets.slice(0, 3).map((pet) => (
                              <Badge key={pet.id} variant="secondary" className="text-xs border-0 bg-kp-orange/10 text-kp-orange">
                                <FontAwesomeIcon icon={faDog} className="mr-1 text-[10px]" />
                                {pet.name}
                              </Badge>
                            ))}
                            {customer.pets.length > 3 && (
                              <Badge variant="secondary" className="text-xs border-0">
                                +{customer.pets.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-xs text-muted-foreground w-3" />
                            {customer._count.appointments} randevu
                          </p>
                          <p className="text-muted-foreground">
                            {formatCurrency(customer.totalSpent)} toplam
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="secondary"
                          className={`border-0 text-xs ${
                            customer.isActive
                              ? "bg-kp-green/10 text-kp-green"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {customer.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                              <FontAwesomeIcon icon={faEllipsisVertical} className="text-muted-foreground" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => window.location.href = `/panel/musteriler/${customer.id}`}>
                              <FontAwesomeIcon icon={faEye} className="text-xs w-4" />
                              Detay
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => { setEditingCustomer(customer); setShowForm(true); }}>
                              <FontAwesomeIcon icon={faPen} className="text-xs w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" onClick={() => handleDelete(customer.id)}>
                              <FontAwesomeIcon icon={faTrash} className="text-xs w-4" />
                              Pasife Al
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => { setShowForm(false); setEditingCustomer(null); }}
          onSaved={() => { setShowForm(false); setEditingCustomer(null); fetchCustomers(); }}
        />
      )}
    </div>
  );
}
