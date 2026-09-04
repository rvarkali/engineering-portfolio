"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ArchitectureLightboxProps = {
  isOpen: boolean;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
};

export function ArchitectureLightbox({
  isOpen,
  title,
  image,
  onClose,
  returnFocusRef
}: ArchitectureLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      returnFocusElement?.focus();
    };
  }, [isOpen, onClose, returnFocusRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="architecture-lightbox-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071126]/82 p-4 backdrop-blur-sm"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-[94vw] flex-col rounded-[18px] border border-white/15 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4 border-b border-portfolio-border px-4 py-3 sm:px-5">
          <h2
            className="text-base font-semibold leading-tight tracking-[-0.01em] text-portfolio-ink sm:text-lg"
            id="architecture-lightbox-title"
          >
            {title}
          </h2>
          <button
            aria-label="Close architecture preview"
            className="inline-flex size-10 items-center justify-center rounded-md border border-portfolio-border bg-white text-portfolio-body transition hover:border-portfolio-accent hover:bg-portfolio-atmosphere hover:text-portfolio-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-portfolio-accent"
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="relative min-h-[58vh] flex-1 bg-[#f7f9fc] sm:min-h-[72vh]">
          <Image
            alt={image.alt}
            className="object-contain p-3 sm:p-5"
            fill
            sizes="94vw"
            src={image.src}
          />
        </div>
      </div>
    </div>
  );
}
