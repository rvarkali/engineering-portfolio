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
const cardSurface = "rounded-lg border border-white/[0.14] bg-white/[0.045] shadow-soft-border";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const metadataLabel = `${labelText} text-blue-200`;
const mutedLabel = `${labelText} text-slate-400`;

export default function WritingIndexPage() {
  return (
    <main className="font-sans">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(11,16,32,0.92),rgba(7,10,18,1))]">
        <div className={`${pageShell} py-14 sm:py-16 lg:py-20`}>
          <LinkButton href="/" variant="tertiary">
            Back to Portfolio
          </LinkButton>
          <p className={`mt-8 ${metadataLabel}`}>Writing / Engineering Notes</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Engineering Notes
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200/90 sm:text-xl sm:leading-9">
            Short technical notes on distributed systems, platform engineering,
            reliability, and AI infrastructure, grounded in implemented systems.
          </p>
        </div>
      </section>

      <section className={`${pageShell} py-10 sm:py-12`}>
        <div className="grid gap-4">
          {articles.map((article) => (
            <article className={`${cardSurface} p-4 sm:p-5`} key={article.slug}>
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className={metadataLabel}>{article.readingTime}</p>
                  <h2 className="mt-3 text-2xl font-[620] leading-tight text-slate-50">
                    {article.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                    {article.description}
                  </p>
                  <p className={`mt-4 ${mutedLabel}`}>Related project: {article.project}</p>
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
