export default function UnderConstruction() {
  return (
    <div className="mt-8 flex flex-col items-start gap-5">
      <div className="w-16 h-16 flex-none" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <g
            className="animate-spin-slow text-accent dark:text-accent-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <circle cx="32" cy="32" r="13" />
            <g strokeLinecap="round">
              <line x1="32" y1="14" x2="32" y2="8" />
              <line x1="32" y1="50" x2="32" y2="56" />
              <line x1="14" y1="32" x2="8" y2="32" />
              <line x1="50" y1="32" x2="56" y2="32" />
              <line x1="19.7" y1="19.7" x2="15.5" y2="15.5" />
              <line x1="44.3" y1="44.3" x2="48.5" y2="48.5" />
              <line x1="44.3" y1="19.7" x2="48.5" y2="15.5" />
              <line x1="19.7" y1="44.3" x2="15.5" y2="48.5" />
            </g>
          </g>
          <circle
            className="animate-spin-slow-rev text-accent dark:text-accent-dark"
            cx="32"
            cy="32"
            r="5"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      </div>
      <div className="text-dim dark:text-dim-dark leading-relaxed max-w-[44ch]">
        <p>
          <strong className="text-ink dark:text-ink-dark">Under construction.</strong> This part of
          the site is still being built.
        </p>
        <p>Check back soon — new content lands here first.</p>
      </div>
    </div>
  );
}
