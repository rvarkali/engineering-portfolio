export const repositoryLinks = {
  cloudOpsPlatform: "https://github.com/rvarkali/grpc-microservices-reference"
};

export const featuredProjects = [
  {
    title: "CloudOps Distributed Microservices Platform",
    status: "Reference architecture",
    description:
      "Production-inspired public reference architecture demonstrating distributed systems, security, reliability, observability, and AI integration across cloud-native backend services.",
    highlights: [
      "Go",
      "gRPC",
      "PostgreSQL",
      "JWT authentication",
      "RBAC",
      "OpenTelemetry",
      "Containerized infrastructure",
      "Catalog Service",
      "Diagnostic Service",
      "Secure service-to-service communication"
    ],
    mcp: ["get_service", "create_diagnostic", "get_diagnostic"],
    href: repositoryLinks.cloudOpsPlatform
  }
];
