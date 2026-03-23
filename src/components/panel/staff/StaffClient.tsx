"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserGroup, faSpinner, faPhone, faEnvelope, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StaffFormModal from "@/components/panel/staff/StaffFormModal";

interface Staff {
  id: string; firstName: string; lastName: string; phone?: string; email?: string;
  role: string; salary?: number; startDate?: string; isActive: boolean; specializations: string[];
}

export default function StaffClient() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchStaff = () => {
    setIsLoading(true);
    fetch("/api/staff").then((r) => r.json()).then((d) => setStaff(d.staff)).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const fmt = (n: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">Personel</h1>
          <p className="text-sm text-muted-foreground mt-1">{staff.length} personel kayıtlı</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-md hover:shadow-lg rounded-xl gap-2" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Yeni Personel
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>
      ) : staff.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl text-center py-20 text-muted-foreground">
          <FontAwesomeIcon icon={faUserGroup} className="text-4xl text-muted-foreground/30 mb-3" />
          <p className="font-medium">Henüz personel kaydı yok</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-kp-green/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-kp-green">{s.firstName[0]}{s.lastName[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{s.firstName} {s.lastName}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <FontAwesomeIcon icon={faBriefcase} className="text-[10px] text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{s.role}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={`ml-auto border-0 text-xs ${s.isActive ? "bg-kp-green/10 text-kp-green" : "bg-muted text-muted-foreground"}`}>
                  {s.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div className="space-y-1.5 text-sm">
                {s.phone && <p className="flex items-center gap-2 text-muted-foreground"><FontAwesomeIcon icon={faPhone} className="text-xs w-3.5" /> {s.phone}</p>}
                {s.email && <p className="flex items-center gap-2 text-muted-foreground"><FontAwesomeIcon icon={faEnvelope} className="text-xs w-3.5" /> {s.email}</p>}
                {s.salary && <p className="text-muted-foreground">Maaş: <span className="font-medium text-foreground">{fmt(s.salary)}</span></p>}
              </div>
              {s.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                  {s.specializations.map((sp, i) => <Badge key={i} variant="secondary" className="text-[10px] border-0">{sp}</Badge>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <StaffFormModal onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchStaff(); }} />}
    </div>
  );
}
