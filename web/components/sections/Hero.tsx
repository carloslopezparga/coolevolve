import type { Content } from "@/content/types";
import { REPO_URL } from "@/lib/site";
import { RackWall } from "./RackWall";

export function Hero({ c }: { c: Content }) {
  const h = c.hero;
  return (
    <section id={c.sections.idea.id} className="relative z-2 overflow-x-clip" aria-labelledby="hero-title">
      <div className="grid min-h-svh grid-cols-1 content-center gap-x-10 gap-y-10 px-(--gutter) pb-14 pt-24 grid-cols-1 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-7 lg:self-center xl:pl-[max(0px,calc((100vw-82rem)/2))]">
          <p className="chip chip-accent hero-in">
            <span className="dot dot-live" aria-hidden="true" />
            {h.status}
          </p>
          <h1 id="hero-title" className="hero-title mt-6 text-fg lg:mt-8">
            <span>{h.headline[0]} </span>
            <span>{h.headline[1]} </span>
            <span>{h.headline[2]}</span>
          </h1>
          <p className="hero-in mt-7 max-w-[41ch] text-lead text-fg lg:mt-9" style={{ ["--i" as string]: 1 }}>
            {h.sub}
          </p>
          <dl className="mono hero-in mt-6 grid max-w-xl gap-x-8 gap-y-2 sm:grid-cols-2" style={{ ["--i" as string]: 2 }}>
            {h.points.map((p) => (
              <div key={p.label}>
                <dt className="text-accent">{p.label}</dt>
                <dd className="text-fg">{p.text}</dd>
              </div>
            ))}
          </dl>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-x-7 gap-y-3" style={{ ["--i" as string]: 3 }}>
            <a
              href={`#${c.sections.loop.id}`}
              className="group inline-flex items-center gap-3 border border-accent px-4 py-2.5 font-medium text-fg transition-colors hover:bg-accent hover:text-ink-950"
            >
              {h.ctaHow}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <a href={REPO_URL} className="link font-medium" rel="noopener">
              {h.ctaGithub}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <div className="hero-in lg:col-span-5 lg:-mr-(--gutter) lg:self-center" style={{ ["--i" as string]: 1 }}>
          <RackWall genLabel={c.ui.generation} cota={h.wallCota} agent={h.wallAgent} caption={h.wallLabel} />
        </div>

        <div className="mono flex flex-col gap-2 text-dim sm:flex-row sm:items-center sm:justify-between lg:col-span-12 xl:pl-[max(0px,calc((100vw-82rem)/2))]">
          <p className="max-w-[62ch]">{h.note}</p>
          <p aria-hidden="true" className="hidden flex-none text-fg sm:block">
            <span className="text-accent">↓</span> {h.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
