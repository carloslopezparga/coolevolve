import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";

export function Business({ c, num }: { c: Content; num: string }) {
  const b = c.business;
  return (
    <section id={c.sections.business.id} className="section">
      <div className="wrap">
        <SectionHead num={num} tag={c.sections.business.tag} title={b.title}>
          <p className="chip chip-dash mt-5">{b.tag}</p>
        </SectionHead>

        {/* Flujo de 3 pasos con flechas que se dibujan */}
        <ol className="mt-12 grid gap-y-8 lg:mt-16 lg:grid-cols-3 lg:gap-x-0" data-rv="">
          {b.steps.map((s, i) => (
            <li key={s.who} className="relative lg:pr-12">
              <div className="flex items-center gap-3">
                <span className="num text-lead text-accent">{i + 1}</span>
                {/* Flecha hacia el siguiente paso */}
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="h-3 min-w-0 flex-1 max-lg:hidden" aria-hidden="true" focusable="false">
                  <path className="rv-draw" d="M0 6 H196" pathLength="1" fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ ["--i" as string]: i * 2 }} />
                </svg>
                <span aria-hidden="true" className="mono -ml-4 text-accent max-lg:hidden">
                  {i < b.steps.length - 1 ? "▸" : "■"}
                </span>
              </div>
              <h3 className="display mt-4 text-lead text-fg">{s.who}</h3>
              <p className="mt-2 max-w-[34ch] text-fg">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-x-10 gap-y-10 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono text-dim">{b.clientsLabel}</p>
            <p className="mt-2 max-w-[38ch] text-fg">{b.clients}</p>
          </div>

          {/* Ruta de expansión: una línea con paradas */}
          <div className="lg:col-span-8" data-rv="">
            <p className="mono text-dim">{b.expansionLabel}</p>
            <ol className="relative mt-5 grid gap-y-5 lg:grid-cols-4">
              <span aria-hidden="true" className="absolute left-[4px] top-1 h-full w-px bg-rule lg:left-0 lg:top-[4px] lg:h-px lg:w-full">
                <span className="rv-line block size-full bg-accent max-lg:hidden" />
              </span>
              {b.expansion.map((stop, i) => (
                <li key={stop} className="relative pl-6 lg:pl-0 lg:pr-4 lg:pt-6">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 size-[9px] lg:top-0 ${i === 0 ? "bg-accent" : "border border-accent bg-ink-950"}`}
                  />
                  <span className="mono block text-dim">
                    {String(i + 1).padStart(2, "0")}
                    {i === 0 ? ` · ${b.first}` : ""}
                  </span>
                  <span className="font-medium text-fg">{stop}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
