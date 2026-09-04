import Link from "next/link";
import { profile, recognition } from "@/data/profile";
import { experienceHighlights } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { LinkButton } from "./LinkButton";
import { ProjectCard } from "./ProjectCard";
import { Section } from "./Section";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.18em] text-portfolio-accent";
const chip =
  "rounded-md border border-[#cfe0f5] bg-[#eef5ff] px-2.5 py-1.5 text-xs font-medium leading-tight text-portfolio-body";

type IconType =
  | "systems"
  | "cloud"
  | "ai"
  | "chart"
  | "lock"
  | "briefcase"
  | "award"
  | "education"
  | "cert";

function LineIcon({ type }: { type: IconType }) {
  const common = "h-7 w-7 text-portfolio-accent";

  if (type === "cloud") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 18h10.25a4.25 4.25 0 0 0 .57-8.46 6 6 0 0 0-11.37-1.7A4.8 4.8 0 0 0 7 18Z" />
      </svg>
    );
  }

  if (type === "ai") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3M8 8h8v8H8z" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h17M8 16V9m5 7V6m5 10v-4" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
      </svg>
    );
  }

  if (type === "briefcase" || type === "cert") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0h8a4 4 0 0 1 4 4v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a4 4 0 0 1 4-4Z" />
      </svg>
    );
  }

  if (type === "award") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-6-18h12v5a6 6 0 0 1-12 0V3Zm0 3H4a4 4 0 0 0 4 4m10-4h2a4 4 0 0 1-4 4" />
      </svg>
    );
  }

  if (type === "education") {
    return (
      <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3 8.5 9-4.5 9 4.5-9 4.5-9-4.5Zm4 2.2V16c1.4 1.5 3.1 2.2 5 2.2s3.6-.7 5-2.2v-5.3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v4H5zM5 15h14v4H5zM8 9v6m8-6v6" />
    </svg>
  );
}
export function CapabilityStrip() {
  const capabilities = [
    ["systems", "Distributed Systems", "Design for scale and resilience"],
    ["cloud", "Cloud Platforms", "AWS, GCP, Kubernetes"],
    ["ai", "Applied AI", "Practical, production-ready"],
    ["chart", "Observability", "Metrics, tracing, reliability"],
    ["lock", "Security", "Zero trust, least privilege"]
  ] as const;

  return (
    <section aria-label="Engineering capabilities" className="border-b border-t border-portfolio-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
        {capabilities.map(([icon, title, description]) => (
          <div className="border-portfolio-border py-5 sm:px-5 lg:border-l lg:first:border-l-0" key={title}>
            <LineIcon type={icon} />
            <h2 className="mt-2.5 text-base font-semibold leading-tight text-portfolio-ink">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-portfolio-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  const metrics = [
    ["500K+", "Nodes Managed", "(at peak)"],
    ["Millions", "Users / Requests", "(at peak)"],
    ["Global", "Cloud & Enterprise", "Environments"],
    ["Real Impact", "From infrastructure", "to customer outcomes"]
  ];

  return (
    <section id="about" className="scroll-mt-24 bg-portfolio-surface pt-7 pb-4 sm:pt-9 sm:pb-5 lg:pt-10 lg:pb-5">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_0.46fr] lg:items-start">
        <div>
          <div className="max-w-3xl">
            <p className={eyebrow}>About</p>
            <h2 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-portfolio-ink sm:text-[2.45rem]">
              Technical leadership for distributed platforms.
            </h2>
          </div>
          <p className="mt-2.5 max-w-4xl text-lg font-normal leading-8 text-portfolio-body sm:mt-3">
            I architect and build distributed backend systems, cloud-native platforms, and secure
            AI-enabled infrastructure. I&apos;m passionate about building reliable systems,
            enabling teams, and solving complex problems that have a real impact on customers and
            businesses.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([value, label, detail]) => (
              <div className="border-l border-portfolio-border pl-4" key={value}>
                <p className="text-[1.45rem] font-bold leading-tight tracking-[-0.025em] text-portfolio-accent">
                  {value}
                </p>
                <p className="mt-2 text-sm font-semibold leading-tight text-portfolio-ink">{label}</p>
                <p className="mt-1 text-sm leading-5 text-portfolio-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-portfolio-border bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_10px_28px_rgba(7,17,38,0.04)] lg:mt-8">
          <blockquote className="mt-1 text-base font-normal italic leading-7 text-portfolio-body">
            “Great systems aren&apos;t just about technology. They&apos;re about people, clear
            abstractions, and the discipline to make the right trade-offs.”
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-portfolio-ink">— Ravinder Varkali</p>
          <div className="mt-6 border-t border-portfolio-border pt-5">
            <p className={eyebrow}>Primary Languages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...profile.languages, "Python"].map((language) => (
                <span className={chip} key={language}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function FeaturedEngineeringSection() {
  const [grpcProject, agentTrustProject] = featuredProjects;
  const projects = [
    {
      title: grpcProject.title,
      category: "Distributed Systems",
      description:
        "End-to-end reference implementation demonstrating secure, observable, production-grade microservices using Go and gRPC.",
      technologies: ["Go", "gRPC", "PostgreSQL", "OpenTelemetry"],
      href: grpcProject.caseStudyHref ?? "/projects/grpc-microservices-reference",
      githubHref: grpcProject.href,
      image: {
        src: "/images/projects/grpc-microservices.png",
        alt: "Isometric illustration of clients communicating with gRPC services, service-owned PostgreSQL databases, and OpenTelemetry."
      },
      lightboxTitle: "gRPC Microservices Reference Architecture Overview"
    },
    {
      title: "AgentTrust SDK",
      category: "Applied AI",
      description:
        "Open-source SDK for least-privilege identity, tool authorization, and audit for AI agents, with MCP and LangChain integration.",
      technologies: ["Python", "MCP", "JWT", "Audit"],
      href: agentTrustProject?.caseStudyHref ?? "/projects/agenttrust",
      githubHref: agentTrustProject?.href,
      image: {
        src: "/images/projects/agenttrust.png",
        alt: "Isometric illustration of an AI agent using scoped identity and authorization before controlled tool execution and audit."
      },
      lightboxTitle: "AgentTrust SDK Identity, Authorization & Audit Architecture"
    },
    {
      title: "Observability & Troubleshooting Platform",
      category: "Platform Engineering",
      description:
        "Distributed observability and troubleshooting platform spanning scalable backend architecture, reliability engineering, secure service design, and technical leadership.",
      technologies: ["Kubernetes", "Redis", "PostgreSQL", "OpenTelemetry"],
      href: "/projects/observability-troubleshooting-platform",
      ctaLabel: "View Experience →",
      image: {
        src: "/images/projects/observability-platform.png",
        alt: "Isometric illustration of distributed agents, a control plane, data services, observability pipeline, and troubleshooting dashboard."
      },
      lightboxTitle:
        "Observability & Troubleshooting Platform Distributed Observability Architecture"
    }
  ];

  return (
    <Section
      id="featured-engineering"
      eyebrow="Featured Engineering"
      title="Selected projects and case studies."
      className="bg-white"
      contentClassName="mt-6 sm:mt-7"
      paddingClassName="pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-8 lg:pb-10"
    >
      <div className="-mt-14 flex justify-end pb-5 sm:-mt-16">
        <LinkButton href={profile.github} variant="tertiary" newTab>
          View all projects →
        </LinkButton>
      </div>
      <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard {...project} key={project.title} />
        ))}
      </div>
    </Section>
  );
}

export function CareerSummarySection() {
  const companies = ["Zscaler", "VMware", "Asurion", "Apple/Wipro", "IBM"];
  const education = ["M.Tech, IIT Madras", "B.Tech, Osmania University"];
  const certifications = [
    "AWS Certified Solutions Architect — Associate",
    "Zscaler Zero Trust Cyber Associate (ZTCA)",
    "Deep Learning Specialization — DeepLearning.AI"
  ];
  const summaries = [
    { icon: "briefcase" as const, title: "Experience", items: companies },
    { icon: "award" as const, title: "Recognition", items: recognition },
    { icon: "education" as const, title: "Education", items: education },
    { icon: "cert" as const, title: "Certifications", items: certifications }
  ];

  return (
    <section className="border-y border-portfolio-border bg-portfolio-surface pb-12 pt-12 sm:pb-14 sm:pt-14 lg:pb-12 lg:pt-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={eyebrow}>Experience & Credentials</p>
            <h2 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-portfolio-ink sm:text-[2.45rem]">
              Engineering experience built across systems at scale.
            </h2>
          </div>
          <LinkButton href={profile.resume} variant="tertiary" newTab>
            View Resume →
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-y-7 sm:grid-cols-2 lg:grid-cols-[0.95fr_1.05fr_0.95fr_1.25fr]">
          {summaries.map((summary, index) => (
            <div
              className={`border-portfolio-border pt-7 first:pt-0 sm:pt-0 ${
                index > 0 ? "border-t sm:border-t-0" : ""
              } ${
                index % 2 === 0
                  ? "sm:border-r sm:pr-6"
                  : "sm:pl-6"
              } lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0`}
              key={summary.title}
            >
              <LineIcon type={summary.icon} />
              <h3 className="mt-3 text-base font-semibold uppercase leading-tight text-portfolio-ink">
                {summary.title}
              </h3>
              <div className="mt-3 space-y-2 text-sm leading-6 text-portfolio-body">
                {summary.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only">
        {experienceHighlights.map((item) => `${item.company}: ${item.role}`).join("; ")}
      </p>
    </section>
  );
}

export function Footer() {
  const iconLinkClass =
    "inline-flex size-9 items-center justify-center rounded-md text-[#B8C5D8] transition-colors hover:bg-white/5 hover:text-[#F8FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60A5FA]";
  const footerTextLinkClass =
    "inline-flex min-h-9 items-center rounded-md px-2.5 text-[#B8C5D8] transition-colors hover:bg-white/5 hover:text-[#F8FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60A5FA]";

  return (
    <footer className="bg-portfolio-navy py-5 sm:py-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-bold tracking-[-0.02em] text-[#F8FAFC]">
              Ravinder <span className="text-[#93C5FD]">Varkali</span>
            </p>
            <p className="mt-1 text-sm font-normal text-[#B8C5D8]">
              Distributed Systems · Cloud Platforms · Applied AI
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-1.5 text-sm font-medium" aria-label="Footer links">
            <Link
              aria-label="LinkedIn profile"
              className={iconLinkClass}
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V8.98h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.3ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47Z" />
              </svg>
            </Link>
            <Link
              aria-label="GitHub profile"
              className={iconLinkClass}
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.86 8.35 6.84 9.7.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.99c.85 0 1.69.12 2.49.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.74c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  fillRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              aria-label="Email Ravinder Varkali"
              className={iconLinkClass}
              href={`mailto:${profile.email}`}
            >
              <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.5h16v11H4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 7 5 7-5" />
              </svg>
            </Link>
            <Link
              className={footerTextLinkClass}
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </Link>
          </nav>
        </div>
        <p className="mt-4 border-t border-[#2B3D57] pt-3 text-sm text-[#AFC0D8]">
          © 2026 Ravinder Varkali. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
