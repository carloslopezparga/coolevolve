"use client";

import { useRef, type ReactNode } from "react";
import type { Content } from "@/content/types";
import { usePinned } from "@/lib/hooks";
import { span, useElementProgress, useFitZoom } from "@/lib/scroll";

interface Props {
  t: Content["why"];
  sourceLabel: string;
  head: ReactNode;
}

/** Línea de tiempo: horizontal y movida por el scroll vertical en escritorio; lista en móvil. */
export function WhyNowTimeline({ t, sourceLabel, head }: Props) {
  const track = useRef<HTMLDivElement | null>(null);
  const viewport = useRef<HTMLDivElement | null>(null);
  const strip = useRef<HTMLOListElement | null>(null);
  const fit = useRef<HTMLDivElement | null>(null);
  const pinned = usePinned();
  useFitZoom(fit, pinned);

  useElementProgress(
    track,
    (p) => {
      const s = strip.current;
      const v = viewport.current;
      if (!s || !v) return;
      if (!pinned) {
        s.style.transform = "";
        return;
      }
      // En porcentaje del propio ancho: no depende de la escala aplicada a la sección.
      const sw = s.getBoundingClientRect().width;
      const vw = v.getBoundingClientRect().width;
      const travel = sw > 0 ? Math.max(0, 1 - vw / sw) : 0;
      s.style.transform = `translate3d(${(-travel * span(p, 0.06, 0.9) * 100).toFixed(3)}%,0,0)`;
    },
    { mode: "pin", enabled: pinned },
  );

  const item =
    "relative flex-none border-rule pt-8 pin:w-[26rem] pin:border-l pin:pl-7 pin:pr-10 unpin:border-l unpin:pb-10 unpin:pl-7";

  return (
    <div ref={track} className="pin:h-[300vh]">
      <div className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:overflow-hidden">
        <div ref={fit}>
        <div className="wrap">{head}</div>

        <div ref={viewport} className="mt-12 pin:mt-14 pin:pl-[max(var(--gutter),calc((100vw-82rem)/2+var(--gutter)))] unpin:mx-auto unpin:max-w-[82rem] unpin:px-(--gutter)">
          <ol ref={strip} className="relative flex flex-col will-change-transform pin:w-max pin:flex-row">
            {/* Eje */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-0 hidden h-px bg-rule pin:block" />
            {t.items.map((it, i) => (
              <li key={it.name} className={item}>
                <span aria-hidden="true" className="absolute -left-[5px] top-0 size-[9px] -translate-y-1/2 bg-accent unpin:top-10" />
                <p className="mono text-dim">
                  {String(i + 1).padStart(2, "0")} · {it.claim}
                </p>
                <h3 className="display mt-3 text-title text-fg" style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem)" }}>
                  {it.name}
                </h3>
                <p className="mt-4 max-w-[36ch] text-fg">{it.text}</p>
                <p className="mono mt-4 text-dim">
                  <span aria-hidden="true">↳ </span>
                  {sourceLabel}: {it.source}
                </p>
              </li>
            ))}
            {/* El hueco */}
            <li className={`${item} pin:w-[30rem] unpin:pb-0`}>
              <span aria-hidden="true" className="absolute -left-[5px] top-0 size-[9px] -translate-y-1/2 border border-accent bg-ink-950 unpin:top-10" />
              <p className="mono text-accent">
                {String(t.items.length + 1).padStart(2, "0")} · {t.gap.name}
              </p>
              <div className="blink-slot mt-3 border border-dashed border-accent px-5 py-6">
                <p className="mono text-accent">[ {t.gap.slot} ]</p>
              </div>
              <p className="mt-4 max-w-[30ch] text-lead text-fg">{t.gap.text}</p>
            </li>
          </ol>
        </div>
        </div>
      </div>
    </div>
  );
}
