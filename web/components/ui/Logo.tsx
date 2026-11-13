/** Celda hexagonal con la rampa térmica en bandas + nombre. */
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="cv-hex">
          <path d="M16 1.5 28.6 8.75v14.5L16 30.5 3.4 23.25V8.75z" />
        </clipPath>
      </defs>
      <g clipPath="url(#cv-hex)">
        <rect y="0" width="32" height="6.4" fill="#E5481B" />
        <rect y="6.4" width="32" height="5" fill="#FF6A2B" />
        <rect y="11.4" width="32" height="5" fill="#FFB238" />
        <rect y="16.4" width="32" height="5" fill="#7FE0EA" />
        <rect y="21.4" width="32" height="5" fill="#3FD0E0" />
        <rect y="26.4" width="32" height="6" fill="#DFF7FA" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span
        className="font-display text-body font-extrabold leading-none text-fg"
        style={{ fontVariationSettings: '"wdth" 112', letterSpacing: "-0.01em" }}
      >
        CoolEvolve
      </span>
    </span>
  );
}
