import type { Content } from "@/content/types";
import { LogoMark } from "@/components/ui/Logo";

/** Pie con las fuentes, en mono pequeño. */
export function Sources({ c, num }: { c: Content; num: string }) {
  const s = c.sources;
  return (
    <footer
      id={c.sections.sources.id}
      className="relative z-2 border-t border-rule pb-16 pt-12"
      style={{ background: "color-mix(in oklab, var(--ice), transparent 90%)" }}
    >
      <div className="wrap grid gap-x-10 gap-y-8 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <h2 className="mono text-fg">
            <span className="text-accent">{num}</span> — {s.title.toLowerCase()}
          </h2>
        </div>
        <ol className="mono space-y-2 text-fg lg:col-span-9">
          {s.items.map((item, i) => (
            <li key={item} className="grid grid-cols-[2.25rem_1fr]">
              <span className="text-dim" aria-hidden="true">
                [{i + 1}]
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="mono flex items-start gap-3 text-dim lg:col-span-9 lg:col-start-4">
          <span className="mt-0.5 flex-none">
            <LogoMark size={16} />
          </span>
          {s.foot}
        </p>
      </div>
    </footer>
  );
}
