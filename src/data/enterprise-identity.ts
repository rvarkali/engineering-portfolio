import type { CaseStudy } from "./case-studies";
import { enterpriseIdentityArchitecture, enterpriseIdentityProject } from "./projects";

const source = `${enterpriseIdentityProject.href}/blob/main`;
const java = `${source}/apps/api/src/main/java/dev/portfolio/iam`;

export const enterpriseIdentityCaseStudy: CaseStudy = {
  slug: "enterprise-identity-security-reference",
  title: enterpriseIdentityProject.title,
  eyebrow: "Identity Security / Backend Engineering",
  summary: enterpriseIdentityProject.description,
  repositoryUrl: enterpriseIdentityProject.href,
  stack: enterpriseIdentityProject.highlights,
  problem: "A valid identity is only the first gate. A multi-tenant API must also establish active membership, resource ownership, relationship permissions and contextual policy before returning data. Human and machine callers need distinct authentication boundaries without bypassing enforcement.",
  constraints: ["Tenant and resource context comes from server-owned data.", "Dependency failures must never become permission grants.", "Human and machine traffic share one API process, with separate listeners."],
  architecture: {
    summary: "A logical component view of the included source. Nginx hosts the React SPA and proxies human requests. Spring Boot orchestrates PostgreSQL, OpenFGA and OPA checks for resource reads. Machine traffic connects directly to a dedicated TLS listener. This illustration is not evidence of a deployed environment.",
    asset: enterpriseIdentityArchitecture,
    components: [
      "React + Keycloak: browser login through oidc-client-ts, Authorization Code + PKCE S256 and a public OIDC client.",
      "Nginx + Spring Boot: SPA delivery, human API proxying, JWT validation and application-level authorization enforcement.",
      "PostgreSQL: internal principal mapping, active tenant membership, resource existence, tenant association and classification.",
      "OpenFGA + OPA: owner, editor and viewer relationships produce computed resource permissions before additional contextual policy, in that order."
    ],
    telemetry: []
  },
  demonstrates: [],
  responsibilities: [],
  requestFlows: [
    {
      title: "Human authentication",
      summary: "The SPA uses an OIDC client library; the API independently validates the resulting access token.",
      steps: [
        "Redirect to Keycloak for Authorization Code + PKCE S256; complete the callback and code exchange through oidc-client-ts.",
        "Send the bearer access token through Nginx to the human API listener. OIDC state and user data use sessionStorage.",
        "Validate signature using JWKS, issuer, API audience and timestamps; explicitly require exp. Resolve issuer + subject to an active internal principal."
      ],
      notes: ["A valid JWT establishes identity; it does not by itself authorize resource access."]
    },
    {
      title: "Human resource authorization",
      summary: "Project and document reads pass ordered gates. OPA cannot override a PostgreSQL or OpenFGA denial.",
      steps: [
        "Resolve the principal and load resource metadata from PostgreSQL. Check active identity, tenant membership and resource eligibility.",
        "Ask OpenFGA for can_view using the internal principal and resource IDs. Denial or failure stops the request before OPA.",
        "Only after OpenFGA ALLOW, call OPA with backend-derived context. Return resource metadata only if the policy also allows."
      ],
      notes: ["Ineligible cross-tenant reads are concealed with 404; permission denial returns 403, and handled dependency failures return 503."]
    },
    {
      title: "Machine identity",
      summary: "An external machine client uses OAuth2 Client Credentials and connects directly to the dedicated HTTPS/mTLS listener.",
      steps: [
        "Obtain a machine access token from the configured confidential Keycloak client; present it with a trusted X.509 client certificate.",
        "Validate JWT signature, issuer, dedicated audience, authorized client, service-account subject, time claims and required role.",
        "Require the trusted TLS transport, valid certificate dates and exactly one matching URI SAN associated with the configured JWT identity."
      ],
      notes: ["GET /api/machine/policy/health is authenticated liveness only: no PostgreSQL, OpenFGA or OPA calls. Certificate association is not OAuth cnf/thumbprint token binding."]
    }
  ],
  decisions: [
    { title: "Separate identity from permission", context: "Authentication alone is insufficient.", decision: "Validate JWTs before resolving an internal principal and evaluating resource access.", consequence: "Additional gates increase request work but prevent a valid token from becoming blanket access.", sourceHref: `${java}/SecurityConfig.java` },
    { title: "Keep tenant context authoritative", context: "Caller claims cannot establish resource ownership.", decision: "Use PostgreSQL for principal mapping, active memberships and resource metadata.", consequence: "The database is an availability dependency; database errors do not grant access.", sourceHref: `${java}/resources/ResourceRepository.java` },
    { title: "Compose relationship and policy checks", context: "Relationships and contextual restrictions solve different problems.", decision: "Require OpenFGA can_view before a separate OPA evaluation. The API owns sequencing.", consequence: "Two decision services add latency and operational complexity; both must allow.", sourceHref: `${java}/resources/ResourceReadService.java` },
    { title: "Isolate machine transport", context: "Machine routes require stronger transport evidence.", decision: "Use a dedicated mTLS connector and reject routes on the wrong listener, including Nginx machine-route denial.", consequence: "Connector isolation is not process isolation: both listeners share one Spring Boot application.", sourceHref: `${java}/machine/MachineListenerGuard.java` }
  ],
  reliability: [],
  security: [
    "Least privilege: each resource read needs active eligibility, relationship permission and policy approval.",
    "Deny by default: malformed dependency responses, timeouts and invalid configuration never produce an allow.",
    "Tenant isolation: derive ownership from the database and conceal resources from ineligible callers.",
    "Defense in depth: reject machine routes on human transport and human routes on machine transport; forwarded headers do not establish trusted mTLS."
  ],
  observability: [],
  verifiedBehavior: [
    { label: "187 Java tests passed", detail: "Recorded coverage includes human JWT required-exp, machine JWT/certificate binding, listener/TLS boundaries, eligibility, tenant isolation and dependency failure handling." },
    { label: "72 Python tests passed", detail: "Recorded provisioning/configuration tests use synthetic fixtures and mocked service/subprocess effects." },
    { label: "259 total passed", detail: "Retained offline regression evidence, not a new execution during this website update and not full live end-to-end acceptance." },
    { label: "Native checks skipped", detail: "OPA and OpenFGA executables were unavailable. Their optional native checks are excluded from the 259 passing tests." }
  ],
  tradeoffs: ["Offline tests use mocked database/policy interfaces and test-owned JWKS/TLS servers. They do not establish live SQL, Keycloak or complete deployment integration."],
  nonGoals: [
    "Offline-validated reference implementation, not a production deployment.",
    "No complete SCIM provisioning or Microsoft Entra ID integration.",
    "No trusted live MFA assurance.",
    "No complete live end-to-end deployment acceptance."
  ],
  futureExtensions: []
};
