"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft, faSpinner, faPlus, faEdit, faTrash, faEye,
  faChevronLeft, faChevronRight, faFilter, faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, unknown>;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
}

const actionIcons: Record<string, typeof faPlus> = { CREATE: faPlus, UPDATE: faEdit, DELETE: faTrash };
const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-600",
  UPDATE: "bg-blue-50 text-blue-600",
  DELETE: "bg-red-50 text-red-600",
};
const actionLabels: Record<string, string> = { CREATE: "Oluşturma", UPDATE: "Güncelleme", DELETE: "Silme" };
const entityLabels: Record<string, string> = {
  Customer: "Müşteri", Pet: "Pet", Appointment: "Randevu", Transaction: "İşlem",
  Service: "Hizmet", Tenant: "İşletme", User: "Kullanıcı", Invoice: "Fatura",
  MedicalRecord: "Hasta Dosyası", Vaccination: "Aşı", GroomingRecord: "Bakım", Product: "Ürün", Prescription: "Reçete",
};

const entityOptions = ["", "Customer", "Pet", "Appointment", "Transaction", "Service", "MedicalRecord", "Vaccination", "GroomingRecord", "Invoice", "Product", "Prescription"];
const actionOptions = ["", "CREATE", "UPDATE", "DELETE"];

export default function ActivityLogClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (entity) params.set("entity", entity);
    if (action) params.set("action", action);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/activity?${params}`);
      const d = await res.json();
      setLogs(d.logs || []);
      setTotalPages(d.pagination?.totalPages || 1);
      setTotal(d.pagination?.total || 0);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [page, entity, action, dateFrom, dateTo, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  };

  const clearFilters = () => {
    setEntity(""); setAction(""); setDateFrom(""); setDateTo(""); setSearch(""); setPage(1);
  };

  const hasFilters = entity || action || dateFrom || dateTo || search;

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faClockRotateLeft} className="text-blue-500" /> Aktivite Logları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} kayıt</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className={`rounded-xl gap-1.5 ${showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            <FontAwesomeIcon icon={faFilter} className="text-xs" /> Filtre
          </Button>
          <a href="/api/export?type=customers" download>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
              <FontAwesomeIcon icon={faDownload} className="text-xs" /> Export
            </Button>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-medium mb-1 block">Varlık</label>
              <select value={entity} onChange={(e) => { setEntity(e.target.value); setPage(1); }}
                className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card">
                <option value="">Tümü</option>
                {entityOptions.filter(Boolean).map((e) => <option key={e} value={e}>{entityLabels[e] || e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-medium mb-1 block">İşlem</label>
              <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }}
                className="w-full h-9 px-3 border border-border rounded-xl text-sm bg-card">
                <option value="">Tümü</option>
                {actionOptions.filter(Boolean).map((a) => <option key={a} value={a}>{actionLabels[a] || a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-medium mb-1 block">Başlangıç</label>
              <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="rounded-xl h-9" />
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-medium mb-1 block">Bitiş</label>
              <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="rounded-xl h-9" />
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-medium mb-1 block">Ara</label>
              <Input placeholder="Entity ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="rounded-xl h-9" />
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-blue-500 hover:underline">Filtreleri Temizle</button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-500 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faClockRotateLeft} className="text-4xl text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">{hasFilters ? "Filtre kriterlerine uygun kayıt bulunamadı" : "Henüz aktivite kaydı yok"}</p>
        </div>
      ) : (
        <>
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-1">
              {logs.map((log) => {
                const icon = actionIcons[log.action] || faEye;
                const color = actionColors[log.action] || "bg-muted text-muted-foreground";
                return (
                  <div key={log.id} className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${color}`}>
                      <FontAwesomeIcon icon={icon} className="text-[10px]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm">
                        <span className="font-medium">{log.user.firstName} {log.user.lastName}</span>
                        {" "}
                        <span className="text-muted-foreground">{actionLabels[log.action] || log.action}</span>
                        {" — "}
                        <Badge variant="secondary" className="text-[10px] border-0">{entityLabels[log.entity] || log.entity}</Badge>
                      </p>
                      {log.details && typeof log.details === "object" && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {Object.entries(log.details as Record<string, unknown>).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 pt-1">{timeAgo(log.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </Button>
              <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
