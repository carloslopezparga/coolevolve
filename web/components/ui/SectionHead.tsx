import type { ReactNode } from "react";

interface Props {
  num: string;
  tag: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Cabecera de sección: línea de cota con el número y titular debajo. */
export function SectionHead({ num, tag, title, lead, children, className = "" }: Props) {
  return (
    <header className={className}>
      <p className="mono cota">
        <span>
          <span className="cota-num">{num}</span> — {tag}
        </span>
      </p>
      <h2 className="display mt-5 max-w-[18ch] text-title text-fg">{title}</h2>
      {lead ? <p className="mt-5 max-w-[46ch] text-lead text-dim">{lead}</p> : null}
      {children}
    </header>
  );
}
