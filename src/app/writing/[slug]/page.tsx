import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/LinkButton";
import { articles, getArticle, type ArticleSection } from "@/data/writing";
import { siteUrl } from "@/data/profile";

type WritingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const pageShell = "mx-auto max-w-4xl px-5 sm:px-8";
const cardSurface = "rounded-lg border border-white/[0.14] bg-white/[0.045] shadow-soft-border";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const metadataLabel = `${labelText} text-blue-200`;
const mutedLabel = `${labelText} text-slate-400`;
const bodyText = "text-base leading-8 text-slate-200/90";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  const url = `${siteUrl}/writing/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/writing/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: "Ravinder Varkali Engineering Portfolio",
      type: "article",
      images: []
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
      images: []
    }
  };
}

function ParagraphSection({ section }: { section: Extract<ArticleSection, { kind: "paragraphs" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-slate-50">{section.title}</h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs.map((paragraph) => (
          <p className={bodyText} key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function SequenceSection({ section }: { section: Extract<ArticleSection, { kind: "sequence" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-slate-50">{section.title}</h2>
      <p className={`mt-4 ${bodyText}`}>{section.intro}</p>
      <div className={`${cardSurface} mt-5 overflow-hidden`}>
        <div className="grid grid-cols-2 border-b border-white/10 bg-slate-950/50">
          <div className={`${metadataLabel} p-3 sm:p-4`}>Transaction A</div>
          <div className={`${metadataLabel} border-l border-white/10 p-3 sm:p-4`}>
            Transaction B
          </div>
        </div>
        <div className="divide-y divide-white/10">
          {section.rows.map(([left, right], index) => (
            <div className="grid grid-cols-2" key={`${left}-${right}-${index}`}>
              <div className="min-h-12 break-words p-3 font-mono text-sm leading-6 text-slate-100 sm:p-4">
                {left}
              </div>
              <div className="min-h-12 break-words border-l border-white/10 p-3 font-mono text-sm leading-6 text-slate-100 sm:p-4">
                {right}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className={`mt-5 ${bodyText}`}>{section.outro}</p>
    </section>
  );
}

function ListSection({ section }: { section: Extract<ArticleSection, { kind: "list" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-slate-50">{section.title}</h2>
      {section.intro ? <p className={`mt-4 ${bodyText}`}>{section.intro}</p> : null}
      <ul className="mt-4 space-y-3">
        {section.items.map((item) => (
          <li className="flex gap-3 text-base leading-7 text-slate-200/90" key={item}>
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleSectionView({ section }: { section: ArticleSection }) {
  if (section.kind === "sequence") {
    return <SequenceSection section={section} />;
  }

  if (section.kind === "list") {
    return <ListSection section={section} />;
  }

  return <ParagraphSection section={section} />;
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="font-sans">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(11,16,32,0.92),rgba(7,10,18,1))]">
        <div className={`${pageShell} py-14 sm:py-16 lg:py-20`}>
          <LinkButton href="/writing" variant="tertiary">
            ← Engineering Notes
          </LinkButton>
          <Link
            className="ml-1 inline-flex min-h-11 items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-[600] leading-[1.35] text-slate-300 transition hover:bg-white/[0.04] hover:text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
            href="/"
          >
            Portfolio
          </Link>
          <p className={`mt-8 ${metadataLabel}`}>Engineering Note</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-200/90 sm:text-xl sm:leading-9">
            {article.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className={`${mutedLabel} rounded-md border border-slate-500/35 px-2.5 py-1.5`}>
              {article.readingTime}
            </span>
            <span className={`${mutedLabel} rounded-md border border-slate-500/35 px-2.5 py-1.5`}>
              {article.project}
            </span>
          </div>
        </div>
      </section>

      <article className={`${pageShell} py-8 sm:py-10`}>
        {article.sections.map((section) => (
          <ArticleSectionView section={section} key={section.title} />
        ))}

        <div className={`${cardSurface} mt-8 p-4 sm:p-5`}>
          <p className={metadataLabel}>Related evidence</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <LinkButton href={article.caseStudyHref} variant="primary">
              View Case Study
            </LinkButton>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-500/35 bg-white/[0.03] px-4 py-2 text-sm font-[600] leading-[1.35] text-slate-100 transition hover:border-slate-300/70 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
              href={article.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Evidence Source
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
