"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck, faCalendarXmark, faSpinner, faPaw, faCheck, faBan, faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

export default function AppointmentConfirmClient() {
  const params = useParams();
  const id = params.id as string;
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "" : "";

  const [status, setStatus] = useState<"loading" | "pending" | "confirmed" | "canceled" | "error" | "already">("loading");
  const [processing, setProcessing] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState("");

  useEffect(() => {
    // Just check if URL is valid, actual status shown after action
    if (id && token) setStatus("pending");
    else setStatus("error");
  }, [id, token]);

  const handleAction = async (action: "confirm" | "cancel") => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/public/appointment/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus("already");
        setAppointmentStatus(data.status);
      } else if (res.ok) {
        setStatus(action === "confirm" ? "confirmed" : "canceled");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-border p-8 max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-kp-green to-kp-orange flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faPaw} className="text-white text-2xl" />
        </div>

        {status === "loading" && (
          <FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" />
        )}

        {status === "pending" && (
          <>
            <div>
              <h1 className="text-2xl font-bold mb-2">Randevu Onayı</h1>
              <p className="text-sm text-muted-foreground">Randevunuzu onaylamak veya iptal etmek için aşağıdaki butonları kullanın.</p>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 rounded-xl gap-2 bg-kp-green hover:bg-kp-green/90 text-white"
                onClick={() => handleAction("confirm")}
                disabled={processing}
              >
                {processing ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCalendarCheck} />}
                Onayla
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
                onClick={() => handleAction("cancel")}
                disabled={processing}
              >
                {processing ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCalendarXmark} />}
                İptal Et
              </Button>
            </div>
          </>
        )}

        {status === "confirmed" && (
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="text-3xl text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-emerald-600">Randevunuz Onaylandı!</h2>
            <p className="text-sm text-muted-foreground">Randevunuz başarıyla onaylanmıştır. Zamanında gelmenizi bekliyoruz.</p>
          </div>
        )}

        {status === "canceled" && (
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faBan} className="text-3xl text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-red-600">Randevunuz İptal Edildi</h2>
            <p className="text-sm text-muted-foreground">Randevunuz iptal edilmiştir. Yeni bir randevu almak için bizimle iletişime geçin.</p>
          </div>
        )}

        {status === "already" && (
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-3xl text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-amber-600">Randevu Zaten İşlenmiş</h2>
            <p className="text-sm text-muted-foreground">Bu randevu daha önce işlenmiştir. Durumu: <strong>{appointmentStatus}</strong></p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-destructive">Geçersiz Bağlantı</h2>
            <p className="text-sm text-muted-foreground">Bu bağlantı geçersiz veya süresi dolmuş olabilir.</p>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground pt-4 border-t border-border">
          Klinik Yönetim ERP/CRM — Evcil Hayvan İşletme Yönetim Sistemi
        </p>
      </div>
    </div>
  );
}
