import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "klinikyonetim.net";

// Known subdomains (not tenant portals)
const SYSTEM_SUBDOMAINS = ["vet", "pet", "www", "api", "admin"];

// Security headers
const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function getSubdomain(hostname: string): string | null {
  // Localhost dev: vet.localhost, pet.localhost
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "www") {
      // vet.localhost:3000 → "vet"
      return parts[0];
    }
    return null;
  }

  // Production: vet.klinikyonetim.net → "vet"
  const rootDomainParts = ROOT_DOMAIN.split(".");
  const hostParts = hostname.split(".");

  if (hostParts.length > rootDomainParts.length) {
    const sub = hostParts.slice(0, hostParts.length - rootDomainParts.length).join(".");
    return sub === "www" ? null : sub;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);

  // Apply security headers
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Set subdomain info as headers for downstream use
  if (subdomain) {
    response.headers.set("x-subdomain", subdomain);
  }

  // ============ SUBDOMAIN ROUTING ============

  // 1. VET subdomain → Veteriner panel
  if (subdomain === "vet") {
    response.headers.set("x-business-type", "VETERINER");
    response.headers.set("x-subdomain-label", "Veteriner");

    // Block landing page on subdomain (redirect to /giris)
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  // 2. PET subdomain → Pet Kuaför panel
  else if (subdomain === "pet") {
    response.headers.set("x-business-type", "PET_KUAFOR");
    response.headers.set("x-subdomain-label", "Pet Kuaför");

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  // 3. Tenant portal subdomain (not vet/pet/system)
  else if (subdomain && !SYSTEM_SUBDOMAINS.includes(subdomain)) {
    // Rewrite to /portal/[slug] internally
    if (pathname === "/" || pathname === "/portal") {
      const portalUrl = new URL(`/portal/${subdomain}`, request.url);
      return NextResponse.rewrite(portalUrl);
    }
    if (pathname === "/giris" || pathname === "/portal-giris") {
      const loginUrl = new URL(`/portal-giris/${subdomain}`, request.url);
      return NextResponse.rewrite(loginUrl);
    }
  }

  // 4. Main domain — no special routing needed
  // Panel access is allowed on any domain (main, vet, pet)
  // Users stay on whichever domain they logged in from

  // ============ AUTH GUARD ============
  if (pathname.startsWith("/panel")) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/giris", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ============ CRON GUARD ============
  if (pathname.startsWith("/api/cron")) {
    const cronSecret = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === "production" && expectedSecret) {
      if (cronSecret !== `Bearer ${expectedSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
