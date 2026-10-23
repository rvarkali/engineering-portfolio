export function ZoomIndicator() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-md border border-blue-100 bg-white/92 text-portfolio-accent opacity-100 shadow-[0_8px_20px_rgba(7,17,38,0.1)] transition-opacity duration-200 ease-out lg:opacity-0 lg:group-hover/zoom:opacity-100 lg:group-focus-visible/zoom:opacity-100 motion-reduce:transition-none"
    >
      <svg
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
        viewBox="0 0 24 24"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.3 15.3 4.2 4.2M10.5 7.7v5.6M7.7 10.5h5.6" />
      </svg>
    </span>
  );
}
