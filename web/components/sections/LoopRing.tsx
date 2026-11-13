"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Content } from "@/content/types";
import { useMotionOk, usePinned } from "@/lib/hooks";
import { span, useElementProgress, useFitZoom } from "@/lib/scroll";
import { pulseAt } from "@/lib/thermal";

const R = 200;
const LAPS = 3;
const pad2 = (n: number) => String(n).padStart(2, "0");
const pad4 = (n: number) => String(n).padStart(4, "0");

/** La primera vuelta es lenta (para leer) y las siguientes se aceleran. */
function lapsAt(p: number): number {
  const q = span(p, 0.04, 0.96);
  if (q < 0.5) return q / 0.5;
  if (q < 0.8) return 1 + (q - 0.5) / 0.3;
  return 2 + (q - 0.8) / 0.2;
}

function arc(a0: number, a1: number): string {
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(R * Math.sin(a)).toFixed(2)} ${(-R * Math.cos(a)).toFixed(2)}`;
  };
  return `M ${pt(a0)} A ${R} ${R} 0 0 1 ${pt(a1)}`;
}

interface Props {
  t: Content["loop"];
  genLabel: string;
  head: ReactNode;
}

/** Sección fija: un pulso recorre el anillo Propone → Simula → Puntúa → Selecciona. */
export function LoopRing({ t, genLabel, head }: Props) {
  const track = useRef<HTMLDivElement | null>(null);
  const list = useRef<HTMLOListElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const pulse = useRef<SVGGElement | null>(null);
  const line = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const [gen, setGen] = useState(LAPS);
  const fit = useRef<HTMLDivElement | null>(null);
  const pinned = usePinned();
  const motionOk = useMotionOk();
  useFitZoom(fit, pinned);

  useElementProgress(
    track,
    (p) => {
      const laps = lapsAt(p);
      pulse.current?.setAttribute("transform", `rotate(${(laps * 360).toFixed(2)})`);
      stage.current?.style.setProperty("--pulse", pulseAt(laps / LAPS));
      setGen(Math.min(LAPS, Math.floor(laps + 1e-6)));
      setActive(Math.floor(((laps % 1) + 1e-6) * 4) % 4);
    },
    { mode: "pin", enabled: pinned },
  );

  // Móvil: la línea que une los pasos se dibuja con el scroll.
  useElementProgress(
    list,
    (p) => {
      if (line.current) line.current.style.transform = `scaleY(${p})`;
    },
    { mode: "flow", from: 0.8, to: 0.35, enabled: motionOk && !pinned },
  );

  return (
    <div ref={track} className="pin:h-[420vh]">
      <div
        ref={stage}
        className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center"
        style={{ ["--pulse" as string]: pulseAt(1) }}
      >
        <div ref={fit} className="wrap grid items-center gap-x-10 gap-y-10 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {head}
            <ol ref={list} className="relative mt-10 space-y-6 pin:space-y-3">
              {/* Línea vertical (solo sin pin) */}
              <span aria-hidden="true" className="absolute bottom-2 left-[0.6rem] top-2 w-px bg-rule pin:hidden">
                <span ref={line} className="block size-full origin-top bg-accent" />
              </span>
              {t.steps.map((s, i) => {
                const on = pinned ? active === i : true;
                return (
                  <li key={s.name} data-active={on} className="relative pl-10 pin:pl-0">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1.5 size-5 border border-accent bg-ink-950 pin:hidden"
                    />
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`mono transition-colors duration-300 ${on ? "text-(--pulse)" : "text-dim"} unpin:text-accent`}
                      >
                        {pad2(i + 1)}
                      </span>
                      <h3
                        className={`font-display text-lead font-extrabold transition-colors duration-300 ${
                          on ? "text-fg" : "text-dim"
                        }`}
                        style={{ fontVariationSettings: '"wdth" 112' }}
                      >
                        {s.name}
                      </h3>
                    </div>
                    <div className="fold">
                      <p className="max-w-[40ch] pl-0 text-fg pin:pl-[2.6rem]">
                        <span className="block pt-1.5 pin:pb-2">{s.text}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Anillo: decorativo, la información está en la lista */}
          <div className="hidden lg:col-span-7 lg:block" aria-hidden="true">
            <svg viewBox="-380 -300 760 600" className="mx-auto block h-auto max-h-[min(78svh,40rem)] w-full">
              {/* Marcas cada 15° */}
              {Array.from({ length: 24 }, (_, i) => {
                const a = (i * 15 * Math.PI) / 180;
                const r0 = R - (i % 6 === 0 ? 0 : 6);
                return (
                  <line
                    key={i}
                    x1={((r0 - 8) * Math.sin(a)).toFixed(2)}
                    y1={(-(r0 - 8) * Math.cos(a)).toFixed(2)}
                    x2={((R - 16) * Math.sin(a)).toFixed(2)}
                    y2={(-(R - 16) * Math.cos(a)).toFixed(2)}
                    stroke="var(--rule)"
                    strokeWidth="1"
                  />
                );
              })}
              <circle r={R} fill="none" stroke="var(--rule)" strokeWidth="1.5" />
              <circle r={R + 46} fill="none" stroke="var(--rule)" strokeWidth="1" strokeDasharray="2 7" />

              {/* Sentido de giro */}
              {[45, 135, 225, 315].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <path d={`M -6 ${-R - 6} L 4 ${-R} L -6 ${-R + 6}`} fill="none" stroke="var(--text-dim)" strokeWidth="1.5" />
                </g>
              ))}

              {/* Pulso */}
              <g ref={pulse}>
                <path d={arc(-52, -34)} fill="none" stroke="var(--pulse)" strokeWidth="3" opacity="0.18" />
                <path d={arc(-34, -16)} fill="none" stroke="var(--pulse)" strokeWidth="3" opacity="0.45" />
                <path d={arc(-16, 0)} fill="none" stroke="var(--pulse)" strokeWidth="3" />
                <circle cy={-R} r="16" fill="var(--pulse)" opacity="0.2" />
                <circle cy={-R} r="6.5" fill="var(--pulse)" />
              </g>

              {/* Nodos */}
              {t.steps.map((s, i) => {
                const a = (i * 90 * Math.PI) / 180;
                const x = R * Math.sin(a);
                const y = -R * Math.cos(a);
                const on = active === i;
                const lx = i === 1 ? 44 : i === 3 ? -44 : 0;
                const ly = i === 0 ? -48 : i === 2 ? 62 : 6;
                return (
                  <g key={s.name} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
                    <circle
                      r="24"
                      className="loop-node"
                      style={{ transform: on ? "scale(1.3)" : "scale(1)" }}
                      fill={on ? "var(--pulse)" : "var(--ink-950)"}
                      stroke={on ? "var(--pulse)" : "var(--text-dim)"}
                      strokeWidth="1.5"
                    />
                    <text
                      y="5.5"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="15"
                      fontWeight="700"
                      fill={on ? "var(--ink-950)" : "var(--text)"}
                    >
                      {pad2(i + 1)}
                    </text>
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={i === 1 ? "start" : i === 3 ? "end" : "middle"}
                      fontFamily="var(--font-display)"
                      fontSize="21"
                      fontWeight="800"
                      style={{ fontVariationSettings: '"wdth" 112' }}
                      fill={on ? "var(--text)" : "var(--text-dim)"}
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}

              {/* Contador de generación */}
              <text y="-34" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="15" fill="var(--text-dim)">
                {genLabel}
              </text>
              <text
                y="34"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="76"
                fontWeight="700"
                letterSpacing="-3"
                fill="var(--pulse)"
              >
                {pad4(gen)}
              </text>
              <text y="70" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fill="var(--text-dim)">
                {t.lapNote}
              </text>
            </svg>
            <p className="mono mt-2 text-center text-dim">{t.ringNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
