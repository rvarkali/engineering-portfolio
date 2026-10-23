"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArchitectureLightbox } from "./ArchitectureLightbox";
import { ZoomIndicator } from "./ZoomIndicator";

type DiagramLightboxButtonProps = {
  asset: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  lightboxTitle: string;
  priority?: boolean;
  sizes: string;
};

export function DiagramLightboxButton({
  asset,
  lightboxTitle,
  priority = false,
  sizes
}: DiagramLightboxButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        aria-label="Enlarge architecture diagram"
        className="group/zoom relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-blue-100 bg-white shadow-[0_18px_60px_rgba(15,45,88,0.08)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-blue-300 hover:shadow-[0_20px_64px_rgba(15,45,88,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none"
        ref={triggerRef}
        title="Click to enlarge"
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
        <ZoomIndicator />
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
