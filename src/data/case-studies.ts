export type CapabilityGroup = {
  title: string;
  items: string[];
};

export type CaseStudyDecision = {
  title: string;
  context: string;
  decision: string;
  consequence: string;
  sourceHref?: string;
};

export type Responsibility = {
  service: string;
  owns: string[];
  exposes: string[];
  dependsOn: string[];
  persistence: string;
};

export type RequestFlow = {
  title: string;
  summary: string;
  steps: string[];
  asset?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  layout?: "linear" | "authorization-branch";
  branches?: {
    deny: string[];
    allow: string[];
  };
  notes: string[];
};

export type FailureBehavior = {
  scenario: string;
  behavior: string;
};

export type VerifiedBehavior = {
  label: string;
  detail: string;
};

export type EvidenceItem = {
  title: string;
  category: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  transcript?: string[];
  result: string;
  limitation: string;
};

export type ThreatModelItem = {
  threat: string;
  status: "MITIGATED" | "PARTIALLY MITIGATED" | "NOT MITIGATED";
  mitigation: string;
  residualRisk: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  repositoryUrl: string;
  stack: string[];
  demonstrates: CapabilityGroup[];
  problem: string;
  constraints: string[];
  architecture: {
    summary: string;
    components: string[];
    telemetry: string[];
    diagram?: "grpc-services";
    asset?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    securityBoundaryPath?: string[];
    outsideBoundaryLabel?: string;
    outsideBoundary?: string;
  };
  responsibilities: Responsibility[];
  requestFlows: RequestFlow[];
  decisions: CaseStudyDecision[];
  reliability: FailureBehavior[];
  security: string[];
  observability: string[];
  threatModel?: {
    summary: string;
    items: ThreatModelItem[];
  };
  evidence?: {
    title: string;
    summary: string;
    sourceUrl: string;
    items: EvidenceItem[];
    boundary: string;
  };
  verifiedBehavior: VerifiedBehavior[];
  tradeoffs: string[];
  nonGoals: string[];
  futureExtensions: string[];
  sectionTitles?: {
    demonstrates?: string;
    problem?: string;
    architecture?: string;
    ownership?: string;
    requestFlow?: string;
    decisions?: string;
    reliability?: string;
    security?: string;
    observability?: string;
    threatModel?: string;
    verified?: string;
    tradeoffs?: string;
    future?: string;
  };
  sectionEyebrows?: {
    ownership?: string;
    reliability?: string;
    observability?: string;
  };
};

const grpcRepositoryUrl = "https://github.com/rvarkali/grpc-microservices-reference";
const grpcAdrBase = `${grpcRepositoryUrl}/blob/main/docs/decisions`;
const agentTrustRepositoryUrl = "https://github.com/ravionxgroup/agenttrust";
const agentTrustDocsBase = `${agentTrustRepositoryUrl}/blob/main/docs`;

export const caseStudies = [
  {
    slug: "grpc-microservices-reference",
    title: "gRPC Microservices Reference",
    eyebrow: "Reference Implementation",
    summary:
      "A public reference implementation for contract-first gRPC services, service-owned persistence, durable diagnostic workflows, security boundaries, reliability controls, and OpenTelemetry-based observability.",
    repositoryUrl: grpcRepositoryUrl,
    stack: [
      "Go",
      "gRPC",
      "Protocol Buffers",
      "PostgreSQL",
      "OpenTelemetry",
      "Docker",
      "Kubernetes",
      "JWT / RBAC"
    ],
    demonstrates: [
      {
        title: "Distributed Systems",
        items: [
          "gRPC service boundaries",
          "contract-first APIs",
          "remote failure handling",
          "service-owned data",
          "optimistic concurrency"
        ]
      },
      {
        title: "Reliability",
        items: [
          "deadlines",
          "bounded retries",
          "health checks",
          "graceful shutdown",
          "controlled failure propagation"
        ]
      },
      {
        title: "Security",
        items: [
          "JWT authentication",
          "RBAC authorization",
          "least-privilege application roles",
          "explicit trust boundaries"
        ]
      },
      {
        title: "Operational Engineering",
        items: [
          "OpenTelemetry",
          "structured logging",
          "migrations",
          "CI / validation",
          "containerized local environment"
        ]
      }
    ],
    problem:
      "Many sample microservice systems either collapse data ownership into one shared database or expand into platform scope before contracts, trust boundaries, and failure behavior are clear. This reference keeps the domain intentionally small so reviewers can inspect the engineering choices directly.",
    constraints: [
      "Services own their data and avoid cross-service database joins.",
      "Cross-service communication occurs through documented gRPC contracts.",
      "Authorization is enforced at service boundaries rather than delegated to callers.",
      "Downstream failures are expected and translated into bounded service responses.",
      "The system remains independently runnable as a public reference implementation.",
      "Observability uses OpenTelemetry-compatible traces, metrics, and structured logs.",
      "Shared database coupling and broad platform scope are intentionally avoided."
    ],
    architecture: {
      summary:
        "The runtime centers on Catalog and Diagnostic services. Callers authenticate at service boundaries, Diagnostic performs Catalog lookups through a gRPC client where required, each service persists through its own PostgreSQL ownership boundary, and telemetry flows through OpenTelemetry into local observability tools.",
      diagram: "grpc-services",
      asset: {
        src: "/projects/grpc-reference/system-architecture.png",
        alt: "System architecture diagram for the gRPC Microservices Reference showing client, authorization, Diagnostic Service, Catalog Service, service-owned PostgreSQL schemas, OpenTelemetry Collector, Jaeger, and Prometheus.",
        width: 1536,
        height: 1024
      },
      components: [
        "Caller / client",
        "JWT authentication and RBAC authorization",
        "Diagnostic Service",
        "Catalog Service",
        "Service-owned PostgreSQL schemas",
        "OpenTelemetry Collector"
      ],
      telemetry: ["OpenTelemetry", "Jaeger", "Prometheus"]
    },
    responsibilities: [
      {
        service: "Catalog Service",
        owns: [
          "fictional service records",
          "catalog authorization rules",
          "service metadata validation"
        ],
        exposes: ["register service", "get service", "update service"],
        dependsOn: ["PostgreSQL catalog schema", "JWT validation"],
        persistence: "Catalog-owned PostgreSQL schema and application role"
      },
      {
        service: "Diagnostic Service",
        owns: [
          "diagnostic job acceptance",
          "job retrieval",
          "idempotency records",
          "diagnostic workflow state"
        ],
        exposes: ["create diagnostic job", "get diagnostic job"],
        dependsOn: ["Catalog gRPC lookup", "PostgreSQL diagnostics schema", "JWT validation"],
        persistence: "Diagnostics-owned PostgreSQL schema and application role"
      }
    ],
    requestFlows: [
      {
        title: "Create Diagnostic Job",
        summary:
          "A caller submits a diagnostic request to the Diagnostic Service. The service authenticates and authorizes the caller, checks Catalog where service eligibility is required, persists the accepted job and idempotency record, and returns a bounded response.",
        steps: [
          "Caller",
          "JWT authentication / RBAC",
          "Diagnostic Service",
          "Catalog gRPC lookup",
          "Diagnostics persistence",
          "Response"
        ],
        asset: {
          src: "/projects/grpc-reference/diagnostic-job-flow.png",
          alt: "Diagnostic job request flow diagram showing client request, authentication and authorization, Diagnostic Service, Catalog Service lookup, persistence, response, telemetry, and failure scenarios.",
          width: 1536,
          height: 1024
        },
        notes: [
          "Deadlines bound downstream Catalog calls.",
          "Authorization is enforced before protected service behavior.",
          "gRPC errors are translated into documented status responses."
        ]
      }
    ],
    decisions: [
      {
        title: "Contract-first gRPC APIs",
        context:
          "The services need explicit API boundaries that can be reviewed independently from implementation details.",
        decision:
          "Define service behavior through Protocol Buffer contracts and unary gRPC methods.",
        consequence:
          "Contracts become easy to inspect and test, while clients must handle typed remote errors explicitly.",
        sourceHref: `${grpcAdrBase}/0003-grpc-contract-and-compatibility-policy.md`
      },
      {
        title: "Service-owned persistence",
        context:
          "Shared tables would make the example easier to wire, but would hide ownership boundaries.",
        decision:
          "Use separate service-owned schemas and avoid cross-service joins or foreign keys.",
        consequence:
          "Ownership is clear, at the cost of explicit cross-service reads where one service needs another service's state.",
        sourceHref: `${grpcAdrBase}/0002-service-boundaries-and-data-ownership.md`
      },
      {
        title: "Durable jobs and transactional outbox",
        context:
          "Diagnostic requests need a durable acceptance path without claiming exactly-once processing.",
        decision:
          "Persist jobs and event records through PostgreSQL-backed state and outbox tables.",
        consequence:
          "The implementation can recover committed work, while publication and consumers still need idempotency.",
        sourceHref: `${grpcAdrBase}/0004-postgresql-durable-jobs-and-transactional-outbox.md`
      },
      {
        title: "Bounded retry for transient downstream failures",
        context:
          "Blind retries across every layer can amplify outages, but selected safe reads can tolerate transient failure.",
        decision:
          "Use deadlines and bounded retry only for selected transient Catalog lookup failures.",
        consequence:
          "The system improves resilience for safe calls without obscuring persistent downstream failures.",
        sourceHref: `${grpcAdrBase}/0007-reliability-and-observability-baseline.md`
      },
      {
        title: "JWT and RBAC at service boundaries",
        context:
          "A service should not trust a caller or adapter to have already performed authorization correctly.",
        decision:
          "Validate bearer tokens and enforce role checks in the owning service.",
        consequence:
          "Trust boundaries are explicit, while local development needs signed token fixtures.",
        sourceHref: `${grpcAdrBase}/0006-authentication-and-authorization-boundary.md`
      },
      {
        title: "OpenTelemetry as telemetry standard",
        context:
          "The reference needs traces, metrics, and logs without binding the core design to one vendor.",
        decision:
          "Use OpenTelemetry-compatible instrumentation and local observability tooling.",
        consequence:
          "Telemetry remains portable, while runtime evidence still needs to be captured from verified local runs.",
        sourceHref: `${grpcAdrBase}/0007-reliability-and-observability-baseline.md`
      }
    ],
    reliability: [
      {
        scenario: "Invalid or expired credentials",
        behavior: "Requests fail closed before protected service behavior executes."
      },
      {
        scenario: "Insufficient role",
        behavior: "The owning service rejects the operation through RBAC authorization."
      },
      {
        scenario: "Catalog unavailable",
        behavior: "Diagnostic-to-Catalog calls are bounded by deadlines and documented error translation."
      },
      {
        scenario: "Request deadline exceeded",
        behavior: "The service returns a bounded failure rather than waiting indefinitely."
      },
      {
        scenario: "Optimistic-lock conflict",
        behavior: "Concurrent stale updates are rejected rather than silently overwriting service metadata."
      },
      {
        scenario: "Database failure",
        behavior: "Readiness and persistence paths surface failure through service status and errors."
      },
      {
        scenario: "Graceful shutdown",
        behavior: "Server lifecycle code is designed to stop accepting work and shut down cleanly."
      }
    ],
    security: [
      "Bearer JWT validation happens at service boundaries.",
      "RBAC decisions are owned by each service.",
      "Catalog and Diagnostics use separate application database privileges.",
      "Migration privileges are separated from normal application access.",
      "Diagnostic-to-Catalog communication uses a dedicated service credential in local development.",
      "Logs and telemetry avoid recording authorization headers or secrets by default."
    ],
    observability: [
      "OpenTelemetry instrumentation covers distributed traces for service requests and internal work paths documented by the reference implementation.",
      "Structured logs carry stable request and correlation metadata where supported.",
      "Metrics are designed around bounded dimensions rather than high-cardinality identifiers.",
      "Local Jaeger and Prometheus support runtime inspection in the development environment.",
      "Verified runtime evidence captures selected local traces, metrics, and persistence checks from synthetic requests."
    ],
    evidence: {
      title: "Verified Runtime Evidence",
      summary:
        "Selected behaviors were reproduced locally with synthetic data and captured as runtime evidence. These artifacts demonstrate correctness, failure handling, and observability boundaries without making performance or production-scale claims.",
      sourceUrl: `${grpcRepositoryUrl}/blob/main/docs/evidence/README.md`,
      boundary:
        "Verified locally with synthetic data. No performance, scalability, availability, or production-reliability claims are implied.",
      items: [
        {
          title: "Joined Diagnostic-to-Catalog trace",
          category: "Distributed trace",
          description:
            "A Diagnostic create request propagates W3C Trace Context across the gRPC boundary into Catalog and its PostgreSQL lookup, with Diagnostic persistence visible in the same trace.",
          image: "/evidence/grpc/diagnostic-success-jaeger.png",
          imageAlt:
            "Jaeger trace showing Diagnostic CreateDiagnosticJob, Catalog GetService client and server spans, and PostgreSQL spans in one trace.",
          imageWidth: 1684,
          imageHeight: 491,
          result:
            "One trace links Diagnostic Service, the Catalog client call, Catalog Service, and PostgreSQL work.",
          limitation: "This is observability evidence, not a latency or throughput claim."
        },
        {
          title: "Catalog dependency outage",
          category: "Failure handling",
          description:
            "With Catalog unavailable, Diagnostic surfaces canonical gRPC Unavailable and the failed downstream attempts remain visible in the trace.",
          image: "/evidence/grpc/catalog-down-jaeger.png",
          imageAlt:
            "Jaeger trace showing a failed Diagnostic request with two failed Catalog client attempts while Catalog is unavailable.",
          imageWidth: 1686,
          imageHeight: 693,
          result: "The failed request is bounded, traceable, and represented with verified retry attempts.",
          limitation: "This does not claim failover, high availability, or dependency-aware readiness."
        },
        {
          title: "Stale update rejected",
          category: "Optimistic concurrency",
          description:
            "A valid Catalog update advances the resource version; a second update using the previous version is rejected with Aborted instead of overwriting newer state.",
          image: "/evidence/grpc/concurrency-stale-aborted-terminal.png",
          imageAlt:
            "Terminal output showing Catalog version 1 updated to version 2 and a stale update returning Aborted.",
          imageWidth: 1034,
          imageHeight: 312,
          result: "The stale writer receives Aborted after the accepted update advances the version.",
          limitation: "This is deterministic correctness evidence, not concurrent load testing."
        },
        {
          title: "Durable Diagnostic admission",
          category: "Idempotency and outbox",
          description:
            "Diagnostic admission persisted one durable job, one idempotency record, and one job-created outbox row; replay returned the original job rather than creating duplicate durable work.",
          image: "/evidence/grpc/diagnostic-db-idempotency-outbox.png",
          imageAlt:
            "PostgreSQL output showing one Diagnostic job row, one idempotency record, one unpublished job-created outbox row, and one durable job for the idempotency key.",
          imageWidth: 714,
          imageHeight: 567,
          result: "One idempotency key maps to one durable job and one unpublished job-created outbox row.",
          limitation: "Outbox publication and worker execution are not claimed."
        }
      ]
    },
    verifiedBehavior: [
      {
        label: "Service registration",
        detail: "Catalog accepts valid service registration through the documented gRPC API."
      },
      {
        label: "Duplicate registration handling",
        detail: "Duplicate Catalog records are rejected through documented service behavior."
      },
      {
        label: "Service lookup",
        detail: "Catalog retrieves registered service metadata by identifier."
      },
      {
        label: "Optimistic update conflict handling",
        detail: "Catalog update paths use version-aware conflict behavior."
      },
      {
        label: "Diagnostic job creation",
        detail: "Diagnostic accepts job creation requests after authorization and Catalog validation."
      },
      {
        label: "Diagnostic job retrieval",
        detail: "Diagnostic exposes retrieval for accepted jobs."
      },
      {
        label: "Health service reporting",
        detail: "Catalog and Diagnostic services expose gRPC health responses."
      },
      {
        label: "Unit and integration validation",
        detail: "The reference repository documents validation across service, repository, transport, auth, and reliability paths."
      }
    ],
    tradeoffs: [
      "The reference intentionally limits service count so boundaries stay inspectable.",
      "Synchronous gRPC is used where immediate validation is valuable; broader event-driven scope is deferred.",
      "The design avoids premature multi-region architecture and complex multi-tenancy.",
      "Services do not share database ownership, which makes some cross-service reads explicit.",
      "The local observability environment is lightweight and intended for inspection, not managed operations.",
      "Performance and scalability claims require measured experiments before being added."
    ],
    nonGoals: [
      "No billing, tenant administration, or product-management workflows.",
      "No broad API gateway, GraphQL layer, or MCP server in the core MVP.",
      "No service mesh, streaming RPCs, CQRS, event sourcing, or cloud-provider-specific infrastructure in the current scope.",
      "No fabricated benchmarks, screenshots, or production-readiness claims."
    ],
    futureExtensions: [
      "Add asynchronous workflows where decoupling adds clear value.",
      "Capture deeper failure-testing evidence from repeatable local runs.",
      "Run measured load experiments and document the results.",
      "Expand verified trace and metric artifacts as new runtime behaviors are implemented.",
      "Integrate controlled AI or MCP diagnostic adapters through documented APIs.",
      "Add optional experience or API layers without changing service ownership boundaries."
    ]
  },
  {
    slug: "agenttrust",
    title: "AgentTrust — Least-Privilege Security for AI Agents",
    eyebrow: "AI Infrastructure Security",
    summary:
      "Identity, independently enforced authorization, MCP tool protection, audit evidence, and observability for AI-agent execution.",
    repositoryUrl: agentTrustRepositoryUrl,
    stack: [
      "Python",
      "Go",
      "JWT",
      "Ed25519",
      "MCP",
      "LangChain",
      "OpenTelemetry",
      "Prometheus",
      "Least Privilege",
      "Audit",
      "AI Infrastructure"
    ],
    demonstrates: [
      {
        title: "AI Infrastructure Security",
        items: [
          "agent/run identity",
          "guarded tool execution",
          "LLM choice separated from authorization",
          "explicit SDK and gateway trust boundaries"
        ]
      },
      {
        title: "Least Privilege",
        items: [
          "short-lived scoped run identity",
          "per-agent and per-tool grants",
          "deny-by-default unknown agents",
          "out-of-scope action rejection"
        ]
      },
      {
        title: "MCP And Tool Access",
        items: [
          "MCP tool-to-scope mapping",
          "trusted gateway routing",
          "denied calls blocked before MCP invocation",
          "raw-client bypass called out as topology risk"
        ]
      },
      {
        title: "Auditability And Observability",
        items: [
          "allow and deny audit records",
          "agent/run/tool/scope correlation",
          "authorization vs execution lifecycle",
          "traces and Prometheus-compatible metrics"
        ]
      }
    ],
    problem:
      "AI applications may hold access to powerful tools. AgentTrust explores the boundary between \"the model requested this\" and \"the application authorizes this\" with scoped run identity, deny-by-default authorization, audit evidence, and an independently enforced gateway path for protected MCP tools.",
    constraints: [
      "The public SDK demonstrates cooperative in-process enforcement for first-party code.",
      "The separately maintained gateway demonstrates independent authorization before configured MCP execution.",
      "Strong gateway enforcement assumes deployment topology prevents direct upstream bypass.",
      "Required scopes and MCP routing come from trusted configuration, not caller input.",
      "The current audit sinks are local JSONL, not immutable or tamper-evident storage.",
      "The initiative avoids production SaaS, multi-tenancy, enterprise IAM, dynamic policy management, and durable centralized audit claims."
    ],
    architecture: {
      summary:
        "AgentTrust has two complementary layers: a public SDK for cooperative in-process enforcement and a separately maintained gateway that independently verifies signed run identity, resolves trusted tool metadata, authorizes exact scopes, audits the decision, and invokes protected MCP tools only after ALLOW.",
      securityBoundaryPath: [
        "Host / Agent",
        "AgentTrust SDK",
        "AgentTrust Gateway",
        "Protected MCP tool"
      ],
      outsideBoundaryLabel: "Direct upstream bypass",
      outsideBoundary:
        "Strong independent enforcement depends on deployment topology preventing agents from directly reaching protected upstreams.",
      components: [
        "LLM / Agent",
        "Host Application",
        "AgentTrust SDK",
        "Signed run identity",
        "Gateway verifier",
        "Trusted tool registry",
        "Exact-scope authorizer",
        "Protected MCP tools",
        "Audit and observability"
      ],
      telemetry: ["Structured logs", "OpenTelemetry traces", "Prometheus-compatible metrics", "JSONL audit evidence"]
    },
    responsibilities: [
      {
        service: "AgentTrust SDK",
        owns: [
          "cooperative run-scoped identity",
          "in-process scope authorization",
          "guarded direct, async, MCP, and LangChain calls"
        ],
        exposes: ["start run", "call", "acall", "guarded decorator"],
        dependsOn: ["policy configuration", "JWT signing secret", "local process time"],
        persistence: "No application database; local audit sink is configured by path"
      },
      {
        service: "AgentTrust Gateway",
        owns: [
          "signed run identity verification",
          "trusted tool resolution",
          "exact-scope authorization",
          "configured MCP tools/call execution"
        ],
        exposes: ["POST /v1/tools/{tool}/execute", "GET /healthz", "GET /readyz", "GET /metrics"],
        dependsOn: ["Ed25519 public verification key", "trusted gateway config", "configured MCP endpoint"],
        persistence: "Local JSONL audit evidence; no durable centralized audit store"
      }
    ],
    requestFlows: [
      {
        title: "Gateway-Protected MCP Execution",
        summary:
          "The flagship demo grants deploy-agent service.status and logs.read. service_status is allowed and reaches MCP once; restart_service requires service.restart and is denied before MCP invocation.",
        layout: "authorization-branch",
        steps: [
          "Gateway receives signed run identity",
          "Verify issuer, audience, expiry, run ID, token ID, and scopes",
          "Resolve trusted AgentTrust tool",
          "Read required scope from gateway config",
          "Exact string authorization"
        ],
        branches: {
          deny: ["restart_service requires service.restart", "Audit deny not_executed", "MCP invocation count = 0"],
          allow: ["service_status requires service.status", "MCP tools/call executes", "Audit execution_result ok"]
        },
        notes: [
          "Authorization precedes MCP execution.",
          "Unknown tools and missing scopes fail closed.",
          "The SDK implementation is public; the enforcement-gateway implementation is maintained separately."
        ]
      }
    ],
    decisions: [
      {
        title: "SDK plus independent gateway",
        context:
          "SDK checks are useful for cooperative application code, but raw client access can bypass an in-process wrapper.",
        decision:
          "Present AgentTrust as one initiative with public SDK enforcement and a separately maintained gateway authorization point.",
        consequence:
          "The SDK remains easy to adopt, while the gateway demonstrates stronger mediation when protected upstreams are not directly reachable."
      },
      {
        title: "Ed25519 signed run identity",
        context:
          "The gateway should verify identities without holding the signing authority's private key.",
        decision:
          "Use short-lived asymmetric JWT run identity with issuer, agent ID, audience, run ID, scopes, issued-at, expiration, and token ID claims.",
        consequence:
          "Signing authority stays separate from enforcement; production key rotation and JWKS remain future work."
      },
      {
        title: "Exact scopes from trusted config",
        context:
          "The client should not be able to influence the required scope for a requested tool.",
        decision:
          "Resolve required scope and MCP mapping from trusted configuration and use exact string matching only.",
        consequence:
          "Authorization is deterministic and auditable; wildcard, prefix, inheritance, and case-folding semantics are intentionally absent."
      },
      {
        title: "Lifecycle audit evidence",
        context:
          "Operators and future Console views need to distinguish authorization from execution without guessing from nullable fields.",
        decision:
          "Emit authorization_decision and execution_result lifecycle records correlated by request_id.",
        consequence:
          "One logical request remains one logical tool call, but JSONL remains non-durable and not tamper-proof."
      }
    ],
    reliability: [
      {
        scenario: "Authentication failure",
        behavior: "Missing, malformed, expired, wrong-issuer, wrong-audience, or invalidly signed run identities fail before authorization or tool execution."
      },
      {
        scenario: "Missing required scope",
        behavior: "The gateway emits authorization_decision deny, result_status not_executed, and does not invoke MCP."
      },
      {
        scenario: "Unknown AgentTrust tool",
        behavior: "Tool resolution fails closed; caller input is not used to construct an arbitrary upstream request."
      },
      {
        scenario: "Authorization audit persistence failure",
        behavior: "The gateway fails closed before execution so the protected upstream is not invoked."
      },
      {
        scenario: "MCP execution failure",
        behavior: "Protocol errors, tool execution errors, timeouts, and unavailable upstreams remain execution failures after an allow decision."
      },
      {
        scenario: "Post-execution audit persistence failure",
        behavior: "The gateway preserves the actual execution outcome where safe and emits correlated fallback diagnostics instead of pretending the tool did not execute."
      }
    ],
    security: [
      "SDK enforcement is cooperative and in-process for AgentRun.call, AgentRun.acall, AgentRun.guarded, GuardedMCPClient, and LangChain wrappers.",
      "Gateway enforcement independently verifies signed Ed25519 JWT run identity before protected MCP execution.",
      "Trusted gateway configuration determines the upstream MCP URL, MCP tool mapping, required scope, timeout, and controlled headers.",
      "Authorization is exact string matching: service.restart is not service.*, SERVICE.RESTART, or an inherited permission.",
      "Denied restart_service requests are audited as not_executed and do not produce an MCP invocation.",
      "Raw JWTs, Authorization headers, raw MCP arguments, keys, and sensitive payloads are excluded from telemetry and audit additions."
    ],
    observability: [
      "OpenTelemetry spans cover authenticate, resolve tool, authorize, authorization audit, MCP execution, and execution-result audit boundaries.",
      "Prometheus-compatible metrics distinguish authentication success/failure, authorization allow/deny, MCP ok/error/timeout, tool execution status, and audit write failure.",
      "Structured logs, traces, metrics, and JSONL audit evidence correlate through request_id and trace_id where tracing is active.",
      "Denied requests include authorization evidence but intentionally have no MCP execution span and no MCP request metric.",
      "Safe telemetry excludes raw JWTs, raw MCP arguments, Authorization headers, key material, and sensitive MCP response bodies."
    ],
    threatModel: {
      summary:
        "The threat model is intentionally scoped. SDK enforcement is strongest for cooperative guarded paths; gateway enforcement is stronger only when deployment topology prevents direct upstream bypass.",
      items: [
        {
          threat: "Prompt-injected agent selects unauthorized tool",
          status: "MITIGATED",
          mitigation: "SDK guarded calls and gateway-protected calls authorize the required scope before execution.",
          residualRisk: "Gateway protection depends on traffic being forced through the gateway."
        },
        {
          threat: "Unknown or out-of-scope action",
          status: "MITIGATED",
          mitigation: "Unknown tools and missing scopes fail closed before MCP execution.",
          residualRisk: "Policy authors can still grant overly broad scopes."
        },
        {
          threat: "Expired, tampered, or wrong-secret credential",
          status: "MITIGATED",
          mitigation: "Automated tests verify fail-closed expiry and JWT validation behavior; gateway verification uses Ed25519 public material.",
          residualRisk: "Production issuer service, JWKS, revocation, and key rotation are not implemented."
        },
        {
          threat: "Overly broad policy",
          status: "PARTIALLY MITIGATED",
          mitigation: "Scope grants are explicit and inspectable.",
          residualRisk: "AgentTrust cannot infer business intent or prevent unsafe wildcard grants."
        },
        {
          threat: "Raw client or tool bypass",
          status: "NOT MITIGATED",
          mitigation: "The docs and architecture mark this as outside the SDK boundary.",
          residualRisk: "If the protected MCP server is directly reachable, code can bypass the gateway."
        },
        {
          threat: "Compromised host process",
          status: "NOT MITIGATED",
          mitigation: "None within a cooperative in-process SDK boundary.",
          residualRisk: "A compromised process can bypass SDK wrappers, read local secrets, or attempt direct upstream access unless topology blocks it."
        },
        {
          threat: "Audit file modification",
          status: "NOT MITIGATED",
          mitigation: "Events are appended under a process lock for cooperative execution.",
          residualRisk: "Filesystem access can modify, truncate, or delete local JSONL audit records."
        }
      ]
    },
    evidence: {
      title: "Verified Runtime Evidence",
      summary:
        "The primary evidence scenario proves the gateway blocks an authenticated but unauthorized restart_service request before MCP execution while allowing service_status for the same deploy-agent identity.",
      sourceUrl: `${agentTrustDocsBase}/evidence/README.md`,
      boundary:
        "Verified locally with synthetic data. The public SDK implementation is linked; the enforcement-gateway implementation is maintained separately and has no public source CTA.",
      items: [
        {
          title: "Gateway ALLOW/DENY proof",
          category: "Gateway demo evidence",
          description:
            "deploy-agent is granted service.status and logs.read. service_status requires service.status and executes; restart_service requires service.restart and is denied before MCP.",
          transcript: [
            "Agent: deploy-agent",
            "Scopes: service.status, logs.read",
            "ALLOW service_status required_scope=service.status HTTP_STATUS=200",
            "MCP counters: service_status=1",
            "DENY restart_service required_scope=service.restart HTTP_STATUS=403 ACCESS_DENIED",
            "Audit: decision=deny reason=scope_not_granted result_status=not_executed",
            "MCP counters: restart_service=0"
          ],
          result:
            "An authenticated identity without service.restart cannot reach the protected restart_service MCP tool through the gateway.",
          limitation:
            "This does not claim an absolute boundary if the protected MCP server is independently reachable."
        },
        {
          title: "Authentication and authorization tests",
          category: "Automated test evidence",
          description:
            "Tests cover missing/invalid tokens, issuer/audience/expiry validation, exact-scope authorization, unknown tools, audit-failure behavior, and no upstream execution on deny.",
          transcript: [
            "go test ./...",
            "go test -race ./...",
            "DENY restart_service -> upstream invocation count zero"
          ],
          result:
            "Covered invalid credential and missing-scope cases fail closed before protected tool execution.",
          limitation:
            "This does not claim production key rotation, token revocation, or enterprise IAM."
        },
        {
          title: "Audit and observability evidence",
          category: "Operational evidence",
          description:
            "Audit lifecycle records distinguish authorization decisions from execution outcomes, while traces and metrics expose ALLOW, DENY, timeout, error, and not-executed paths.",
          transcript: [
            "authorization_decision decision=allow reason=scope_granted",
            "execution_result result_status=ok reason=execution_ok",
            "authorization_decision decision=deny reason=scope_not_granted result_status=not_executed",
            "DENY trace: authorization span present, no MCP execution span",
            "DENY metrics: authorization deny incremented, no MCP request increment"
          ],
          result:
            "Operators can correlate request_id and trace_id across logs, traces, metrics, and audit evidence without counting lifecycle events as two tool calls.",
          limitation:
            "Local JSONL audit is not immutable, tamper-evident, centralized, or SIEM-integrated."
        }
      ]
    },
    verifiedBehavior: [
      {
        label: "Gateway demo: scoped call allowed",
        detail: "service_status requires service.status; deploy-agent has that scope, receives HTTP 200, and increments MCP invocation count to one."
      },
      {
        label: "Gateway demo: out-of-scope call denied",
        detail: "restart_service requires service.restart; deploy-agent has only service.status and logs.read, so the gateway returns ACCESS_DENIED."
      },
      {
        label: "Gateway demo: denied call does not execute",
        detail: "The denied restart_service path records result_status=not_executed and leaves MCP restart_service invocation count at zero."
      },
      {
        label: "Audit lifecycle: one logical call",
        detail: "authorization_decision and execution_result records correlate by request_id without turning one request into two tool calls."
      },
      {
        label: "Automated tests: invalid credentials rejected",
        detail: "Missing, malformed, expired, wrong-issuer, wrong-audience, and invalidly signed identities fail closed."
      },
      {
        label: "Automated tests: caller cannot route around config",
        detail: "Tests verify clients cannot override MCP destination, MCP tool mapping, required scope, or trusted headers."
      },
      {
        label: "Observability tests: denied path has no MCP span",
        detail: "Denied requests produce authorization evidence and metrics but no MCP execution span or MCP request metric."
      },
      {
        label: "Race tests pass",
        detail: "Gateway, audit sink, metrics, and MCP adapter behavior are covered by Go race test runs."
      }
    ],
    tradeoffs: [
      "SDK enforcement is lightweight and framework-friendly, but only an independent gateway can mediate calls outside cooperative application code.",
      "Asymmetric Ed25519 run tokens keep signing authority separate from gateway verification, while production key rotation remains future work.",
      "Static trusted tool configuration is easy to audit and demo, but dynamic policy distribution is deferred.",
      "Exact scopes are deterministic and deny by default, but intentionally avoid wildcard and inheritance convenience.",
      "JSONL evidence is inspectable, but not durable, centralized, immutable, or tamper-proof.",
      "A stateless MCP tools/call adapter is narrow and testable, but not a universal MCP transport gateway.",
      "Authorization audit failure fails closed before execution; post-execution audit failure cannot undo possible side effects.",
      "request_id is the application/audit correlation key, while trace_id connects distributed telemetry."
    ],
    nonGoals: [
      "No production SaaS or commercial availability claim.",
      "No managed policy control plane or policy editing UI.",
      "No organization management, SSO/RBAC, or multi-tenant enforcement.",
      "No durable centralized audit store or tamper-proof audit claim.",
      "No dynamic MCP discovery or universal MCP transport proxying.",
      "No production issuer, token revocation, or key rotation service.",
      "No guaranteed hard boundary when protected upstreams are directly reachable outside the gateway."
    ],
    futureExtensions: [
      "JWKS and signing-key rotation.",
      "Durable audit pipeline and centralized evidence ingestion.",
      "Policy/control plane with careful change governance.",
      "Tenant-aware authorization and organization-level administration.",
      "MCP server identity and gateway deployment reference patterns.",
      "Richer Console integration over normalized lifecycle evidence."
    ],
    sectionTitles: {
      demonstrates: "AI security capabilities made inspectable.",
      problem: "Model-selected tools are not authorization.",
      architecture: "SDK and gateway enforcement boundaries.",
      ownership: "Identity, policy, routing, audit, and observability stay separated.",
      requestFlow: "Authorization precedes execution.",
      decisions: "Security trade-offs with the boundary named.",
      reliability: "Fail-closed behavior before protected execution.",
      security: "The boundary is explicit, not implied.",
      observability: "Telemetry shows what did and did not execute.",
      threatModel: "Mitigations stay inside the stated boundary.",
      verified: "Verified behavior with topology assumptions named.",
      tradeoffs: "Limitations that sharpen the security story.",
      future: "Future hardening, not current promises."
    },
    sectionEyebrows: {
      ownership: "Component Responsibilities",
      reliability: "Authorization Failure Behavior",
      observability: "Auditability"
    }
  },
  {
    slug: "observability-troubleshooting-platform",
    title: "Observability & Troubleshooting Platform",
    eyebrow: "Professional Experience",
    summary:
      "Designed a distributed troubleshooting platform operating across hundreds of thousands of nodes, reducing diagnostic workflows from hours to minutes while limiting direct infrastructure access.",
    repositoryUrl: "/",
    stack: [
      "Go",
      "Java",
      "Kubernetes",
      "Redis",
      "PostgreSQL",
      "OpenTelemetry",
      "Distributed Systems",
      "Platform Engineering"
    ],
    demonstrates: [
      {
        title: "Distributed Platform",
        items: [
          "fleet-wide diagnostics",
          "job orchestration",
          "backend coordination",
          "operational workflows"
        ]
      },
      {
        title: "Large-Scale Fleet",
        items: [
          "hundreds of thousands of nodes",
          "high-frequency communication",
          "connection reduction",
          "bursty workload handling"
        ]
      },
      {
        title: "Secure Operations",
        items: [
          "role-based access",
          "least-privilege workflows",
          "auditability",
          "reduced direct infrastructure access"
        ]
      },
      {
        title: "Observability",
        items: [
          "metrics",
          "logs",
          "traces",
          "operational visibility"
        ]
      }
    ],
    problem:
      "Troubleshooting complex issues across a large distributed infrastructure was slow, manual, and operationally risky. The platform provided a scalable way to collect diagnostics, run approved workflows, and surface actionable information without requiring engineers to directly access infrastructure.",
    constraints: [
      "Keep the page public-safe by omitting proprietary implementation details, internal service names, customer information, and operational data.",
      "Use high-level architecture boundaries rather than private service or API names.",
      "Present scale and impact as approximate professional experience outcomes, not public benchmarks or SLA claims.",
      "Describe the system in terms of platform capabilities that can be discussed without exposing confidential operations."
    ],
    architecture: {
      summary:
        "Support engineers used a client-facing workflow to initiate diagnostics. A control plane handled authentication, authorization, request validation, and job orchestration. An execution layer scheduled work against distributed node agents, while PostgreSQL, Redis, OpenTelemetry, and access-control systems supported persistence, coordination, visibility, and secure operation.",
      components: [
        "Support engineers / client",
        "Control plane",
        "Execution / orchestration layer",
        "Distributed nodes / agents",
        "PostgreSQL",
        "Redis",
        "OpenTelemetry",
        "Security and access control"
      ],
      telemetry: [
        "OpenTelemetry",
        "Metrics",
        "Logs",
        "Traces"
      ],
      securityBoundaryPath: [
        "Support engineers / client",
        "Control plane",
        "Execution layer",
        "Distributed nodes / agents"
      ],
      outsideBoundaryLabel: "Private implementation details",
      outsideBoundary:
        "Internal service names, customer details, private APIs, and operational procedures are intentionally omitted."
    },
    responsibilities: [
      {
        service: "Control Plane",
        owns: [
          "authentication and authorization",
          "request validation",
          "job orchestration",
          "workflow state"
        ],
        exposes: [
          "diagnostic request workflow",
          "status and result views",
          "auditable operations"
        ],
        dependsOn: [
          "PostgreSQL",
          "Redis",
          "OpenTelemetry",
          "execution layer"
        ],
        persistence: "PostgreSQL for jobs, metadata, and results."
      },
      {
        service: "Execution Layer",
        owns: [
          "task scheduling",
          "agent selection",
          "command dispatch",
          "failure handling"
        ],
        exposes: [
          "approved diagnostic execution",
          "agent coordination",
          "execution status"
        ],
        dependsOn: [
          "distributed node agents",
          "queueing and coordination",
          "secure communication"
        ],
        persistence: "Redis-backed coordination for queues, state, and heartbeats."
      }
    ],
    requestFlows: [
      {
        title: "Troubleshooting Workflow",
        summary:
          "A support engineer initiates an approved diagnostic request. The platform validates access, coordinates execution, collects results, and emits telemetry for operational visibility.",
        steps: [
          "Support engineer request",
          "Control plane validation",
          "Execution orchestration",
          "Distributed node agents",
          "Results and telemetry"
        ],
        notes: [
          "Requests are authorized before execution.",
          "Communication is represented at a conceptual level.",
          "Operational details and private implementation names are omitted."
        ]
      }
    ],
    decisions: [
      {
        title: "Scalable backend coordination",
        context:
          "The platform had to coordinate diagnostic jobs across many nodes and environments.",
        decision:
          "Use a control-plane and execution-layer split with explicit state, queueing, and worker coordination.",
        consequence:
          "The split improves scale and operability, while requiring careful state management and failure handling."
      },
      {
        title: "Aggregated agent communication",
        context:
          "High-frequency independent agent communication created backend connection pressure.",
        decision:
          "Reduce fan-out through local aggregation, batched check-ins, and pipelined communication.",
        consequence:
          "Connection pressure dropped from roughly 40K to 10K in the observed optimization, while adding coordination complexity."
      },
      {
        title: "Least-privilege troubleshooting",
        context:
          "Direct infrastructure access was risky and difficult to scale across support workflows.",
        decision:
          "Route diagnostics through controlled, auditable workflows with role-based access.",
        consequence:
          "Operational risk is reduced, but workflow design must keep approved paths useful and reliable."
      },
      {
        title: "Observable operations",
        context:
          "Operators needed to understand system behavior, failures, and diagnostic execution.",
        decision:
          "Build metrics, logs, and traces into the platform using OpenTelemetry-oriented observability.",
        consequence:
          "Troubleshooting becomes easier to inspect, but telemetry volume and signal quality need active management."
      }
    ],
    reliability: [
      {
        scenario: "Partial distributed failures",
        behavior:
          "The platform was designed for retries, timeouts, and graceful degradation across node and service boundaries."
      },
      {
        scenario: "Bursty diagnostic workloads",
        behavior:
          "Aggregation, batching, and queueing helped absorb high-frequency communication and workload spikes."
      },
      {
        scenario: "Operational visibility gaps",
        behavior:
          "Metrics, logs, and traces exposed enough system behavior for inspection and continuous improvement."
      }
    ],
    security: [
      "Role-based access limited who could initiate troubleshooting workflows.",
      "Approved workflows reduced the need for direct infrastructure access.",
      "Auditability made operational actions easier to review.",
      "Secure communication and least privilege were core design constraints."
    ],
    observability: [
      "Metrics tracked platform health and operational behavior.",
      "Structured logs supported troubleshooting and audit review.",
      "Traces helped inspect request and execution paths.",
      "Alerting and visibility supported rollout and production operations."
    ],
    verifiedBehavior: [
      {
        label: "Troubleshooting workflow reduction",
        detail:
          "Professional experience included reducing diagnostic workflows from roughly two hours to roughly fifteen minutes."
      },
      {
        label: "Fleet-scale support",
        detail:
          "The platform scaled to support more than 500,000 nodes across multiple environments."
      },
      {
        label: "Support engineering adoption",
        detail:
          "The platform supported a large support engineering organization of roughly 1,000 engineers."
      }
    ],
    tradeoffs: [
      "Aggregation lowered connection pressure but introduced coordination complexity.",
      "Controlled workflows reduced risk but required careful product and operations alignment.",
      "High observability improved inspection while adding signal-management and storage considerations."
    ],
    nonGoals: [
      "No proprietary implementation details.",
      "No internal service names.",
      "No customer information.",
      "No private APIs or operational procedures.",
      "No public benchmark, SLA, or current production claim."
    ],
    futureExtensions: [
      "Broader product adoption.",
      "Deeper automation for recurring diagnostic workflows.",
      "Continued reliability and observability improvements."
    ]
  }
] satisfies CaseStudy[];

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
