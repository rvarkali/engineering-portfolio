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
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  result: string;
  limitation: string;
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
  };
  responsibilities: Responsibility[];
  requestFlows: RequestFlow[];
  decisions: CaseStudyDecision[];
  reliability: FailureBehavior[];
  security: string[];
  observability: string[];
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
};

const grpcRepositoryUrl = "https://github.com/rvarkali/grpc-microservices-reference";
const grpcAdrBase = `${grpcRepositoryUrl}/blob/main/docs/decisions`;

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
  }
] satisfies CaseStudy[];

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
