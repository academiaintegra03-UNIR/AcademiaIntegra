import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { programs } from "@/lib/data/programs";
import { countryOrder } from "@/lib/data/countries";

const staticRoutes = [
  "",
  "/programas",
  "/paises",
  "/diagnostico",
  "/planes-precios",
  "/recursos",
  "/colegios",
  "/nosotros",
  "/faq",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
    ...programs.map((p) => ({
      url: `${siteUrl}/programas/${p.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...countryOrder.map((id) => ({
      url: `${siteUrl}/paises/${id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
