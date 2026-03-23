"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMagnifyingGlass,
  faRightFromBracket,
  faGear,
  faUser,
  faPaw,
  faCalendarDays,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    tenantName: string;
    businessType: string;
  };
}

interface SearchResult {
  type: "customer" | "pet" | "appointment";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Süper Admin",
  OWNER: "İşletme Sahibi",
  ADMIN: "Admin",
  MANAGER: "Müdür",
  STAFF: "Personel",
  RECEPTIONIST: "Resepsiyonist",
};

const businessTypeLabels: Record<string, string> = {
  VETERINER: "Veteriner Kliniği",
  PET_KUAFOR: "Pet Kuaför",
};

const businessTypeColors: Record<string, string> = {
  VETERINER: "bg-kp-green/10 text-kp-green",
  PET_KUAFOR: "bg-kp-coral/10 text-kp-coral",
};

const typeIcons = { customer: faUser, pet: faPaw, appointment: faCalendarDays };
const typeColors = { customer: "text-blue-500", pet: "text-kp-orange", appointment: "text-kp-green" };
const typeLabels = { customer: "Müşteri", pet: "Pet", appointment: "Randevu" };

export default function PanelTopbar({ user }: TopbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (href: string) => {
    setShowResults(false);
    setQuery("");
    router.push(href);
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Left: Search */}
      <div className="flex items-center gap-3 flex-1">
        <div ref={searchRef} className="relative w-80">
          <FontAwesomeIcon
            icon={isSearching ? faSpinner : faMagnifyingGlass}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs ${isSearching ? "animate-spin" : ""}`}
          />
          <Input
            type="search"
            placeholder="Müşteri, pet veya randevu ara..."
            className="pl-9 h-10 rounded-xl bg-muted/50 border-0 focus:bg-white focus:border-border text-sm"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onKeyDown={(e) => { if (e.key === "Escape") { setShowResults(false); setQuery(""); } }}
          />

          {/* Search Results Dropdown */}
          {showResults && query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              {results.length === 0 && !isSearching ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sonuç bulunamadı</p>
              ) : (
                results.map((r) => (
                  <button key={`${r.type}-${r.id}`} onClick={() => handleSelect(r.href)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl">
                    <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0`}>
                      <FontAwesomeIcon icon={typeIcons[r.type]} className={`text-xs ${typeColors[r.type]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{r.subtitle}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] border-0 shrink-0">{typeLabels[r.type]}</Badge>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Business Type Badge */}
        <Badge
          variant="secondary"
          className={`hidden sm:inline-flex border-0 text-xs ${
            businessTypeColors[user.businessType] || "bg-muted text-muted-foreground"
          }`}
        >
          {businessTypeLabels[user.businessType] || user.businessType}
        </Badge>

        {/* Notifications */}
        <button
          className="relative w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Bildirimler"
          onClick={() => router.push("/panel/bildirimler")}
        >
          <FontAwesomeIcon icon={faBell} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-kp-coral" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-kp-green/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-kp-green">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {roleLabels[user.role] || user.role}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.tenantName}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push("/panel/profil")}>
              <FontAwesomeIcon icon={faUser} className="text-xs text-muted-foreground w-4" />
              Profilim
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push("/panel/ayarlar")}>
              <FontAwesomeIcon icon={faGear} className="text-xs text-muted-foreground w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xs w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

