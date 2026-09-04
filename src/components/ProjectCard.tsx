"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArchitectureLightbox } from "./ArchitectureLightbox";

type ProjectCardProps = {
  category: string;
  title: string;
  description: string;
  technologies: string[];
  image: {
    src: string;
    alt: string;
  };
  href: string;
  githubHref?: string;
  ctaLabel?: string;
  lightboxTitle: string;
};

export function ProjectCard({
  category,
  title,
  description,
  technologies,
  image,
  href,
  githubHref,
  ctaLabel = "View Case Study →",
  lightboxTitle
}: ProjectCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-portfolio-border bg-white shadow-[0_8px_24px_rgba(7,17,38,0.035)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-blue-300 hover:shadow-[0_14px_34px_rgba(7,17,38,0.07)]">
      <div className="border-b border-portfolio-border bg-[#f6f9fd] p-3 sm:p-4">
        <button
          aria-label={`View full architecture diagram for ${title}`}
          className="group/image relative flex aspect-[16/10] min-h-[180px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[12px] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
          ref={imageButtonRef}
          type="button"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 48vw, 100vw"
            className="origin-center object-contain p-1 transition-transform duration-200 ease-out group-hover/image:scale-[1.006] motion-reduce:transition-none motion-reduce:group-hover/image:scale-100"
          />
          <span className="pointer-events-none absolute right-3 top-3 rounded-md border border-portfolio-border bg-white/92 px-2.5 py-1.5 text-xs font-semibold text-portfolio-accent opacity-0 shadow-[0_8px_20px_rgba(7,17,38,0.08)] transition-opacity duration-200 ease-out group-hover/image:opacity-100 group-focus-visible/image:opacity-100 motion-reduce:transition-none">
            View architecture ↗
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-portfolio-accent">
          {category}
        </p>
        <h3 className="mt-3 text-[1.3rem] font-bold leading-[1.18] tracking-[-0.018em] text-portfolio-ink">
          {title}
        </h3>
        <p className="mt-3 text-[15px] font-normal leading-[1.62] text-portfolio-body">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              className="rounded-md border border-[#cfe0f5] bg-[#eef5ff] px-2.5 py-1.5 text-xs font-medium leading-tight text-portfolio-body"
              key={technology}
            >
              {technology}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-4">
          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-portfolio-accent bg-portfolio-accent px-3.5 text-sm font-semibold leading-none text-white transition-colors duration-200 hover:border-blue-700 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
            href={href}
          >
            {ctaLabel}
          </Link>
          {githubHref ? (
            <Link
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-portfolio-border bg-white px-3.5 text-sm font-semibold leading-none text-portfolio-body transition-colors duration-200 hover:border-blue-300 hover:bg-portfolio-atmosphere hover:text-portfolio-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-portfolio-accent"
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                className="size-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.86 8.35 6.84 9.7.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.99c.85 0 1.69.12 2.49.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.74c0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  fillRule="evenodd"
                />
              </svg>
              GitHub ↗
            </Link>
          ) : null}
        </div>
      </div>
      <ArchitectureLightbox
        image={image}
        isOpen={isLightboxOpen}
        returnFocusRef={imageButtonRef}
        title={lightboxTitle}
        onClose={() => setIsLightboxOpen(false)}
      />
    </article>
  );
}
