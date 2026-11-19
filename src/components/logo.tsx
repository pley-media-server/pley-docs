/** Pley's mark: three posters on a shelf, a play button cut out of the front one (favicon.svg in the Pley repository). */
export function LogoMark({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="12" y1="15" x2="34" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <g transform="translate(-16 -16) scale(1.5)">
        <path fill="#0369a1" d="M46 21.5h3a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3h-3z" />
        <path fill="#0284c7" d="M36 18.5h4.5a3.5 3.5 0 0 1 3.5 3.5v20a3.5 3.5 0 0 1-3.5 3.5H36z" />
        <path
          fill={`url(#${id})`}
          fillRule="evenodd"
          d="M16 15.5h14a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4v-25a4 4 0 0 1 4-4zM19 27v10a1 1 0 0 0 1.51.86l8.5-5a1 1 0 0 0 0-1.72l-8.5-5A1 1 0 0 0 19 27z"
        />
      </g>
    </svg>
  );
}

export function Logo({ id, className = "" }: { id: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark id={id} className="size-7 shrink-0" />
      <span className="text-[1.25rem] font-bold tracking-[-0.03em] text-fg">Pley</span>
    </span>
  );
}
