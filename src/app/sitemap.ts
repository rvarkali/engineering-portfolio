import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: "2026-08-24",
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
