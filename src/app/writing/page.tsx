import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/components/LinkButton";
import { getArticlesNewestFirst } from "@/data/writing";

export const metadata: Metadata = {
  title: "Engineering Insights",
  description:
    "Source-backed engineering articles on distributed systems, identity security, platform engineering, reliability, and applied AI.",
  alternates: {
    canonical: "/writing"
  },
  openGraph: {
    title: "Engineering Insights",
    description:
      "Source-backed engineering articles on distributed systems, identity security, platform engineering, reliability, and applied AI.",
    url: "/writing",
    siteName: "Ravinder Varkali Engineering Portfolio",
    type: "website",
    images: []
  },
  twitter: {
    card: "summary",
    title: "Engineering Insights",
    description:
      "Source-backed engineering articles on distributed systems, identity security, platform engineering, reliability, and applied AI.",
    images: []
  }
};

const pageShell = "mx-auto max-w-5xl px-5 sm:px-8";
const cardSurface =
  "rounded-lg border border-portfolio-border bg-white shadow-[0_10px_35px_rgba(15,45,88,0.06)]";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const lightMetadataLabel = `${labelText} text-portfolio-accent`;
const lightMutedLabel = `${labelText} text-portfolio-muted`;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function WritingIndexPage() {
  const articles = getArticlesNewestFirst();

  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.1),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-8 sm:py-10 lg:py-12`}>
          <LinkButton href="/" variant="tertiary">
            Back to Portfolio
          </LinkButton>
          <p className={`mt-8 ${lightMetadataLabel}`}>Writing / Engineering Insights</p>
          <h1 className="mt-3 text-4xl font-[720] leading-tight tracking-normal text-[#050b2d] sm:text-5xl">
            Engineering Insights
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-portfolio-body sm:text-lg sm:leading-8">
            Source-backed articles on architecture, distributed systems, identity security,
            platform engineering, reliability, and applied AI.
          </p>
        </div>
      </section>

      <section className={`${pageShell} bg-white py-8 sm:py-10`}>
        <div className="grid gap-4">
          {articles.map((article) => (
            <article className={`${cardSurface} p-4 sm:p-5`} key={article.slug}>
              <div className={`grid gap-5 ${article.heroImage ? "lg:grid-cols-[18rem_1fr_auto]" : "lg:grid-cols-[1fr_auto]"} lg:items-center`}>
                {article.heroImage ? (
                  <Image
                    alt={article.heroImage.alt}
                    className="h-auto w-full rounded-md border border-blue-100"
                    height={article.heroImage.height}
                    sizes="(min-width: 1024px) 288px, 100vw"
                    src={article.heroImage.src}
                    width={article.heroImage.width}
                  />
                ) : null}
                <div>
                  <p className={lightMetadataLabel}>
                    {article.publishedAt ? `${article.publicationDateProvisional ? "Provisional · " : ""}${formatDate(article.publishedAt)} · ` : ""}{article.readingTime}
                  </p>
                  <h2 className="mt-3 text-2xl font-[620] leading-tight text-portfolio-ink">
                    {article.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-portfolio-body sm:text-base sm:leading-7">
                    {article.description}
                  </p>
                  <p className={`mt-4 ${lightMutedLabel}`}>Related project: {article.project}</p>
                </div>
                <LinkButton href={`/writing/${article.slug}`} variant="primary">
                  Read Insight →
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
