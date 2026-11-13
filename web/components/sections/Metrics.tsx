import type { Content, GaugeKind } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";

const R = 70;
const polar = (deg: number, r = R): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(-r * Math.sin(a)).toFixed(2)];
};
/** Arco del semicírculo superior entre dos fracciones (0 = izquierda, 1 = derecha). */
const arc = (f0: number, f1: number, r = R) => {
  const [x0, y0] = polar(180 - f0 * 180, r);
  const [x1, y1] = polar(180 - f1 * 180, r);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
};

/** Zona objetivo y marca de referencia según el tipo de métrica. Sin escala numérica: no hay datos. */
const ZONES: Record<GaugeKind, { zone: [number, number] | null; ref: number | null }> = {
  open: { zone: null, ref: null },
  below: { zone: [0, 0.6], ref: 0.6 },
  near: { zone: [0.56, 0.78], ref: 0.78 },
  check: { zone: null, ref: null },
};

function Gauge({ kind }: { kind: GaugeKind }) {
  const { zone, ref } = ZONES[kind];
  return (
    <svg viewBox="-90 -92 180 112" className="block h-auto w-full max-w-[13rem]" aria-hidden="true" focusable="false">
      {/* Escala vacía */}
      <path d={arc(0, 1)} fill="none" stroke="var(--rule)" strokeWidth="10" />
      {Array.from({ length: 11 }, (_, i) => {
        const [x0, y0] = polar(180 - i * 18, R + 9);
        const [x1, y1] = polar(180 - i * 18, R + (i % 5 === 0 ? 17 : 13));
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--text-dim)" strokeWidth="1" />;
      })}
      {/* Zona objetivo (rayada: no es una lectura) */}
      {zone ? (
        <path d={arc(zone[0], zone[1])} fill="none" stroke="var(--accent)" strokeWidth="10" strokeDasharray="3 3" />
      ) : null}
      {kind === "open" ? (
        <text y="-30" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="26" fontWeight="700" fill="var(--accent)">
          ?
        </text>
      ) : null}
      {/* Marca de referencia */}
      {ref !== null ? (
        <line
          x1={polar(180 - ref * 180, R - 8)[0]}
          y1={polar(180 - ref * 180, R - 8)[1]}
          x2={polar(180 - ref * 180, R + 8)[0]}
          y2={polar(180 - ref * 180, R + 8)[1]}
          stroke="var(--text)"
          strokeWidth="2"
        />
      ) : null}
      {kind === "check" ? (
        <rect x="-15" y="-52" width="30" height="30" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
      ) : null}
      {/* Aguja aparcada: sin lectura */}
      <line x1="0" y1="0" x2={polar(180, R - 22)[0]} y2="0" stroke="var(--text-dim)" strokeWidth="1.5" strokeDasharray="2 4" />
      <circle r="4.5" fill="var(--ink-950)" stroke="var(--text-dim)" strokeWidth="1.5" />
      <text y="16" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--text-dim)">
        — —
      </text>
    </svg>
  );
}

/** Cinco medidores vacíos: objetivos del proyecto, no resultados. */
export function Metrics({ c, num }: { c: Content; num: string }) {
  const m = c.metrics;
  return (
    <section id={c.sections.metrics.id} className="section">
      <div className="wrap">
        <SectionHead num={num} tag={c.sections.metrics.tag} title={m.title} />

        <div className="panel crop mt-12 lg:mt-16">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule px-5 py-4">
            <span className="chip chip-accent">
              <span className="dot" aria-hidden="true" />
              {c.ui.pending}
            </span>
            <strong className="text-lead font-medium text-fg">{m.banner}</strong>
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-5">
            {m.items.map((it, i) => (
              <li
                key={it.name}
                className="flex gap-5 border-rule p-5 max-lg:border-b sm:flex-col sm:gap-4 lg:border-l lg:first:border-l-0"
              >
                <div className="w-28 flex-none sm:w-full">
                  <Gauge kind={it.kind} />
                  <p className="mono mt-1 text-center text-dim max-sm:hidden">
                    {m.reading}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="mono text-dim">M{i + 1}</p>
                  <h3 className="mt-1 font-display text-body font-extrabold leading-tight text-fg" style={{ fontVariationSettings: '"wdth" 108' }}>
                    {it.name}
                  </h3>
                  <dl className="mt-3 space-y-2">
                    <div>
                      <dt className="mono text-dim">{m.columns.measures}</dt>
                      <dd className="text-fg">{it.measures}</dd>
                    </div>
                    <div>
                      <dt className="mono text-accent">{m.columns.target}</dt>
                      <dd className="font-medium text-fg">{it.target}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">{m.columns.status}</dt>
                      <dd>
                        <span className="chip chip-dash">{c.ui.pending}</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
