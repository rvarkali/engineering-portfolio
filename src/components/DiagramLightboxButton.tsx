"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArchitectureLightbox } from "./ArchitectureLightbox";

type DiagramLightboxButtonProps = {
  asset: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  label: string;
  lightboxTitle: string;
  priority?: boolean;
  sizes: string;
};

export function DiagramLightboxButton({
  asset,
  label,
  lightboxTitle,
  priority = false,
  sizes
}: DiagramLightboxButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        aria-label={`${label}: open full-resolution diagram`}
        className="group/diagram relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_18px_60px_rgba(15,45,88,0.08)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-blue-300 hover:shadow-[0_20px_64px_rgba(15,45,88,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none"
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Image
          alt={asset.alt}
          className="h-auto w-full"
          height={asset.height}
          priority={priority}
          sizes={sizes}
          src={asset.src}
          width={asset.width}
        />
        <span className="pointer-events-none absolute right-3 top-3 rounded-md border border-blue-100 bg-white/92 px-2.5 py-1.5 text-xs font-bold text-portfolio-accent opacity-0 shadow-[0_8px_20px_rgba(7,17,38,0.08)] transition-opacity duration-200 ease-out group-hover/diagram:opacity-100 group-focus-visible/diagram:opacity-100 motion-reduce:transition-none">
          {label} ↗
        </span>
      </button>
      <ArchitectureLightbox
        image={{ src: asset.src, alt: asset.alt }}
        isOpen={isOpen}
        returnFocusRef={triggerRef}
        title={lightboxTitle}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
