import type { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { articles } from "@/data/writing";

export const metadata: Metadata = {
  title: "Engineering Notes",
  description:
    "Technical writing on distributed systems, platform engineering, reliability, and AI infrastructure grounded in implemented systems.",
  alternates: {
    canonical: "/writing"
  },
  openGraph: {
    title: "Engineering Notes",
    description:
      "Technical writing on distributed systems, platform engineering, reliability, and AI infrastructure grounded in implemented systems.",
    url: "/writing",
    siteName: "Ravinder Varkali Engineering Portfolio",
    type: "website",
    images: []
  },
  twitter: {
    card: "summary",
    title: "Engineering Notes",
    description:
      "Technical writing on distributed systems, platform engineering, reliability, and AI infrastructure grounded in implemented systems.",
    images: []
  }
};

const pageShell = "mx-auto max-w-5xl px-5 sm:px-8";
const cardSurface =
  "rounded-lg border border-portfolio-border bg-white shadow-[0_10px_35px_rgba(15,45,88,0.06)]";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const lightMetadataLabel = `${labelText} text-portfolio-accent`;
const lightMutedLabel = `${labelText} text-portfolio-muted`;

export default function WritingIndexPage() {
  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.1),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-8 sm:py-10 lg:py-12`}>
          <LinkButton href="/" variant="tertiary">
            Back to Portfolio
          </LinkButton>
          <p className={`mt-8 ${lightMetadataLabel}`}>Writing / Engineering Notes</p>
          <h1 className="mt-3 text-4xl font-[720] leading-tight tracking-normal text-[#050b2d] sm:text-5xl">
            Engineering Notes
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-portfolio-body sm:text-lg sm:leading-8">
            Short technical notes on distributed systems, platform engineering,
            reliability, and AI infrastructure, grounded in implemented systems.
          </p>
        </div>
      </section>

      <section className={`${pageShell} bg-white py-8 sm:py-10`}>
        <div className="grid gap-4">
          {articles.map((article) => (
            <article className={`${cardSurface} p-4 sm:p-5`} key={article.slug}>
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className={lightMetadataLabel}>{article.readingTime}</p>
                  <h2 className="mt-3 text-2xl font-[620] leading-tight text-portfolio-ink">
                    {article.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-portfolio-body sm:text-base sm:leading-7">
                    {article.description}
                  </p>
                  <p className={`mt-4 ${lightMutedLabel}`}>Related project: {article.project}</p>
                </div>
                <LinkButton href={`/writing/${article.slug}`} variant="primary">
                  Read Note →
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
