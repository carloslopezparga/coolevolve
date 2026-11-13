"use client";

import { useRef, useState } from "react";
import type { Content } from "@/content/types";
import { useMotionOk, usePinned } from "@/lib/hooks";
import { easeInOut, span, useElementProgress } from "@/lib/scroll";
import { Source } from "@/components/ui/Source";

const START = 415;
const END = 945;
const SCALE = 1000;
const JAPAN_AT = 92; // % de la escala: marca orientativa, ver nota.

const HATCH =
  "repeating-linear-gradient(135deg, var(--hot-500) 0 6px, color-mix(in oklab, var(--hot-500), var(--ink-950) 45%) 6px 10px)";

interface Props {
  t: Content["problem"]["chart"];
  sourceLabel: string;
  head: React.ReactNode;
}

/** Barra guiada por el scroll: de 415 TWh (2024) a 945 TWh (previsión 2030). */
export function ProblemChart({ t, sourceLabel, head }: Props) {
  const track = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(2);
  const pinned = usePinned();
  const motionOk = useMotionOk();

  useElementProgress(
    track,
    (p) => {
      const e = easeInOut(pinned ? span(p, 0.1, 0.82) : p);
      const v = Math.round(START + (END - START) * e);
      if (numRef.current) numRef.current.textContent = String(v);
      const pct = (v / SCALE) * 100;
      if (fillRef.current) fillRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      if (tipRef.current) tipRef.current.style.left = `${pct}%`;
      setPhase(e <= 0 ? 0 : e >= 1 ? 2 : 1);
    },
    { mode: pinned ? "pin" : "flow", from: 0.8, to: 0.3, enabled: motionOk },
  );

  const endPct = (END / SCALE) * 100;
  const startPct = (START / SCALE) * 100;

  return (
    <div ref={track} className="pin:h-[230vh]">
      <div className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:py-16">
        <div className="wrap">
          {head}
          <figure className="mt-10 lg:mt-12">
            <figcaption className="mono text-dim">
              {t.caption} · {t.unit}
            </figcaption>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <p className="num text-mega leading-none text-fg" aria-hidden="true">
                <span ref={numRef}>{END}</span>
                <span className="ml-3 text-lead tracking-normal text-dim">{t.unit}</span>
              </p>
              <ol className="mono flex items-center gap-2 pb-2" aria-hidden="true">
                <li className={`chip ${phase === 0 ? "chip-accent text-fg" : "text-dim"}`}>{t.startLabel}</li>
                <li className="text-dim">→</li>
                <li className={`chip ${phase === 2 ? "chip-accent text-fg" : "text-dim"}`}>{t.endLabel}</li>
              </ol>
            </div>

            {/* Barra con escala 0–1000 TWh */}
            <div className="relative mt-6" aria-hidden="true">
              <div className="relative h-14 border border-rule bg-ink-900 lg:h-16">
                {/* Previsión (rayada) */}
                <div
                  ref={fillRef}
                  className="absolute inset-0"
                  style={{ background: HATCH, clipPath: `inset(0 ${100 - endPct}% 0 0)` }}
                />
                {/* Dato de 2024 (sólido) */}
                <div className="absolute inset-y-0 left-0 bg-hot-600" style={{ width: `${startPct}%` }} />
                {/* Marcas cada 100 TWh */}
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className="absolute bottom-0 h-2 w-px bg-ink-950/70"
                    style={{ left: `${(i + 1) * 10}%` }}
                  />
                ))}
                {/* Punta */}
                <div
                  ref={tipRef}
                  className="absolute -inset-y-1.5 w-px bg-fg"
                  style={{ left: `${endPct}%` }}
                />
                {/* Japón hoy: marca orientativa */}
                <div
                  className={`absolute -top-7 bottom-0 border-l border-dashed border-fg transition-opacity duration-500 ${
                    phase === 2 ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ left: `${JAPAN_AT}%` }}
                >
                  <span className="mono absolute right-1.5 top-0 whitespace-nowrap text-fg">≈ {t.japan}</span>
                </div>
              </div>
              <div className="mono relative mt-1.5 h-5 text-dim">
                {[0, 250, 500, 750, 1000].map((v) => (
                  <span
                    key={v}
                    className={`absolute ${v === 0 ? "" : v === 1000 ? "-translate-x-full" : "-translate-x-1/2"}`}
                    style={{ left: `${v / 10}%` }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Los dos datos, también como texto */}
            <dl className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <div className={`transition-opacity duration-500 ${phase === 0 || !motionOk ? "" : "opacity-70"}`}>
                <dt className="mono flex items-center gap-2 text-dim">
                  <span className="inline-block size-3 bg-hot-600" aria-hidden="true" />
                  {t.startLabel}
                </dt>
                <dd className="mt-1 text-fg">
                  <strong className="font-mono font-bold">
                    {START} {t.unit}
                  </strong>
                  , {t.startNote}
                </dd>
              </div>
              <div className={`transition-opacity duration-500 ${phase === 2 ? "" : "opacity-70"}`}>
                <dt className="mono flex items-center gap-2 text-dim">
                  <span className="inline-block size-3" style={{ background: HATCH }} aria-hidden="true" />
                  {t.endLabel}
                </dt>
                <dd className="mt-1 text-fg">
                  <strong className="font-mono font-bold">
                    {END} {t.unit}
                  </strong>
                  , {t.endNote}
                </dd>
              </div>
            </dl>

            <div className="mt-5 grid gap-x-10 gap-y-1 lg:grid-cols-2">
              <Source label={sourceLabel}>{t.source}</Source>
              <p className="mono text-dim">
                {t.scaleNote} {t.japanNote}
              </p>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
