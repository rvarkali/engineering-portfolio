import { credentials, expertiseGroups, profile, recognition } from "@/data/profile";
import { experienceHighlights } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { articles } from "@/data/writing";
import { LinkButton } from "./LinkButton";
import { Section } from "./Section";

const cardSurface = "rounded-lg border border-white/[0.12] bg-white/[0.04] shadow-soft-border";
const emphasizedCardSurface = "border-blue-300/30 bg-blue-300/[0.06]";
const cardTitle = "text-base font-[620] leading-snug text-slate-50 sm:text-lg";
const cardBody = "text-sm leading-6 text-slate-300 sm:text-base sm:leading-7";
const metadataLabel =
  "text-xs font-semibold uppercase tracking-[0.16em] text-blue-200 sm:text-sm";
const mutedLabel = "text-xs font-semibold uppercase tracking-[0.16em] text-slate-400";
const chip =
  "rounded-md border border-slate-500/45 bg-slate-900/70 px-2 py-1 text-sm font-medium leading-[1.35] text-slate-200 sm:px-2.5 sm:py-1.5 sm:text-[15px] sm:leading-[1.4]";
const codeChip =
  "rounded-md border border-violet-300/25 bg-violet-300/[0.1] px-2 py-1 font-mono text-[13px] font-medium leading-[1.35] text-violet-100 sm:px-2.5 sm:py-1.5 sm:text-sm sm:leading-[1.4]";

export function AboutSection() {
  return (
    <Section id="about" eyebrow="About" title="Technical leadership for distributed platforms.">
      <div className={`${cardSurface} p-4 sm:p-6`}>
        <p className="text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          {profile.about}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className={mutedLabel}>Primary languages</span>
          {profile.languages.map((language) => (
            <span className={chip} key={language}>
              {language}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ExpertiseSection() {
  return (
    <Section
      id="technical-expertise"
      eyebrow="Technical Expertise"
      title="Core engineering strengths."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expertiseGroups.map((group) => (
          <article
            className={`${cardSurface} p-4 sm:p-5 ${
              group.title === "Distributed Systems" ||
              group.title === "Applied AI & AI Infrastructure"
                ? emphasizedCardSurface
                : ""
            } ${group.title === "Technical Leadership" ? "md:col-span-2 xl:col-span-3" : ""}`}
            key={group.title}
          >
            <h3 className={cardTitle}>{group.title}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              {group.items.map((item) => (
                <span className={chip} key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ArchitectureVisualization() {
  const clientNodes = ["AI Client", "Engineering Client"];
  const crossCutting = ["Authentication / RBAC", "OpenTelemetry", "Reliability Controls"];

  return (
    <div className={`${cardSurface} bg-ink-950/50 p-4 sm:p-5`}>
      <div className="flex flex-col items-center text-center">
        <div className="w-full rounded-md border border-blue-200/25 bg-blue-200/[0.06] p-3">
          <p className={`mb-2 ${metadataLabel}`}>Clients</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {clientNodes.map((node) => (
              <div
                className="rounded-md border border-slate-500/45 bg-slate-900/70 px-3 py-2.5 text-sm font-medium leading-[1.35] text-slate-100"
                key={node}
              >
                {node}
              </div>
            ))}
          </div>
        </div>
        <div className="h-6 w-px bg-blue-200/30" />
        <div className="rounded-md border border-slate-500/45 bg-slate-900/70 px-5 py-3 text-sm font-medium leading-[1.35] text-slate-100">
          MCP
        </div>
        <div className="h-6 w-px bg-violet-200/30" />
        <div className="rounded-md border border-slate-500/45 bg-slate-900/70 px-5 py-3 text-sm font-medium leading-[1.35] text-slate-100">
          MCP Integration Layer
        </div>
        <div className="h-6 w-px bg-slate-400/30" />
        <div className="rounded-md border border-slate-500/45 bg-slate-900/70 px-5 py-3 text-sm font-medium leading-[1.35] text-slate-100">
          gRPC
        </div>
        <div className="grid w-full items-start gap-2 pt-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:pt-5">
          <div className="rounded-md border border-slate-500/45 bg-slate-900/70 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-sm font-medium leading-[1.35] text-slate-100">Catalog Service</p>
          </div>
          <div className="hidden h-full min-h-12 w-px bg-slate-500/25 sm:block" />
          <div className="rounded-md border border-slate-500/45 bg-slate-900/70 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-sm font-medium leading-[1.35] text-slate-100">Diagnostic Service</p>
          </div>
        </div>
        <div className="h-6 w-px bg-slate-400/30" />
        <div className="rounded-md border border-amber-200/30 bg-amber-200/[0.11] px-5 py-3 text-sm font-medium leading-[1.35] text-amber-100">
          PostgreSQL
        </div>
      </div>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className={mutedLabel}>Cross-cutting controls</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {crossCutting.map((item) => (
            <span className={chip} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentTrustFlow({ steps }: { steps: string[] }) {
  return (
    <div
      aria-label="AgentTrust authorization flow: Start Run, Scoped JWT, Authorize Scope, Allow or Deny, Audit Decision, Execute if Allowed"
      className="rounded-lg border border-slate-500/30 bg-ink-950/45 p-3 sm:p-4"
    >
      <div className="flex flex-col items-center gap-1.5">
        {steps.map((step, index) => (
          <div className="flex w-full flex-col items-center gap-1.5" key={step}>
            <div className="flex min-h-10 w-full max-w-64 items-center justify-center rounded-md border border-slate-500/40 bg-slate-900/70 px-3 py-2 text-center text-sm font-medium leading-[1.25] text-slate-100 sm:max-w-72">
              {step}
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="text-sm font-semibold leading-none text-blue-200/70"
              >
                ↓
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedEngineeringSection() {
  const [cloudOpsProject, agentTrustProject] = featuredProjects;

  return (
    <Section
      id="featured-engineering"
      eyebrow="Featured Engineering"
      title="Distributed platform reference architecture."
      description="The primary portfolio artifact remains a public distributed systems reference architecture, with a second SDK project showing applied AI security and framework integration."
    >
      <article className="rounded-lg border border-blue-300/30 bg-[linear-gradient(180deg,rgba(96,165,250,0.09),rgba(255,255,255,0.04))] p-4 shadow-soft-border sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={metadataLabel}>{cloudOpsProject.status}</p>
                <h3 className="mt-3 text-2xl font-[620] leading-tight text-slate-50 sm:text-3xl">
                  {cloudOpsProject.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {cloudOpsProject.caseStudyHref ? (
                  <LinkButton href={cloudOpsProject.caseStudyHref} variant="primary">
                    View Case Study →
                  </LinkButton>
                ) : null}
                <LinkButton href={cloudOpsProject.href} newTab>
                  View Source →
                </LinkButton>
              </div>
            </div>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-5 sm:leading-8">
              {cloudOpsProject.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
              {cloudOpsProject.highlights.map((highlight) => (
                <span className={chip} key={highlight}>
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 sm:mt-7 sm:pt-5">
              <p className={metadataLabel}>AI integration</p>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:mt-3 sm:leading-7">
                MCP exposes selected diagnostic and service capabilities to AI clients.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                {cloudOpsProject.mcp?.map((tool) => (
                  <code className={codeChip} key={tool}>
                    {tool}
                  </code>
                ))}
              </div>
            </div>
          </div>
          <ArchitectureVisualization />
        </div>
      </article>
      {agentTrustProject ? (
        <article className={`${cardSurface} mt-4 p-4 sm:mt-5 sm:p-6 lg:p-7`}>
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-7">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className={metadataLabel}>{agentTrustProject.status}</p>
                  <h3 className="mt-3 text-xl font-[620] leading-tight text-slate-50 sm:text-2xl">
                    {agentTrustProject.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {agentTrustProject.caseStudyHref ? (
                    <LinkButton href={agentTrustProject.caseStudyHref} variant="primary">
                      View Case Study →
                    </LinkButton>
                  ) : null}
                  <LinkButton href={agentTrustProject.href} newTab>
                    View Source →
                  </LinkButton>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                {agentTrustProject.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {agentTrustProject.highlights.map((highlight) => (
                  <span className={chip} key={highlight}>
                    {highlight}
                  </span>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
                <span className="font-semibold text-slate-300">MVP boundary:</span>{" "}
                {agentTrustProject.boundary}
              </p>
            </div>
            {agentTrustProject.trustFlow ? (
              <div className="flex flex-col justify-center">
                <p className={metadataLabel}>Authorization flow</p>
                <div className="mt-3">
                  <AgentTrustFlow steps={agentTrustProject.trustFlow} />
                </div>
              </div>
            ) : null}
          </div>
        </article>
      ) : null}
    </Section>
  );
}

const evidenceItems = [
  {
    category: "Concurrent correctness",
    title: "Concurrent workflow admission",
    project: "gRPC Microservices Reference",
    proof:
      "A controlled local PostgreSQL-backed experiment sent 20 equivalent Diagnostic requests with one idempotency key across five runs. Each run converged on 1 durable job, 1 idempotency record, and 1 job-created outbox event.",
    boundary:
      "Local correctness evidence, not a throughput, scale, latency, or production-reliability benchmark.",
    href: "/projects/grpc-microservices-reference"
  },
  {
    category: "Distributed observability",
    title: "Joined runtime trace",
    project: "gRPC Microservices Reference",
    proof:
      "Local runtime evidence shows one OpenTelemetry trace across Diagnostic service, Catalog gRPC client, Catalog service, and PostgreSQL repository work. Dependency-failure behavior was captured in the same evidence set.",
    boundary: "This does not claim production observability, SLO validation, or availability.",
    href: "/projects/grpc-microservices-reference"
  },
  {
    category: "AI authorization boundary",
    title: "Denied before tool execution",
    project: "AgentTrust",
    proof:
      "Within AgentTrust's guarded cooperative execution boundary, service.read reached the underlying tool path once; service.restart without scope was denied before invocation, with denied invocation count 0.",
    boundary: "This does not imply process isolation or protection from raw client/tool bypass.",
    href: "/projects/agenttrust"
  }
];

export function EvidenceAtGlanceSection() {
  return (
    <Section
      id="evidence-at-a-glance"
      eyebrow="Evidence at a Glance"
      title="Engineering claims backed by runtime evidence."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {evidenceItems.map((item) => (
          <article className={`${cardSurface} flex flex-col p-4 sm:p-5`} key={item.title}>
            <p className={metadataLabel}>{item.category}</p>
            <h3 className="mt-3 text-lg font-[620] leading-snug text-slate-50">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.proof}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.boundary}</p>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className={mutedLabel}>{item.project}</p>
              <LinkButton href={item.href} variant="primary">
                View Case Study →
              </LinkButton>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function WritingSection() {
  const [article] = articles;

  if (!article) {
    return null;
  }

  return (
    <Section
      id="writing"
      eyebrow="Writing / Engineering Notes"
      title="Short technical notes from implemented systems."
    >
      <article className={`${cardSurface} p-4 sm:p-5`}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className={metadataLabel}>{article.readingTime}</p>
            <h3 className="mt-3 text-xl font-[620] leading-tight text-slate-50 sm:text-2xl">
              {article.title}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              {article.description}
            </p>
          </div>
          <LinkButton href={`/writing/${article.slug}`} variant="primary">
            Read Note →
          </LinkButton>
        </div>
      </article>
    </Section>
  );
}

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="Experience Highlights"
      title="Engineering experience at scale."
      description="Selected platform, distributed systems, and architecture work across cloud and enterprise environments."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {experienceHighlights.map((item, index) => (
          <article
            className={`${cardSurface} p-4 sm:p-5 ${
              index === experienceHighlights.length - 1 ? "md:col-span-2" : ""
            }`}
            key={item.company}
          >
            <h3 className={cardTitle}>{item.company}</h3>
            <p className={`mt-1 ${metadataLabel}`}>{item.role}</p>
            <p className={`mt-3 ${cardBody}`}>{item.focus}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function RecognitionSection() {
  return (
    <Section id="recognition" eyebrow="Recognition" title="Selected recognition.">
      <div className="grid gap-4 md:grid-cols-3">
        {recognition.map((item) => (
          <div
            className={`${cardSurface} p-4 text-sm font-[620] leading-snug text-slate-100 sm:p-5 sm:text-base`}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function EducationSection() {
  return (
    <Section
      id="education"
      eyebrow="Education & Certifications"
      title="Education and certifications."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`${cardSurface} bg-ink-800/70 p-4 sm:p-5`}>
          <h3 className={metadataLabel}>Education</h3>
          <div className="mt-3 space-y-3">
            {credentials.education.map((item) => (
              <p className={cardBody} key={item}>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className={`${cardSurface} bg-ink-800/70 p-4 sm:p-5`}>
          <h3 className={metadataLabel}>Certifications</h3>
          <div className="mt-3 space-y-3">
            {credentials.certifications.map((item) => (
              <p className={cardBody} key={item}>
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ContactSection() {
  return (
    <footer id="contact" className="border-t border-white/10 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300 sm:text-sm">
              Contact
            </p>
            <h2 className="mt-3 text-[2rem] font-[620] leading-tight text-slate-50 sm:text-3xl">
              Professional links
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:leading-8">
              For engineering leadership, architecture, platform, cloud, and applied AI
              conversations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={profile.linkedin} variant="tertiary">
              LinkedIn
            </LinkButton>
            <LinkButton href={profile.github}>GitHub</LinkButton>
            <LinkButton href={`mailto:${profile.email}`} variant="tertiary">
              Email
            </LinkButton>
            <LinkButton href={profile.resume} newTab>
              Resume
            </LinkButton>
          </div>
        </div>
        <p className="mt-10 text-sm text-slate-500">
          © {new Date().getFullYear()} {profile.name} · {profile.role}
        </p>
      </div>
    </footer>
  );
}
