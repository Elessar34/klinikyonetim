"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faSpinner, faSave, faKey, faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileProps {
  user: { firstName: string; lastName: string; email: string; phone?: string; role: string; tenantName: string; businessType: string };
}

const roleLabels: Record<string, string> = { OWNER: "İşletme Sahibi", ADMIN: "Yönetici", VET: "Veteriner Hekim", GROOMER: "Kuaför", CASHIER: "Kasiyer", STAFF: "Personel" };

export default function ProfileClient({ user }: ProfileProps) {
  const [form, setForm] = useState({
    firstName: user.firstName, lastName: user.lastName, phone: user.phone || "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* */ }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    setPwMsg("");
    if (passwords.newPassword !== passwords.confirm) { setPwMsg("Şifreler eşleşmiyor"); return; }
    if (passwords.newPassword.length < 6) { setPwMsg("Şifre en az 6 karakter olmalı"); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPassword }),
      });
      if (res.ok) {
        setPwMsg("Şifre değiştirildi ✓");
        setPasswords({ current: "", newPassword: "", confirm: "" });
      } else {
        const d = await res.json();
        setPwMsg(d.error || "Hata");
      }
    } catch { setPwMsg("Bağlantı hatası"); }
    finally { setPwSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-kp-green" /> Profilim
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Hesap bilgilerinizi yönetin</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 pb-5 border-b border-border mb-5">
          <div className="w-20 h-20 rounded-2xl bg-kp-green/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-kp-green">{user.firstName[0]}{user.lastName[0]}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-muted-foreground">{roleLabels[user.role] || user.role} • {user.tenantName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-0.5 mb-5">
          <button onClick={() => setActiveTab("profile")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <FontAwesomeIcon icon={faUser} className="mr-1.5 text-xs" /> Profil
          </button>
          <button onClick={() => setActiveTab("password")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "password" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <FontAwesomeIcon icon={faKey} className="mr-1.5 text-xs" /> Şifre
          </button>
          <button onClick={() => setActiveTab("security")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "security" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-xs" /> Güvenlik
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Ad</Label>
                <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Soyad</Label>
                <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={user.email} disabled className="rounded-xl bg-muted" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefon</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="0500 000 0000" className="rounded-xl" />
            </div>
            <div className="flex justify-end">
              <Button className="gradient-primary text-white border-0 shadow-md rounded-xl gap-2" onClick={handleSave} disabled={saving}>
                {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
                {saved ? "Kaydedildi ✓" : "Kaydet"}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-4 max-w-md">
            {pwMsg && <div className={`px-4 py-3 rounded-xl text-sm ${pwMsg.includes("✓") ? "bg-kp-green/10 text-kp-green" : "bg-destructive/10 text-destructive"}`}>{pwMsg}</div>}
            <div className="space-y-1.5">
              <Label className="text-xs">Mevcut Şifre</Label>
              <Input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yeni Şifre</Label>
              <Input type="password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yeni Şifre Tekrar</Label>
              <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} className="rounded-xl" />
            </div>
            <Button className="gradient-primary text-white border-0 shadow-md rounded-xl gap-2" onClick={handlePasswordChange} disabled={pwSaving}>
              {pwSaving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Şifreyi Değiştir"}
            </Button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm font-medium">Son Giriş</p>
              <p className="text-xs text-muted-foreground mt-1">Bugün, IP: ••••</p>
            </div>
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm font-medium">İki Faktörlü Doğrulama</p>
              <p className="text-xs text-muted-foreground mt-1">Henüz aktif değil</p>
              <Button variant="outline" size="sm" className="rounded-xl mt-2 text-xs">Etkinleştir</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
