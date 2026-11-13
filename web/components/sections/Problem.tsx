import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { Source } from "@/components/ui/Source";
import { ProblemChart } from "./ProblemChart";

const HATCH_AMBER =
  "repeating-linear-gradient(135deg, var(--amber) 0 5px, color-mix(in oklab, var(--amber), var(--ink-950) 50%) 5px 9px)";
const HATCH_HOT =
  "repeating-linear-gradient(135deg, var(--hot-500) 0 5px, color-mix(in oklab, var(--hot-500), var(--ink-950) 50%) 5px 9px)";

export function Problem({ c, num }: { c: Content; num: string }) {
  const p = c.problem;
  const src = c.ui.source;
  return (
    <section id={c.sections.problem.id} className="relative z-2 pb-[clamp(4.5rem,10vw,9rem)] pt-[clamp(4.5rem,10vw,9rem)] pin:pt-0">
      <ProblemChart
        t={p.chart}
        sourceLabel={src}
        head={<SectionHead num={num} tag={c.sections.problem.tag} title={p.title} />}
      />

      <div className="wrap mt-16 grid gap-x-10 gap-y-14 lg:mt-8 grid-cols-1 lg:grid-cols-12">
        {/* IA ×4 */}
        <div className="lg:col-span-4" data-rv="" >
          <p className="num rv text-title text-hot-500">{p.ai.value}</p>
          <p className="rv mt-3 max-w-[34ch] text-fg" style={{ ["--i" as string]: 1 }}>
            {p.ai.text}
          </p>
          <Source label={src} className="mt-3">
            {p.ai.source}
          </Source>
        </div>

        {/* Peso de la refrigeración: barra de rango */}
        <figure className="lg:col-span-8" data-rv="">
          <figcaption className="text-lead text-fg">{p.cooling.title}</figcaption>
          <div className="mt-6 space-y-4">
            {p.cooling.ranges.map((r, i) => (
              <div key={r.who}>
                <p className="mono flex flex-wrap items-baseline gap-x-3 text-fg">
                  <span className="text-dim">{r.who}</span>
                  <strong className="font-bold">
                    {r.from}–{r.to} %
                  </strong>
                  {r.note ? <span className="text-dim">{r.note}</span> : null}
                </p>
                <div className="relative mt-1.5 h-5 border border-rule bg-ink-900" aria-hidden="true">
                  <div className="absolute inset-y-0" style={{ left: `${r.from}%`, width: `${r.to - r.from}%` }}>
                    <div
                      className="rv-line size-full"
                      style={{
                        background: i === 0 ? "var(--hot-500)" : HATCH_AMBER,
                        ["--i" as string]: i * 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mono relative mt-1.5 h-5 text-dim" aria-hidden="true">
            {[0, 25, 50, 75, 100].map((v) => (
              <span
                key={v}
                className={`absolute ${v === 0 ? "" : v === 100 ? "-translate-x-full" : "-translate-x-1/2"}`}
                style={{ left: `${v}%` }}
              >
                {v}
              </span>
            ))}
          </div>
          <p className="mono mt-1 text-dim">{p.cooling.axis}</p>
          <Source label={src} className="mt-3">
            {p.cooling.source}
          </Source>
        </figure>

        {/* Precedente: Google −40 % */}
        <figure className="lg:col-span-7" data-rv="">
          <figcaption>
            <p className="mono text-dim">{p.google.kicker}</p>
            <p className="num mt-1 text-title text-cool-400">{p.google.value}</p>
            <p className="mt-3 max-w-[44ch] text-fg">{p.google.text}</p>
          </figcaption>
          <div className="mono mt-5 space-y-2 text-dim" aria-hidden="true">
            <div className="flex items-center gap-3">
              <span className="w-16 flex-none">{p.google.before}</span>
              <div className="h-5 flex-1">
                <div className="rv-line size-full" style={{ background: HATCH_HOT }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 flex-none">{p.google.after}</span>
              <div className="relative h-5 flex-1">
                <div className="absolute inset-y-0 left-0 w-[60%]">
                  <div className="rv-line size-full bg-cool-400" style={{ ["--i" as string]: 3 }} />
                </div>
                <div className="absolute inset-y-0 right-0 flex w-[40%] items-center justify-center border border-dashed border-cool-400 text-fg">
                  {p.google.value}
                </div>
              </div>
            </div>
          </div>
          <Source label={src} className="mt-3">
            {p.google.source}
          </Source>
        </figure>

        {/* Siguiente mercado: HVAC */}
        <figure className="lg:col-span-5" data-rv="">
          <figcaption>
            <p className="mono text-dim">{p.hvac.kicker}</p>
            <p className="num mt-1 text-title text-amber">{p.hvac.value}</p>
            <p className="mt-3 max-w-[40ch] text-fg">{p.hvac.text}</p>
          </figcaption>
          <div className="relative mt-5 h-5 border border-rule bg-ink-900" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 w-1/2">
              <div className="rv-line size-full bg-amber" />
            </div>
            <div className="absolute inset-y-0 left-1/2 w-[14%]">
              <div className="rv-line size-full" style={{ background: HATCH_AMBER, ["--i" as string]: 4 }} />
            </div>
            <span className="absolute -inset-y-1.5 left-1/2 w-px bg-fg" />
          </div>
          <p className="mono mt-1.5 text-dim" aria-hidden="true">
            <span className="ml-[50%] inline-block -translate-x-1/2">50 %</span>
          </p>
          <Source label={src} className="mt-3">
            {p.hvac.source}
          </Source>
        </figure>

        <p className="display rv max-w-[26ch] text-title text-fg lg:col-span-12 lg:mt-6" data-rv="">
          {p.message}
        </p>
      </div>
    </section>
  );
}
