"use client";

import { useState } from "react";
import type { Content } from "@/content/types";

type NodeKey = keyof Content["stack"]["nodes"];
type EdgeKey = keyof Content["stack"]["edges"];

const NW = 188;
const NH = 84;

/* Posiciones en una retícula 3×2 (viewBox 1040×400). */
const POS: Record<NodeKey, [number, number]> = {
  llm: [16, 30],
  engine: [406, 30],
  sim: [796, 30],
  tracking: [16, 286],
  baselines: [406, 286],
  evaluator: [796, 286],
};

interface EdgeDef {
  key: EdgeKey;
  from: NodeKey;
  to: NodeKey;
  d: string;
  label: [number, number];
  anchor?: "start" | "middle" | "end";
}

const EDGES: EdgeDef[] = [
  { key: "engineLlm", from: "engine", to: "llm", d: "M406 54 H214", label: [305, 44], anchor: "middle" },
  { key: "llmEngine", from: "llm", to: "engine", d: "M204 92 H396", label: [305, 112], anchor: "middle" },
  { key: "engineSim", from: "engine", to: "sim", d: "M594 72 H786", label: [690, 62], anchor: "middle" },
  { key: "simEval", from: "sim", to: "evaluator", d: "M900 114 V276", label: [910, 204], anchor: "start" },
  { key: "evalEngine", from: "evaluator", to: "engine", d: "M836 286 V180 H500 V124", label: [668, 170], anchor: "middle" },
  { key: "baseEval", from: "baselines", to: "evaluator", d: "M594 328 H786", label: [690, 318], anchor: "middle" },
  { key: "engineTrack", from: "engine", to: "tracking", d: "M440 114 V236 H110 V276", label: [275, 226], anchor: "middle" },
];

const ORDER: NodeKey[] = ["llm", "engine", "sim", "evaluator", "baselines", "tracking"];

/** Diagrama interactivo del stack. En móvil se muestra como lista con todo el detalle. */
export function StackDiagram({ t }: { t: Content["stack"] }) {
  const [active, setActive] = useState<NodeKey>("evaluator");
  const n = t.nodes[active];

  return (
    <div className="mt-12 grid gap-x-10 gap-y-8 lg:mt-16 grid-cols-1 lg:grid-cols-12">
      <div className="hidden md:block lg:col-span-8">
        <svg viewBox="0 0 1040 400" className="block h-auto w-full" role="group" aria-label={t.title}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
            </marker>
          </defs>

          {EDGES.map((e) => {
            const hot = e.from === active || e.to === active;
            return (
              <g key={e.key}>
                <path
                  d={e.d}
                  fill="none"
                  className={`stack-edge ${hot ? "flow" : ""}`}
                  stroke={hot ? "var(--accent)" : "var(--text-dim)"}
                  strokeOpacity={hot ? 1 : 0.55}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  markerEnd="url(#arr)"
                />
                <text
                  x={e.label[0]}
                  y={e.label[1]}
                  textAnchor={e.anchor}
                  fontFamily="var(--font-mono)"
                  fontSize="12.5"
                  fill={hot ? "var(--text)" : "var(--text-dim)"}
                  stroke="var(--ink-950)"
                  strokeWidth="5"
                  paintOrder="stroke"
                >
                  {t.edges[e.key]}
                </text>
              </g>
            );
          })}

          {ORDER.map((key, i) => {
            const [x, y] = POS[key];
            const on = key === active;
            const critical = key === "evaluator";
            return (
              <g
                key={key}
                className="stack-node cursor-pointer"
                transform={`translate(${x} ${y})`}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${t.nodes[key].name}: ${t.nodes[key].tool}`}
                onMouseEnter={() => setActive(key)}
                onFocus={() => setActive(key)}
                onClick={() => setActive(key)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setActive(key);
                  }
                }}
              >
                <rect
                  width={NW}
                  height={NH}
                  fill={on ? "var(--ink-800)" : "var(--ink-900)"}
                  stroke={on ? "var(--accent)" : critical ? "var(--text)" : "var(--rule)"}
                  strokeWidth={on || critical ? 2 : 1.5}
                  strokeDasharray={critical && !on ? "0" : undefined}
                />
                <text x="16" y="28" fontFamily="var(--font-mono)" fontSize="13" fill={on ? "var(--accent)" : "var(--text-dim)"}>
                  {String(i + 1).padStart(2, "0")}
                  {critical ? " ◆" : ""}
                </text>
                <text
                  x="16"
                  y="60"
                  fontFamily="var(--font-display)"
                  fontSize="18.5"
                  fontWeight="800"
                  style={{ fontVariationSettings: '"wdth" 112' }}
                  fill="var(--text)"
                >
                  {t.nodes[key].name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mono mt-3 text-dim">{t.hint}</p>
      </div>

      {/* Detalle del nodo activo */}
      <div className="hidden md:block lg:col-span-4" aria-live="polite">
        <div className="panel crop p-5">
          <p className="mono text-accent">
            {String(ORDER.indexOf(active) + 1).padStart(2, "0")}
            {active === "evaluator" ? " ◆" : ""}
          </p>
          <h3 className="display mt-2 text-lead text-fg">{n.name}</h3>
          <p className="mt-3 text-fg">{n.role}</p>
          <p className="mono mt-4 border-t border-rule pt-3 text-dim">{n.tool}</p>
        </div>
      </div>

      {/* Lista completa: visible en móvil, disponible para lectores de pantalla en escritorio */}
      <dl className="md:sr-only">
        {ORDER.map((key, i) => (
          <div key={key} className="relative border-l border-rule pb-7 pl-6 last:pb-0">
            <span aria-hidden="true" className={`absolute -left-[5px] top-2 size-[9px] ${key === "evaluator" ? "bg-accent" : "border border-accent bg-ink-950"}`} />
            <dt>
              <span className="mono text-accent">
                {String(i + 1).padStart(2, "0")}
                {key === "evaluator" ? " ◆" : ""}
              </span>
              <span className="display mt-1 block text-lead text-fg">{t.nodes[key].name}</span>
            </dt>
            <dd className="mt-2 text-fg">{t.nodes[key].role}</dd>
            <dd className="mono mt-2 text-dim">{t.nodes[key].tool}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
