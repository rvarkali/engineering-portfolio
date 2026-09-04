import Link from "next/link";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  newTab?: boolean;
};

export function LinkButton({
  href,
  children,
  variant = "secondary",
  newTab = false
}: LinkButtonProps) {
  const variantClassNames = {
    primary:
      "border-portfolio-accent bg-portfolio-accent text-white shadow-sm shadow-blue-700/15 hover:border-blue-700 hover:bg-blue-700",
    secondary:
      "border-portfolio-border bg-white text-portfolio-ink hover:border-portfolio-accent hover:bg-portfolio-atmosphere",
    tertiary:
      "border-transparent bg-transparent text-portfolio-accent hover:bg-portfolio-atmosphere hover:text-blue-700"
  };

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-[600] leading-[1.35] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 ${variantClassNames[variant]}`}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
