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
    diagram?: "grpc-services" | "agenttrust-boundary";
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
      "OpenTelemetry instrumentation covers service requests and internal work paths documented by the reference implementation.",
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
    title: "AgentTrust",
    eyebrow: "AI Infrastructure Security",
    summary:
      "Least-privilege identity and authorization for AI agent tool execution, implemented as an SDK-first guard for cooperative tool, MCP, and LangChain paths.",
    repositoryUrl: agentTrustRepositoryUrl,
    stack: [
      "Python",
      "JWT",
      "MCP",
      "LangChain",
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
          "explicit SDK trust boundary"
        ]
      },
      {
        title: "Least Privilege",
        items: [
          "short-lived scoped credentials",
          "per-agent policy grants",
          "deny-by-default unknown agents",
          "out-of-scope action rejection"
        ]
      },
      {
        title: "MCP And Tool Access",
        items: [
          "MCP tool-to-scope mapping",
          "guarded-client enforcement",
          "denied calls blocked before client invocation",
          "raw-client bypass called out explicitly"
        ]
      },
      {
        title: "Auditability",
        items: [
          "allow and deny audit records",
          "agent/run/tool/scope correlation",
          "redacted argument capture",
          "local JSONL audit sink"
        ]
      }
    ],
    problem:
      "LLM-driven applications may choose tools dynamically, but the host application must not treat a model-selected tool as an authorized action. AgentTrust explores the boundary between \"the model requested this\" and \"the application authorizes this\" with scoped per-run identity and guarded tool execution.",
    constraints: [
      "AgentTrust is an SDK-level authorization layer for cooperative first-party code.",
      "Authorization applies only when calls are routed through guarded AgentTrust APIs.",
      "Raw tool, shell, database, or MCP client access remains outside the SDK enforcement boundary.",
      "Policies grant explicit scope patterns per known agent.",
      "The current audit sink is local JSONL, not immutable or tamper-evident storage.",
      "The MVP avoids a gateway, control plane, enterprise IAM, and production-scale authorization service."
    ],
    architecture: {
      summary:
        "The host application starts an AgentTrust run, receives a scoped in-process run identity, routes tool or MCP calls through guarded adapters, and gets an allow-or-deny decision before execution. Audit records capture the decision and outcome for calls inside that path.",
      diagram: "agenttrust-boundary",
      securityBoundaryPath: [
        "Host / Agent",
        "AgentTrust guarded execution boundary",
        "Guarded adapter",
        "Tool / MCP client"
      ],
      outsideBoundaryLabel: "Raw MCP client / raw tool reference",
      outsideBoundary:
        "Code retaining a raw MCP session, raw client, or direct tool reference can bypass SDK-level enforcement.",
      components: [
        "LLM / Agent",
        "Host Application",
        "AgentTrust SDK",
        "Policy configuration",
        "Per-run identity",
        "Guarded adapter",
        "Tool / MCP client",
        "Local JSONL audit sink"
      ],
      telemetry: ["Audit JSONL", "CLI audit viewer"]
    },
    responsibilities: [
      {
        service: "AgentTrust SDK",
        owns: [
          "run-scoped identity establishment",
          "scope authorization",
          "guarded direct and async calls"
        ],
        exposes: ["start run", "call", "acall", "guarded decorator"],
        dependsOn: ["policy configuration", "JWT signing secret", "local process time"],
        persistence: "No application database; local audit sink is configured by path"
      },
      {
        service: "Guarded Adapters",
        owns: [
          "MCP tool-to-scope mapping",
          "LangChain tool wrapping",
          "delegation into AgentRun authorization"
        ],
        exposes: ["GuardedMCPClient", "as_langchain_tool", "as_langchain_tools"],
        dependsOn: ["AgentRun", "wrapped client or function", "developer routing through wrapper"],
        persistence: "Adapter decisions are recorded through the shared audit sink"
      }
    ],
    requestFlows: [
      {
        title: "Guarded Tool Execution",
        summary:
          "The host starts a run for a known agent, AgentTrust establishes scoped run identity from policy, and each guarded tool call is authorized before the underlying tool or MCP client is invoked.",
        layout: "authorization-branch",
        steps: [
          "Host starts run",
          "Policy grants scopes",
          "Per-run identity established",
          "Tool requires scope",
          "Authorize required scope"
        ],
        branches: {
          deny: ["Audit deny", "ToolDenied", "No execution"],
          allow: ["Execute guarded tool", "Audit outcome"]
        },
        notes: [
          "Authorization precedes execution for guarded calls.",
          "Unknown agents and out-of-scope actions fail closed.",
          "Serialized JWT verification exists, while guarded calls use the established in-process identity."
        ]
      }
    ],
    decisions: [
      {
        title: "SDK-first enforcement instead of gateway",
        context:
          "The first milestone needed to be easy to embed in existing agent applications without introducing a network service.",
        decision:
          "Keep enforcement in the application process and route cooperative tool calls through AgentTrust.",
        consequence:
          "Integration stays lightweight, but code with raw-client access can bypass the SDK boundary.",
        sourceHref: `${agentTrustDocsBase}/threat-model.md`
      },
      {
        title: "Short-lived scoped run identity",
        context:
          "Long-lived agent-level authority makes it harder to correlate and bound individual tool sessions.",
        decision:
          "Issue per-run identity containing agent ID, run ID, scopes, token ID, issuer, issued-at time, and expiry.",
        consequence:
          "Capability exposure and audit correlation improve, while revocation and key rotation remain future hardening.",
        sourceHref: `${agentTrustRepositoryUrl}/blob/main/agenttrust/identity.py`
      },
      {
        title: "Guarded adapters",
        context:
          "LLM-selected tools should not execute merely because the model chose them.",
        decision:
          "Route direct calls, LangChain tools, and MCP client calls through the same AgentRun authorization path.",
        consequence:
          "Authorization-before-execution is consistent for guarded paths, but security depends on calls staying inside the wrapper.",
        sourceHref: `${agentTrustRepositoryUrl}/blob/main/agenttrust/mcp.py`
      },
      {
        title: "Local JSONL audit",
        context:
          "The SDK needed an inspectable audit trail without requiring infrastructure.",
        decision:
          "Write local JSONL audit events for guarded allow, deny, and error outcomes.",
        consequence:
          "The trail is transparent and portable, but it is not immutable or tamper-evident.",
        sourceHref: `${agentTrustRepositoryUrl}/blob/main/agenttrust/audit.py`
      }
    ],
    reliability: [
      {
        scenario: "Unknown agent",
        behavior: "A run cannot be started when no policy exists for the agent."
      },
      {
        scenario: "Out-of-scope action",
        behavior: "The guarded call writes a deny audit event and raises ToolDenied before execution."
      },
      {
        scenario: "Expired run identity",
        behavior: "AgentRun checks expiry before guarded execution and denies expired identities."
      },
      {
        scenario: "Tampered or wrong-secret token",
        behavior: "The JWT verification helper fails closed for covered invalid token cases."
      },
      {
        scenario: "Missing MCP scope mapping",
        behavior: "The guarded MCP wrapper can fail closed when default-to-tool-name fallback is disabled."
      },
      {
        scenario: "Tool execution error",
        behavior: "Allowed guarded calls audit an error status when the underlying callable raises."
      }
    ],
    security: [
      "The enforced path is AgentRun.call, AgentRun.acall, AgentRun.guarded, GuardedMCPClient, and supported guarded adapters.",
      "A caller with direct raw-tool or raw-client access can bypass SDK-level enforcement.",
      "Policies map known agent IDs to allowed scope patterns.",
      "MCP tools resolve to required scopes through explicit mappings, metadata, custom resolvers, or optional tool-name fallback.",
      "JWT verification exists, but guarded tool calls use the established in-process run identity.",
      "Local JSONL audit logging is not tamper-evident or immutable."
    ],
    observability: [
      "Audit events correlate agent ID, run ID, token ID, tool, required scope, decision, reason, redacted arguments, result status, and timestamp.",
      "The CLI can display local audit records with filters for agent and decision.",
      "Redaction is key-name based and truncates long strings.",
      "Audit logging is local SDK evidence, not centralized SIEM or non-repudiation evidence."
    ],
    threatModel: {
      summary:
        "The threat model is intentionally scoped to SDK-level cooperative enforcement. It is strongest against unauthorized tool selection inside guarded paths and intentionally does not claim protection from raw-client bypass or compromised hosts.",
      items: [
        {
          threat: "Prompt-injected agent selects unauthorized tool",
          status: "MITIGATED",
          mitigation: "Guarded calls authorize the required scope before execution.",
          residualRisk: "Only applies when the host routes the call through AgentTrust."
        },
        {
          threat: "Unknown or out-of-scope action",
          status: "MITIGATED",
          mitigation: "Unknown agents and missing scopes fail closed in the guarded path.",
          residualRisk: "Policy authors can still grant overly broad scopes."
        },
        {
          threat: "Expired, tampered, or wrong-secret credential",
          status: "MITIGATED",
          mitigation: "Automated tests verify fail-closed expiry and JWT validation behavior.",
          residualRisk: "No revocation or key rotation exists in the current MVP."
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
          residualRisk: "Code with direct references can call tools without AgentTrust."
        },
        {
          threat: "Compromised host process",
          status: "NOT MITIGATED",
          mitigation: "None within the SDK-first boundary.",
          residualRisk: "A compromised process can bypass wrappers, read secrets, or alter audit files."
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
        "The primary evidence scenario is a public-safe MCP-style demo proving authorization-before-execution for guarded calls. Credential validation is documented as automated-test evidence, not runtime-demo evidence.",
      sourceUrl: `${agentTrustDocsBase}/evidence/README.md`,
      boundary:
        "Verified locally with synthetic data for calls routed through AgentTrust guarded execution APIs. This does not demonstrate process isolation or protection against raw-client bypass.",
      items: [
        {
          title: "Authorization before MCP-style execution",
          category: "Runtime demo evidence",
          description:
            "An ops-reader run is granted only service.read. The allowed read invokes the fake MCP client once; the denied service.restart call raises ToolDenied and leaves the underlying invocation count at zero.",
          transcript: [
            "Agent: ops-reader",
            "ALLOW service.read underlying_invoked=True invocation_count=1",
            "DENY service.restart tool_denied=True underlying_invoked=False invocation_count=0",
            "AUDIT ALLOW service.read",
            "AUDIT DENY service.restart"
          ],
          result:
            "The denied MCP-style action is audited and blocked before the fake underlying client executes.",
          limitation:
            "This is guarded-client SDK evidence; it does not prove gateway enforcement or raw-client containment."
        },
        {
          title: "Credential validation",
          category: "Automated test evidence",
          description:
            "Tests cover expired run identities, expired serialized JWTs, tampered tokens, wrong signing secrets, and malformed scope claims.",
          transcript: [
            "PYTHONDONTWRITEBYTECODE=1 python3 -m pytest -p no:cacheprovider",
            "48 passed, 3 skipped",
            "Skipped: real MCP SDK integration tests when mcp is not installed"
          ],
          result:
            "Covered invalid credential cases fail closed through TokenError or ToolDenied paths.",
          limitation:
            "This does not claim token revocation, signing-key rotation, or a remote token-introspection service."
        },
        {
          title: "Allow and deny audit trail",
          category: "Runtime demo evidence",
          description:
            "The same demo emits one ALLOW and one DENY audit line with the same synthetic agent/run context, tool, required scope, decision, and execution status.",
          transcript: [
            "ALLOW agent=ops-reader run=<synthetic> tool=service.read scope=service.read status=ok",
            "DENY  agent=ops-reader run=<synthetic> tool=service.restart scope=service.restart status=not_executed"
          ],
          result:
            "Guarded calls produce local audit records for allowed and denied tool attempts.",
          limitation:
            "Local JSONL audit is not immutable, tamper-evident, centralized, or SIEM-integrated."
        }
      ]
    },
    verifiedBehavior: [
      {
        label: "Runtime demo: scoped call allowed",
        detail: "The MCP-style evidence demo allows service.read for ops-reader and invokes the fake client once."
      },
      {
        label: "Runtime demo: out-of-scope call denied",
        detail: "The same run denies service.restart with ToolDenied because only service.read is granted."
      },
      {
        label: "Runtime demo: denied call does not execute",
        detail: "The denied MCP-style call leaves the fake underlying service.restart invocation count at zero."
      },
      {
        label: "Runtime demo: allow and deny audited",
        detail: "The demo prints ALLOW service.read and DENY service.restart audit records for the same run."
      },
      {
        label: "Automated tests: invalid credentials rejected",
        detail: "Expired, tampered, wrong-secret, and malformed-scope credential cases fail closed in tests."
      },
      {
        label: "Automated tests: unknown agent denied",
        detail: "Starting a run for an agent missing from policy raises PolicyError."
      },
      {
        label: "Automated tests: adapter coverage",
        detail: "Direct, async, decorator, MCP wrapper, and LangChain guarded paths are covered by local tests."
      },
      {
        label: "Verified environment caveat",
        detail: "The latest local run reported 48 passed and 3 skipped; skipped tests were real MCP SDK integration tests because the dependency was not installed."
      }
    ],
    tradeoffs: [
      "SDK-first enforcement keeps integration lightweight but cannot stop code that bypasses the SDK.",
      "HS256 signing keeps the MVP small, while asymmetric signing and key rotation remain future hardening.",
      "Tool-name fallback can simplify MCP mapping, but explicit mapping is stronger for fail-closed demos.",
      "Local JSONL audit is transparent and portable, but not tamper-evident.",
      "Redaction avoids obvious key-name leaks, but does not perform comprehensive PII detection."
    ],
    nonGoals: [
      "No process isolation or sandboxing.",
      "No protection from a compromised host process.",
      "No containment for malicious tool implementations after an allowed call.",
      "No centralized policy/control plane, enterprise IAM, or multi-tenant authorization service.",
      "No token revocation, signing-key rotation, SIEM integration, or immutable audit storage.",
      "No production-scale authorization, performance, adoption, or live MCP deployment claims."
    ],
    futureExtensions: [
      "Out-of-process enforcement gateway for hard mediation.",
      "Asymmetric credentials and signing-key rotation.",
      "Durable or tamper-evident audit backend.",
      "Explicit token revocation.",
      "Centralized policy and control plane."
    ],
    sectionTitles: {
      demonstrates: "AI security capabilities made inspectable.",
      problem: "Model-selected tools are not authorization.",
      architecture: "SDK enforcement boundary for cooperative tool paths.",
      ownership: "Identity, policy, adapters, and audit stay separated.",
      requestFlow: "Authorization precedes execution.",
      decisions: "Security trade-offs with the boundary named.",
      reliability: "Fail-closed behavior inside guarded paths.",
      security: "The boundary is explicit, not implied.",
      observability: "Audit records provide local accountability.",
      threatModel: "Mitigations stay inside the stated boundary.",
      verified: "Verified behavior without hard-isolation claims.",
      tradeoffs: "Limitations that sharpen the security story.",
      future: "Future hardening, not current promises."
    },
    sectionEyebrows: {
      ownership: "Component Responsibilities",
      reliability: "Authorization Failure Behavior",
      observability: "Auditability"
    }
  }
] satisfies CaseStudy[];

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
