import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";

/** Tabla comparativa real; la columna de CoolEvolve se ilumina en frío fila a fila. */
export function Edge({ c, num }: { c: Content; num: string }) {
  const e = c.edge;
  return (
    <section id={c.sections.edge.id} className="section">
      <div className="wrap">
        <SectionHead num={num} tag={c.sections.edge.tag} title={e.title} lead={e.lead} />

        <table className="stack-table edge-table mt-12 w-full border-collapse text-left lg:mt-16" data-rv="">
          <caption className="sr-only">{e.title}</caption>
          <thead>
            <tr className="mono text-dim">
              <th scope="col" className="w-[24%] border-b border-rule py-3 pr-4 font-normal">
                {e.columns[0]}
              </th>
              <th scope="col" className="w-[22%] border-b border-rule px-4 py-3 font-normal">
                {e.columns[1]}
              </th>
              <th scope="col" className="w-[27%] border-b border-rule px-4 py-3 font-normal">
                {e.columns[2]}
              </th>
              <th scope="col" className="edge-head edge-cell border-b border-cool-400 px-4 py-3">
                <span className="font-display text-body font-extrabold" style={{ fontVariationSettings: '"wdth" 112' }}>
                  {e.columns[3]}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {e.rows.map((r, i) => (
              <tr key={r[0]} className="max-md:border-t max-md:border-rule max-md:py-5">
                <th
                  scope="row"
                  className="border-rule py-4 pr-4 align-top font-display text-lead font-extrabold text-fg max-md:pb-3 md:border-b md:text-body"
                  style={{ fontVariationSettings: '"wdth" 108' }}
                >
                  {r[0]}
                </th>
                <td data-label={e.columns[1]} className="border-rule align-top text-fg max-md:py-1.5 md:border-b md:px-4 md:py-4">
                  {r[1]}
                </td>
                <td data-label={e.columns[2]} className="border-rule align-top text-fg max-md:py-1.5 md:border-b md:px-4 md:py-4">
                  {r[2]}
                </td>
                <td
                  data-label={e.columns[3]}
                  className="edge-cell border-cool-400/40 align-top font-medium max-md:mt-2 max-md:border max-md:px-3 max-md:py-2.5 md:border-b md:px-4 md:py-4"
                  style={{ ["--i" as string]: i }}
                >
                  {r[3]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 grid gap-x-10 gap-y-4 grid-cols-1 lg:grid-cols-12" data-rv="">
          <p className="chip chip-accent rv h-fit w-fit lg:col-span-2">{e.note}</p>
          <p className="rv max-w-[52ch] text-lead text-fg lg:col-span-10" style={{ ["--i" as string]: 1 }}>
            {e.goal}
          </p>
        </div>
      </div>
    </section>
  );
}
