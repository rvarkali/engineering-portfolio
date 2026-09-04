import Image from "next/image";
import Link from "next/link";
import type { CaseStudy, CaseStudyDecision, EvidenceItem } from "@/data/case-studies";
import { DiagramLightboxButton } from "./DiagramLightboxButton";
import { LinkButton } from "./LinkButton";

const pageShell = "mx-auto max-w-6xl px-5 sm:px-8";
const cardSurface = "rounded-lg border border-white/[0.16] bg-white/[0.045] shadow-soft-border";
const labelText = "text-xs font-semibold uppercase tracking-[0.16em]";
const mutedLabel = `${labelText} text-slate-300`;
const metadataLabel = `${labelText} text-blue-200`;
const sectionTitle = "mt-3 text-3xl font-[620] leading-tight text-slate-50 sm:text-4xl";
const cardTitle = "text-lg font-[620] leading-snug text-slate-50";
const compactCardTitle = "text-base font-[620] leading-snug text-slate-50";
const bodyText = "text-sm leading-6 text-slate-200/90 sm:text-base sm:leading-8";
const compactBodyText = "text-sm leading-6 text-slate-200/90";
const chip =
  "rounded-md border border-slate-400/45 bg-slate-900/75 px-2 py-1 text-sm font-[560] leading-[1.4] text-slate-100 sm:px-2.5 sm:py-1.5";

function CaseStudySection({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10 font-sans sm:py-14">
      <div className={pageShell}>
        <div className="max-w-3xl">
          <p className={`${labelText} text-blue-300 sm:text-sm`}>{eyebrow}</p>
          <h2 className={sectionTitle}>{title}</h2>
          {description ? <p className={`mt-4 ${bodyText}`}>{description}</p> : null}
        </div>
        <div className="mt-7 sm:mt-9">{children}</div>
      </div>
    </section>
  );
}

function CapabilityGrid({ groups }: { groups: CaseStudy["demonstrates"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <article className={`${cardSurface} p-4 sm:p-5`} key={group.title}>
          <h3 className={compactCardTitle}>{group.title}</h3>
          <ul className="mt-4 space-y-2.5">
            {group.items.map((item) => (
              <li className={`flex gap-2 ${compactBodyText}`} key={item}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ArchitectureDiagram({ caseStudy }: { caseStudy: CaseStudy }) {
  if (caseStudy.architecture.diagram === "agenttrust-boundary") {
    return <AgentTrustBoundaryDiagram caseStudy={caseStudy} />;
  }

  return (
    <div
      aria-label="Architecture diagram showing caller, authorization, Diagnostic Service, Catalog Service, service-owned PostgreSQL persistence, OpenTelemetry, Jaeger, and Prometheus."
      className={`${cardSurface} p-4 sm:p-6`}
      role="img"
    >
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.1fr] lg:items-center">
        <div className="space-y-3">
          <DiagramNode label="Caller / client" tone="blue" />
          <Connector label="JWT + RBAC" />
          <div className="grid gap-3 sm:grid-cols-2">
            <DiagramNode label="Diagnostic Service" tone="violet" />
            <DiagramNode label="Catalog Service" tone="slate" />
          </div>
          <Connector label="service-owned persistence" />
          <div className="grid gap-3 sm:grid-cols-2">
            <DiagramNode label="Diagnostics schema" tone="amber" />
            <DiagramNode label="Catalog schema" tone="amber" />
          </div>
        </div>
        <div className="rounded-lg border border-blue-200/25 bg-blue-200/[0.055] p-4 sm:p-5">
          <p className={metadataLabel}>Telemetry path</p>
          <div className="mt-4 grid gap-3">
            <DiagramNode label="OpenTelemetry Collector" tone="blue" />
            <div className="grid gap-3 sm:grid-cols-2">
              {caseStudy.architecture.telemetry.slice(1).map((tool) => (
                <DiagramNode label={tool} tone="slate" key={tool} />
              ))}
            </div>
          </div>
          <p className={`mt-5 ${bodyText}`}>{caseStudy.architecture.summary}</p>
        </div>
      </div>
    </div>
  );
}

function AgentTrustBoundaryDiagram({ caseStudy }: { caseStudy: CaseStudy }) {
  const description =
    "AgentTrust SDK boundary diagram: LLM or agent enters the host application, host routes guarded calls through AgentTrust identity and policy, authorization either denies and audits or allows a guarded adapter to invoke a tool or MCP client. Raw client or tool references are outside the SDK boundary.";

  return (
    <div aria-label={description} className={`${cardSurface} p-4 sm:p-6`} role="img">
      <p className="sr-only">{description}</p>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-3">
          <DiagramNode label="LLM / Agent" tone="blue" />
          <Connector label="requests action" />
          <DiagramNode label="Host Application" tone="slate" />
          <Connector label="enforced path" />
          <div className="rounded-lg border border-blue-200/30 bg-blue-200/[0.055] p-4">
            <p className={metadataLabel}>AgentTrust SDK</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DiagramNode label="Identity + Policy" tone="blue" />
              <DiagramNode label="Authorization" tone="violet" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className={`${labelText} text-red-200`}>Deny</p>
                <div className="mt-2 rounded-md border border-red-200/30 bg-red-300/[0.08] p-3 text-sm font-[620] leading-snug text-red-50">
                  Audit deny + ToolDenied
                </div>
              </div>
              <div>
                <p className={`${labelText} text-emerald-200`}>Allow</p>
                <div className="mt-2 rounded-md border border-emerald-200/30 bg-emerald-300/[0.08] p-3 text-sm font-[620] leading-snug text-emerald-50">
                  Guarded adapter executes
                </div>
              </div>
            </div>
          </div>
          <Connector label="allow only" />
          <DiagramNode label="Tool / MCP Client" tone="amber" />
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200/25 bg-red-300/[0.06] p-4 sm:p-5">
            <p className={`${labelText} text-red-200`}>Outside SDK boundary</p>
            <p className={`mt-3 ${bodyText}`}>
              {caseStudy.architecture.outsideBoundary}
            </p>
            <div className="mt-4 grid gap-2">
              <DiagramNode label="Raw MCP session" tone="slate" />
              <DiagramNode label="Direct tool reference" tone="slate" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-400/25 bg-slate-900/60 p-4 sm:p-5">
            <p className={metadataLabel}>Components</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {caseStudy.architecture.components.map((component) => (
                <span className={chip} key={component}>
                  {component}
                </span>
              ))}
            </div>
            <p className={`mt-5 ${bodyText}`}>{caseStudy.architecture.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramNode({ label, tone }: { label: string; tone: "blue" | "violet" | "slate" | "amber" }) {
  const tones = {
    blue: "border-blue-200/35 bg-blue-300/[0.08] text-blue-50",
    violet: "border-violet-200/35 bg-violet-300/[0.08] text-violet-50",
    slate: "border-slate-500/45 bg-slate-900/70 text-slate-100",
    amber: "border-amber-200/35 bg-amber-200/[0.1] text-amber-50"
  };

  return (
    <div
      className={`flex min-h-14 items-center justify-center rounded-md border px-3 py-3 text-center text-sm font-[620] leading-snug sm:leading-normal ${tones[tone]}`}
    >
      {label}
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="h-5 w-px bg-slate-500/40" />
      <p className={`${labelText} text-slate-300`}>{label}</p>
      <div className="h-5 w-px bg-slate-500/40" />
    </div>
  );
}

function ResponsibilityGrid({ items }: { items: CaseStudy["responsibilities"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article className={`${cardSurface} p-4 sm:p-6`} key={item.service}>
          <h3 className={cardTitle}>{item.service}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ResponsibilityList title="Owns" items={item.owns} />
            <ResponsibilityList title="Exposes" items={item.exposes} />
            <ResponsibilityList title="Depends on" items={item.dependsOn} />
            <div className="rounded-md border border-amber-200/30 bg-amber-200/[0.09] p-3">
              <p className={mutedLabel}>Persistence</p>
              <p className={`mt-2 ${compactBodyText} text-amber-50`}>{item.persistence}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ResponsibilityList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className={mutedLabel}>{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li className={compactBodyText} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestFlow({ flow }: { flow: CaseStudy["requestFlows"][number] }) {
  const isGrpcDiagnosticFlow = flow.title === "Create Diagnostic Job";
  const authorizationBranches = flow.layout === "authorization-branch" ? flow.branches : undefined;
  const mainPath = isGrpcDiagnosticFlow
    ? [
        "Caller",
        "JWT Authentication / RBAC",
        "Diagnostic Service",
        "Diagnostic Job Persistence",
        "Response"
      ]
    : flow.steps;
  const description = isGrpcDiagnosticFlow
    ? "Create Diagnostic Job request flow: Caller sends a request through JWT authentication and RBAC to the Diagnostic Service. Diagnostic Service performs a gRPC lookup to Catalog Service as a downstream dependency, then writes to Diagnostic Job Persistence and returns a response."
    : authorizationBranches
      ? `${flow.title} flow: ${flow.steps.join(" to ")}, then branches to deny path: ${authorizationBranches.deny.join(" to ")}, or allow path: ${authorizationBranches.allow.join(" to ")}.`
      : `${flow.title} flow: ${flow.steps.join(" to ")}.`;

  return (
    <article className={`${cardSurface} p-4 sm:p-6`}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h3 className={cardTitle}>{flow.title}</h3>
          <p className={`mt-3 ${bodyText}`}>{flow.summary}</p>
          <div className="mt-5" aria-label={description} role="img">
            <p className="sr-only">{description}</p>
            {mainPath.map((step, index) => (
              <div className="flex flex-col items-center" key={step}>
                <div className="w-full max-w-xl">
                  <div className="flex min-h-12 items-center justify-center rounded-md border border-slate-400/40 bg-slate-900/75 px-3 py-2 text-center text-sm font-[620] leading-snug text-slate-100">
                    {step}
                  </div>
                  {isGrpcDiagnosticFlow && step === "Diagnostic Service" ? (
                    <div className="ml-4 mt-3 border-l border-blue-200/35 pl-4">
                      <div className="rounded-md border border-blue-200/25 bg-blue-200/[0.055] p-3">
                        <p className={`${labelText} text-blue-200`}>Downstream dependency</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-center">
                          <div className="hidden h-px w-8 bg-blue-200/45 sm:block" aria-hidden="true" />
                          <p className={`${labelText} text-slate-300`}>gRPC lookup</p>
                          <div className="rounded-md border border-slate-400/40 bg-slate-900/75 px-3 py-2 text-center text-sm font-[620] leading-snug text-slate-100">
                            Catalog Service
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                {index < mainPath.length - 1 ? (
                  <div className="flex flex-col items-center py-2" aria-hidden="true">
                    <div className="h-5 w-px bg-blue-200/35" />
                    <span className="text-sm font-semibold leading-none text-blue-200/75">↓</span>
                    <div className="h-5 w-px bg-blue-200/35" />
                  </div>
                ) : null}
              </div>
            ))}
            {authorizationBranches ? (
              <div className="mt-4">
                <div className="mx-auto h-5 w-px bg-blue-200/35" aria-hidden="true" />
                <div
                  className="mx-auto hidden h-6 max-w-xl border-x border-t border-blue-200/35 sm:block"
                  aria-hidden="true"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FlowBranch
                    label="Deny"
                    tone="deny"
                    steps={authorizationBranches.deny}
                  />
                  <FlowBranch
                    label="Allow"
                    tone="allow"
                    steps={authorizationBranches.allow}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="rounded-lg border border-blue-200/25 bg-blue-200/[0.055] p-4">
          <p className={metadataLabel}>Where controls apply</p>
          <ul className="mt-3 space-y-2">
            {flow.notes.map((note) => (
              <li className={compactBodyText} key={note}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function FlowBranch({
  label,
  steps,
  tone
}: {
  label: string;
  steps: string[];
  tone: "allow" | "deny";
}) {
  const toneClassNames =
    tone === "allow"
      ? "border-emerald-200/35 bg-emerald-300/[0.08] text-emerald-50"
      : "border-red-200/35 bg-red-300/[0.08] text-red-50";
  const labelClassName = tone === "allow" ? "text-emerald-200" : "text-red-200";

  return (
    <div className="rounded-lg border border-slate-400/25 bg-slate-950/45 p-3 sm:p-4">
      <p className={`${labelText} text-center ${labelClassName}`}>{label}</p>
      <div className="mt-3 flex flex-col items-center">
        {steps.map((step, index) => (
          <div className="flex w-full flex-col items-center" key={step}>
            <div
              className={`flex min-h-12 w-full items-center justify-center rounded-md border px-3 py-2 text-center text-sm font-[620] leading-snug ${toneClassNames}`}
            >
              {step}
            </div>
            {index < steps.length - 1 ? (
              <div className="flex flex-col items-center py-2" aria-hidden="true">
                <div className="h-4 w-px bg-slate-500/40" />
                <span className="text-sm font-semibold leading-none text-slate-300">↓</span>
                <div className="h-4 w-px bg-slate-500/40" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionCard({ decision }: { decision: CaseStudyDecision }) {
  return (
    <article className={`${cardSurface} p-4 sm:p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className={cardTitle}>{decision.title}</h3>
        {decision.sourceHref ? (
          <Link
            className="text-sm font-semibold text-blue-200 underline decoration-blue-200/40 underline-offset-4 hover:text-blue-100"
            href={decision.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source ADR
          </Link>
        ) : null}
      </div>
      <dl className="mt-4 space-y-3">
        <DecisionTerm term="Context" detail={decision.context} />
        <DecisionTerm term="Decision" detail={decision.decision} />
        <DecisionTerm term="Trade-off" detail={decision.consequence} />
      </dl>
    </article>
  );
}

function DecisionTerm({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className={mutedLabel}>{term}</dt>
      <dd className={`mt-1.5 ${compactBodyText}`}>{detail}</dd>
    </div>
  );
}

function TrustBoundary({ caseStudy }: { caseStudy: CaseStudy }) {
  const path = caseStudy.architecture.securityBoundaryPath ?? [
    "Caller",
    "Service boundary",
    "Application logic",
    "PostgreSQL"
  ];
  const outsideBoundaryLabel = caseStudy.architecture.outsideBoundaryLabel;

  return (
    <div className={`${cardSurface} p-4 sm:p-6`}>
      <div className={`grid gap-3 ${path.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        {path.map((label, index) => (
          <div className="flex flex-col items-center gap-3" key={label}>
            <DiagramNode
              label={label}
              tone={index === 0 ? "blue" : index === path.length - 1 ? "amber" : "slate"}
            />
            {index < path.length - 1 ? (
              <p className={`${labelText} text-center text-slate-300 sm:hidden`}>
                then
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {outsideBoundaryLabel && caseStudy.architecture.outsideBoundary ? (
        <div className="mt-5 rounded-lg border border-red-200/25 bg-red-300/[0.06] p-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.1fr)] sm:items-center">
            <DiagramNode label={outsideBoundaryLabel} tone="slate" />
            <p className={`${labelText} hidden text-center text-red-200 sm:block`}>outside</p>
            <div className={`rounded-md border border-red-200/30 bg-red-300/[0.08] p-3 ${compactBodyText} text-red-50`}>
              {caseStudy.architecture.outsideBoundary}
            </div>
          </div>
        </div>
      ) : null}
      <div className="mt-6 grid gap-2 md:grid-cols-2">
        {caseStudy.security.map((item) => (
          <div
            className={`rounded-md border border-slate-400/30 bg-slate-900/60 p-3 ${compactBodyText}`}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleCardGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div className={`${cardSurface} p-4 ${compactBodyText}`} key={item}>
          {item}
        </div>
      ))}
    </div>
  );
}

function EvidenceSection({ evidence }: { evidence: NonNullable<CaseStudy["evidence"]> }) {
  const [featuredItem, ...supportingItems] = evidence.items;

  return (
    <div className="space-y-5 sm:space-y-6">
      {featuredItem ? <EvidenceCard item={featuredItem} priority /> : null}
      {supportingItems.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {supportingItems.map((item) => (
            <EvidenceCard item={item} key={item.title} />
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-4 rounded-lg border border-blue-200/25 bg-blue-200/[0.055] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className={compactBodyText}>{evidence.boundary}</p>
        <LinkButton href={evidence.sourceUrl} newTab>
          View Full Runtime Evidence →
        </LinkButton>
      </div>
    </div>
  );
}

function EvidenceCard({ item, priority = false }: { item: EvidenceItem; priority?: boolean }) {
  return (
    <article className={`${cardSurface} overflow-hidden`}>
      {item.image && item.imageAlt && item.imageWidth && item.imageHeight ? (
        <Link
          aria-label={`Open full-size evidence screenshot for ${item.title}`}
          className="block border-b border-white/[0.12] bg-slate-950/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-300"
          href={item.image}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            alt={item.imageAlt}
            className="h-auto w-full"
            height={item.imageHeight}
            priority={priority}
            sizes={priority ? "(min-width: 1152px) 1152px, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            src={item.image}
            width={item.imageWidth}
          />
        </Link>
      ) : null}
      <div className={priority ? "p-4 sm:p-6" : "p-4"}>
        <p className={metadataLabel}>{item.category}</p>
        <h3 className={`mt-2 ${priority ? cardTitle : compactCardTitle}`}>{item.title}</h3>
        <p className={`mt-3 ${priority ? bodyText : compactBodyText}`}>{item.description}</p>
        {item.transcript ? (
          <pre className="mt-4 whitespace-pre-wrap break-words rounded-md border border-slate-400/25 bg-slate-950/80 p-3 text-[13px] leading-6 text-slate-100 sm:text-sm">
            <code>{item.transcript.join("\n")}</code>
          </pre>
        ) : null}
        <dl className="mt-4 grid gap-3">
          <EvidenceTerm term="Result" detail={item.result} />
          <EvidenceTerm term="Boundary" detail={item.limitation} />
        </dl>
      </div>
    </article>
  );
}

function EvidenceTerm({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className={mutedLabel}>{term}</dt>
      <dd className={`mt-1.5 ${compactBodyText}`}>{detail}</dd>
    </div>
  );
}

function GrpcReferencePage({ caseStudy }: { caseStudy: CaseStudy }) {
  const primaryFlow = caseStudy.requestFlows[0];
  const featuredEvidence = caseStudy.evidence?.items[0];
  const supportingEvidence = caseStudy.evidence?.items.slice(1, 4) ?? [];
  const primaryDecisions = caseStudy.decisions.filter((decision) =>
    [
      "Contract-first gRPC APIs",
      "Service-owned persistence",
      "Durable jobs and transactional outbox",
      "Bounded retry for transient downstream failures"
    ].includes(decision.title)
  );
  const coreHighlights = [
    {
      label: "2",
      title: "Service boundaries",
      detail: "Catalog and Diagnostic services communicate through explicit APIs."
    },
    {
      label: "DB",
      title: "Service-owned persistence",
      detail: "Each service owns its own PostgreSQL schema and application role."
    },
    {
      label: "JWT",
      title: "JWT + RBAC",
      detail: "Least-privilege checks are enforced at service boundaries."
    },
    {
      label: "OTel",
      title: "OpenTelemetry",
      detail: "Traces, metrics, and logs make local runtime behavior inspectable."
    }
  ];

  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.12),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-7 sm:py-10`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LinkButton href="/" variant="tertiary">
              ← Back to Portfolio
            </LinkButton>
            <nav className="hidden items-center gap-6 text-sm font-[620] text-slate-600 md:flex" aria-label="Case study sections">
              <a className="hover:text-portfolio-accent" href="#overview">Overview</a>
              <a className="hover:text-portfolio-accent" href="#architecture">Architecture</a>
              <a className="hover:text-portfolio-accent" href="#decisions">Decisions</a>
              <a className="hover:text-portfolio-accent" href="#runtime-evidence">Evidence</a>
            </nav>
            <LinkButton href={caseStudy.repositoryUrl} newTab variant="primary">
              View on GitHub ↗
            </LinkButton>
          </div>

          <div id="overview" className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">{caseStudy.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-[720] leading-[1.04] tracking-normal text-[#050b2d] sm:text-5xl lg:text-6xl">
                {caseStudy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                {caseStudy.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {caseStudy.stack.map((item) => (
                  <span
                    className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm font-[620] text-slate-700"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-blue-100 bg-white/86 p-3 shadow-[0_18px_60px_rgba(15,45,88,0.08)] sm:grid-cols-2">
              {coreHighlights.map((item) => (
                <article className="min-h-32 rounded-md border border-blue-100 bg-slate-50/85 p-5" key={item.title}>
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                      {item.label}
                    </span>
                    <div>
                      <h2 className="text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LightSection id="architecture" eyebrow="System Architecture" title="A minimal, production-inspired distributed system." description={caseStudy.architecture.summary}>
        {caseStudy.architecture.asset ? (
          <DiagramLightboxButton
            asset={caseStudy.architecture.asset}
            label="View architecture"
            lightboxTitle="System Architecture"
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
          />
        ) : (
          <ArchitectureDiagram caseStudy={caseStudy} />
        )}
      </LightSection>

      <LightSection id="decisions" eyebrow="Engineering Decisions" title="Key engineering decisions" description="Trade-offs that make the system reliable, secure, and maintainable.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primaryDecisions.map((decision) => (
            <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={decision.title}>
              <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{decision.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{decision.decision}</p>
              {decision.sourceHref ? (
                <Link className="mt-4 inline-flex text-sm font-bold text-portfolio-accent hover:text-blue-700" href={decision.sourceHref} target="_blank" rel="noopener noreferrer">
                  View ADR →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </LightSection>

      <LightSection id="request-flow" eyebrow="Runtime Behavior" title="From request to response, with failure handling." description={primaryFlow?.summary}>
        {primaryFlow?.asset ? (
          <DiagramLightboxButton
            asset={primaryFlow.asset}
            label="View flow"
            lightboxTitle="Diagnostic Job Request Flow"
            sizes="(min-width: 1152px) 1152px, 100vw"
          />
        ) : primaryFlow ? (
          <RequestFlow flow={primaryFlow} />
        ) : null}
      </LightSection>

      <section className="border-y border-portfolio-border bg-slate-50">
        <div className={`${pageShell} grid gap-4 py-10 lg:grid-cols-2`}>
          <LightDetailPanel eyebrow="Security Boundaries" title="Defense in depth at service boundaries." items={caseStudy.security.slice(0, 4)} />
          <LightDetailPanel eyebrow="Observability" title="Built for inspection, not just operation." items={caseStudy.observability.slice(0, 4)} />
        </div>
      </section>

      {caseStudy.evidence ? (
        <section id="runtime-evidence" className="scroll-mt-24 bg-[linear-gradient(180deg,#071126,#020617)] py-11 text-white sm:py-14">
          <div className={pageShell}>
            <p className={metadataLabel}>Runtime Evidence</p>
            <div className="mt-3 grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <h2 className="text-3xl font-[720] leading-tight sm:text-4xl">{caseStudy.evidence.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{caseStudy.evidence.summary}</p>
                <div className="mt-6">
                  <LinkButton href={caseStudy.evidence.sourceUrl} newTab>
                    View Full Runtime Evidence →
                  </LinkButton>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                {featuredEvidence ? <EvidenceCard item={featuredEvidence} priority /> : null}
                <div className="grid gap-3">
                  {supportingEvidence.map((item) => (
                    <article className="rounded-lg border border-white/15 bg-white/[0.06] p-4" key={item.title}>
                      <p className={metadataLabel}>{item.category}</p>
                      <h3 className="mt-2 text-base font-[720] text-slate-50">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.result}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <LightSection id="scope" eyebrow="Scope And Limitations" title="A focused reference implementation." description={caseStudy.evidence?.boundary}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <CompactScopeList items={caseStudy.nonGoals.slice(0, 3)} />
          <LinkButton href={caseStudy.repositoryUrl} newTab variant="primary">
            Explore the implementation on GitHub ↗
          </LinkButton>
        </div>
      </LightSection>
    </main>
  );
}

function LightSection({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-portfolio-border py-10 sm:py-14">
      <div className={pageShell}>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-[720] leading-tight text-[#050b2d] sm:text-4xl">{title}</h2>
          {description ? <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{description}</p> : null}
        </div>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

function LightDetailPanel({
  eyebrow,
  title,
  items
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)] sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-[720] leading-tight text-[#050b2d]">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-600" key={item}>
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CompactScopeList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <p className="border-l-2 border-blue-200 pl-3 text-sm leading-6 text-slate-600" key={item}>
          {item}
        </p>
      ))}
    </div>
  );
}

function AgentTrustPage({ caseStudy }: { caseStudy: CaseStudy }) {
  const primaryFlow = caseStudy.requestFlows[0];
  const docsHref = `${caseStudy.repositoryUrl}/blob/main/docs/threat-model.md`;
  const evidenceHref = caseStudy.evidence?.sourceUrl ?? `${caseStudy.repositoryUrl}/blob/main/docs/evidence/README.md`;
  const heroHighlights = [
    {
      label: "LP",
      title: "Least privilege",
      detail: "Per-run scopes limit what a known agent can request."
    },
    {
      label: "Auth",
      title: "Tool authorization",
      detail: "Guarded calls check required scope before execution."
    },
    {
      label: "Audit",
      title: "Auditability",
      detail: "Allow, deny, and error outcomes are written to local JSONL."
    },
    {
      label: "MCP",
      title: "Framework integration",
      detail: "MCP and LangChain adapters use the same guarded SDK path."
    }
  ];
  const capabilityGroups = [
    {
      title: "Agent Identity",
      items: ["per-run identity", "short-lived JWT", "agent/run/token correlation"]
    },
    {
      title: "Tool Authorization",
      items: ["scope checks before execution", "deny-by-default unknown agents", "out-of-scope calls blocked"]
    },
    {
      title: "Auditability",
      items: ["allow and deny records", "redacted arguments", "local JSONL audit sink"]
    },
    {
      title: "Framework / MCP Integration",
      items: ["direct and decorator calls", "MCP guarded client", "LangChain StructuredTool wrappers"]
    }
  ];
  const decisionCards = [
    caseStudy.decisions.find((decision) => decision.title === "Short-lived scoped run identity"),
    caseStudy.decisions.find((decision) => decision.title === "SDK-first enforcement instead of gateway"),
    caseStudy.decisions.find((decision) => decision.title === "Local JSONL audit"),
    caseStudy.decisions.find((decision) => decision.title === "Guarded adapters")
  ].filter((decision): decision is CaseStudyDecision => Boolean(decision));
  const conciseDecisionCopy: Record<string, { decision: string; why: string; tradeoff: string }> = {
    "Short-lived scoped run identity": {
      decision: "Issue per-run identity with agent, run, scopes, token ID, issuer, issue time, and expiry.",
      why: "Long-lived agent authority is harder to correlate and bound per tool session.",
      tradeoff: "Exposure and audit correlation improve; revocation and key rotation remain future hardening."
    },
    "SDK-first enforcement instead of gateway": {
      decision: "Keep enforcement in-process and route cooperative tool calls through AgentTrust.",
      why: "The first milestone needed to embed easily without introducing a network service.",
      tradeoff: "Integration stays lightweight, but raw-client access can bypass the SDK boundary."
    },
    "Local JSONL audit": {
      decision: "Write local JSONL events for guarded allow, deny, and error outcomes.",
      why: "The SDK needed an inspectable audit trail without requiring infrastructure.",
      tradeoff: "The trail is portable, but not immutable or tamper-evident."
    },
    "Guarded adapters": {
      decision: "Route direct calls, LangChain tools, and MCP calls through the same AgentRun path.",
      why: "LLM-selected tools should not execute just because the model chose them.",
      tradeoff: "Enforcement is consistent for guarded paths, but depends on staying inside wrappers."
    }
  };
  const integrations = [
    {
      title: "MCP",
      detail: "GuardedMCPClient maps tool names to AgentTrust scopes before calling the wrapped MCP session."
    },
    {
      title: "LangChain",
      detail: "StructuredTool wrappers route sync and async tools through AgentRun authorization and audit."
    },
    {
      title: "Python agents",
      detail: "Direct calls and decorators cover custom first-party agent code without framework coupling."
    }
  ];
  const currentScope = [
    "SDK-first, in-process enforcement for cooperative code.",
    "Short-lived scoped JWT run identities issued by AgentTrust.start_run.",
    "Local JSONL audit records for guarded allow, deny, and error outcomes.",
    "Direct, decorator, MCP, and LangChain guarded integration paths."
  ];
  const outsideScope = [
    "Hard gateway or sidecar enforcement.",
    "Managed control plane or centralized policy administration.",
    "Tamper-evident audit storage, SIEM pipeline, revocation, or key rotation.",
    "Protection from compromised hosts, raw-client bypass, or malicious tool internals."
  ];

  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.11),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-7 sm:py-10`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LinkButton href="/" variant="tertiary">
              ← Back to Portfolio
            </LinkButton>
            <nav className="hidden items-center gap-6 text-sm font-[620] text-slate-600 md:flex" aria-label="Case study sections">
              <a className="hover:text-portfolio-accent" href="#overview">Overview</a>
              <a className="hover:text-portfolio-accent" href="#architecture">Architecture</a>
              <a className="hover:text-portfolio-accent" href="#decisions">Decisions</a>
              <a className="hover:text-portfolio-accent" href="#evidence">Evidence</a>
            </nav>
            <LinkButton href={caseStudy.repositoryUrl} newTab variant="primary">
              View on GitHub ↗
            </LinkButton>
          </div>

          <div id="overview" className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Open Source Project</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-[720] leading-[1.04] tracking-normal text-[#050b2d] sm:text-5xl lg:text-6xl">
                AgentTrust SDK
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                A lightweight Python SDK for least-privilege identity, authorization, and local audit around AI agent tool execution.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Python", "AI Agents", "MCP", "LangChain", "JWT", "Authorization", "Audit", "Least Privilege"].map((item) => (
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm font-[620] text-slate-700" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={caseStudy.repositoryUrl} newTab variant="primary">
                  View on GitHub ↗
                </LinkButton>
                <LinkButton href={docsHref} newTab>
                  Read Threat Model →
                </LinkButton>
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-blue-100 bg-white/86 p-3 shadow-[0_18px_60px_rgba(15,45,88,0.08)] sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <article className="min-h-32 rounded-md border border-blue-100 bg-slate-50/85 p-5" key={item.title}>
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                      {item.label}
                    </span>
                    <div>
                      <h2 className="text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LightSection id="capabilities" eyebrow="Key Capabilities" title="What this demonstrates." description="A practical security layer for agent tools: identity, scoped authorization, audit, and guarded integrations.">
        <LightCapabilityGrid groups={capabilityGroups} />
      </LightSection>

      <LightSection id="architecture" eyebrow="System Architecture" title="Identity, authorization, and audit across the tool execution path." description={caseStudy.architecture.summary}>
        {caseStudy.architecture.asset ? (
          <DiagramLightboxButton
            asset={caseStudy.architecture.asset}
            label="View architecture"
            lightboxTitle="AgentTrust System Architecture"
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
          />
        ) : (
          <ArchitectureDiagram caseStudy={caseStudy} />
        )}
      </LightSection>

      <LightSection id="runtime-flow" eyebrow="Runtime Flow" title="From agent request to authorized tool execution." description={primaryFlow?.summary}>
        {primaryFlow?.asset ? (
          <DiagramLightboxButton
            asset={primaryFlow.asset}
            label="View flow"
            lightboxTitle="AgentTrust Tool Execution Flow"
            sizes="(min-width: 1152px) 1152px, 100vw"
          />
        ) : primaryFlow ? (
          <RequestFlow flow={primaryFlow} />
        ) : null}
      </LightSection>

      <LightSection id="decisions" eyebrow="Engineering Decisions" title="Key engineering decisions" description="Short trade-offs that keep the SDK lightweight, explicit, and inspectable.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {decisionCards.map((decision) => (
            <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={decision.title}>
              <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{decision.title}</h3>
              <dl className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <div>
                  <dt className="font-bold text-slate-800">Decision</dt>
                  <dd>{conciseDecisionCopy[decision.title]?.decision ?? decision.decision}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-800">Why</dt>
                  <dd>{conciseDecisionCopy[decision.title]?.why ?? decision.context}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-800">Trade-off</dt>
                  <dd>{conciseDecisionCopy[decision.title]?.tradeoff ?? decision.consequence}</dd>
                </div>
              </dl>
              {decision.sourceHref ? (
                <Link className="mt-4 inline-flex text-sm font-bold text-portfolio-accent hover:text-blue-700" href={decision.sourceHref} target="_blank" rel="noopener noreferrer">
                  View source →
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </LightSection>

      <section className="border-y border-portfolio-border bg-slate-50">
        <div className={`${pageShell} grid gap-4 py-10 lg:grid-cols-[1.1fr_0.9fr]`}>
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)] sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Security Model</p>
            <h2 className="mt-2 text-2xl font-[720] leading-tight text-[#050b2d]">Authorization before tool invocation, inside an explicit SDK boundary.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              AgentTrust provides soft in-process enforcement for cooperative first-party code routed through guarded SDK calls. It is not a gateway, sandbox, or process-isolation boundary.
            </p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {caseStudy.security.slice(0, 6).map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-slate-600" key={item}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)] sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Integrations</p>
            <h2 className="mt-2 text-2xl font-[720] leading-tight text-[#050b2d]">Framework adapters stay thin.</h2>
            <div className="mt-5 grid gap-3">
              {integrations.map((item) => (
                <div className="rounded-md border border-blue-100 bg-slate-50 p-4" key={item.title}>
                  <h3 className="text-sm font-bold text-[#050b2d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {caseStudy.evidence ? (
        <LightSection id="evidence" eyebrow="Verified Behavior" title="Evidence from tests and local demos." description={caseStudy.evidence.summary}>
          <div className="grid gap-4 lg:grid-cols-3">
            {caseStudy.evidence.items.map((item) => (
              <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={item.title}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-portfolio-accent">{item.category}</p>
                <h3 className="mt-2 text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                {item.transcript ? (
                  <pre className="mt-4 max-h-44 overflow-auto rounded-md border border-slate-200 bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                    <code>{item.transcript.join("\n")}</code>
                  </pre>
                ) : null}
                <p className="mt-4 text-sm font-bold leading-6 text-slate-800">{item.result}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.limitation}</p>
              </article>
            ))}
          </div>
          <div className="mt-5">
            <LinkButton href={evidenceHref} newTab>
              Read Verified Evidence →
            </LinkButton>
          </div>
        </LightSection>
      ) : null}

      <LightSection id="scope" eyebrow="Scope And Limitations" title="Current scope, with the boundary named." description="AgentTrust is useful today as a least-privilege and audit layer for guarded SDK paths. Hard external enforcement remains outside the current implementation.">
        <div className="grid gap-4 lg:grid-cols-2">
          <ScopePanel title="Current Scope" items={currentScope} tone="current" />
          <ScopePanel title="Not Currently Provided / Roadmap" items={outsideScope} tone="outside" />
        </div>
      </LightSection>

      <section className="border-t border-portfolio-border bg-slate-50">
        <div className={`${pageShell} flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Explore The Project</p>
            <h2 className="mt-2 text-2xl font-[720] leading-tight text-[#050b2d]">Get started with AgentTrust</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={caseStudy.repositoryUrl} newTab variant="primary">
              View on GitHub ↗
            </LinkButton>
            <LinkButton href={docsHref} newTab>
              Read Threat Model →
            </LinkButton>
            <LinkButton href="/" variant="tertiary">
              Back to Projects →
            </LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function ObservabilityExperiencePage({ caseStudy }: { caseStudy: CaseStudy }) {
  const heroHighlights = [
    {
      title: "Distributed Platform",
      detail: "Backend services coordinated diagnostics and remediation workflows across a large fleet."
    },
    {
      title: "Large-Scale Fleet",
      detail: "Designed to operate across hundreds of thousands of production nodes."
    },
    {
      title: "Secure Operations",
      detail: "Role-based, auditable workflows reduced the need for direct infrastructure access."
    },
    {
      title: "Observability",
      detail: "Telemetry, logs, and metrics made troubleshooting behavior easier to inspect."
    }
  ];
  const problemCards = [
    {
      title: "Slow diagnostic workflows",
      detail:
        "Complex issues could take hours and required manual data collection across multiple systems."
    },
    {
      title: "Multiple systems and nodes",
      detail:
        "A single issue often required correlating data from many services, clusters, and nodes."
    },
    {
      title: "High operational risk",
      detail:
        "Direct infrastructure access increased security exposure and was difficult to scale safely."
    },
    {
      title: "Need for scale and consistency",
      detail:
        "The platform needed reliable behavior across diverse environments with auditable workflows."
    }
  ];
  const architectureCapabilities = [
    {
      title: "Persistent Storage",
      detail: "Jobs, metadata, and results in PostgreSQL."
    },
    {
      title: "Queueing & Coordination",
      detail: "Command queues, transient state, and agent heartbeats in Redis."
    },
    {
      title: "Observability",
      detail: "Metrics, logs, and traces through OpenTelemetry."
    },
    {
      title: "Security & Access Control",
      detail: "RBAC, audit logs, secure communication, and least privilege."
    }
  ];
  const engineeringChallenges = [
    {
      title: "Distributed Coordination",
      items: [
        "Orchestrate diagnostics across many nodes and environments",
        "Handle concurrent workflows",
        "Maintain consistent state"
      ]
    },
    {
      title: "Fleet-Scale Communication",
      items: [
        "High-frequency agent check-ins",
        "Connection and resource management",
        "Aggregation, batching, and pipelining"
      ]
    },
    {
      title: "Reliability & Failure Handling",
      items: [
        "Graceful handling of partial failures",
        "Bounded timeouts and explicit retry behavior",
        "Scalable, resilient control plane"
      ]
    },
    {
      title: "Security & Least Privilege",
      items: [
        "Role-based access control",
        "Limit direct infrastructure access",
        "Audit logging and traceability"
      ]
    }
  ];
  const impactCards = [
    {
      metric: "~2 hours → ~15 minutes",
      title: "Faster Troubleshooting",
      detail: "Reduced diagnostic workflows from hours to minutes."
    },
    {
      metric: "500,000+",
      title: "Nodes Supported",
      detail: "Scaled to support troubleshooting workflows across hundreds of thousands of nodes."
    },
    {
      metric: "~1,000",
      title: "Support Engineers",
      detail: "Supported a large support engineering organization."
    },
    {
      metric: "Multi-Product",
      title: "Platform Adoption",
      detail: "Integrated with multiple products, with room to expand."
    }
  ];
  const roleAreas = [
    {
      title: "Architecture & Design",
      items: [
        "Defined system architecture and component boundaries",
        "Designed scalable communication for distributed nodes",
        "Made key reliability, security, and operability decisions"
      ]
    },
    {
      title: "Implementation",
      items: [
        "Architected and implemented core backend components",
        "Built node management and command execution services",
        "Optimized high-frequency communication and data flow"
      ]
    },
    {
      title: "Technical Leadership",
      items: [
        "Led design reviews and cross-team collaboration",
        "Drove practices for scalability, reliability, and security",
        "Helped onboard additional products and use cases"
      ]
    },
    {
      title: "Operations & Production",
      items: [
        "Enabled observability, alerting, and operational visibility",
        "Supported rollout and incremental expansion",
        "Participated in failure analysis and continuous improvement"
      ]
    }
  ];
  const lessons = [
    {
      title: "Design for operability",
      detail:
        "Simplicity, clear boundaries, and strong observability make large systems easier to run."
    },
    {
      title: "Security by design",
      detail:
        "Limiting direct infrastructure access and enforcing auditability reduces operational risk."
    },
    {
      title: "Plan for scale and bursts",
      detail:
        "High-frequency communication needs careful resource management, batching, and backpressure."
    },
    {
      title: "Expect and handle failures",
      detail:
        "Partial failures, retries, and graceful degradation must be part of the core design."
    }
  ];

  return (
    <main className="bg-white font-sans text-portfolio-ink">
      <section className="border-b border-portfolio-border bg-[radial-gradient(circle_at_top_right,rgba(23,105,255,0.11),transparent_34%),linear-gradient(180deg,#ffffff,#f7fbff)]">
        <div className={`${pageShell} py-7 sm:py-10`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LinkButton href="/" variant="tertiary">
              ← Back to Portfolio
            </LinkButton>
            <nav className="hidden items-center gap-6 text-sm font-[620] text-slate-600 md:flex" aria-label="Experience sections">
              <a className="hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent" href="#overview">Overview</a>
              <a className="hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent" href="#architecture">Architecture</a>
              <a className="hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent" href="#impact">Impact</a>
              <a className="hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent" href="#lessons">Lessons</a>
            </nav>
          </div>

          <div id="overview" className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">{caseStudy.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-[720] leading-[1.04] tracking-normal text-[#050b2d] sm:text-5xl lg:text-6xl">
                {caseStudy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                {caseStudy.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {caseStudy.stack.map((item) => (
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm font-[620] text-slate-700" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-blue-100 bg-white/86 p-3 shadow-[0_18px_60px_rgba(15,45,88,0.08)] sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <article className="min-h-32 rounded-md border border-blue-100 bg-slate-50/85 p-5" key={item.title}>
                  <h2 className="text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LightSection id="problem" eyebrow="The Engineering Problem" title="Troubleshooting at scale is hard." description={caseStudy.problem}>
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)] sm:p-6">
            <p className="text-sm leading-7 text-slate-600">
              Supporting a large distributed infrastructure required engineers to gather data,
              run troubleshooting workflows, and surface actionable information without directly
              accessing production infrastructure.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The goal was to reduce time to resolution, improve security, and enable repeatable
              self-service diagnostics for a large support engineering organization.
            </p>
          </div>
          <div className="grid gap-3">
            {problemCards.map((item) => (
              <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_35px_rgba(15,45,88,0.05)]" key={item.title}>
                <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Goal</p>
          <p className="mt-2 text-xl font-[720] leading-snug text-[#050b2d]">
            Reduce time to resolution, improve security, and enable scalable, self-service troubleshooting for a large support engineering organization.
          </p>
        </div>
      </LightSection>

      <LightSection id="architecture" eyebrow="Architecture Overview" title="A scalable, secure, and observable troubleshooting platform." description={caseStudy.architecture.summary}>
        <div
          aria-label="Sanitized architecture diagram showing support engineers using a client to reach a control plane, execution layer, and distributed node agents, with PostgreSQL, Redis, OpenTelemetry, and security capabilities."
          className="rounded-lg border border-blue-100 bg-[linear-gradient(180deg,#f8fbff,#ffffff)] p-4 shadow-[0_14px_42px_rgba(15,45,88,0.07)] sm:p-5"
          role="img"
        >
          <p className="sr-only">
            Support Engineers and clients request diagnostics through a control plane. The control plane
            authenticates and authorizes requests, orchestrates jobs, and dispatches work through an
            execution layer to distributed node agents over secure communication. Supporting capabilities
            include PostgreSQL, Redis, OpenTelemetry, and security controls.
          </p>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
            {["Support Engineers / Client", "Control Plane", "Execution / Orchestration Layer", "Distributed Nodes / Agents"].map((item, index, items) => (
              <div className="contents" key={item}>
                <div className="flex min-h-32 items-center justify-center rounded-lg border border-blue-200 bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,45,88,0.04)]">
                  <div>
                    <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {index === 0
                        ? "Request diagnostics and review results"
                        : index === 1
                          ? "Authentication, authorization, validation, orchestration"
                          : index === 2
                            ? "Task scheduling, agent selection, command dispatch"
                            : "Agents collect diagnostics and execute approved commands"}
                    </p>
                  </div>
                </div>
                {index < items.length - 1 ? (
                  <div className="flex items-center justify-center text-sm font-bold text-portfolio-accent" aria-hidden="true">
                    <span className="hidden lg:inline">→</span>
                    <span className="lg:hidden">↓</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {architectureCapabilities.map((item) => (
              <article className="rounded-lg border border-blue-100 bg-white p-4" key={item.title}>
                <h3 className="text-sm font-[720] leading-snug text-[#050b2d]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </LightSection>

      <section className="border-b border-portfolio-border bg-white">
        <div className={`${pageShell} grid gap-7 py-10 sm:py-14 lg:grid-cols-[0.98fr_1.02fr]`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Scaling The Platform</p>
            <h2 className="mt-3 text-3xl font-[720] leading-tight text-[#050b2d] sm:text-4xl">Optimized for high-scale, real-world operations.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The platform handled high-frequency agent communication, large diagnostic data volumes,
              and bursty workloads while keeping backend pressure manageable.
            </p>
            <div className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]">
              <h3 className="text-base font-[720] leading-snug text-[#050b2d]">Agent Communication Optimization</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Local aggregation, batched check-ins, and pipelined communication reduced fan-out and
                lowered backend connection pressure.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_0.9fr] sm:items-end">
                <div className="flex h-44 items-end gap-8 rounded-md border border-blue-100 bg-slate-50 px-6 py-5">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full max-w-20 items-end">
                      <span className="h-full w-full rounded-t-md bg-blue-300" />
                    </div>
                    <p className="text-center text-xs font-bold leading-5 text-slate-600">~40K<br />Before</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full max-w-20 items-end">
                      <span className="h-1/4 w-full rounded-t-md bg-blue-600" />
                    </div>
                    <p className="text-center text-xs font-bold leading-5 text-slate-600">~10K<br />After</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  {["Local node aggregation", "Batched heartbeats", "Pipelined communication", "Lower backend connection pressure"].map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Key Engineering Challenges</p>
            <h2 className="mt-3 text-3xl font-[720] leading-tight text-[#050b2d] sm:text-4xl">Designing for scale, reliability, and security.</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {engineeringChallenges.map((group) => (
                <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={group.title}>
                  <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{group.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LightSection id="impact" eyebrow="Engineering Impact" title="Measurable results at scale." description="The platform improved the speed, security, and reliability of troubleshooting across a large distributed environment.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {impactCards.map((item) => (
            <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={item.title}>
              <p className="text-2xl font-[720] leading-tight text-[#050b2d]">{item.metric}</p>
              <h3 className="mt-2 text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Business Value</p>
          <p className="mt-2 text-lg font-[720] leading-snug text-[#050b2d]">
            Enabled faster resolution, reduced operational risk, and improved engineering productivity.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Delivered a scalable, secure, and observable platform that became part of repeatable operational workflows.
          </p>
        </div>
      </LightSection>

      <section id="lessons" className="scroll-mt-24 border-b border-portfolio-border bg-white">
        <div className={`${pageShell} grid gap-7 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr]`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">My Role</p>
            <h2 className="mt-3 text-3xl font-[720] leading-tight text-[#050b2d] sm:text-4xl">Architecture, implementation, and technical leadership.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              I helped architect and build the core backend platform, working with
              cross-functional teams to design, scale, and operationalize the system.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {roleAreas.map((group) => (
                <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={group.title}>
                  <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{group.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">Key Takeaways</p>
            <h2 className="mt-3 text-3xl font-[720] leading-tight text-[#050b2d] sm:text-4xl">Lessons from building at scale.</h2>
            <div className="mt-7 grid gap-4">
              {lessons.map((item) => (
                <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={item.title}>
                  <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className={`${pageShell} flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-portfolio-accent">About This Page</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This page provides a high-level overview of my professional engineering experience. Proprietary implementation details, internal service names, customer information, and operational data have been omitted.
            </p>
          </div>
          <LinkButton href="/" variant="tertiary">
            Back to Portfolio →
          </LinkButton>
        </div>
      </section>
    </main>
  );
}

function LightCapabilityGrid({ groups }: { groups: Array<{ title: string; items: string[] }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]" key={group.title}>
          <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{group.title}</h3>
          <ul className="mt-4 space-y-2">
            {group.items.map((item) => (
              <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ScopePanel({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "current" | "outside";
}) {
  const markerClassName = tone === "current" ? "bg-emerald-500" : "bg-slate-400";

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,45,88,0.06)]">
      <h3 className="text-base font-[720] leading-snug text-[#050b2d]">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-600" key={item}>
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${markerClassName}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ThreatModelMatrix({ threatModel }: { threatModel: NonNullable<CaseStudy["threatModel"]> }) {
  const statusClassNames = {
    MITIGATED: "border-emerald-200/35 bg-emerald-300/[0.08] text-emerald-50",
    "PARTIALLY MITIGATED": "border-amber-200/35 bg-amber-300/[0.08] text-amber-50",
    "NOT MITIGATED": "border-red-200/35 bg-red-300/[0.08] text-red-50"
  };

  return (
    <div className={`${cardSurface} overflow-hidden`}>
      <p className={`p-4 sm:p-5 ${bodyText}`}>{threatModel.summary}</p>
      <div className="divide-y divide-white/[0.1] border-t border-white/[0.1]">
        {threatModel.items.map((item) => (
          <article
            className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[1fr_auto_1.15fr_1.15fr] lg:items-start"
            key={item.threat}
          >
            <h3 className={compactCardTitle}>{item.threat}</h3>
            <span className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClassNames[item.status]}`}>
              {item.status}
            </span>
            <p className={compactBodyText}>{item.mitigation}</p>
            <p className={compactBodyText}>{item.residualRisk}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  if (caseStudy.slug === "grpc-microservices-reference") {
    return <GrpcReferencePage caseStudy={caseStudy} />;
  }

  if (caseStudy.slug === "agenttrust") {
    return <AgentTrustPage caseStudy={caseStudy} />;
  }

  if (caseStudy.slug === "observability-troubleshooting-platform") {
    return <ObservabilityExperiencePage caseStudy={caseStudy} />;
  }

  return (
    <main className="font-sans">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(11,16,32,0.92),rgba(7,10,18,1))]">
        <div className={`${pageShell} py-16 sm:py-20 lg:py-24`}>
          <LinkButton href="/" variant="tertiary">
            Back to Portfolio
          </LinkButton>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className={metadataLabel}>{caseStudy.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
                {caseStudy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200/90 sm:text-xl sm:leading-9">
                {caseStudy.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={caseStudy.repositoryUrl} newTab>
                  View Source
                </LinkButton>
                <LinkButton href="/" variant="tertiary">
                  Back to Portfolio
                </LinkButton>
              </div>
            </div>
            <div className={`${cardSurface} p-4 sm:p-5`}>
              <p className={mutedLabel}>Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {caseStudy.stack.map((item) => (
                  <span className={chip} key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CaseStudySection
        id="demonstrates"
        eyebrow="What This Demonstrates"
        title={caseStudy.sectionTitles?.demonstrates ?? "Engineering capabilities made inspectable."}
      >
        <CapabilityGrid groups={caseStudy.demonstrates} />
      </CaseStudySection>

      <CaseStudySection
        id="problem"
        eyebrow="Problem And Constraints"
        title={caseStudy.sectionTitles?.problem ?? "A narrow domain for visible engineering decisions."}
        description={caseStudy.problem}
      >
        <SimpleCardGrid items={caseStudy.constraints} />
      </CaseStudySection>

      <CaseStudySection
        id="architecture"
        eyebrow="System Architecture"
        title={caseStudy.sectionTitles?.architecture ?? "Bounded services, explicit contracts, portable telemetry."}
      >
        <ArchitectureDiagram caseStudy={caseStudy} />
      </CaseStudySection>

      <CaseStudySection
        id="ownership"
        eyebrow={caseStudy.sectionEyebrows?.ownership ?? "Service Responsibilities"}
        title={caseStudy.sectionTitles?.ownership ?? "Ownership stays with the service."}
      >
        <ResponsibilityGrid items={caseStudy.responsibilities} />
      </CaseStudySection>

      <CaseStudySection
        id="request-flow"
        eyebrow="Request Flow"
        title={caseStudy.sectionTitles?.requestFlow ?? "Create Diagnostic Job flow."}
      >
        {caseStudy.requestFlows.map((flow) => (
          <RequestFlow flow={flow} key={flow.title} />
        ))}
      </CaseStudySection>

      <CaseStudySection
        id="decisions"
        eyebrow="Engineering Decisions"
        title={caseStudy.sectionTitles?.decisions ?? "Trade-offs, not just technology choices."}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {caseStudy.decisions.map((decision) => (
            <DecisionCard decision={decision} key={decision.title} />
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="reliability"
        eyebrow={caseStudy.sectionEyebrows?.reliability ?? "Reliability And Failure Model"}
        title={caseStudy.sectionTitles?.reliability ?? "Implemented behavior is separated from future evidence."}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {caseStudy.reliability.map((item) => (
            <article className={`${cardSurface} p-4`} key={item.scenario}>
              <p className={metadataLabel}>Implemented behavior</p>
              <h3 className={`mt-2 ${compactCardTitle}`}>{item.scenario}</h3>
              <p className={`mt-2 ${compactBodyText}`}>{item.behavior}</p>
            </article>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="security"
        eyebrow="Security Boundaries"
        title={caseStudy.sectionTitles?.security ?? "Authentication, authorization, and persistence privileges."}
      >
        <TrustBoundary caseStudy={caseStudy} />
      </CaseStudySection>

      <CaseStudySection
        id="observability"
        eyebrow={caseStudy.sectionEyebrows?.observability ?? "Observability"}
        title={caseStudy.sectionTitles?.observability ?? "Telemetry designed for local inspection and verified evidence."}
      >
        <SimpleCardGrid items={caseStudy.observability} />
      </CaseStudySection>

      {caseStudy.threatModel ? (
        <CaseStudySection
          id="threat-model"
          eyebrow="Threat Model"
          title={caseStudy.sectionTitles?.threatModel ?? "Mitigations stay inside the stated boundary."}
        >
          <ThreatModelMatrix threatModel={caseStudy.threatModel} />
        </CaseStudySection>
      ) : null}

      {caseStudy.evidence ? (
        <CaseStudySection
          id="runtime-evidence"
          eyebrow="Verified Runtime Evidence"
          title={caseStudy.evidence.title}
          description={caseStudy.evidence.summary}
        >
          <EvidenceSection evidence={caseStudy.evidence} />
        </CaseStudySection>
      ) : null}

      <CaseStudySection
        id="verified"
        eyebrow="Verified Behavior"
        title={caseStudy.sectionTitles?.verified ?? "Documented behavior without inflated claims."}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {caseStudy.verifiedBehavior.map((item) => (
            <article className={`${cardSurface} p-4`} key={item.label}>
              <h3 className={compactCardTitle}>{item.label}</h3>
              <p className={`mt-2 ${compactBodyText}`}>{item.detail}</p>
            </article>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="tradeoffs"
        eyebrow="Trade-offs And Limitations"
        title={caseStudy.sectionTitles?.tradeoffs ?? "Deliberate scope boundaries."}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className={cardTitle}>Trade-offs</h3>
            <div className="mt-4">
              <SimpleCardGrid items={caseStudy.tradeoffs} />
            </div>
          </div>
          <div>
            <h3 className={cardTitle}>Non-goals</h3>
            <div className="mt-4">
              <SimpleCardGrid items={caseStudy.nonGoals} />
            </div>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="future"
        eyebrow="Future Extensions"
        title={caseStudy.sectionTitles?.future ?? "Neutral technical extensions, gated by evidence."}
      >
        <SimpleCardGrid items={caseStudy.futureExtensions} />
      </CaseStudySection>
    </main>
  );
}
