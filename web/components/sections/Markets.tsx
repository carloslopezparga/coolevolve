import type { Content } from "@/content/types";
import type { TokLine } from "@/lib/highlight";
import { MarketPicker } from "./MarketPicker";

export function Markets({ c, num, code }: { c: Content; num: string; code: TokLine[] }) {
  const mk = c.markets;
  return (
    <section id={c.sections.markets.id} className="section">
      <div className="wrap">
        <p className="mono cota">
          <span>
            <span className="cota-num">{num}</span> — {c.sections.markets.tag}
          </span>
        </p>
        <h2 className="mono mt-5 text-dim">{mk.title}</h2>
        <p className="display mt-2 max-w-[16ch] text-mega text-fg" style={{ fontSize: "clamp(2.5rem, 1rem + 6.4vw, 6.5rem)", lineHeight: 0.96 }}>
          {mk.phrase}
        </p>
        <MarketPicker t={mk} code={code} />
      </div>
    </section>
  );
}
