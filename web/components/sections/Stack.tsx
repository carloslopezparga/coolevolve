import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { StackDiagram } from "./StackDiagram";

export function Stack({ c, num }: { c: Content; num: string }) {
  const s = c.stack;
  return (
    <section id={c.sections.stack.id} className="section">
      <div className="wrap">
        <SectionHead num={num} tag={c.sections.stack.tag} title={s.title} lead={s.lead} />
        <StackDiagram t={s} />

        {/* Principios del evaluador: checklist técnica */}
        <div className="mt-16 grid gap-x-10 gap-y-8 lg:mt-24 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mono text-accent">◆</p>
            <h3 className="display mt-2 text-lead text-fg" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)", lineHeight: 1.1 }}>
              {s.principles.title}
            </h3>
            <p className="mt-4 max-w-[40ch] text-dim">{s.principles.intro}</p>
          </div>
          <ul className="lg:col-span-7">
            {s.principles.items.map((item, i) => (
              <li key={item} className="flex gap-4 border-t border-rule py-4 last:border-b" data-rv="">
                <svg viewBox="0 0 24 24" className="mt-0.5 size-6 flex-none" aria-hidden="true" focusable="false">
                  <rect x="1.5" y="1.5" width="21" height="21" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                  <path className="tick" d="M6 12.5 10.5 17 18.5 7.5" pathLength="1" fill="none" stroke="var(--accent)" strokeWidth="2.25" style={{ ["--i" as string]: i }} />
                </svg>
                <p className="text-fg">
                  <span className="sr-only">{s.principles.checked}: </span>
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
