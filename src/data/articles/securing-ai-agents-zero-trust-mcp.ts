import type { Article } from "../writing";

const repository = "https://github.com/ravionxgroup/agenttrust";

export const agentTrustZeroTrustMcpArticle: Article = {
  slug: "securing-ai-agents-zero-trust-mcp",
  title: "Securing AI Agents: Building a Zero Trust Authorization Gateway for MCP Tool Execution",
  subtitle:
    "How signed agent identities, trusted permission mappings, independent Gateway enforcement, and observable decisions constrain MCP tool execution.",
  description:
    "Explore how AgentTrust applies Zero Trust principles to AI agent tool execution through signed identities, exact-scope authorization, independent Gateway enforcement, and observable MCP execution.",
  readingTime: "14 min read",
  publishedAt: "2026-10-25",
  modifiedAt: "2026-10-25",
  author: "Ravinder Varkali",
  category: "AI Security / Zero Trust",
  tags: ["AI Security", "Agentic AI", "MCP", "Zero Trust", "Authorization", "Platform Engineering"],
  heroImage: {
    src: "/images/writing/agenttrust/agenttrust-thumbnail.png",
    alt: "AgentTrust Zero Trust authorization gateway controlling ALLOW and DENY paths between an AI agent and an MCP server.",
    width: 1682,
    height: 949
  },
  project: "AgentTrust — AI Agent Security Reference Architecture and Implementation",
  caseStudyHref: "/projects/agenttrust",
  sourceHref: repository,
  sourceLabel: "View Public SDK and Console",
  disclaimer:
    "This article describes a locally validated security reference architecture and implementation. It does not establish production readiness, a managed authorization service, or complete identity lifecycle management.",
  intro: [
    {
      kind: "paragraph",
      text: "AI agents are moving beyond generating responses. They can now interact with enterprise APIs, retrieve operational data, and execute actions through tools exposed using the Model Context Protocol (MCP)."
    },
    {
      kind: "paragraph",
      text: "This introduces an important security challenge: How do we ensure an AI agent executes only the operations it is explicitly authorized to perform?"
    },
    {
      kind: "paragraph",
      text: "Consider an AI agent responsible for monitoring application health. It may need to check service status and retrieve diagnostic information. But should it also be allowed to restart services or modify infrastructure?"
    },
    {
      kind: "paragraph",
      text: "A valid authentication token establishes identity. It does not automatically grant permission to perform every available action."
    },
    {
      kind: "paragraph",
      text: "I built AgentTrust, an AI agent security reference architecture and implementation that explores how established Zero Trust principles—explicit verification, least-privilege access, and deny-by-default enforcement—can be applied to MCP tool execution."
    },
    {
      kind: "callout",
      label: "Objective",
      text: "An agent’s ability to request a tool must not determine its permission to execute that tool."
    },
    {
      kind: "paragraph",
      text: "AgentTrust demonstrates this principle through signed agent identities, trusted permission mappings, independent Gateway enforcement, and observable authorization decisions."
    },
    {
      kind: "paragraph",
      text: "The implementation has been validated in a local environment. Its focus is on demonstrating the security architecture and enforcement mechanisms rather than providing a complete production authorization platform."
    }
  ],
  sections: [
    {
      kind: "rich",
      id: "controlling-agent-actions",
      title: "1. The Security Challenge: Controlling Agent Actions",
      blocks: [
        {
          kind: "paragraph",
          text: "Traditional applications typically invoke predefined APIs through known execution paths."
        },
        {
          kind: "paragraph",
          text: "AI agents introduce a different interaction model. Depending on their instructions and available tools, they may dynamically select operations during execution."
        },
        {
          kind: "paragraph",
          text: "An agent that normally performs read-only monitoring might attempt an administrative action because of an unexpected instruction, application behavior, or malicious content."
        },
        {
          kind: "paragraph",
          text: "For example, an untrusted document or tool response could influence an agent to request a service restart."
        },
        {
          kind: "paragraph",
          text: "Prompt instructions and application-level restrictions can reduce unwanted behavior, but they should not be treated as authoritative security controls."
        },
        {
          kind: "paragraph",
          text: "The infrastructure protecting sensitive operations must independently evaluate whether the requesting identity has the required permission."
        },
        {
          kind: "paragraph",
          text: "This requires three architectural properties:"
        },
        {
          kind: "list",
          items: [
            "Explicit identity verification: Establish the authenticated identity associated with the request.",
            "Least-privilege authorization: Permit only operations covered by explicitly granted permissions.",
            "Pre-execution enforcement: Reject unauthorized operations before protected systems execute them."
          ]
        },
        {
          kind: "paragraph",
          text: "AgentTrust applies these principles to a defined subset of MCP tool execution."
        }
      ]
    },
    {
      kind: "rich",
      id: "architecture-and-trust-boundaries",
      title: "2. AgentTrust Architecture and Trust Boundaries",
      blocks: [
        {
          kind: "paragraph",
          text: "AgentTrust separates agent integration from authorization enforcement."
        },
        {
          kind: "paragraph",
          text: "The architecture consists of five principal components."
        },
        { kind: "subheading", title: "External Identity Issuer" },
        {
          kind: "paragraph",
          text: "A trusted issuer creates signed credentials representing an agent execution context."
        },
        {
          kind: "paragraph",
          text: "In Gateway mode, the issuer signs JWTs using Ed25519. The signing private key remains outside the public SDK and Gateway."
        },
        {
          kind: "paragraph",
          text: "The Gateway verifies these credentials but does not issue them."
        },
        { kind: "subheading", title: "AI Agent" },
        {
          kind: "paragraph",
          text: "The agent represents an application or automated workflow requesting tool operations."
        },
        {
          kind: "paragraph",
          text: "It operates in a less-trusted environment and cannot be relied upon to enforce its own authorization requirements."
        },
        { kind: "subheading", title: "Public AgentTrust SDK" },
        {
          kind: "paragraph",
          text: "The public Python SDK provides the integration client used to communicate with the Gateway."
        },
        {
          kind: "paragraph",
          text: "The client supplies a bearer token, logical tool identifier, and JSON arguments."
        },
        {
          kind: "paragraph",
          text: "It does not determine the required authorization scope or select the protected MCP destination."
        },
        {
          kind: "paragraph",
          text: "The SDK also supports a separate cooperative local mode using HS256 tokens. This mode has a different trust model and does not provide the independent enforcement boundary of Gateway mode."
        },
        { kind: "subheading", title: "Authorization Gateway" },
        {
          kind: "paragraph",
          text: "The separately maintained Go Gateway independently validates identity and evaluates authorization."
        },
        {
          kind: "list",
          items: [
            "Verifying JWT identity claims.",
            "Resolving logical tools from trusted configuration.",
            "Enforcing exact-scope permissions.",
            "Recording authorization evidence.",
            "Dispatching authorized MCP operations."
          ]
        },
        { kind: "subheading", title: "Protected MCP Server" },
        {
          kind: "paragraph",
          text: "The MCP server exposes configured operational tools."
        },
        {
          kind: "paragraph",
          text: "The Gateway constructs and dispatches authorized MCP `tools/call` requests to the configured destination."
        },
        {
          kind: "paragraph",
          text: "AgentTrust implements a bounded, stateless HTTP JSON-RPC tool-execution adapter rather than a general-purpose MCP proxy or discovery service."
        },
        { kind: "subheading", title: "Architecture Overview" },
        {
          kind: "diagram",
          asset: {
            src: "/images/writing/agenttrust/agenttrust-architecture.png",
            alt: "AgentTrust architecture showing an external identity issuer, less-trusted AI agent and SDK client, trusted authorization Gateway, protected MCP server, DENY termination, and observability outputs.",
            width: 783,
            height: 519
          },
          caption:
            "The Gateway verifies signed identity, resolves trusted tool configuration, authorizes exact scopes, records pre-dispatch evidence, and reaches the configured MCP server only on ALLOW.",
          lightboxTitle: "AgentTrust Architecture and Trust Boundaries"
        },
        {
          kind: "paragraph",
          text: "The primary execution flow is: AI Agent → Public AgentTrust Gateway Client → Authorization Gateway → Configured MCP Server."
        },
        {
          kind: "paragraph",
          text: "The Gateway is the authoritative enforcement point for requests using this protected path."
        },
        { kind: "subheading", title: "Why Deployment Isolation Matters" },
        {
          kind: "paragraph",
          text: "An independent Gateway does not automatically make protected tools unreachable through other routes."
        },
        {
          kind: "paragraph",
          text: "If an agent can directly communicate with the upstream MCP server, it may bypass Gateway authorization entirely."
        },
        {
          kind: "paragraph",
          text: "AgentTrust’s demonstrated local Docker topology separates agent workloads from protected tools and permits access through the Gateway."
        },
        {
          kind: "paragraph",
          text: "Other deployments require equivalent network or service-level restrictions to preserve this security boundary."
        },
        {
          kind: "callout",
          label: "Deployment boundary",
          text: "Gateway enforcement is effective only when protected execution cannot bypass the Gateway.",
          tone: "limitation"
        }
      ]
    },
    {
      kind: "rich",
      id: "agent-identity-and-authentication",
      title: "3. Agent Identity and Authentication",
      blocks: [
        {
          kind: "paragraph",
          text: "AgentTrust uses JWT-based identity verification in Gateway mode."
        },
        {
          kind: "paragraph",
          text: "A separate trusted issuer signs the token using Ed25519, and the Gateway verifies the token using the corresponding public key."
        },
        { kind: "subheading", title: "What Does the Gateway Validate?" },
        {
          kind: "list",
          items: [
            "EdDSA signature.",
            "Expected issuer and audience.",
            "Token expiration and issued-at time.",
            "Agent identity.",
            "Execution run identifier.",
            "Token identifier.",
            "Granted authorization scopes."
          ]
        },
        {
          kind: "paragraph",
          text: "These checks establish the identity and authorization context presented to the Gateway."
        },
        {
          kind: "paragraph",
          text: "However, token validity alone does not authorize a particular tool operation."
        },
        { kind: "subheading", title: "Short-Lived Execution Identities" },
        {
          kind: "paragraph",
          text: "The demonstration issuer generates JWTs with a 15-minute lifetime."
        },
        {
          kind: "paragraph",
          text: "The SDK’s separate local mode defaults to five-minute HS256 tokens."
        },
        {
          kind: "paragraph",
          text: "Short-lived credentials help reduce the exposure associated with compromised tokens."
        },
        {
          kind: "paragraph",
          text: "The Gateway requires an expiration claim and rejects expired tokens, but it does not enforce a maximum token lifetime."
        },
        {
          kind: "paragraph",
          text: "Managed token issuance, refresh, key rotation, JWKS discovery, and revocation are outside the current implementation."
        },
        {
          kind: "paragraph",
          text: "These remain important considerations for broader deployments."
        }
      ]
    },
    {
      kind: "rich",
      id: "fine-grained-authorization",
      title: "4. Fine-Grained Authorization for MCP Tools",
      blocks: [
        {
          kind: "paragraph",
          text: "One of AgentTrust’s key design decisions is to associate protected tool operations with explicitly configured permissions."
        },
        {
          kind: "paragraph",
          text: "Consider the following implemented mappings:"
        },
        {
          kind: "table",
          columns: ["Logical Tool", "Required Permission"],
          rows: [
            ["`service_status`", "`service.status`"],
            ["`restart_service`", "`service.restart`"]
          ]
        },
        {
          kind: "callout",
          label: "Demonstration scope",
          text: "These are synthetic demonstration operations used to verify authorization and dispatch behavior; `restart_service` does not restart production infrastructure.",
          tone: "limitation"
        },
        {
          kind: "paragraph",
          text: "An agent granted `service.status` can request the configured health-check operation."
        },
        {
          kind: "paragraph",
          text: "It cannot execute `restart_service` unless its credential includes `service.restart`."
        },
        { kind: "subheading", title: "Trusted Permission Resolution" },
        {
          kind: "paragraph",
          text: "The requesting agent supplies a logical tool identifier and JSON arguments."
        },
        {
          kind: "paragraph",
          text: "The Gateway resolves the corresponding authorization requirement from trusted configuration."
        },
        {
          kind: "paragraph",
          text: "The agent cannot redefine the permission required by a tool."
        },
        {
          kind: "paragraph",
          text: "For example, it cannot claim that `restart_service` requires only `service.status`."
        },
        {
          kind: "paragraph",
          text: "This prevents a less-trusted requester from controlling the authorization rules applied to its own requests."
        },
        { kind: "subheading", title: "Exact-Scope Matching" },
        {
          kind: "paragraph",
          text: "The Gateway evaluates explicitly required scopes against those granted to the authenticated identity."
        },
        {
          kind: "paragraph",
          text: "Authorization uses exact-scope matching rather than wildcard or inherited permissions."
        },
        {
          kind: "paragraph",
          text: "A valid token with insufficient scopes is denied."
        },
        {
          kind: "paragraph",
          text: "Unknown or unconfigured tools are also rejected."
        },
        {
          kind: "paragraph",
          text: "This establishes a deny-by-default authorization model for configured Gateway operations."
        },
        { kind: "subheading", title: "MCP Execution" },
        {
          kind: "paragraph",
          text: "Once authorization succeeds, the Gateway constructs an MCP `tools/call` request using its trusted tool mapping."
        },
        {
          kind: "paragraph",
          text: "The requester does not choose the upstream MCP address, protocol method, or configured tool name."
        },
        {
          kind: "paragraph",
          text: "This limits the ability of an agent to redirect authorized execution toward an unintended destination."
        }
      ]
    },
    {
      kind: "rich",
      id: "allow-deny-and-execution-evidence",
      title: "5. ALLOW, DENY, and Execution Evidence",
      blocks: [
        {
          kind: "paragraph",
          text: "A useful security architecture must demonstrate not only that authorization decisions are made, but also that those decisions control protected execution."
        },
        {
          kind: "paragraph",
          text: "AgentTrust includes tests covering both authorized and unauthorized tool requests."
        },
        { kind: "subheading", title: "Scenario A: Authorized Service Status" },
        {
          kind: "paragraph",
          text: "An agent possesses the permission `service.status` and requests `service_status`."
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Validates the signed identity.",
            "Resolves the logical tool from trusted configuration.",
            "Confirms that the required scope is granted.",
            "Records the required pre-dispatch evidence.",
            "Constructs and dispatches the configured MCP `tools/call`."
          ]
        },
        {
          kind: "callout",
          label: "Authorization result",
          text: "ALLOW. Existing test evidence confirms that the authorized request reaches the configured MCP operation."
        },
        { kind: "subheading", title: "Scenario B: Unauthorized Service Restart" },
        {
          kind: "paragraph",
          text: "The same agent requests `restart_service`. However, its credential does not contain `service.restart`. The Gateway rejects the operation."
        },
        {
          kind: "callout",
          label: "Authorization result",
          text: "DENY. Execution result: NOT_EXECUTED.",
          tone: "limitation"
        },
        {
          kind: "list",
          items: [
            "The request is rejected with HTTP 403.",
            "The authorization decision is DENY.",
            "The execution outcome is NOT_EXECUTED.",
            "The protected MCP server receives zero calls."
          ]
        },
        {
          kind: "paragraph",
          text: "The final assertion is particularly important."
        },
        {
          kind: "paragraph",
          text: "The security control does not merely report an unauthorized operation. It prevents the protected operation from being invoked through the Gateway."
        },
        { kind: "subheading", title: "Authorization Versus Execution Outcome" },
        {
          kind: "table",
          columns: ["Authorization", "Execution Outcome", "Meaning"],
          rows: [
            ["DENY", "NOT_EXECUTED", "Authorization prevented execution"],
            ["ALLOW", "SUCCEEDED", "Authorized operation completed successfully"],
            ["ALLOW", "FAILED", "Authorized operation failed"],
            ["ALLOW", "UNKNOWN", "Execution outcome could not be determined"]
          ]
        },
        {
          kind: "paragraph",
          text: "An ALLOW decision does not guarantee successful downstream execution."
        },
        {
          kind: "paragraph",
          text: "This distinction is especially important for operations that may produce side effects."
        },
        {
          kind: "paragraph",
          text: "For example, if a Gateway loses connectivity after dispatching a restart operation, it may not be able to determine whether the operation completed."
        },
        {
          kind: "paragraph",
          text: "Reporting the outcome as UNKNOWN is more accurate than assuming success or failure."
        },
        { kind: "subheading", title: "Audit Evidence and Failure Behavior" },
        {
          kind: "paragraph",
          text: "AgentTrust records authorization and execution lifecycle evidence using a local JSONL audit sink."
        },
        {
          kind: "paragraph",
          text: "Required pre-dispatch audit failures block execution."
        },
        {
          kind: "paragraph",
          text: "This ensures the Gateway does not intentionally proceed with a protected operation when mandatory pre-execution evidence cannot be recorded."
        },
        {
          kind: "paragraph",
          text: "However, audit storage is not immutable or tamper-proof."
        },
        {
          kind: "paragraph",
          text: "Additionally, an audit failure after an upstream handoff cannot undo a possible downstream side effect."
        },
        {
          kind: "paragraph",
          text: "These distinctions are important when designing security systems that must operate correctly under partial failures."
        }
      ]
    },
    {
      kind: "rich",
      id: "observability-and-trade-offs",
      title: "6. Observability and Engineering Trade-offs",
      blocks: [
        {
          kind: "paragraph",
          text: "Authorization enforcement introduces another component into the execution path."
        },
        {
          kind: "paragraph",
          text: "That component must be observable, understandable, and designed to handle failures safely."
        },
        { kind: "subheading", title: "OpenTelemetry Tracing" },
        {
          kind: "paragraph",
          text: "The Gateway emits OpenTelemetry spans covering important processing stages, including:"
        },
        {
          kind: "list",
          items: [
            "Request handling.",
            "Authentication.",
            "Trusted tool resolution.",
            "Authorization.",
            "Audit writes.",
            "MCP execution."
          ]
        },
        {
          kind: "paragraph",
          text: "When configured, these spans can be exported through OTLP to an external collector."
        },
        {
          kind: "paragraph",
          text: "The Gateway also injects W3C trace context into outbound MCP requests."
        },
        {
          kind: "paragraph",
          text: "The current implementation does not establish a complete distributed trace originating in the public SDK and continuing through the Gateway."
        },
        {
          kind: "paragraph",
          text: "Its verified tracing capability is therefore Gateway instrumentation with downstream context propagation."
        },
        { kind: "subheading", title: "Prometheus-Compatible Metrics" },
        {
          kind: "paragraph",
          text: "The Gateway exposes Prometheus-compatible metrics for operational monitoring."
        },
        {
          kind: "paragraph",
          text: "These include authorization activity and request-processing measurements."
        },
        {
          kind: "paragraph",
          text: "Metrics help engineers investigate rejection patterns, latency, and operational behavior."
        },
        {
          kind: "paragraph",
          text: "The implementation exposes a metrics endpoint; it does not provide a managed monitoring service."
        },
        { kind: "subheading", title: "Engineering Trade-offs" },
        { kind: "subheading", title: "Independent Enforcement Versus Additional Latency" },
        {
          kind: "paragraph",
          text: "Placing authorization in the Gateway creates a stronger security boundary than relying solely on cooperative SDK checks."
        },
        {
          kind: "paragraph",
          text: "However, it adds processing and network overhead to protected requests."
        },
        { kind: "subheading", title: "Exact-Scope Permissions Versus Policy Flexibility" },
        {
          kind: "paragraph",
          text: "Exact-scope matching makes authorization behavior predictable and easier to reason about."
        },
        {
          kind: "paragraph",
          text: "More advanced authorization requirements, such as contextual policies or delegated permissions, would require additional capabilities."
        },
        { kind: "subheading", title: "Signed Credentials Versus Identity Lifecycle Management" },
        {
          kind: "paragraph",
          text: "Cryptographic verification establishes the authenticity of presented identity claims."
        },
        {
          kind: "paragraph",
          text: "It does not eliminate the need for secure issuance, rotation, revocation, and credential distribution."
        },
        { kind: "subheading", title: "Auditability Versus Evidence Durability" },
        {
          kind: "paragraph",
          text: "Recording security decisions improves accountability and troubleshooting."
        },
        {
          kind: "paragraph",
          text: "However, local audit files do not provide the durability, immutability, or operational guarantees of a dedicated enterprise audit platform."
        },
        {
          kind: "paragraph",
          text: "These trade-offs demonstrate that effective security depends on both application-level controls and deployment architecture."
        }
      ]
    },
    {
      kind: "rich",
      id: "engineering-lessons",
      title: "7. Engineering Lessons and Future Considerations",
      blocks: [
        {
          kind: "paragraph",
          text: "Building AgentTrust reinforced several architectural lessons."
        },
        { kind: "subheading", title: "Security Enforcement Must Be Independent of Agent Behavior" },
        {
          kind: "paragraph",
          text: "AI agents may dynamically select tools or respond to unexpected instructions."
        },
        {
          kind: "paragraph",
          text: "Authorization cannot depend solely on the agent following intended behavior."
        },
        { kind: "subheading", title: "The Trust Boundary Must Be Explicit" },
        {
          kind: "paragraph",
          text: "A Gateway provides meaningful protection only when the surrounding deployment prevents direct access to protected systems."
        },
        {
          kind: "paragraph",
          text: "Security architecture must account for network paths, service boundaries, and operational privileges."
        },
        { kind: "subheading", title: "Permission Requirements Must Come from Trusted Sources" },
        {
          kind: "paragraph",
          text: "The requesting agent should not determine the authorization rules applied to its own operations."
        },
        {
          kind: "paragraph",
          text: "Trusted configuration establishes a clear separation between requested actions and security policy."
        },
        { kind: "subheading", title: "Execution Uncertainty Must Be Represented Accurately" },
        {
          kind: "paragraph",
          text: "An authorized operation can fail, time out, or complete without the Gateway receiving confirmation."
        },
        {
          kind: "paragraph",
          text: "Separating authorization decisions from execution outcomes helps prevent misleading audit records."
        },
        { kind: "subheading", title: "Observability Supports Security Verification" },
        {
          kind: "paragraph",
          text: "Traces, metrics, and audit records provide different forms of evidence."
        },
        {
          kind: "paragraph",
          text: "Together, they help engineers understand how requests were evaluated and what happened during execution."
        },
        { kind: "subheading", title: "Future Considerations" },
        {
          kind: "list",
          items: [
            "Delegated authorization across multiple agents.",
            "Context-aware policy evaluation.",
            "Managed identity lifecycle.",
            "Stronger deployment and workload isolation.",
            "Centralized policy administration.",
            "More comprehensive distributed tracing.",
            "Durable security audit infrastructure."
          ]
        },
        {
          kind: "paragraph",
          text: "These are areas for further engineering exploration rather than capabilities claimed by the current implementation."
        }
      ]
    },
    {
      kind: "rich",
      id: "conclusion",
      title: "Conclusion",
      blocks: [
        {
          kind: "paragraph",
          text: "As AI agents gain access to operational systems, security must extend beyond authenticating the requesting application."
        },
        {
          kind: "paragraph",
          text: "Each protected action needs an independently evaluated authorization decision, backed by trusted permission requirements and enforced before execution."
        },
        {
          kind: "paragraph",
          text: "AgentTrust demonstrates this approach through signed agent identities, exact-scope authorization, Gateway-controlled MCP dispatch, and observable execution evidence."
        },
        {
          kind: "paragraph",
          text: "The implementation also highlights an essential architectural consideration: an authorization Gateway cannot provide a meaningful security boundary without deployment controls that prevent bypass."
        },
        {
          kind: "callout",
          label: "Central lesson",
          text: "An agent’s ability to request an operation is not evidence that it should be permitted to execute it."
        },
        {
          kind: "paragraph",
          text: "That principle applies not only to MCP-based AI agents, but to any distributed system where less-trusted components initiate sensitive operations."
        },
        { kind: "subheading", title: "Explore AgentTrust" },
        {
          kind: "paragraph",
          text: "The AgentTrust project case study provides additional architecture details, implementation context, and supporting documentation."
        }
      ]
    }
  ]
};
