import { useMemo } from "react";

type SubdomainInfo = {
  subdomain: string | null;
  businessType: "VETERINER" | "PET_KUAFOR" | null;
  label: string;
  isVet: boolean;
  isPet: boolean;
  isMain: boolean;
};

export function useSubdomain(): SubdomainInfo {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return { subdomain: null, businessType: null, label: "Klinik Yönetim", isVet: false, isPet: false, isMain: true };
    }

    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    let sub: string | null = null;

    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      if (parts.length > 1 && parts[0] !== "www") {
        sub = parts[0];
      }
    } else {
      // Production: subdomain.klinikyonetim.net
      if (parts.length > 2) {
        sub = parts[0] === "www" ? null : parts[0];
      }
    }

    if (sub === "vet") {
      return { subdomain: "vet", businessType: "VETERINER", label: "Veteriner Paneli", isVet: true, isPet: false, isMain: false };
    }
    if (sub === "pet") {
      return { subdomain: "pet", businessType: "PET_KUAFOR", label: "Pet Kuaför Paneli", isVet: false, isPet: true, isMain: false };
    }

    return { subdomain: sub, businessType: null, label: "Klinik Yönetim", isVet: false, isPet: false, isMain: !sub };
  }, []);
}
