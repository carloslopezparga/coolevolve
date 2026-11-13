import type { Content } from "@/content/types";
import type { TokLine } from "@/lib/highlight";
import { SectionHead } from "@/components/ui/SectionHead";
import { CodeBlock } from "@/components/ui/Code";
import { LoopRing } from "./LoopRing";

export function Loop({ c, num, pseudo }: { c: Content; num: string; pseudo: TokLine[] }) {
  const l = c.loop;
  return (
    <section id={c.sections.loop.id} className="relative z-2 pb-[clamp(4.5rem,10vw,9rem)] pt-[clamp(4.5rem,10vw,9rem)] pin:pt-0">
      <LoopRing
        t={l}
        genLabel={c.ui.generation}
        head={<SectionHead num={num} tag={c.sections.loop.tag} title={l.title} lead={l.lead} />}
      />

      <div className="wrap mt-16 grid gap-x-10 gap-y-10 lg:mt-4 grid-cols-1 lg:grid-cols-12" data-rv="">
        <p className="rv text-lead text-fg lg:col-span-5">
          <span className="mono mb-3 block text-accent">→ {l.resultLabel}</span>
          {l.result}
        </p>
        <figure className="panel crop rv min-w-0 lg:col-span-7" style={{ ["--i" as string]: 2 }}>
          <figcaption className="mono flex items-center justify-between gap-4 border-b border-rule px-4 py-2 text-dim">
            <span className="text-fg">{l.pseudoTitle}</span>
            <span>python</span>
          </figcaption>
          <CodeBlock lines={pseudo} label={l.pseudoTitle} />
        </figure>
      </div>
    </section>
  );
}
