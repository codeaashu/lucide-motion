import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/icon-data";
import { siteConfig } from "@/lib/site-config";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/playground`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const docsRoutes: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${base}${page.url}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: page.url === "/docs" ? 0.9 : 0.7,
  }));

  const iconRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${base}/icons/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...docsRoutes, ...iconRoutes];
}
