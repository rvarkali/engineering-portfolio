import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { siteUrl } from "@/data/profile";
import { articles, getConfirmedModifiedDate } from "@/data/writing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: "2026-10-22",
      changeFrequency: "monthly",
      priority: 1
    },
    ...caseStudies.map((caseStudy) => ({
      url: `${siteUrl}/projects/${caseStudy.slug}`,
      lastModified: caseStudy.slug === "enterprise-identity-security-reference" ? "2026-10-22" : "2026-08-30",
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    {
      url: `${siteUrl}/writing`,
      lastModified: "2026-08-30",
      changeFrequency: "monthly",
      priority: 0.75
    },
    ...articles.map((article) => {
      const lastModified = getConfirmedModifiedDate(article);

      return {
        url: `${siteUrl}/writing/${article.slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.7
      };
    })
  ];
}
