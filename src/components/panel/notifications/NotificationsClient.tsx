"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, faCalendarDays, faScissors, faSyringe, faMoneyBill, faPaw, faSpinner,
  faCheck, faCircle, faStar, faExclamationTriangle, faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string; type: string; channel: string; title: string; message: string;
  isRead: boolean; createdAt: string; metadata?: Record<string, unknown>;
  customer?: { id: string; firstName: string; lastName: string } | null;
}

const typeConfig: Record<string, { icon: typeof faBell; color: string; bg: string }> = {
  appointment_reminder: { icon: faCalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
  appointment_confirmation: { icon: faCalendarDays, color: "text-emerald-600", bg: "bg-emerald-50" },
  appointment_canceled: { icon: faCalendarDays, color: "text-destructive", bg: "bg-destructive/10" },
  grooming_due: { icon: faScissors, color: "text-rose-500", bg: "bg-rose-50" },
  vaccination_due: { icon: faSyringe, color: "text-amber-600", bg: "bg-amber-50" },
  stock_low: { icon: faBoxOpen, color: "text-orange-600", bg: "bg-orange-50" },
  payment: { icon: faMoneyBill, color: "text-emerald-600", bg: "bg-emerald-50" },
  pet: { icon: faPaw, color: "text-kp-orange", bg: "bg-kp-orange/10" },
  survey: { icon: faStar, color: "text-yellow-500", bg: "bg-yellow-50" },
  system: { icon: faExclamationTriangle, color: "text-muted-foreground", bg: "bg-muted" },
};

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?filter=${filter}&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setTotal(data.total);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const timeAgo = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (diff < 60) return "Az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} className="text-amber-500" /> Bildirimler
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-white border-0 text-xs">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Toplam {total} bildirim</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-xl p-0.5">
            <button onClick={() => { setFilter("all"); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Tümü</button>
            <button onClick={() => { setFilter("unread"); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "unread" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Okunmamış</button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={markAllRead}>
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> Tümünü Oku
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faBell} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">{filter === "unread" ? "Okunmamış bildirim yok" : "Henüz bildirim yok"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const conf = typeConfig[n.type] || { icon: faBell, color: "text-muted-foreground", bg: "bg-muted" };
            return (
              <div key={n.id} onClick={() => { if (!n.isRead) markRead(n.id); }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  !n.isRead ? "bg-card border-kp-green/20 shadow-sm hover:shadow-md cursor-pointer" : "border-border hover:bg-muted/50"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${conf.bg}`}>
                  <FontAwesomeIcon icon={conf.icon} className={`${conf.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                    {!n.isRead && <FontAwesomeIcon icon={faCircle} className="text-[6px] text-kp-green" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                    {n.customer && <Badge variant="secondary" className="text-[10px] border-0 bg-muted">{n.customer.firstName} {n.customer.lastName}</Badge>}
                    <Badge variant="secondary" className="text-[9px] border-0 bg-muted capitalize">{n.channel}</Badge>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
