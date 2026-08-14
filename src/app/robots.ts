import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Role-gated demo panels have no public content worth indexing and
        // shouldn't show up as thin/duplicate pages in search results.
        disallow: ["/campus", "/acudientes", "/colegios-panel", "/tutores", "/admin", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
