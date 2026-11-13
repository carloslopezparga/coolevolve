import type { Content } from "@/content/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { SitesBuilding } from "./SitesBuilding";

export function Vision({ c, num }: { c: Content; num: string }) {
  const v = c.vision;
  return (
    <section id={c.sections.vision.id} className="relative z-2 py-[clamp(4.5rem,10vw,9rem)] pin:py-0">
      <SitesBuilding
        t={v}
        head={
          <SectionHead num={num} tag={c.sections.vision.tag} title={v.title}>
            <p className="chip chip-accent mt-5">{v.tag}</p>
            <p className="mt-5 max-w-[30ch] text-lead text-fg">{v.lead}</p>
            <p className="mt-3 max-w-[46ch] text-dim">{v.text}</p>
          </SectionHead>
        }
      />
    </section>
  );
}
