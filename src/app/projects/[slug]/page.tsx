import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudy";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { siteUrl } from "@/data/profile";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    return {};
  }

  const title = `${caseStudy.title} | Engineering Case Study`;
  const description = caseStudy.summary;
  const url = `${siteUrl}/projects/${caseStudy.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${caseStudy.slug}`
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ravinder Varkali Engineering Portfolio",
      type: "article",
      images: []
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: []
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyPage caseStudy={caseStudy} />;
}
