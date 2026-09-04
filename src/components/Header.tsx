import Link from "next/link";
import { profile } from "@/data/profile";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#featured-engineering" },
  { label: "Writing", href: "/writing" },
  { label: "Resume", href: profile.resume, newTab: true },
  { label: "Contact", href: `mailto:${profile.email}` }
];

function IconLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-md text-portfolio-body transition-colors duration-200 hover:bg-portfolio-atmosphere hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}

function NavLinks({ compact = false }: { compact?: boolean }) {
  return (
    <nav
      aria-label={compact ? "Mobile navigation" : "Main navigation"}
      className={compact ? "grid gap-1 py-2" : "hidden items-center gap-8 lg:flex"}
    >
      {navItems.map((item) => (
        <Link
          className={`text-sm font-medium text-portfolio-body transition-colors duration-200 hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent ${
            item.label === "Home" && !compact
              ? "border-b border-portfolio-accent pb-2 text-portfolio-accent"
              : compact
                ? "rounded-md px-3 py-2"
                : "pb-2"
          }`}
          href={item.href}
          key={item.label}
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noopener noreferrer" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-portfolio-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 sm:px-8">
        <Link
          className="min-w-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
          href="/"
        >
          <p className="text-xl font-bold leading-tight tracking-[-0.02em] text-portfolio-ink">
            Ravinder <span className="text-portfolio-accent">Varkali</span>
          </p>
          <p className="mt-1 text-[13px] font-normal leading-tight text-portfolio-muted">
            Senior Staff / Principal Software Engineer
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <NavLinks />
          <div className="hidden items-center gap-1 border-l border-portfolio-border pl-4 sm:flex">
            <IconLink href={profile.linkedin} label="LinkedIn profile">
              <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V8.98h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.3ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47Z" />
              </svg>
            </IconLink>
            <IconLink href={profile.github} label="GitHub profile">
              <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.86 8.35 6.84 9.7.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.99c.85 0 1.69.12 2.49.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.74c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" clipRule="evenodd" />
              </svg>
            </IconLink>
          </div>
          <details className="relative lg:hidden">
            <summary className="flex min-h-10 cursor-pointer list-none items-center rounded-md border border-portfolio-border px-3 text-sm font-medium text-portfolio-body marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent">
              Menu
            </summary>
            <div className="absolute right-0 mt-3 w-56 rounded-lg border border-portfolio-border bg-white p-2 shadow-xl shadow-slate-900/10">
              <NavLinks compact />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
