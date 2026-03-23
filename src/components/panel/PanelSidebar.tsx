"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faHouse,
  faUsers,
  faDog,
  faCalendarDays,
  faMoneyBillTrendUp,
  faUserGroup,
  faStethoscope,
  faSyringe,
  faPrescription,
  faFlask,
  faPills,
  faScissors,
  faImages,
  faRoute,
  faBell,
  faChartLine,
  faGear,
  faClockRotateLeft,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    tenantName: string;
    businessType: string;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof faHouse;
  businessTypes?: string[];
  category?: string;
  allowedRoles?: string[]; // if set, only these roles see this item
}

const navItems: NavItem[] = [
  // Ortak
  { href: "/panel/dashboard", label: "Dashboard", icon: faHouse },
  { href: "/panel/musteriler", label: "Müşteriler", icon: faUsers },
  { href: "/panel/petler", label: "Petler", icon: faDog },
  { href: "/panel/randevular", label: "Randevular", icon: faCalendarDays },
  { href: "/panel/muhasebe", label: "Gelir / Gider", icon: faMoneyBillTrendUp, allowedRoles: ["ADMIN", "OWNER", "VET"] },
  { href: "/panel/personel", label: "Personel", icon: faUserGroup, allowedRoles: ["ADMIN", "OWNER"] },

  // Veteriner
  { href: "/panel/hasta-dosyasi", label: "Hasta Dosyası", icon: faStethoscope, businessTypes: ["VETERINER"], category: "Veteriner" },
  { href: "/panel/asilar", label: "Aşı Takibi", icon: faSyringe, businessTypes: ["VETERINER"], category: "Veteriner" },
  { href: "/panel/receteler", label: "Reçeteler", icon: faPrescription, businessTypes: ["VETERINER"], category: "Veteriner" },
  { href: "/panel/laboratuvar", label: "Laboratuvar", icon: faFlask, businessTypes: ["VETERINER"], category: "Veteriner" },
  { href: "/panel/ilac-stok", label: "İlaç & Stok", icon: faPills, businessTypes: ["VETERINER"], category: "Veteriner" },



  // Hizmetler (tüm iş tipleri)
  { href: "/panel/hizmetler", label: "Hizmetler", icon: faGear, category: "Yönetim" },

  // Pet Kuaför
  { href: "/panel/bakim", label: "Bakım Kayıtları", icon: faScissors, businessTypes: ["PET_KUAFOR"], category: "Pet Kuaför" },
  { href: "/panel/galeri", label: "Fotoğraf Galeri", icon: faImages, businessTypes: ["PET_KUAFOR"], category: "Pet Kuaför" },
  { href: "/panel/takvim", label: "Kuaför Takvimi", icon: faCalendarDays, businessTypes: ["PET_KUAFOR"], category: "Pet Kuaför" },
  { href: "/panel/rota", label: "Mobil Rota", icon: faRoute, businessTypes: ["PET_KUAFOR"], category: "Pet Kuaför" },

  // Yönetim
  { href: "/panel/raporlar", label: "Raporlar", icon: faChartLine, category: "Yönetim", allowedRoles: ["ADMIN", "OWNER"] },
  { href: "/panel/aktivite", label: "Aktivite Log", icon: faClockRotateLeft, category: "Yönetim", allowedRoles: ["ADMIN", "OWNER"] },

  // Sistem
  { href: "/panel/bildirimler", label: "Bildirimler", icon: faBell, category: "Sistem" },
  { href: "/panel/ayarlar", label: "Ayarlar", icon: faGear, category: "Sistem", allowedRoles: ["ADMIN", "OWNER"] },
];

export default function PanelSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(
    (item) => {
      if (item.businessTypes && !item.businessTypes.includes(user.businessType)) return false;
      if (item.allowedRoles && !item.allowedRoles.includes(user.role)) return false;
      return true;
    }
  );

  const grouped = filteredItems.reduce((acc, item) => {
    const category = item.category || "Genel";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-64"
      } bg-white border-r border-border flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link href="/panel/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm shrink-0">
            <FontAwesomeIcon icon={faPaw} className="text-white text-sm" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold font-[family-name:var(--font-heading)] gradient-text">
              Klinik Yönetim
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
          aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-xs" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {category}
              </p>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-kp-green/10 text-kp-green shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`w-4 text-sm ${isActive ? "text-kp-green" : ""}`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-border p-3">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-kp-green/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-kp-green">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.tenantName}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
