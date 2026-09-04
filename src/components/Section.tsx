import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  paddingClassName?: string;
  children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  className = "",
  contentClassName = "mt-7 sm:mt-9",
  paddingClassName = "py-10 sm:py-14 lg:py-16",
  children
}: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${paddingClassName} ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-portfolio-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-portfolio-ink sm:text-[2.45rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base font-normal leading-7 text-portfolio-body sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
