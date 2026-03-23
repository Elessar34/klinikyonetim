import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://klinikyonetim.net"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panel/", "/api/", "/sifre-sifirla"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
