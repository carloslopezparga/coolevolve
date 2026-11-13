import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { WhyNowTimeline } from "./WhyNow";

export function WhyNow({ c, num }: { c: Content; num: string }) {
  return (
    <section id={c.sections.why.id} className="relative z-2 py-[clamp(4.5rem,10vw,9rem)] pin:py-0">
      <WhyNowTimeline
        t={c.why}
        sourceLabel={c.ui.source}
        head={<SectionHead num={num} tag={c.sections.why.tag} title={c.why.title} lead={c.why.lead} />}
      />
    </section>
  );
}
