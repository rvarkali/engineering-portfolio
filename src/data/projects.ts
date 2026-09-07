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
    title: "AgentTrust — Least-Privilege Security for AI Agents",
    status: "AI agent authorization initiative",
    description:
      "Least-privilege identity and independently enforced tool authorization for AI agents, with scoped run identities, MCP enforcement, audit evidence, and observability.",
    highlights: ["AI Security", "Go", "Python", "JWT / Ed25519", "MCP", "OpenTelemetry", "Prometheus", "Least Privilege"],
    trustFlow: [
      "Start Run",
      "Scoped JWT",
      "Authorize Scope",
      "Allow / Deny",
      "Audit Decision",
      "Execute if Allowed"
    ],
    boundary:
      "Public SDK enforcement is cooperative and in-process; the separately maintained gateway demonstrates an independent authorization point when topology prevents direct upstream bypass.",
    href: repositoryLinks.agentTrust,
    caseStudyHref: "/projects/agenttrust"
  }
];
