export type ArticleSection =
  | {
      kind: "paragraphs";
      title: string;
      paragraphs: string[];
    }
  | {
      kind: "sequence";
      title: string;
      intro: string;
      rows: [string, string][];
      outro: string;
    }
  | {
      kind: "list";
      title: string;
      intro?: string;
      items: string[];
    };

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  readingTime: string;
  project: string;
  caseStudyHref: string;
  sourceHref: string;
  sections: ArticleSection[];
};

export const articles = [
  {
    slug: "for-update-missing-idempotency-key",
    title: "Why FOR UPDATE Does Not Protect a Missing Idempotency Key",
    subtitle:
      "A PostgreSQL-backed idempotency pattern where row locks, unique constraints, transaction rollback, and bounded retry each solve a different part of concurrent workflow admission.",
    description:
      "A concise engineering explanation of PostgreSQL row locking, uniqueness constraints, transaction rollback, and idempotent workflow admission under concurrent requests.",
    readingTime: "5 min read",
    project: "gRPC Microservices Reference",
    caseStudyHref: "/projects/grpc-microservices-reference",
    sourceHref:
      "https://github.com/rvarkali/grpc-microservices-reference/blob/main/docs/evidence/concurrent-idempotency.md",
    sections: [
      {
        kind: "paragraphs",
        title: "The Question",
        paragraphs: [
          "The gRPC Microservices Reference includes a Diagnostic workflow admission path with an idempotency key. A caller can submit a Diagnostic request, the service validates the request against Catalog, and the Diagnostics repository persists the accepted job, the idempotency record, and a job-created outbox event in one PostgreSQL transaction.",
          "The interesting concurrency question is smaller than the whole workflow: why doesn't SELECT ... FOR UPDATE prevent two concurrent transactions from both deciding that an idempotency key does not yet exist?",
          "In this design, the answer is that FOR UPDATE locks rows returned by the query. When the idempotency record is already present, that lock is useful. When the row is absent, there is no idempotency row for the query to lock. Under the demonstrated PostgreSQL setup, two concurrent transactions can both observe no record for the same authenticated subject and idempotency key, then both proceed toward insertion."
        ]
      },
      {
        kind: "sequence",
        title: "The Race",
        intro:
          "Conceptually, the implemented behavior can be understood as this sequence:",
        rows: [
          ["SELECT ... FOR UPDATE", "SELECT ... FOR UPDATE"],
          ["no row", "no row"],
          ["INSERT diagnostic_job", "INSERT diagnostic_job"],
          ["INSERT idempotency_record", "INSERT idempotency_record"],
          ["COMMIT", "unique violation / rollback"],
          ["", "retry"],
          ["", "read committed record"],
          ["", "return existing job"]
        ],
        outro:
          "No application-level mutex is implied here. The first read does not reserve the missing key. The database constraint decides which transaction establishes that idempotency identity."
      },
      {
        kind: "paragraphs",
        title: "The Real Durable Invariant",
        paragraphs: [
          "The durable invariant is the primary key on diagnostics.idempotency_records: (authenticated_subject, idempotency_key). That uniqueness constraint arbitrates concurrent attempts to create the same idempotency identity.",
          "The repository first looks for an existing idempotency record with FOR UPDATE. If it finds one, it compares the stored request hash with the incoming canonical request hash. A matching hash means replay the existing Diagnostic job. A different hash means the idempotency key was reused for a different request and should be rejected as a conflict.",
          "If the record is absent, the repository creates a queued Diagnostic job, inserts the idempotency record pointing to that job, and inserts the job-created outbox event. Those three writes happen inside the same transaction. If the idempotency insert loses the uniqueness race, PostgreSQL reports unique violation 23505. The repository classifies that as a duplicate-insert-race outcome. Because the transaction rolls back, the losing transaction's transient Diagnostic job and outbox insert do not become durable."
        ]
      },
      {
        kind: "paragraphs",
        title: "Database Invariant Versus API Behavior",
        paragraphs: [
          "The uniqueness constraint prevents duplicate durable identity for the same authenticated subject and idempotency key. That is the database invariant.",
          "The service still has to translate expected contention into useful API behavior. In the CreateDiagnosticJob service path, a duplicate-insert-race result triggers one bounded retry through the same repository method. On retry, the transaction reads the idempotency record that the winning transaction committed. Because the concurrent requests are equivalent, the request hash matches and the service returns the existing Diagnostic job.",
          "This distinction matters. The database prevents duplicate durable admission identity. The application retry turns that contention outcome into idempotent API behavior for callers. Those are related, but they are not the same mechanism."
        ]
      },
      {
        kind: "paragraphs",
        title: "Why The Initial Lock Still Exists",
        paragraphs: [
          "It would be wrong to conclude that SELECT ... FOR UPDATE is useless. It protects the existing-row case. Once an idempotency record exists, the repository needs to read a stable association between the key, the canonical request hash, and the Diagnostic job ID. Locking that row serializes access to that existing idempotency identity while the transaction determines replay versus conflict.",
          "The nuance is simple: FOR UPDATE protects an existing row. The uniqueness constraint protects creation of the identity when that row is initially absent."
        ]
      },
      {
        kind: "paragraphs",
        title: "The Local Concurrent Experiment",
        paragraphs: [
          "The repository includes local PostgreSQL-backed integration evidence for this exact path. The focused test starts 20 goroutines behind a shared barrier and sends 20 concurrent equivalent Diagnostic admissions with the same authenticated subject, same service ID, same diagnostic profile, same request body, and same idempotency key. Request IDs are unique because request ID is not part of the canonical idempotency hash.",
          "The focused test was repeated five times successfully. Each run observed: 20 successful responses, 1 unique returned diagnostic job ID, 1 durable diagnostic job, 1 idempotency record, 1 job-created outbox row, and 0 unexpected errors.",
          "This is local PostgreSQL-backed integration evidence for one durable workflow admission in the tested scenario. It is not load testing, performance testing, scalability testing, or production concurrency validation."
        ]
      },
      {
        kind: "list",
        title: "What This Does Not Establish",
        intro:
          "The result is useful because it is narrow. It does not claim more than the experiment measured.",
        items: [
          "It is not a throughput benchmark.",
          "It is not a latency measurement.",
          "It is not production-scale validation.",
          "It is not proof of arbitrary-contention safety.",
          "It is not multi-region correctness.",
          "It is not exactly-once execution.",
          "It is not exactly-once event delivery.",
          "It is not a substitute for production observability."
        ]
      },
      {
        kind: "list",
        title: "Principal-Level Takeaways",
        items: [
          "Idempotency needs a durable uniqueness invariant, not only an initial read.",
          "Locking an existing row and arbitrating creation of a missing row are different concurrency problems.",
          "Keep durable workflow admission records in one transaction when they represent one accepted unit of work.",
          "Translate expected database contention into deliberate API behavior.",
          "Test idempotency concurrently; sequential replay tests do not exercise the first-writer race."
        ]
      }
    ]
  }
] satisfies Article[];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
