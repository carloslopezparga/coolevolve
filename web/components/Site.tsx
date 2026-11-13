import { SECTION_ORDER, type Content, type SectionKey } from "@/content/types";
import { Nav } from "./chrome/Nav";
import { Telemetry } from "./chrome/Telemetry";
import { SmoothScroll } from "./chrome/SmoothScroll";
import { RevealObserver } from "./chrome/RevealObserver";
import { Reticle } from "./chrome/Reticle";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { Loop } from "./sections/Loop";
import { CodeSection } from "./sections/CodeSection";
import { Vision } from "./sections/Vision";
import { tokenize } from "@/lib/highlight";

export const sectionNum = (key: SectionKey) => `§${String(SECTION_ORDER.indexOf(key) + 1).padStart(2, "0")}`;

/** La página completa, de un solo scroll. Todo el texto llega por `c`. */
export async function Site({ c }: { c: Content }) {
  const sections = SECTION_ORDER.map((key) => ({
    id: c.sections[key].id,
    num: sectionNum(key),
    tag: c.sections[key].tag,
  }));

  const [pseudo, codeTokens] = await Promise.all([
    tokenize(c.loop.pseudo),
    tokenize(c.code.lines.map((l) => l.text).join("\n")),
  ]);

  return (
    <>
      <a
        href="#main"
        className="mono fixed left-3 top-3 z-[80] -translate-y-20 border border-accent bg-ink-950 px-3 py-2 text-fg focus-visible:translate-y-0"
      >
        {c.ui.skip}
      </a>
      <div className="blueprint" aria-hidden="true" />
      <div className="ruler" aria-hidden="true" />

      <Nav
        locale={c.locale}
        navLabel={c.ui.navLabel}
        items={c.ui.navItems.map((key) => ({
          id: c.sections[key].id,
          label: c.ui.navLabels[key] ?? c.sections[key].tag,
        }))}
        all={sections.map((s) => ({ id: s.id, num: s.num, label: s.tag }))}
        menu={c.ui.menu}
        close={c.ui.close}
        github={c.ui.github}
        langSwitch={c.ui.langSwitch}
      />
      <Telemetry sections={sections} tempLabel={c.ui.hudTemp} locale={c.locale} />

      <main id="main">
        <Hero c={c} />
        <Problem c={c} num={sectionNum("problem")} />
        <Loop c={c} num={sectionNum("loop")} pseudo={pseudo} />
        <CodeSection c={c} num={sectionNum("code")} tokens={codeTokens} />
        <Vision c={c} num={sectionNum("vision")} />
      </main>

      <div className="grain" aria-hidden="true" />
      <SmoothScroll />
      <RevealObserver />
      <Reticle />
    </>
  );
}
