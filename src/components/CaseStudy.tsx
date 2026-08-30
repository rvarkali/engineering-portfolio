import Image from "next/image";
import Link from "next/link";
import type { CaseStudy, CaseStudyDecision, EvidenceItem } from "@/data/case-studies";
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
