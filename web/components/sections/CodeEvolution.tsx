"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Content } from "@/content/types";
import type { TokLine } from "@/lib/highlight";
import { usePinned } from "@/lib/hooks";
import { useElementProgress } from "@/lib/scroll";
import { Tokens } from "@/components/ui/Code";

type Stage = 0 | 1 | 2;
type LineState = "hidden" | "shown" | "added" | "removed";

interface Props {
  t: Content["code"];
  tokens: TokLine[];
  head: ReactNode;
}

function stateAt(line: Content["code"]["lines"][number], stage: Stage): LineState {
  if (line.until !== undefined && stage >= line.until) return stage === line.until ? "removed" : "hidden";
  if (stage < line.from) return "hidden";
  return stage === line.from && stage > 0 ? "added" : "shown";
}

const MARK: Record<LineState, string> = { hidden: " ", shown: " ", added: "+", removed: "−" };

interface ListingProps {
  t: Content["code"];
  tokens: TokLine[];
  stage: Stage;
  label: string;
  /** Vista estática: marca como añadidas todas las líneas que no estaban en la generación 0. */
  sinceStart?: boolean;
}

function Listing({ t, tokens, stage, label, sinceStart }: ListingProps) {
  // Estado y número de cada línea para esta etapa.
  const rows: { st: LineState; visible: boolean; n: number }[] = [];
  let count = 0;
  for (const line of t.lines) {
    let st = stateAt(line, stage);
    if (sinceStart && st === "shown" && line.from > 0) st = "added";
    if (sinceStart && st === "removed") st = "hidden";
    const visible = st === "shown" || st === "added";
    if (visible) count += 1;
    rows.push({ st, visible, n: count });
  }

  return (
    <div className="code" role="group" aria-label={label}>
      <pre tabIndex={0} className="!px-0" data-lenis-prevent-horizontal>
        <code className="block min-w-max">
          {rows.map(({ st, visible, n }, i) => (
            <span key={i} className="diff-line" data-state={st} aria-hidden={!visible}>
              <div>
                <span className="flex">
                  <span aria-hidden="true" className="w-9 flex-none select-none pr-2 text-right text-dim">
                    {visible ? n : ""}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`w-5 flex-none select-none text-center ${st === "added" ? "text-cool-400" : "text-hot-500"}`}
                  >
                    {MARK[st]}
                  </span>
                  {st === "added" ? <span className="sr-only">{t.legendAdd}: </span> : null}
                  <span className="pr-5">
                    <Tokens line={tokens[i] ?? []} />
                  </span>
                </span>
              </div>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** Panel fijo: el controlador pasa de la generación 0 a la N con un diff animado. */
export function CodeEvolution({ t, tokens, head }: Props) {
  const track = useRef<HTMLDivElement | null>(null);
  const marker = useRef<HTMLSpanElement | null>(null);
  const [stage, setStage] = useState<Stage>(2);
  const pinned = usePinned();

  useElementProgress(
    track,
    (p) => {
      setStage(p < 0.24 ? 0 : p < 0.6 ? 1 : 2);
      if (marker.current) marker.current.style.left = `${Math.min(1, p / 0.8) * 100}%`;
    },
    { mode: "pin", enabled: pinned },
  );

  const legend = (
    <p className="mono flex flex-wrap gap-x-5 gap-y-1 text-dim">
      <span>
        <span className="text-cool-400">+</span> {t.legendAdd}
      </span>
      <span>
        <span className="text-hot-500">−</span> {t.legendDel}
      </span>
    </p>
  );

  return (
    <div ref={track} className="pin:h-[340vh]">
      <div className="pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center">
        <div className="wrap grid items-start gap-x-10 gap-y-10 grid-cols-1 lg:grid-cols-12 pin:items-center">
          <div className="lg:col-span-5">
            {head}
            <p className="chip chip-dash mt-6">{t.label}</p>

            {/* Indicador de generación */}
            <div className="mt-8 hidden pin:block" aria-hidden="true">
              <div className="relative h-px bg-rule">
                <span
                  ref={marker}
                  className="absolute -top-1.5 h-3 w-px bg-accent transition-[left] duration-150 ease-linear"
                  style={{ left: "100%" }}
                />
              </div>
              <div className="mono mt-2 flex justify-between text-dim">
                <span>{t.stages[0].tag}</span>
                <span>{t.stages[2].tag}</span>
              </div>
            </div>

            <ol className="mt-8 space-y-6 pin:space-y-3">
              {t.stages.map((s, i) => {
                const on = pinned ? stage === i : true;
                return (
                  <li key={s.tag} data-active={on}>
                    <p className={`mono transition-colors duration-300 ${on ? "text-accent" : "text-dim"}`}>{s.tag}</p>
                    <h3
                      className={`font-display text-lead font-extrabold transition-colors duration-300 ${on ? "text-fg" : "text-dim"}`}
                      style={{ fontVariationSettings: '"wdth" 112' }}
                    >
                      {s.title}
                    </h3>
                    <div className="fold">
                      <p className="max-w-[42ch] text-fg">
                        <span className="block pt-1.5 pin:pb-2">{s.text}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="min-w-0 lg:col-span-7">
            {/* Con pin: un solo panel que cambia con el scroll */}
            <figure className="panel crop hidden pin:block">
              <figcaption className="mono flex items-center justify-between gap-4 border-b border-rule px-4 py-2">
                <span className="text-fg">{t.file}</span>
                <span className="text-accent" aria-live="polite">
                  {t.stages[stage].tag}
                </span>
              </figcaption>
              <div className="min-h-[21.5rem]">
                <Listing t={t} tokens={tokens} stage={stage} label={`${t.file} · ${t.stages[stage].tag}`} />
              </div>
              <div className="border-t border-rule px-4 py-2">{legend}</div>
            </figure>

            {/* Sin pin: generación 0 y generación N, una debajo de otra */}
            <div className="space-y-6 pin:hidden">
              {([0, 2] as const).map((st) => (
                <figure key={st} className="panel crop">
                  <figcaption className="mono flex items-center justify-between gap-4 border-b border-rule px-4 py-2">
                    <span className="text-fg">{t.file}</span>
                    <span className="text-accent">{t.stages[st].tag}</span>
                  </figcaption>
                  <Listing t={t} tokens={tokens} stage={st} sinceStart label={`${t.file} · ${t.stages[st].tag}`} />
                </figure>
              ))}
              {legend}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
