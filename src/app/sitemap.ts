import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { siteUrl } from "@/data/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: "2026-08-24",
      changeFrequency: "monthly",
      priority: 1
    },
    ...caseStudies.map((caseStudy) => ({
      url: `${siteUrl}/projects/${caseStudy.slug}`,
      lastModified: "2026-08-30",
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
