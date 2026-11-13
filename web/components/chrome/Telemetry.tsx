"use client";

import { useEffect, useRef, useState } from "react";
import { accentAt, pageTemp } from "@/lib/thermal";

interface Props {
  sections: { id: string; num: string; tag: string }[];
  tempLabel: string;
  locale: string;
}

/**
 * Estado térmico global: interpola `--accent` con el scroll y pinta el HUD.
 * El HUD es decorativo (aria-hidden): la misma información está en la página.
 */
export function Telemetry({ sections, tempLabel, locale }: Props) {
  const [current, setCurrent] = useState(0);
  const tempRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const els = sections.map((s) => document.getElementById(s.id));
    let raf = 0;
    let lastStep = -1;
    let lastIdx = -1;

    const update = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // El acento se cuantiza para no recalcular estilos en cada píxel.
      const step = Math.round(p * 240);
      if (step !== lastStep) {
        lastStep = step;
        const q = step / 240;
        root.style.setProperty("--accent", accentAt(q));
        root.style.setProperty("--heat", (1 - q).toFixed(3));
      }

      const label = pageTemp(p, locale);
      for (const el of tempRefs.current) if (el && el.textContent !== label) el.textContent = label;
      for (const el of coverRefs.current) if (el) el.style.transform = `scaleX(${1 - p})`;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;

      const line = window.innerHeight * 0.45;
      let idx = 0;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setCurrent(idx);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections, locale]);

  const s = sections[current] ?? sections[0];
  const initial = pageTemp(0, locale);

  const bar = (i: number) => (
    <div className="relative h-1 overflow-hidden" style={{ background: "var(--ramp)" }}>
      <div
        ref={(el) => {
          coverRefs.current[i] = el;
        }}
        className="absolute inset-0 origin-right bg-ink-950/80"
      />
    </div>
  );

  return (
    <div aria-hidden="true">
      {/* Barra de progreso superior */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
        <div
          ref={progressRef}
          className="h-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Escritorio: esquina superior derecha */}
      <div className="mono pointer-events-none fixed right-3 top-3 z-50 hidden w-46 border border-rule bg-ink-950 lg:block">
        <div className="flex items-baseline justify-between gap-3 px-2.5 pt-2">
          <span className="text-accent">{s.num}</span>
          <span className="truncate text-fg">{s.tag}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-2.5 pb-2">
          <span className="text-dim">{tempLabel}</span>
          <span
            ref={(el) => {
              tempRefs.current[0] = el;
            }}
            className="tabular-nums text-fg"
          >
            {initial}
          </span>
        </div>
        {bar(0)}
      </div>

      {/* Móvil: barra inferior */}
      <div className="mono pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-ink-950 lg:hidden">
        {bar(1)}
        <div className="flex h-9 items-center justify-between gap-3 px-5">
          <span className="truncate">
            <span className="text-accent">{s.num}</span> <span className="text-fg">{s.tag}</span>
          </span>
          <span className="flex-none">
            <span className="text-dim">{tempLabel}</span>{" "}
            <span
              ref={(el) => {
                tempRefs.current[1] = el;
              }}
              className="tabular-nums text-fg"
            >
              {initial}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
