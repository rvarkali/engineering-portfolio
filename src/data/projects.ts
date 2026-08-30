export const repositoryLinks = {
  grpcMicroservicesReference: "https://github.com/rvarkali/grpc-microservices-reference",
  agentTrust: "https://github.com/ravionxgroup/agenttrust"
};

type FeaturedProject = {
  title: string;
  status: string;
  description: string;
  highlights: string[];
  href: string;
  caseStudyHref?: string;
  mcp?: string[];
  trustFlow?: string[];
  boundary?: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    title: "gRPC Microservices Reference",
    status: "Reference architecture",
    description:
      "Public reference implementation demonstrating contract-first gRPC service design, secure service-to-service communication, reliability, observability, and AI integration across cloud-native backend services.",
    highlights: [
      "Go",
      "gRPC",
      "PostgreSQL",
      "RBAC",
      "OpenTelemetry",
      "Containers",
      "Catalog Service",
      "Diagnostic Service"
    ],
    mcp: ["get_service", "create_diagnostic", "get_diagnostic"],
    href: repositoryLinks.grpcMicroservicesReference,
    caseStudyHref: "/projects/grpc-microservices-reference"
  },
  {
    title: "AgentTrust — Least-Privilege Identity & Audit for AI Agents",
    status: "Open-source AI agent authorization SDK",
    description:
      "Python SDK providing short-lived scoped identities for AI agent runs, deny-by-default tool authorization, and auditable execution decisions. Integrates with MCP and LangChain while keeping identity, policy, and audit concerns isolated from framework adapters.",
    highlights: ["Python", "JWT", "MCP", "LangChain", "Least Privilege", "Audit"],
    trustFlow: [
      "Start Run",
      "Scoped JWT",
      "Authorize Scope",
      "Allow / Deny",
      "Audit Decision",
      "Execute if Allowed"
    ],
    boundary:
      "Soft in-process enforcement for cooperative first-party code; hard out-of-process enforcement remains roadmap work.",
    href: repositoryLinks.agentTrust
  }
];
