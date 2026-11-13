import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";

/** Línea de tiempo vertical F0–F5. Relleno hasta F0; lo futuro, con trazo discontinuo. */
export function Roadmap({ c, num }: { c: Content; num: string }) {
  const r = c.roadmap;
  return (
    <section id={c.sections.roadmap.id} className="section">
      <div className="wrap grid gap-x-10 gap-y-12 grid-cols-1 lg:grid-cols-12">
        <SectionHead num={num} tag={c.sections.roadmap.tag} title={r.title} className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start" />

        <ol className="lg:col-span-8">
          {r.phases.map((p, i) => {
            const now = i === 0;
            return (
              <li key={p.id} className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 pb-10 last:pb-0 sm:grid-cols-[4.5rem_1fr] sm:gap-x-8" data-rv="">
                {/* Tramo de línea hasta la siguiente fase */}
                {i < r.phases.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-[0.6875rem] top-6 w-px ${
                      now ? "" : "border-l border-dashed border-rule"
                    }`}
                    style={now ? { background: "linear-gradient(to bottom, var(--accent) 0 45%, transparent 45%)" } : undefined}
                  />
                ) : null}
                {now ? (
                  <span aria-hidden="true" className="absolute bottom-0 left-[0.6875rem] top-[55%] w-px border-l border-dashed border-rule" />
                ) : null}

                {/* Marcador */}
                <span className="relative mt-1 block size-[1.4375rem]" aria-hidden="true">
                  {now ? <span className="pulse-ring absolute inset-0 rounded-full border border-accent" /> : null}
                  <span
                    className={`absolute inset-[5px] rounded-full ${now ? "bg-accent" : "border border-dashed border-dim bg-ink-950"}`}
                  />
                </span>

                <div className={`rv ${now ? "" : ""}`}>
                  <p className="mono flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={now ? "text-accent" : "text-dim"}>{p.dates}</span>
                    {now ? (
                      <span className="chip chip-accent">
                        <span className="dot dot-live" aria-hidden="true" />
                        {r.here}
                      </span>
                    ) : (
                      <span className="text-dim">· {r.planned}</span>
                    )}
                  </p>
                  <h3 className="mt-2 flex flex-wrap items-baseline gap-x-4">
                    <span className={`num text-title ${now ? "text-accent" : "text-dim"}`} style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem)" }}>
                      {p.id}
                    </span>
                    <span className="display text-lead text-fg">{p.name}</span>
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-fg">{p.what}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
