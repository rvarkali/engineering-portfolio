import Image from "next/image";
import { LinkButton } from "./LinkButton";

const heroCapabilities = [
  { label: "Scalable Platforms", icon: "cloud" },
  { label: "Reliable Systems", icon: "cube" },
  { label: "Applied AI", icon: "chip" },
  { label: "Real-World Impact", icon: "chart" }
];

function CapabilityIcon({ icon }: { icon: string }) {
  const className = "h-7 w-7 text-portfolio-accent";

  if (icon === "cloud") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 18h10.3a4 4 0 0 0 .5-7.95A5.7 5.7 0 0 0 7 8.4 4.8 4.8 0 0 0 7 18Z" />
      </svg>
    );
  }

  if (icon === "cube") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="m12 3.5 7 4v8.9l-7 4-7-4V7.5l7-4Zm0 8.1 7-4.1M12 11.6 5 7.5m7 4.1v8.8" />
      </svg>
    );
  }

  if (icon === "chip") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3M8 8h8v8H8z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h17M8 16v-5m5 5V7m5 9v-8" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_60%,#ffffff_100%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[64%] lg:block">
        <Image
          src="/images/hero/hero-mountain.png"
          alt=""
          fill
          priority
          sizes="64vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.76)_24%,rgba(255,255,255,0.08)_58%,rgba(255,255,255,0)_100%)]" />
        <figure className="absolute right-10 top-11 max-w-[22rem] border-l-2 border-portfolio-accent bg-white/18 py-2 pl-5 text-portfolio-ink xl:right-14">
          <blockquote className="text-lg font-medium italic leading-[1.5]">
            “Technology is most powerful
            <br />
            when it helps people solve
            <br />
            real problems.”
          </blockquote>
          <figcaption className="mt-4 text-sm font-semibold">— Ravinder Varkali</figcaption>
        </figure>
        <div className="absolute bottom-10 right-10 grid w-[58%] grid-cols-4 gap-2 xl:right-14">
          {heroCapabilities.map((item) => (
            <div
              className="flex min-h-16 items-center justify-center gap-3 rounded-md border border-portfolio-border/90 bg-white/90 px-3 py-3 shadow-[0_12px_30px_rgba(7,17,38,0.12)]"
              key={item.label}
            >
              <CapabilityIcon icon={item.icon} />
              <span className="text-center text-xs font-semibold leading-tight text-portfolio-ink">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mx-auto grid min-h-[590px] max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:py-14">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-portfolio-accent">
            Distributed Systems · Cloud Platforms · Applied AI
          </p>
          <h1 className="mt-5 max-w-[45rem] text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-portfolio-ink sm:text-[3.7rem] lg:text-[4rem]">
            Building reliable systems
            <br />
            that scale and make
            <br />
            <span className="text-portfolio-accent">a real impact.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-8 text-portfolio-body">
            I design and build distributed systems, cloud-native platforms, and AI-enabled
            infrastructure. I combine architecture ownership with hands-on implementation to solve
            complex, real-world problems at scale.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LinkButton href="#featured-engineering" variant="primary">
              View Engineering Work →
            </LinkButton>
            <LinkButton href="/resume/ravinder-varkali-resume.pdf" newTab>
              View Resume
            </LinkButton>
          </div>
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-lg border border-portfolio-border bg-white shadow-xl shadow-blue-950/10 lg:hidden">
          <Image
            src="/images/hero/hero-mountain.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <figure className="absolute left-4 top-4 max-w-[18rem] border-l-2 border-portfolio-accent bg-white/55 py-2 pl-4 text-portfolio-ink backdrop-blur-[2px]">
            <blockquote className="text-sm font-medium italic leading-[1.45]">
              “Technology is most powerful when it helps people solve real problems.”
            </blockquote>
            <figcaption className="mt-2 text-xs font-semibold">— Ravinder Varkali</figcaption>
          </figure>
          <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {heroCapabilities.map((item) => (
              <div
                className="flex min-h-14 items-center justify-center gap-2 rounded-md border border-portfolio-border/90 bg-white/92 px-2 py-2 shadow-[0_10px_24px_rgba(7,17,38,0.12)]"
                key={item.label}
              >
                <CapabilityIcon icon={item.icon} />
                <span className="text-center text-xs font-semibold leading-tight text-portfolio-ink">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
