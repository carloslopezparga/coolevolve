import type { Content } from "@/content/types";
import { pageTemp } from "@/lib/thermal";

/** Cierre sobrio: la página ya está fría. */
export function Author({ c, num }: { c: Content; num: string }) {
  const a = c.author;
  return (
    <section
      id={c.sections.author.id}
      className="section"
      style={{
        background:
          "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--ice), transparent 93%) 55%, color-mix(in oklab, var(--ice), transparent 90%))",
      }}
    >
      <div className="wrap grid gap-x-10 gap-y-12 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mono cota">
            <span>
              <span className="cota-num">{num}</span> — {c.sections.author.tag}
            </span>
          </p>
          <p className="display mt-6 max-w-[14ch] text-title text-ice">{a.closing}</p>
          <p className="mono mt-8 flex items-center gap-3 text-fg">
            <span className="dot" style={{ background: "var(--ice)" }} aria-hidden="true" />
            {c.ui.hudTemp} {pageTemp(1, c.locale)} · {a.cold}
          </p>
        </div>

        <div className="lg:col-span-5 lg:pt-12">
          <h2 className="mono text-dim">{a.title}</h2>
          <p className="display mt-2 text-lead text-fg" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)", lineHeight: 1.1 }}>
            {a.name}
          </p>
          <p className="mt-4 max-w-[44ch] text-fg">{a.bio}</p>
          <ul className="mt-6 border-t border-rule">
            {a.links.map((l) => (
              <li key={l.label} className="border-b border-rule">
                <a href={l.href} rel="noopener me" className="group flex items-baseline justify-between gap-4 py-3">
                  <span className="mono text-dim">{l.label}</span>
                  <span className="link min-w-0 truncate">{l.handle}</span>
                  <span aria-hidden="true" className="text-accent transition-transform duration-200 group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
