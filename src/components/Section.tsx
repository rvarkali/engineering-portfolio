import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-[4.5rem]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-9">{children}</div>
      </div>
    </section>
  );
}
