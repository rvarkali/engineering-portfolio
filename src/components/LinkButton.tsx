import Link from "next/link";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  newTab?: boolean;
};

export function LinkButton({
  href,
  children,
  variant = "secondary",
  newTab = false
}: LinkButtonProps) {
  const className =
    variant === "primary"
      ? "border-blue-300/60 bg-blue-400/15 text-white hover:border-blue-200 hover:bg-blue-400/25"
      : "border-slate-500/35 bg-white/[0.03] text-slate-100 hover:border-slate-300/70 hover:bg-white/[0.06]";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-[600] leading-[1.35] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 ${className}`}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
