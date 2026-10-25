import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DiagramLightboxButton } from "@/components/DiagramLightboxButton";
import { LinkButton } from "@/components/LinkButton";
import { profile, siteUrl } from "@/data/profile";
import {
  articles,
  getArticle,
  getConfirmedModifiedDate,
  getConfirmedPublicationDate,
  type ArticleBlock,
  type ArticleSection
} from "@/data/writing";

type WritingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const pageShell = "mx-auto max-w-4xl px-5 sm:px-8";
const cardSurface =
  "rounded-lg border border-portfolio-border bg-white shadow-[0_10px_35px_rgba(15,45,88,0.06)]";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const lightMetadataLabel = `${labelText} text-portfolio-accent`;
const lightMutedLabel = `${labelText} text-portfolio-muted`;
const bodyText = "text-base leading-8 text-portfolio-body";

function renderInlineCode(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-900" key={`${part}-${index}`}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}

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
  const publishedTime = getConfirmedPublicationDate(article);
  const modifiedTime = getConfirmedModifiedDate(article);

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
      publishedTime,
      modifiedTime,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      images: article.heroImage
        ? [
            {
              url: article.heroImage.src,
              width: article.heroImage.width,
              height: article.heroImage.height,
              alt: article.heroImage.alt
            }
          ]
        : [
            {
              url: "/og.png",
              width: 1200,
              height: 630,
              alt: "Ravinder Varkali Engineering Portfolio"
            }
          ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.heroImage?.src ?? "/og.png"]
    }
  };
}

function ParagraphSection({ section }: { section: Extract<ArticleSection, { kind: "paragraphs" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-portfolio-ink">{section.title}</h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs.map((paragraph) => (
          <p className={bodyText} key={paragraph}>
            {renderInlineCode(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}

function SequenceSection({ section }: { section: Extract<ArticleSection, { kind: "sequence" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-portfolio-ink">{section.title}</h2>
      <p className={`mt-4 ${bodyText}`}>{renderInlineCode(section.intro)}</p>
      <div className={`${cardSurface} mt-5 overflow-hidden`}>
        <div className="grid grid-cols-2 border-b border-portfolio-border bg-portfolio-atmosphere">
          <div className={`${lightMetadataLabel} p-3 sm:p-4`}>Transaction A</div>
          <div className={`${lightMetadataLabel} border-l border-portfolio-border p-3 sm:p-4`}>
            Transaction B
          </div>
        </div>
        <div className="divide-y divide-portfolio-border">
          {section.rows.map(([left, right], index) => (
            <div className="grid grid-cols-2" key={`${left}-${right}-${index}`}>
              <div className="min-h-12 break-words p-3 font-mono text-sm leading-6 text-slate-800 sm:p-4">
                {left}
              </div>
              <div className="min-h-12 break-words border-l border-portfolio-border p-3 font-mono text-sm leading-6 text-slate-800 sm:p-4">
                {right}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className={`mt-5 ${bodyText}`}>{renderInlineCode(section.outro)}</p>
    </section>
  );
}

function ListSection({ section }: { section: Extract<ArticleSection, { kind: "list" }> }) {
  return (
    <section className="py-7 sm:py-8">
      <h2 className="text-2xl font-[620] leading-tight text-portfolio-ink">{section.title}</h2>
      {section.intro ? <p className={`mt-4 ${bodyText}`}>{renderInlineCode(section.intro)}</p> : null}
      <ul className="mt-4 space-y-3">
        {section.items.map((item) => (
          <li className="flex gap-3 text-base leading-7 text-portfolio-body" key={item}>
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-portfolio-accent" />
            <span>{renderInlineCode(item)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleList({ block }: { block: Extract<ArticleBlock, { kind: "list" }> }) {
  const List = block.ordered ? "ol" : "ul";
  return (
    <List className={`${block.ordered ? "list-decimal" : "list-disc"} space-y-3 pl-6 text-base leading-8 text-portfolio-body marker:font-semibold marker:text-portfolio-accent`}>
      {block.items.map((item) => (
        <li className="pl-1" key={item}>{renderInlineCode(item)}</li>
      ))}
    </List>
  );
}

function ArticleCode({ block }: { block: Extract<ArticleBlock, { kind: "code" }> }) {
  return (
    <figure className={`${cardSurface} overflow-hidden`}>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-portfolio-border bg-portfolio-atmosphere px-4 py-3 sm:px-5">
        <span className="text-sm font-semibold text-portfolio-ink">{block.caption}</span>
        <span className={lightMetadataLabel}>{block.language}</span>
      </figcaption>
      <pre className="overflow-x-auto bg-[#071126] p-4 text-[13px] leading-6 text-slate-100 sm:p-5 sm:text-sm">
        <code>{block.code}</code>
      </pre>
      {block.note || block.sourceHref ? (
        <div className="space-y-2 border-t border-portfolio-border bg-white px-4 py-3 text-sm leading-6 text-portfolio-body sm:px-5">
          {block.note ? <p>{block.note}</p> : null}
          {block.sourceHref ? (
            <Link className="inline-flex font-semibold text-portfolio-accent underline decoration-blue-200 underline-offset-4 hover:text-blue-700" href={block.sourceHref} target="_blank" rel="noopener noreferrer">
              {block.sourceLabel ?? "Inspect source"} ↗
            </Link>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

function ArticleDiagram({ block }: { block: Extract<ArticleBlock, { kind: "diagram" }> }) {
  return (
    <figure>
      <DiagramLightboxButton
        asset={block.asset}
        lightboxTitle={block.lightboxTitle}
        sizes="(min-width: 896px) 896px, 100vw"
      />
      <figcaption className="mt-3 text-sm leading-6 text-portfolio-muted">
        {block.caption}{" "}
        <a className="font-semibold text-portfolio-accent underline decoration-blue-200 underline-offset-4 hover:text-blue-700" href={block.asset.src} target="_blank" rel="noopener noreferrer">
          Open full-resolution diagram ↗
        </a>
      </figcaption>
    </figure>
  );
}

function ArticleTable({ block }: { block: Extract<ArticleBlock, { kind: "table" }> }) {
  return (
    <figure>
      <div className={`${cardSurface} overflow-x-auto`}>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm leading-6">
          <thead className="bg-portfolio-atmosphere text-portfolio-ink">
            <tr>
              {block.columns.map((column) => (
                <th className="border-b border-portfolio-border px-4 py-3 font-semibold sm:px-5" scope="col" key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-portfolio-border text-portfolio-body">
            {block.rows.map((row, rowIndex) => (
              <tr className="align-top" key={`${row[0]}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td className={`px-4 py-3 sm:px-5 ${cellIndex === 0 ? "font-medium text-portfolio-ink" : ""}`} key={`${cell}-${cellIndex}`}>{renderInlineCode(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption ? <figcaption className="mt-3 text-sm leading-6 text-portfolio-muted">{block.caption}</figcaption> : null}
    </figure>
  );
}

function ArticleCallout({ block }: { block: Extract<ArticleBlock, { kind: "callout" }> }) {
  const tone = block.tone ?? "implementation";
  const toneClass = {
    implementation: "border-blue-200 bg-blue-50/70",
    recommendation: "border-amber-200 bg-amber-50/70",
    limitation: "border-slate-300 bg-slate-50"
  }[tone];
  return (
    <aside className={`rounded-lg border p-4 sm:p-5 ${toneClass}`}>
      <p className={lightMetadataLabel}>{block.label}</p>
      <p className="mt-2 text-sm leading-7 text-portfolio-body sm:text-base">{renderInlineCode(block.text)}</p>
    </aside>
  );
}

function ArticleReference({ block }: { block: Extract<ArticleBlock, { kind: "reference" }> }) {
  return (
    <aside className="rounded-lg border border-slate-300 bg-slate-50 p-4 sm:p-5">
      <p className={lightMetadataLabel}>{block.label}</p>
      <Link
        className="mt-2 inline-flex font-semibold text-portfolio-ink underline decoration-blue-200 underline-offset-4 hover:text-portfolio-accent"
        href={block.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {block.title} ↗
      </Link>
      <p className={`mt-4 ${lightMutedLabel}`}>{block.revisionLabel}</p>
      <Link
        className="mt-2 inline-flex font-mono text-sm font-semibold text-portfolio-accent underline decoration-blue-200 underline-offset-4 hover:text-blue-700"
        href={block.revisionHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {block.revision} ↗
      </Link>
      <p className="mt-4 text-sm leading-7 text-portfolio-body sm:text-base">{renderInlineCode(block.text)}</p>
    </aside>
  );
}

function ArticleBlockView({ block, compact = false }: { block: ArticleBlock; compact?: boolean }) {
  if (block.kind === "paragraph") return <p className={bodyText}>{renderInlineCode(block.text)}</p>;
  if (block.kind === "subheading") return <h3 className={`${compact ? "pt-1" : "pt-2"} text-xl font-[620] leading-tight text-portfolio-ink`}>{block.title}</h3>;
  if (block.kind === "list") return <ArticleList block={block} />;
  if (block.kind === "code") return <ArticleCode block={block} />;
  if (block.kind === "diagram") return <ArticleDiagram block={block} />;
  if (block.kind === "table") return <ArticleTable block={block} />;
  if (block.kind === "callout") return <ArticleCallout block={block} />;
  return <ArticleReference block={block} />;
}

function RichSection({ section }: { section: Extract<ArticleSection, { kind: "rich" }> }) {
  const compact = section.id === "engineering-lessons";

  return (
    <section className="scroll-mt-24 py-7 sm:py-9" id={section.id}>
      <h2 className="text-2xl font-[650] leading-tight text-portfolio-ink sm:text-3xl">{section.title}</h2>
      <div className={`mt-5 ${compact ? "space-y-4" : "space-y-[1.1rem]"}`}>
        {section.blocks.map((block, index) => (
          <ArticleBlockView block={block} compact={compact} key={`${block.kind}-${index}`} />
        ))}
      </div>
    </section>
  );
}

function ArticleSectionView({ section }: { section: ArticleSection }) {
  if (section.kind === "rich") {
    return <RichSection section={section} />;
  }

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

  const richSections = article.sections.filter(
    (section): section is Extract<ArticleSection, { kind: "rich" }> => section.kind === "rich"
  );
  const articleUrl = `${siteUrl}/writing/${article.slug}`;
  const publishedDate = getConfirmedPublicationDate(article);
  const modifiedDate = getConfirmedModifiedDate(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: article.author ?? profile.name,
      url: siteUrl
    },
    publisher: {
      "@type": "Person",
      name: profile.name,
      url: siteUrl
    },
    keywords: article.tags?.join(", "),
    about: article.project,
    citation: article.sourceCommitHref ?? article.sourceHref,
    image: article.heroImage ? `${siteUrl}${article.heroImage.src}` : undefined
  };

  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.1),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-8 sm:py-10 lg:py-12`}>
          <div className="flex flex-wrap items-center gap-2">
            <LinkButton href="/writing" variant="tertiary">
              ← Engineering Insights
            </LinkButton>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-[600] leading-[1.35] text-portfolio-accent transition hover:bg-portfolio-atmosphere hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
              href="/"
            >
              Portfolio
            </Link>
          </div>
          <p className={`mt-8 ${lightMetadataLabel}`}>Engineering Insight</p>
          <h1 className="mt-3 text-4xl font-[720] leading-tight tracking-normal text-[#050b2d] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-portfolio-body sm:text-lg sm:leading-8">
            {article.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {article.publishedAt ? (
              <span className={`${lightMutedLabel} rounded-md border border-portfolio-border bg-white px-2.5 py-1.5`}>
                {article.publicationDateProvisional ? "Provisional publication · " : "Published · "}{formatDate(article.publishedAt)}
              </span>
            ) : null}
            <span className={`${lightMutedLabel} rounded-md border border-portfolio-border bg-white px-2.5 py-1.5`}>
              {article.readingTime}
            </span>
            <span className={`${lightMutedLabel} rounded-md border border-portfolio-border bg-white px-2.5 py-1.5`}>
              {article.category ?? article.project}
            </span>
          </div>
          {article.heroImage ? (
            <div className="mt-8 overflow-hidden rounded-lg border border-blue-100 bg-slate-950 shadow-[0_18px_60px_rgba(15,45,88,0.12)]">
              <Image
                alt={article.heroImage.alt}
                className="h-auto w-full"
                height={article.heroImage.height}
                priority
                sizes="(min-width: 896px) 896px, 100vw"
                src={article.heroImage.src}
                width={article.heroImage.width}
              />
            </div>
          ) : null}
        </div>
      </section>

      <article className={`${pageShell} py-8 text-portfolio-body sm:py-10`}>
        {richSections.length > 0 ? (
          <nav aria-label="Article contents" className={`${cardSurface} mb-7 p-4 sm:p-5`}>
            <p className={lightMetadataLabel}>In this article</p>
            <ol className="mt-4 grid gap-x-6 gap-y-2 text-sm leading-6 sm:grid-cols-2">
              {richSections.map((section) => (
                <li key={section.id}>
                  <a className="font-medium text-portfolio-body underline decoration-blue-200 underline-offset-4 hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent" href={`#${section.id}`}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {article.disclaimer ? (
          <aside className="mb-3 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-portfolio-body sm:p-5">
            <strong className="text-portfolio-ink">Implementation scope:</strong> {article.disclaimer}
          </aside>
        ) : null}

        {article.intro ? (
          <section aria-label="Article introduction" className="space-y-[1.1rem] py-7 sm:py-8">
            {article.intro.map((block, index) => (
              <ArticleBlockView block={block} key={`${block.kind}-${index}`} />
            ))}
          </section>
        ) : null}

        {article.sections.map((section) => (
          <ArticleSectionView section={section} key={section.kind === "rich" ? section.id : section.title} />
        ))}

        <div className={`${cardSurface} mt-8 p-4 sm:p-5`}>
          <p className={lightMetadataLabel}>Related evidence</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <LinkButton href={article.caseStudyHref} variant="primary">
              View Case Study
            </LinkButton>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-portfolio-border bg-white px-4 py-2 text-sm font-[600] leading-[1.35] text-portfolio-ink transition hover:border-portfolio-accent hover:bg-portfolio-atmosphere focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
              href={article.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.sourceLabel ?? "View Evidence Source"}
            </Link>
            {article.sourceCommitHref && article.sourceCommit ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-portfolio-border bg-white px-4 py-2 text-sm font-[600] leading-[1.35] text-portfolio-ink transition hover:border-portfolio-accent hover:bg-portfolio-atmosphere focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
                href={article.sourceCommitHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Audited commit {article.sourceCommit.slice(0, 12)} ↗
              </Link>
            ) : null}
          </div>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
