"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Content } from "@/content/types";
import { useMotionOk, usePinned } from "@/lib/hooks";
import { span, useElementProgress, useFitZoom } from "@/lib/scroll";

/* ── Proyección isométrica (axonometría explotada) ── */
const U = 44;
const C = Math.cos(Math.PI / 6);
const W = 6;
const D = 4;
const H = 2.4;
const FLOORS = 3; // plantas con racks; la placa 3 es la cubierta
const T = 0.14; // canto del forjado

type P3 = [number, number, number];
const px = ([x, y, z]: P3): [number, number] => [(x - y) * C * U, (x + y) * 0.5 * U - z * U];
const pt = (p: P3) => px(p).map((v) => v.toFixed(1)).join(",");
const poly = (pts: P3[]) => pts.map(pt).join(" ");

function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    left: poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    right: poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
  };
}

function ring(cx: number, cy: number, z: number, r: number, a0 = 0, a1 = 360, n = 28) {
  const pts: P3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
  }
  return poly(pts);
}

const RACK_X = [0.5, 1.35, 2.2, 3.05, 3.9, 4.75];
const RACK = { y: 2.8, w: 0.6, d: 0.8, h: 1.1 };

const ease = "cubic-bezier(0.2, 0.7, 0.1, 1)";

interface Props {
  t: Content["vision"];
  head: ReactNode;
}

/** Edificio isométrico que se «analiza» con el scroll. Concepto, no un inmueble real. */
export function SitesBuilding({ t, head }: Props) {
  const track = useRef<HTMLDivElement | null>(null);
  const fig = useRef<HTMLElement | null>(null);
  const [stage, setStage] = useState(5);
  const fit = useRef<HTMLDivElement | null>(null);
  const pinned = usePinned();
  const motionOk = useMotionOk();
  useFitZoom(fit, pinned);

  useElementProgress(
    track,
    (p) => setStage(Math.min(5, 1 + Math.floor(span(p, 0.05, 0.92) * 5))),
    { mode: "pin", enabled: pinned },
  );

  // Sin pin y con movimiento: el análisis avanza solo al entrar en pantalla.
  useEffect(() => {
    if (pinned || !motionOk || !fig.current) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let s = 1;
        setStage(1);
        timer = window.setInterval(() => {
          s += 1;
          setStage(s);
          if (s >= 5) window.clearInterval(timer);
        }, 850);
      },
      { threshold: 0.35 },
    );
    io.observe(fig.current);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [pinned, motionOk]);

  const on = (k: number) => stage >= k;
  const fade = (k: number, delay = 0): React.CSSProperties => ({
    opacity: on(k) ? 1 : 0,
    transition: `opacity 600ms ${ease} ${on(k) ? delay : 0}ms`,
  });
  const cool = on(5);
  const zr = FLOORS * H; // cota de cubierta

  return (
    <div ref={track} className="pin:h-[380vh]">
      <div className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center">
        <div ref={fit} className="wrap grid items-center gap-x-10 gap-y-10 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {head}
            <ol className="mt-8 space-y-5 pin:mt-6 pin:space-y-2">
              {t.steps.map((s, i) => {
                const active = pinned ? stage === i + 1 : true;
                return (
                  <li key={s.name} data-active={active}>
                    <div className="flex items-baseline gap-4">
                      <span className={`mono transition-colors duration-300 ${active ? "text-accent" : "text-dim"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={`font-display text-lead font-extrabold transition-colors duration-300 ${
                          active ? "text-fg" : "text-dim"
                        }`}
                        style={{ fontVariationSettings: '"wdth" 112' }}
                      >
                        {s.name}
                      </h3>
                    </div>
                    <div className="fold">
                      <p className="max-w-[40ch] pl-[2.6rem] text-fg">
                        <span className="block pt-1 pin:pb-2">{s.text}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <figure ref={fig} className="lg:col-span-7">
            <svg
              viewBox="-215 -345 520 600"
              className="mx-auto block h-auto max-h-[min(72svh,40rem)] w-full"
              role="img"
              aria-label={t.figure}
            >
              {/* Guías verticales de la axonometría explotada */}
              {(
                [
                  [0, D],
                  [W, 0],
                  [W, D],
                ] as const
              ).map(([x, y]) => (
                <line
                  key={`${x}-${y}`}
                  x1={px([x, y, 0])[0].toFixed(1)}
                  y1={px([x, y, 0])[1].toFixed(1)}
                  x2={px([x, y, zr])[0].toFixed(1)}
                  y2={px([x, y, zr])[1].toFixed(1)}
                  stroke="var(--rule)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              ))}

              {/* Vibraciones en la base */}
              <g style={fade(2, 250)} fill="none" stroke="var(--amber)" strokeWidth="1.25">
                {[0.55, 0.95, 1.35].map((r) => (
                  <polyline key={r} points={ring(W, D, 0, r, -25, 115, 16)} />
                ))}
              </g>

              {Array.from({ length: FLOORS + 1 }, (_, k) => {
                const z = k * H;
                const plate = box(0, 0, z - T, W, D, T);
                const isRoof = k === FLOORS;
                return (
                  <g key={k}>
                    {/* Forjado */}
                    <g strokeLinejoin="round">
                      <polygon points={plate.left} fill="var(--ink-900)" stroke="var(--text-dim)" strokeWidth="1" />
                      <polygon points={plate.right} fill="var(--ink-800)" stroke="var(--text-dim)" strokeWidth="1" />
                      <polygon points={plate.top} fill="var(--ink-950)" fillOpacity="0.94" stroke="var(--text-dim)" strokeWidth="1" />
                      {/* Canto resaltado: análisis estructural */}
                      {!isRoof && (
                        <polyline
                          points={poly([[0, D, z], [W, D, z], [W, 0, z]])}
                          fill="none"
                          stroke="var(--amber)"
                          strokeWidth="2.5"
                          style={{
                            opacity: on(2) && !on(4) ? 1 : on(4) ? 0.35 : 0,
                            transition: `opacity 600ms ${ease} ${k * 140}ms`,
                          }}
                        />
                      )}
                    </g>

                    {!isRoof && (
                      <>
                        {/* Cargas sobre el forjado */}
                        <g
                          stroke="var(--amber)"
                          strokeWidth="1.25"
                          fill="none"
                          style={{
                            opacity: on(2) && !on(4) ? 1 : 0,
                            transition: `opacity 500ms ${ease} ${on(4) ? 0 : k * 140}ms`,
                          }}
                        >
                          {RACK_X.map((x) => {
                            const [ax, ay] = px([x + 0.3, 3.2, z + 0.06]);
                            const [, by] = px([x + 0.3, 3.2, z + 0.95]);
                            return (
                              <path
                                key={x}
                                d={`M ${ax.toFixed(1)} ${by.toFixed(1)} V ${ay.toFixed(1)} m -4 -7 l 4 7 l 4 -7`}
                              />
                            );
                          })}
                        </g>

                        {/* Cuadro eléctrico */}
                        {(() => {
                          const b = box(5.3, 0.75, z, 0.42, 0.5, 1.2);
                          const lit = on(3);
                          return (
                            <g style={fade(3, k * 160)} strokeLinejoin="round">
                              <polygon points={b.left} fill="var(--ink-900)" stroke="var(--amber)" strokeWidth="1.25" />
                              <polygon points={b.right} fill={lit ? "var(--amber)" : "var(--ink-900)"} stroke="var(--amber)" strokeWidth="1.25" />
                              <polygon points={b.top} fill="var(--ink-800)" stroke="var(--amber)" strokeWidth="1.25" />
                            </g>
                          );
                        })()}

                        {/* Racks de la planta */}
                        <g
                          strokeLinejoin="round"
                          style={{
                            opacity: on(4) ? 1 : 0,
                            transform: on(4) ? "translateY(0)" : "translateY(-10px)",
                            transition: `opacity 550ms ${ease} ${on(4) ? k * 260 : 0}ms, transform 550ms ${ease} ${on(4) ? k * 260 : 0}ms`,
                          }}
                        >
                          {RACK_X.map((x) => {
                            const b = box(x, RACK.y, z, RACK.w, RACK.d, RACK.h);
                            const stroke = cool ? "var(--cool-400)" : "var(--text)";
                            return (
                              <g key={x} stroke={stroke} strokeWidth="1" style={{ transition: "stroke 600ms" }}>
                                <polygon points={b.left} fill="var(--ink-900)" />
                                <polygon points={b.right} fill="var(--ink-800)" />
                                <polygon
                                  points={b.top}
                                  fill={cool ? "var(--cool-400)" : "var(--ink-950)"}
                                  style={{ transition: `fill 700ms ${ease} ${cool ? (FLOORS - k) * 180 : 0}ms` }}
                                />
                                {[0.3, 0.55, 0.8].map((f) => (
                                  <line
                                    key={f}
                                    x1={px([x + 0.08, RACK.y + RACK.d, z + RACK.h * f])[0].toFixed(1)}
                                    y1={px([x + 0.08, RACK.y + RACK.d, z + RACK.h * f])[1].toFixed(1)}
                                    x2={px([x + RACK.w - 0.08, RACK.y + RACK.d, z + RACK.h * f])[0].toFixed(1)}
                                    y2={px([x + RACK.w - 0.08, RACK.y + RACK.d, z + RACK.h * f])[1].toFixed(1)}
                                    strokeOpacity="0.55"
                                  />
                                ))}
                              </g>
                            );
                          })}
                        </g>

                        {/* Ramal de refrigeración de la planta */}
                        <g
                          fill="none"
                          stroke="var(--cool-400)"
                          strokeWidth="1.5"
                          style={fade(5, (FLOORS - k) * 180)}
                        >
                          <polyline points={poly([[0.25, 3.9, z + 1.6], [5.45, 3.9, z + 1.6]])} />
                          {RACK_X.map((x) => (
                            <polyline key={x} points={poly([[x + 0.3, 3.9, z + 1.6], [x + 0.3, 3.9, z + 1.28]])} />
                          ))}
                        </g>
                      </>
                    )}

                    {isRoof &&
                      (() => {
                        const u = box(3.3, 2.4, z, 1.9, 1.15, 0.7);
                        const stroke = cool ? "var(--cool-400)" : "var(--text-dim)";
                        return (
                          <g strokeLinejoin="round" stroke={stroke} strokeWidth="1.25" style={{ transition: "stroke 600ms" }}>
                            <polygon points={u.left} fill="var(--ink-900)" />
                            <polygon points={u.right} fill="var(--ink-800)" />
                            <polygon points={u.top} fill={cool ? "color-mix(in oklab, var(--cool-400), var(--ink-950) 70%)" : "var(--ink-950)"} style={{ transition: "fill 600ms" }} />
                            <polygon points={ring(3.8, 2.975, z + 0.7, 0.36)} fill="none" />
                            <polygon points={ring(4.7, 2.975, z + 0.7, 0.36)} fill="none" />
                          </g>
                        );
                      })()}
                  </g>
                );
              })}

              {/* Montante eléctrico y acometida */}
              <g fill="none" stroke="var(--amber)" strokeWidth="1.5" style={fade(3)}>
                <polyline points={poly([[7.3, 1.0, 0], [5.95, 1.0, 0], [5.95, 1.0, (FLOORS - 1) * H + 1.2]])} strokeDasharray="5 4" className="flow" />
                <polygon points={box(7.3, 0.75, 0, 0.5, 0.5, 0.5).top} fill="var(--ink-900)" />
                <polygon points={box(7.3, 0.75, 0, 0.5, 0.5, 0.5).left} fill="var(--ink-900)" />
                <polygon points={box(7.3, 0.75, 0, 0.5, 0.5, 0.5).right} fill="var(--amber)" />
              </g>

              {/* Montante de refrigeración desde cubierta */}
              <g fill="none" stroke="var(--cool-400)" strokeWidth="1.5" style={fade(5)}>
                <polyline
                  points={poly([[3.3, 3.0, zr + 0.35], [0.25, 3.0, zr + 0.35], [0.25, 3.9, zr + 0.35], [0.25, 3.9, 1.6]])}
                  strokeDasharray="5 4"
                  className="flow"
                />
              </g>

              {/* Marcas numeradas: remiten a los pasos de la lista */}
              <g fontFamily="var(--font-mono)" fontSize="15" fontWeight="700">
                <text x="-192" y="96" fill="var(--amber)" style={fade(2, 300)}>02</text>
                <text x="272" y="206" fill="var(--amber)" style={fade(3, 300)}>03</text>
                <text x="-192" y="-116" fill="var(--text)" style={fade(4, 300)}>04</text>
                <text x="176" y="-232" fill="var(--cool-400)" style={fade(5, 300)}>05</text>
              </g>
            </svg>
            <figcaption className="mt-3">
              <ul className="mono flex flex-wrap justify-center gap-x-5 gap-y-1 text-dim">
                <li>
                  <span className="text-amber">02</span> {t.labels.slab} · {t.labels.vibration}
                </li>
                <li>
                  <span className="text-amber">03</span> {t.labels.power}
                </li>
                <li>
                  <span className="text-fg">04</span> {t.labels.racks}
                </li>
                <li>
                  <span className="text-cool-400">05</span> {t.labels.cooling}
                </li>
              </ul>
              <p className="mt-3 flex justify-center">
                <span className="chip chip-dash">{t.figure}</span>
              </p>
              <p className="mono mt-3 text-center text-dim">{t.status}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
