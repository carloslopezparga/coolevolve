import type { TokLine } from "@/lib/highlight";

/** Pinta una línea de tokens de Shiki. */
export function Tokens({ line }: { line: TokLine }) {
  if (line.length === 0) return <>{"​"}</>;
  return (
    <>
      {line.map((t, i) => (
        <span key={i} style={t.color || t.i ? { color: t.color, fontStyle: t.i ? "italic" : undefined } : undefined}>
          {t.c}
        </span>
      ))}
    </>
  );
}

/** Bloque de código resaltado en build time. */
export function CodeBlock({ lines, label, className = "" }: { lines: TokLine[]; label?: string; className?: string }) {
  return (
    <div className={`code ${className}`}>
      <pre tabIndex={0} aria-label={label} data-lenis-prevent-horizontal>
        <code>
          {lines.map((l, i) => (
            <span key={i} className="block">
              <Tokens line={l} />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
