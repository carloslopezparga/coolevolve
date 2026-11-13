/** Fuente de un dato, en mono pequeño junto a la cifra. */
export function Source({ label, children, className = "" }: { label: string; children: string; className?: string }) {
  return (
    <p className={`mono text-dim ${className}`}>
      <span aria-hidden="true">↳ </span>
      {label}: {children}
    </p>
  );
}
