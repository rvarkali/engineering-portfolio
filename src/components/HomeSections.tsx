import { credentials, expertiseGroups, profile, recognition } from "@/data/profile";
import { experienceHighlights } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
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

export function FeaturedEngineeringSection() {
  const [project] = featuredProjects;

  return (
    <Section
      id="featured-engineering"
      eyebrow="Featured Engineering"
      title="Distributed platform reference architecture."
      description="The primary portfolio artifact is a public reference architecture that connects implementation detail with distributed systems, reliability, security, observability, and applied AI integration."
    >
      <article className="rounded-lg border border-blue-300/30 bg-[linear-gradient(180deg,rgba(96,165,250,0.09),rgba(255,255,255,0.04))] p-4 shadow-soft-border sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={metadataLabel}>{project.status}</p>
                <h3 className="mt-3 text-2xl font-[620] leading-tight text-slate-50 sm:text-3xl">
                  {project.title}
                </h3>
              </div>
              <LinkButton href={project.href}>View Architecture & Code →</LinkButton>
            </div>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-5 sm:leading-8">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
              {project.highlights.map((highlight) => (
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
                {project.mcp.map((tool) => (
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
            <LinkButton href={profile.linkedin}>LinkedIn</LinkButton>
            <LinkButton href={profile.github}>GitHub</LinkButton>
            <LinkButton href={`mailto:${profile.email}`}>Email</LinkButton>
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
