"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear, faPaw, faStore, faUserShield, faBell, faPalette, faSpinner, faSave,
  faGlobe, faCopy, faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Tenant {
  name: string; slug?: string; businessType: string; phone?: string; email?: string;
  address?: string; city?: string; district?: string;
  logo?: string; website?: string; taxId?: string;
}

const businessTypeLabels: Record<string, string> = {
  VETERINER: "Veteriner Kliniği", PET_KUAFOR: "Pet Kuaför",
};

export default function SettingsClient() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [portalCopied, setPortalCopied] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setTenant(d))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const updateField = (field: string, value: string) => {
    setTenant((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenant),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const tabs = [
    { key: "general", label: "Genel", icon: faStore },
    { key: "notifications", label: "Bildirimler", icon: faBell },
    { key: "portal", label: "Müşteri Portalı", icon: faGlobe },
    { key: "appearance", label: "Görünüm", icon: faPalette },
    { key: "security", label: "Güvenlik", icon: faUserShield },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><FontAwesomeIcon icon={faSpinner} className="text-2xl text-kp-green animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] flex items-center gap-2">
            <FontAwesomeIcon icon={faGear} className="text-muted-foreground" /> Ayarlar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">İşletme ayarlarını yönetin</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-md rounded-xl gap-2" onClick={handleSave} disabled={saving}>
          {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
          {saved ? "Kaydedildi ✓" : "Kaydet"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            <FontAwesomeIcon icon={tab.icon} className="text-xs" /> {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && tenant && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <FontAwesomeIcon icon={faPaw} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{tenant.name}</h2>
              <p className="text-sm text-muted-foreground">{businessTypeLabels[tenant.businessType] || tenant.businessType}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">İşletme Adı</Label>
              <Input value={tenant.name || ""} onChange={(e) => updateField("name", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefon</Label>
              <Input value={tenant.phone || ""} onChange={(e) => updateField("phone", e.target.value)} placeholder="0500 000 0000" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={tenant.email || ""} onChange={(e) => updateField("email", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Web Sitesi</Label>
              <Input value={tenant.website || ""} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" className="rounded-xl" />
            </div>
            <div className="col-span-full space-y-1.5">
              <Label className="text-xs">Adres</Label>
              <Input value={tenant.address || ""} onChange={(e) => updateField("address", e.target.value)} placeholder="Tam adres" className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">İl</Label>
              <Input value={tenant.city || ""} onChange={(e) => updateField("city", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">İlçe</Label>
              <Input value={tenant.district || ""} onChange={(e) => updateField("district", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Vergi No</Label>
              <Input value={tenant.taxId || ""} onChange={(e) => updateField("taxId", e.target.value)} className="rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold mb-2">Bildirim Tercihleri</h3>
          {[
            { key: "appointmentReminder", label: "Randevu hatırlatma", desc: "Randevudan 1 gün önce otomatik hatırlatma" },
            { key: "groomingReminder", label: "Bakım hatırlatma", desc: "Bakım günü yaklaşınca otomatik WhatsApp mesajı" },
            { key: "vaccinationReminder", label: "Aşı hatırlatma", desc: "Aşı zamanı gelince bildirim" },
            { key: "paymentReminder", label: "Ödeme hatırlatma", desc: "Bekleyen ödemeler için hatırlatma" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-kp-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Portal */}
      {activeTab === "portal" && tenant && (
        <div className="space-y-4">
          {/* Portal Link */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGlobe} className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-teal-800">Müşteri Portalı</h3>
                <p className="text-xs text-teal-600">Müşterileriniz bu link üzerinden giriş yapabilir</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-teal-200">
              <code className="flex-1 text-sm text-teal-700 font-mono truncate">
                {typeof window !== "undefined" ? `${window.location.origin}/portal-giris/${tenant.slug || "slug"}` : `/portal-giris/${tenant.slug || "slug"}`}
              </code>
              <button onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/portal-giris/${tenant.slug}`);
                  setPortalCopied(true); setTimeout(() => setPortalCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs hover:bg-teal-600 transition-colors flex items-center gap-1.5 shrink-0">
                <FontAwesomeIcon icon={portalCopied ? faCheck : faCopy} />
                {portalCopied ? "Kopyalandı!" : "Kopyala"}
              </button>
            </div>
          </div>

          {/* Usage Guide */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Nasıl Kullanılır?</h3>
            <div className="space-y-3">
              {[
                { step: "1", title: "Müşteri Detayına Gidin", desc: "Panel → Müşteriler → Müşteri seçin" },
                { step: "2", title: "Portal Şifresi Belirleyin", desc: "'Portal Erişimi' bölümünden şifre girin ve 'Portal Aç' butonuna tıklayın" },
                { step: "3", title: "Bilgileri Paylaşın", desc: "Müşteriye portal linkini ve Müşteri No + şifresini bildirin" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 font-bold text-sm flex items-center justify-center shrink-0">{item.step}</div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-xs text-blue-600">💡 Müşteriler, portal üzerinden petlerini, randevularını ve geçmişlerini görüntüleyebilir. Şifreyi her müşteri için ayrı belirlersiniz.</p>
          </div>
        </div>
      )}

      {/* Appearance */}
      {activeTab === "appearance" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold mb-2">Görünüm Ayarları</h3>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-sm font-medium">Renk Teması</p>
            <div className="flex gap-3 mt-3">
              {["#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b"].map((color) => (
                <button key={color} className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-foreground transition-all" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-sm font-medium">Logo</p>
            <p className="text-xs text-muted-foreground mt-1">Logo yükleyerek faturalar ve raporlarda görüntüleyin.</p>
            <Button variant="outline" size="sm" className="rounded-xl mt-3 text-xs">Logo Yükle</Button>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold mb-2">Güvenlik Ayarları</h3>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-sm font-medium">İki Faktörlü Doğrulama</p>
            <p className="text-xs text-muted-foreground mt-1">Hesap güvenliğinizi artırmak için 2FA etkinleştirin.</p>
            <Button variant="outline" size="sm" className="rounded-xl mt-3 text-xs">Etkinleştir</Button>
          </div>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-sm font-medium">Oturum Geçmişi</p>
            <p className="text-xs text-muted-foreground mt-1">Son 30 güne ait oturum açma kayıtları.</p>
            <Button variant="outline" size="sm" className="rounded-xl mt-3 text-xs">Geçmişi Görüntüle</Button>
          </div>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-sm font-medium">API Anahtarları</p>
            <p className="text-xs text-muted-foreground mt-1">Entegrasyonlar için API anahtarlarınızı yönetin.</p>
            <Button variant="outline" size="sm" className="rounded-xl mt-3 text-xs">Anahtarları Yönet</Button>
          </div>
        </div>
      )}
    </div>
  );
}
