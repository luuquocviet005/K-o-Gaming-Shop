import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/danh-muc", "/khuyen-mai", "/lien-he", "/chinh-sach"];

  return [
    ...staticPages.map((path) => ({
      url: `${site.url}${path}/`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...categories.map((c) => ({
      url: `${site.url}/danh-muc/${c.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/san-pham/${p.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
