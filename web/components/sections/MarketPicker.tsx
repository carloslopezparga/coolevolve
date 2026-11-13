"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Content } from "@/content/types";
import type { TokLine } from "@/lib/highlight";
import { useMotionOk } from "@/lib/hooks";
import { Tokens } from "@/components/ui/Code";

const loadFeatures = () => import("@/lib/motionFeatures").then((m) => m.default);

interface Props {
  t: Content["markets"];
  code: TokLine[];
}

/** Selector de mercado: cambia el hueco «evaluador» y la línea de código de ejemplo. */
export function MarketPicker({ t, code }: Props) {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const motionOk = useMotionOk();
  const it = t.items[idx];

  const move = (to: number) => {
    const n = (to + t.items.length) % t.items.length;
    setIdx(n);
    refs.current[n]?.focus();
  };

  const swap = motionOk
    ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } }
    : { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } };
  const transition = { duration: motionOk ? 0.28 : 0, ease: [0.2, 0.7, 0.1, 1] as const };

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="mt-10 lg:mt-14">
        <p id="market-pick" className="mono text-dim">
          {t.pick}
        </p>
        <div role="radiogroup" aria-labelledby="market-pick" className="mono mt-3 flex flex-wrap gap-2">
          {t.items.map((item, i) => {
            const on = i === idx;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    move(i + 1);
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    move(i - 1);
                  }
                }}
                className={`flex cursor-pointer items-center gap-2 border px-3 py-2 transition-colors ${
                  on ? "border-accent bg-accent text-ink-950" : "border-rule text-fg hover:border-accent"
                }`}
              >
                <span aria-hidden="true">{on ? "■" : "□"}</span>
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Diagrama: motor → [evaluador] → lo que sale */}
        <div className="mt-8 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1.5fr_auto_1.2fr]" aria-live="polite">
          <div className="panel flex flex-col justify-center p-5">
            <p className="mono text-dim">01</p>
            <p className="display mt-1 text-lead text-fg">{t.engine}</p>
          </div>
          <Arrow />
          <div className="crop relative flex min-h-[7.5rem] flex-col justify-center border border-dashed border-accent p-5">
            <p className="mono text-accent">02 · {t.evaluatorSlot}</p>
            <div className="relative mt-1 min-h-[2.2em] overflow-hidden text-lead">
              <AnimatePresence mode="wait" initial={false}>
                <m.p key={it.id} {...swap} transition={transition} className="display text-lead text-fg">
                  {it.evaluator}
                </m.p>
              </AnimatePresence>
            </div>
          </div>
          <Arrow />
          <div className="panel flex flex-col justify-center p-5">
            <p className="mono text-dim">03 · {t.output}</p>
            <div className="relative mt-1 min-h-[2.2em] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <m.p key={it.id} {...swap} transition={transition} className="text-lead text-fg">
                  {it.out}
                </m.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 grid-cols-1 lg:grid-cols-12">
          <p className="text-fg lg:col-span-5 lg:pr-6 lg:pt-4">{it.text}</p>
          <figure className="panel min-w-0 lg:col-span-7">
            <figcaption className="mono flex items-center justify-between gap-4 border-b border-rule px-4 py-2 text-dim">
              <span className="text-fg">evaluator.py</span>
              <span>{t.codeNote}</span>
            </figcaption>
            <div className="code overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <m.pre key={it.id} {...swap} transition={transition} className="!whitespace-pre-wrap [overflow-wrap:anywhere]">
                  <code>
                    <Tokens line={code[idx] ?? []} />
                  </code>
                </m.pre>
              </AnimatePresence>
            </div>
          </figure>
        </div>
      </div>
    </LazyMotion>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className="mono flex items-center justify-center text-accent max-lg:rotate-90">
      ——▸
    </span>
  );
}
