import type { Content } from "@/content/types";
import type { TokLine } from "@/lib/highlight";
import { SectionHead } from "@/components/ui/SectionHead";
import { CodeEvolution } from "./CodeEvolution";

export function CodeSection({ c, num, tokens }: { c: Content; num: string; tokens: TokLine[] }) {
  return (
    <section id={c.sections.code.id} className="relative z-2 py-[clamp(4.5rem,10vw,9rem)] pin:py-0">
      <CodeEvolution
        t={c.code}
        tokens={tokens}
        head={<SectionHead num={num} tag={c.sections.code.tag} title={c.code.title} lead={c.code.intro} />}
      />
    </section>
  );
}
