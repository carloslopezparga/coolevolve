import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";

/** Acordeón accesible con <details>: cada riesgo y su mitigación. */
export function Risks({ c, num }: { c: Content; num: string }) {
  const r = c.risks;
  return (
    <section id={c.sections.risks.id} className="section">
      <div className="wrap grid gap-x-10 gap-y-10 grid-cols-1 lg:grid-cols-12">
        <SectionHead num={num} tag={c.sections.risks.tag} title={r.title} lead={r.lead} className="lg:col-span-5" />
        <div className="lg:col-span-7 lg:pt-12">
          {r.items.map((it, i) => (
            <details key={it.risk} className="risk group border-t border-rule last:border-b" open={i === 0}>
              <summary className="flex items-center gap-4 py-4 hover:text-accent">
                <span className="mono w-6 flex-none text-dim">R{i + 1}</span>
                <span className="flex-1 font-display text-lead font-extrabold text-fg" style={{ fontVariationSettings: '"wdth" 108', fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)" }}>
                  {it.risk}
                </span>
                <span aria-hidden="true" className="risk-sign mono flex size-7 flex-none items-center justify-center border border-rule text-accent">
                  +
                </span>
              </summary>
              <div className="pb-5 pl-10 pr-11">
                <p className="mono text-accent">{r.mitigation}</p>
                <p className="mt-1 max-w-[56ch] text-fg">{it.mitigation}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
