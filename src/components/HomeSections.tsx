import { education, expertiseGroups, profile, recognition } from "@/data/profile";
import { experienceHighlights } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { LinkButton } from "./LinkButton";
import { Section } from "./Section";

export function AboutSection() {
  return (
    <Section id="about" eyebrow="About" title="Hands-on technical leadership for distributed platforms.">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <p className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-lg leading-9 text-slate-300 shadow-soft-border">
          {profile.about}
        </p>
        <div className="rounded-lg border border-white/10 bg-ink-800/70 p-6 shadow-soft-border">
          <h3 className="text-base font-semibold text-white">Primary languages</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.languages.map((language) => (
              <span
                className="rounded-md border border-blue-300/25 bg-blue-300/10 px-3 py-2 text-sm font-semibold text-blue-100"
                key={language}
              >
                {language}
              </span>
            ))}
          </div>
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
      title="Depth across platform architecture, reliability, security, and AI-enabled infrastructure."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expertiseGroups.map((group) => (
          <article
            className={`rounded-lg border p-5 shadow-soft-border ${
              group.title === "Distributed Systems" ||
              group.title === "Applied AI & AI Infrastructure"
                ? "border-blue-300/25 bg-blue-300/[0.055]"
                : "border-white/10 bg-white/[0.035]"
            }`}
            key={group.title}
          >
            <h3 className="text-lg font-semibold text-white">{group.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  className="rounded-md border border-slate-600/50 bg-slate-950/35 px-2.5 py-1.5 text-sm text-slate-300"
                  key={item}
                >
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
    <div className="rounded-lg border border-white/10 bg-ink-950/40 p-5 shadow-soft-border">
      <div className="flex flex-col items-center text-center">
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {clientNodes.map((node) => (
            <div
              className="rounded-md border border-blue-200/25 bg-blue-200/10 px-4 py-3 text-sm font-semibold text-blue-50"
              key={node}
            >
              {node}
            </div>
          ))}
        </div>
        <div className="h-7 w-px bg-blue-200/30" />
        <div className="rounded-md border border-violet-200/30 bg-violet-200/10 px-5 py-3 text-sm font-semibold text-violet-50">
          MCP
        </div>
        <div className="h-7 w-px bg-violet-200/30" />
        <div className="rounded-md border border-violet-200/30 bg-violet-200/10 px-5 py-3 text-sm font-semibold text-violet-50">
          MCP Integration Layer
        </div>
        <div className="h-7 w-px bg-slate-400/30" />
        <div className="rounded-md border border-slate-300/25 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100">
          gRPC
        </div>
        <div className="grid w-full items-start gap-3 pt-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-4">
            <p className="text-sm font-semibold text-white">Catalog Service</p>
          </div>
          <div className="hidden h-full min-h-12 w-px bg-slate-500/25 sm:block" />
          <div className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-4">
            <p className="text-sm font-semibold text-white">Diagnostic Service</p>
          </div>
        </div>
        <div className="h-7 w-px bg-slate-400/30" />
        <div className="rounded-md border border-amber-200/25 bg-amber-200/10 px-5 py-3 text-sm font-semibold text-amber-50">
          PostgreSQL
        </div>
      </div>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Cross-cutting controls
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {crossCutting.map((item) => (
            <span
              className="rounded-md border border-slate-600/45 bg-slate-950/45 px-3 py-1.5 text-xs font-medium text-slate-300"
              key={item}
            >
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
      title="Production-inspired distributed systems work."
      description="The primary portfolio artifact is a public reference architecture that connects implementation detail with distributed systems, reliability, security, observability, and applied AI integration."
    >
      <article className="rounded-lg border border-blue-300/25 bg-[linear-gradient(180deg,rgba(96,165,250,0.09),rgba(255,255,255,0.035))] p-6 shadow-soft-border sm:p-7 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                  {project.status}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {project.title}
                </h3>
              </div>
              <LinkButton href={project.href}>View Architecture & Code →</LinkButton>
            </div>
            <p className="mt-5 text-base leading-8 text-slate-300">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.highlights.map((highlight) => (
                <span
                  className="rounded-md border border-white/10 bg-ink-950/50 px-3 py-1.5 text-sm text-slate-200"
                  key={highlight}
                >
                  {highlight}
                </span>
              ))}
            </div>
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                MCP implementation
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Exposes selected distributed-platform diagnostic and service capabilities
                to AI clients through implemented tools.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.mcp.map((tool) => (
                  <code
                    className="rounded-md border border-violet-300/25 bg-violet-300/10 px-3 py-1.5 text-sm text-violet-100"
                    key={tool}
                  >
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
        {experienceHighlights.map((item) => (
          <article
            className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-soft-border"
            key={item.company}
          >
            <h3 className="text-xl font-semibold text-white">{item.company}</h3>
            <p className="mt-1 text-sm font-semibold text-blue-200">{item.role}</p>
            <p className="mt-3 text-base leading-7 text-slate-300">{item.focus}</p>
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
            className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-base font-semibold text-slate-100 shadow-soft-border"
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
      title="Academic background and selected certifications."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {education.map((item) => (
          <div
            className="rounded-lg border border-white/10 bg-ink-800/70 p-4 text-sm font-medium text-slate-200 shadow-soft-border"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ContactSection() {
  return (
    <footer id="contact" className="border-t border-white/10 py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Professional links</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
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
          © {new Date().getFullYear()} {profile.name}. Built as a static professional
          engineering portfolio.
        </p>
      </div>
    </footer>
  );
}
