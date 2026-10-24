import type { Article } from "../writing";

const auditedCommit = "6a57a6da24d364572e736c8ce05a6f2c2e2257a7";
const repository = "https://github.com/rvarkali/enterprise-identity-security-reference";
const sourceAtCommit = `${repository}/blob/${auditedCommit}`;

export const postgresOpenFgaOpaAuthorizationArticle: Article = {
  slug: "postgresql-openfga-opa-authorization",
  title: "Why I Combined PostgreSQL, OpenFGA, and OPA for Authorization—and When I Wouldn’t",
  subtitle:
    "An engineering case study in multi-tenant authorization, relationship-based access control, contextual policy, and the operational cost of combining them.",
  description:
    "A source-backed analysis of layered authorization with PostgreSQL, OpenFGA, and OPA, including trust boundaries, failure behavior, consistency risks, and simpler alternatives.",
  readingTime: "13 min read",
  publishedAt: "2026-10-23",
  modifiedAt: "2026-10-23",
  author: "Ravinder Varkali",
  tags: ["PostgreSQL", "OpenFGA", "OPA", "Authorization", "ReBAC", "Policy as Code", "Multi-tenancy"],
  project: "Enterprise Identity & Zero Trust Authorization",
  caseStudyHref: "/projects/enterprise-identity-security-reference",
  sourceHref: repository,
  sourceLabel: "View Reference Implementation",
  sourceCommit: auditedCommit,
  sourceCommitHref: `${repository}/tree/${auditedCommit}`,
  disclaimer:
    "This article describes an offline-oriented engineering reference. It does not establish production readiness, measured performance, or live end-to-end deployment validation.",
  sections: [
    {
      kind: "rich",
      id: "authentication-is-not-authorization",
      title: "1. Authentication Is Not Authorization",
      blocks: [
        {
          kind: "paragraph",
          text: "A valid access token tells an API who is making a request. It does not automatically establish which resources that identity can access."
        },
        {
          kind: "paragraph",
          text: "That distinction becomes particularly important in multi-tenant applications. Consider a document-management service where users belong to organizations, projects contain documents, and permissions depend on relationships with individual resources. A user may be authenticated, belong to an organization, and still lack permission to view a particular document."
        },
        {
          kind: "paragraph",
          text: "Traditional role-based access control (RBAC) handles broad permissions well. Resource-level authorization introduces additional questions:"
        },
        {
          kind: "list",
          items: [
            "Does the user have an active membership in the resource’s tenant?",
            "Does a direct or inherited relationship grant access to the document?",
            "Does the document’s classification impose additional restrictions?",
            "What happens when an authorization dependency is unavailable?"
          ]
        },
        {
          kind: "paragraph",
          text: "I explored these questions while building an Enterprise IAM reference implementation using Spring Boot, PostgreSQL, OpenFGA, and Open Policy Agent (OPA)."
        },
        {
          kind: "paragraph",
          text: "The architecture separates three responsibilities: PostgreSQL establishes authoritative application facts, including internal identity, tenant membership, resource existence, tenant association, parent-project linkage, and classification. OpenFGA evaluates principal-to-resource relationships, including owner, editor, and viewer roles and inherited permissions. OPA evaluates contextual policy after the relationship check succeeds."
        },
        {
          kind: "paragraph",
          text: "This separation makes the trust boundaries explicit. It also introduces additional dependencies and consistency challenges. The engineering question is whether the application’s authorization requirements justify that complexity."
        }
      ]
    },
    {
      kind: "rich",
      id: "following-a-document-read-request",
      title: "2. Following a Document-Read Request",
      blocks: [
        {
          kind: "paragraph",
          text: "The Spring Boot API acts as the authorization enforcement point. Consider GET /api/v1/documents/{documentId}. An authorized request passes through four stages."
        },
        { kind: "subheading", title: "1. Authenticate the caller" },
        {
          kind: "paragraph",
          text: "Spring Security validates the JWT signature, issuer, expiration, and expected audience. The application uses the validated issuer and subject to resolve an active internal principal. A valid JWT is necessary, but it does not grant document-level permission."
        },
        { kind: "subheading", title: "2. Establish tenant and resource eligibility" },
        {
          kind: "paragraph",
          text: "PostgreSQL supplies the document record, tenant association, parent-project linkage, and classification. The API checks that the principal has active membership in the resource’s tenant. This context comes from backend records rather than a tenant identifier selected by the caller."
        },
        { kind: "subheading", title: "3. Evaluate the resource relationship" },
        {
          kind: "paragraph",
          text: "After PostgreSQL eligibility checks succeed, OpenFGA evaluates the computed can_view permission for the principal and document. That permission may result from a direct document relationship or inherited access through the parent project."
        },
        { kind: "subheading", title: "4. Evaluate contextual policy" },
        {
          kind: "paragraph",
          text: "Only after OpenFGA allows access does the API invoke OPA with backend-constructed context. OPA evaluates the resource type, action, preceding relationship decision, and classification. The current implementation supports classification-aware policy. It does not complete the authentication-assurance integration needed to allow confidential-document reads."
        },
        {
          kind: "paragraph",
          text: "The API returns the document only when every required authorization stage succeeds."
        },
        {
          kind: "diagram",
          asset: {
            src: "/images/writing/postgresql-openfga-opa-authorization/document-read-authorization-sequence.svg",
            alt: "Document-read authorization sequence: Spring Security validates the JWT, PostgreSQL resolves the principal and tenant eligibility, OpenFGA evaluates computed can_view, and OPA applies contextual policy before the API returns the document.",
            width: 1000,
            height: 1420
          },
          lightboxTitle: "Document-read authorization sequence",
          caption:
            "Figure 1. Simplified implemented authorization path. A denial or recognized dependency failure stops the request without returning the protected document; Section 7 details the HTTP responses."
        },
        {
          kind: "code",
          language: "java",
          caption: "Document-read orchestration in ResourceReadService.java",
          note:
            "Contiguous verbatim excerpt from the audited commit. Surrounding method setup, exception handling, and security-event emission are omitted. requireView enforces PostgreSQL eligibility and OpenFGA authorization; requireContext invokes OPA only after requireView succeeds.",
          sourceHref: `${sourceAtCommit}/apps/api/src/main/java/dev/portfolio/iam/resources/ResourceReadService.java#L57-L64`,
          sourceLabel: "Inspect the audited Java source",
          code: `UUID principal = principals.resolve(jwt);
event.principal = principal; event.reason = "RESOURCE_OR_ELIGIBILITY";
var document = resources.findDocument(id).orElseThrow(ResourceReadService::notFound);
requireView(principal, document.tenantId(), document.tenantSlug(), DOCUMENT, document.id(), event);
event.reason = "OPA_DENY";
requireContext(DOCUMENT, document.classification());
event.allow(document.tenantId(), document.id());
return document;`
        },
        {
          kind: "paragraph",
          text: "The ordering matters. A later engine cannot override an earlier denial, and an ineligible tenant context is rejected before the external relationship check."
        }
      ]
    },
    {
      kind: "rich",
      id: "why-postgresql-comes-first",
      title: "3. Why PostgreSQL Comes First",
      blocks: [
        {
          kind: "paragraph",
          text: "One of the most important architectural decisions was to establish tenant eligibility before evaluating resource relationships."
        },
        {
          kind: "paragraph",
          text: "PostgreSQL owns the authoritative application records:"
        },
        {
          kind: "list",
          items: [
            "Internal principals and their active status.",
            "Tenant memberships.",
            "Resource existence and tenant association.",
            "Document-to-project linkage.",
            "Document classification."
          ]
        },
        {
          kind: "paragraph",
          text: "Principal-to-resource roles such as owner, editor, and viewer are represented in OpenFGA, not stored as ownership fields on the PostgreSQL resource records. This distinction prevents two systems from appearing to own the same authorization fact."
        },
        { kind: "subheading", title: "Tenant isolation before relationship evaluation" },
        {
          kind: "paragraph",
          text: "For a document request, the API retrieves the resource’s tenant context and verifies active membership before invoking OpenFGA. If the resource does not exist, or the caller is not eligible for its tenant, the API returns 404 Not Found. This helps avoid revealing whether a resource exists outside the caller’s eligible tenant context."
        },
        {
          kind: "paragraph",
          text: "If the caller belongs to the tenant but lacks the required relationship, the request normally returns 403 Forbidden. The implementation also rechecks membership following an OpenFGA denial. If membership has been revoked, the result can instead be 404."
        },
        { kind: "subheading", title: "Why not rely entirely on OpenFGA?" },
        {
          kind: "paragraph",
          text: "OpenFGA can represent tenant membership and resource relationships. However, a relationship tuple does not necessarily reflect the current lifecycle state of an authoritative PostgreSQL record. A relationship could remain after an application membership is deactivated."
        },
        {
          kind: "paragraph",
          text: "Checking active membership in PostgreSQL first prevents that stale relationship alone from bypassing tenant eligibility. It does not eliminate every cross-system consistency risk. The broader principle is to decide which system owns each authorization fact before distributing authorization decisions across multiple components."
        }
      ]
    },
    {
      kind: "rich",
      id: "why-openfga",
      title: "4. Why OpenFGA? Beyond Application-Wide Roles",
      blocks: [
        {
          kind: "paragraph",
          text: "RBAC is effective when permissions are associated with a manageable number of roles. It becomes less convenient when users have different permissions across individual resources. A user might be an editor on one project, a viewer on another, and have no access to a third. Documents may also inherit permissions from their parent projects."
        },
        {
          kind: "paragraph",
          text: "OpenFGA represents these relationships in a dedicated authorization model. Instead of asking whether a user has a global viewer role, the application asks: Can this principal view this specific document? The can_view permission is computed by the model. It is not necessarily a directly stored relationship tuple."
        },
        { kind: "subheading", title: "Why not use SQL access-control tables?" },
        {
          kind: "paragraph",
          text: "For straightforward resource ownership and a small number of roles, PostgreSQL tables and Spring Security may be sufficient. That design avoids another network service and keeps authorization logic close to application data."
        },
        {
          kind: "paragraph",
          text: "OpenFGA becomes more attractive when relationships span multiple resource types, permissions are inherited through hierarchies, or application queries become increasingly difficult to maintain. But a relationship engine introduces responsibilities of its own. The application must manage relationship tuples, authorization model versions, and coordination with authoritative resource state."
        },
        {
          kind: "paragraph",
          text: "In this implementation, each OpenFGA check supplies an explicit, externally configured authorization-model ID and requests higher consistency. This avoids silently selecting the latest model and reduces certain stale-read risks within OpenFGA. It does not provide transactional consistency with PostgreSQL."
        },
        {
          kind: "paragraph",
          text: "I would introduce OpenFGA when relationship complexity justifies a dedicated authorization model—not simply because relationship-based access control is more expressive than RBAC."
        }
      ]
    },
    {
      kind: "rich",
      id: "why-opa",
      title: "5. Why OPA? Relationships Are Not the Entire Policy",
      blocks: [
        {
          kind: "paragraph",
          text: "A valid relationship does not necessarily mean access should be granted under every circumstance. A user may have permission to view a project’s documents, but certain documents may require additional security conditions. This is where contextual policy becomes useful."
        },
        {
          kind: "paragraph",
          text: "OpenFGA evaluates the relationship. OPA evaluates whether the requested operation satisfies additional policy requirements. The API constructs OPA input from backend-controlled values, including resource type, action, classification, and the successful OpenFGA decision. OPA is invoked only after OpenFGA allows access."
        },
        { kind: "subheading", title: "Classification-aware authorization" },
        {
          kind: "paragraph",
          text: "The Rego policy distinguishes PUBLIC, INTERNAL, and CONFIDENTIAL documents. Public and internal classifications can pass the contextual policy check when the required preceding conditions are satisfied. Confidential documents require trusted authentication assurance."
        },
        {
          kind: "code",
          language: "rego",
          caption: "Selected classification rules from authorization/opa/policies/access.rego",
          note:
            "The valid_document rule and its valid_common dependency are omitted for readability. This excerpt is not a complete standalone policy.",
          sourceHref: `${sourceAtCommit}/authorization/opa/policies/access.rego#L5-L50`,
          sourceLabel: "Inspect the complete audited Rego policy",
          code: `default allow := false

# Additional common input validation is omitted.
allow if {
  valid_document
  input.classification in {"PUBLIC", "INTERNAL"}
}

allow if {
  valid_document
  input.classification == "CONFIDENTIAL"
  trusted := data.iam.config.trusted_assurance_values
  is_array(trusted)
  every value in trusted {
    is_string(value)
    count(value) > 0
  }
  input.authentication.assurance in trusted
}`
        },
        {
          kind: "callout",
          tone: "limitation",
          label: "Implementation boundary",
          text: "The Java client currently supplies an empty authentication-assurance object, while the configured trusted-assurance list is empty. Confidential-document reads therefore remain denied through the implemented API path. This is classification-aware authorization, not a completed step-up authentication system."
        },
        { kind: "subheading", title: "Why not implement the policy in Java?" },
        {
          kind: "paragraph",
          text: "For three document classifications, Java conditionals would be simpler. OPA becomes more valuable when contextual policies evolve independently of application releases, need centralized governance, or must be evaluated consistently across multiple services."
        },
        {
          kind: "paragraph",
          text: "Potential extensions include verified authentication assurance or trusted device posture. Those are architectural possibilities, not demonstrated features of this implementation. A separate policy engine should reduce overall policy-management complexity, not merely relocate conditional statements."
        }
      ]
    },
    {
      kind: "rich",
      id: "operational-cost",
      title: "6. The Operational Cost of Layered Authorization",
      blocks: [
        {
          kind: "paragraph",
          text: "The architecture provides distinct authorization boundaries, but a successful request depends on several components. That creates four important trade-offs."
        },
        { kind: "subheading", title: "Latency" },
        {
          kind: "paragraph",
          text: "A document read involves database operations followed by sequential OpenFGA and OPA evaluations. Each dependency contributes to end-to-end latency. Authorization caching could reduce repeated evaluations, but cached decisions can outlive membership revocations, relationship removals, or policy changes."
        },
        {
          kind: "paragraph",
          text: "The reference implementation does not include a request-path authorization-decision cache or measured authorization latency. I would measure the full request path and establish revocation requirements before introducing caching."
        },
        { kind: "subheading", title: "Availability" },
        {
          kind: "paragraph",
          text: "An authorization dependency can fail even when the caller has legitimate access. The implementation fails closed: recognized PostgreSQL, OpenFGA, and OPA failures do not grant access and are mapped to 503 Service Unavailable in the protected resource path."
        },
        {
          kind: "callout",
          tone: "implementation",
          label: "Implemented",
          text: "The clients use bounded connect and request timeouts, including a bound on the complete asynchronous response."
        },
        {
          kind: "callout",
          tone: "recommendation",
          label: "Production consideration",
          text: "Those limits still require operational tuning and validation. A production system would also need a deliberate retry strategy where safe, dependency isolation, monitoring, and recovery procedures. The repository does not establish production high availability."
        },
        { kind: "subheading", title: "Consistency and revocation" },
        {
          kind: "paragraph",
          text: "PostgreSQL and OpenFGA maintain different representations of authorization-related state. There is no shared transaction between them in the current implementation. For example, a project ownership change may update an authoritative application record and its relationship representation at different times. During that interval, the systems may disagree."
        },
        {
          kind: "paragraph",
          text: "Requesting higher consistency from OpenFGA does not guarantee consistency between OpenFGA and PostgreSQL."
        },
        {
          kind: "diagram",
          asset: {
            src: "/images/writing/postgresql-openfga-opa-authorization/authorization-consistency-boundary.svg",
            alt: "Authorization consistency boundary: the implemented Spring Boot path reads authoritative facts from PostgreSQL, evaluates relationships in OpenFGA, and evaluates contextual policy in OPA without a shared PostgreSQL and OpenFGA transaction; a separate proposed section shows an outbox, idempotent projection, reconciliation, and monitoring.",
            width: 1200,
            height: 1180
          },
          lightboxTitle: "PostgreSQL and OpenFGA consistency boundary",
          caption:
            "Figure 2. PostgreSQL and OpenFGA have distinct responsibilities without a shared transaction. The proposed outbox, idempotent projection, reconciliation, and monitoring components are not implemented in the reference repository."
        },
        {
          kind: "paragraph",
          text: "A production design could use transactional outbox processing, idempotent relationship updates, reconciliation, and synchronization-lag monitoring. These measures would need to be designed and validated rather than assumed to eliminate every authorization consistency window."
        },
        { kind: "subheading", title: "Operational complexity" },
        {
          kind: "paragraph",
          text: "Troubleshooting becomes more difficult when a denial can originate from tenant eligibility, relationship evaluation, or contextual policy. The implementation emits structured authorization events to application logs. It does not persist those events to a dedicated audit database."
        },
        {
          kind: "callout",
          tone: "recommendation",
          label: "Production consideration",
          text: "I would evaluate decision identifiers, dependency metrics, distributed tracing, policy and model version visibility, and durable audit records where required."
        },
        {
          kind: "paragraph",
          text: "The real cost of layered authorization is keeping the components correct, observable, and consistent as the system evolves."
        }
      ]
    },
    {
      kind: "rich",
      id: "fail-closed",
      title: "7. Fail Closed Without Hiding Failures",
      blocks: [
        {
          kind: "paragraph",
          text: "Authorization uncertainty must never become permission. If OpenFGA cannot evaluate a relationship or OPA cannot produce a valid decision, the API should not assume access is allowed. But a dependency failure is not the same as an explicit denial."
        },
        {
          kind: "paragraph",
          text: "The implementation distinguishes the following outcomes:"
        },
        {
          kind: "table",
          columns: ["Condition", "HTTP response"],
          rows: [
            ["Missing or invalid JWT", "401 Unauthorized"],
            ["Valid JWT without exactly one active internal principal", "403 Forbidden"],
            ["Missing resource or tenant-ineligible principal", "404 Not Found"],
            ["Relationship or contextual policy denial", "403 Forbidden"],
            ["Recognized authorization dependency failure", "503 Service Unavailable"]
          ],
          caption: "Protected document-read response boundaries"
        },
        {
          kind: "paragraph",
          text: "This distinction matters operationally. Returning 403 for a dependency outage can make infrastructure failures appear to be permission changes. Allowing access during the same outage would compromise the authorization boundary."
        },
        {
          kind: "paragraph",
          text: "Recognized dependency failures are mapped to 503 without returning protected resource data. Unexpected application exceptions may follow other error-handling paths. For production use, I would complement these responses with dependency-specific metrics, tracing, and alerting."
        },
        {
          kind: "paragraph",
          text: "Fail closed for security, but preserve enough diagnostic information to distinguish an authorization denial from an authorization-system failure."
        }
      ]
    },
    {
      kind: "rich",
      id: "when-to-choose-this-architecture",
      title: "8. When I Would—and Wouldn’t—Choose This Architecture",
      blocks: [
        {
          kind: "paragraph",
          text: "I would not combine PostgreSQL, OpenFGA, and OPA by default. The decision depends on whether the application needs complex resource relationships, independently evolving contextual policies, or both."
        },
        { kind: "subheading", title: "Where the layered approach makes sense" },
        { kind: "subheading", title: "Multi-tenant SaaS" },
        {
          kind: "paragraph",
          text: "Users may belong to multiple organizations and have different permissions across projects. PostgreSQL can establish tenant eligibility, OpenFGA can evaluate project relationships, and OPA can apply contextual restrictions. This resembles the requirements explored in the reference implementation."
        },
        { kind: "subheading", title: "Financial services" },
        {
          kind: "paragraph",
          text: "An employee may have access to a customer account but require additional conditions before performing a sensitive operation. Relationship-based authorization can evaluate account entitlements, while contextual policy can enforce transaction-specific restrictions. Such applications also require domain-specific controls and regulatory considerations beyond this reference."
        },
        { kind: "subheading", title: "Zero Trust enterprise applications" },
        {
          kind: "paragraph",
          text: "An authenticated employee may have permission to access an application, but sensitive operations could require stronger authentication or verified device security. Separating resource relationships from contextual policy can support this design. Device-posture evaluation and end-to-end step-up authentication are not implemented in the current reference."
        },
        { kind: "subheading", title: "Choosing the simpler alternative" },
        {
          kind: "table",
          columns: ["Application requirements", "Architecture to consider"],
          rows: [
            ["Simple roles, ownership, and stable permissions", "Spring Security + PostgreSQL"],
            ["Complex resource relationships and inherited permissions", "PostgreSQL + OpenFGA"],
            ["Complex contextual rules with simple relationships", "PostgreSQL + OPA"],
            ["Complex relationships and independently evolving contextual policies", "PostgreSQL + OpenFGA + OPA"]
          ],
          caption: "Architecture selection starting points"
        },
        {
          kind: "paragraph",
          text: "These are starting points, not universal prescriptions. Team expertise, operational ownership, deployment constraints, latency requirements, and security obligations can change the decision."
        },
        {
          kind: "paragraph",
          text: "For a single-service application with straightforward roles and ownership rules, I would generally start with Spring Security and PostgreSQL. I would introduce OpenFGA when hierarchical relationships or inherited permissions become difficult to maintain through SQL and application code. I would introduce OPA when contextual policies become complex enough to justify independent policy management."
        },
        {
          kind: "paragraph",
          text: "I would combine all three when both requirements are substantial and the team can operate the additional dependencies responsibly. The best authorization architecture is the simplest design that satisfies the application’s security, correctness, and operational requirements."
        }
      ]
    },
    {
      kind: "rich",
      id: "engineering-lessons",
      title: "9. Engineering Lessons",
      blocks: [
        {
          kind: "paragraph",
          text: "Building this reference implementation reinforced four principles."
        },
        {
          kind: "list",
          items: [
            "Define ownership of authorization facts. PostgreSQL owns application identity, active tenant membership, resource existence, tenant association, linkage, and classification. OpenFGA evaluates principal-to-resource relationships. OPA evaluates contextual policy.",
            "Treat evaluation order as part of the security design. Tenant eligibility comes before relationship evaluation, and contextual policy cannot override earlier denials.",
            "Design for failure and revocation. Timeouts and fail-closed responses matter, but so do consistency boundaries, recovery, and operational visibility.",
            "Introduce complexity only when requirements justify it. Dedicated authorization engines are useful when they solve problems that would otherwise make the application harder to maintain."
          ]
        },
        {
          kind: "paragraph",
          text: "This repository demonstrates these boundaries through application code and isolated tests. It does not establish production readiness, cross-system transactional synchronization, or measured performance characteristics."
        },
        {
          kind: "paragraph",
          text: "I would choose PostgreSQL, OpenFGA, and OPA together when the application genuinely needs both sophisticated resource relationships and independently managed contextual policy. Otherwise, a simpler authorization architecture may be the better engineering decision."
        },
        {
          kind: "callout",
          tone: "implementation",
          label: "Engineering conclusion",
          text: "Good authorization design is about making the right trust decisions at the right boundaries—not maximizing the number of security components."
        },
        {
          kind: "reference",
          label: "Reference implementation",
          title: "Enterprise Identity & Security Reference",
          href: repository,
          revisionLabel: "Verified revision",
          revision: auditedCommit.slice(0, 12),
          revisionHref: `${repository}/tree/${auditedCommit}`,
          text: "This is an offline-oriented engineering reference, not a production deployment. The diagrams illustrate verified request behavior and explicitly identified architectural recommendations; they are not evidence of live deployment or end-to-end production validation."
        }
      ]
    }
  ]
};
