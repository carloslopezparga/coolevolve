export type Locale = "es" | "en";

export const SECTION_ORDER = [
  "idea",
  "problem",
  "loop",
  "code",
  "edge",
  "why",
  "stack",
  "metrics",
  "roadmap",
  "vision",
  "markets",
  "business",
  "risks",
  "author",
  "sources",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export interface SectionMeta {
  /** Ancla en la URL. */
  id: string;
  /** Etiqueta corta en minúsculas para el HUD y los números de sección. */
  tag: string;
}

export interface Sourced {
  source: string;
}

export interface CodeLine {
  text: string;
  /** Etapa en la que aparece la línea (0 = generación 0). */
  from: 0 | 1 | 2;
  /** Etapa en la que desaparece. */
  until?: 1 | 2;
}

export type GaugeKind = "open" | "below" | "near" | "check";

export interface Content {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    ogKicker: string;
    ogFoot: string;
  };
  sections: Record<SectionKey, SectionMeta>;
  ui: {
    skip: string;
    navLabel: string;
    navItems: SectionKey[];
    navLabels: Partial<Record<SectionKey, string>>;
    menu: string;
    close: string;
    github: string;
    langSwitch: string;
    hudTemp: string;
    illustrative: string;
    source: string;
    pending: string;
    tbd: string;
    target: string;
    step: string;
    generation: string;
    of: string;
  };
  hero: {
    status: string;
    headline: [string, string, string];
    sub: string;
    points: { label: string; text: string }[];
    ctaHow: string;
    ctaGithub: string;
    wallLabel: string;
    wallCota: string;
    wallAgent: string;
    note: string;
    scrollHint: string;
  };
  problem: {
    title: string;
    chart: {
      caption: string;
      unit: string;
      startLabel: string;
      startNote: string;
      endLabel: string;
      endNote: string;
      japan: string;
      japanNote: string;
      scaleNote: string;
      source: string;
    };
    ai: { value: string; text: string } & Sourced;
    cooling: {
      title: string;
      ranges: { who: string; from: number; to: number; note?: string }[];
      axis: string;
    } & Sourced;
    google: { kicker: string; value: string; text: string; before: string; after: string } & Sourced;
    hvac: { kicker: string; value: string; text: string } & Sourced;
    message: string;
  };
  loop: {
    title: string;
    lead: string;
    steps: { name: string; text: string }[];
    result: string;
    ringNote: string;
    lapNote: string;
    pseudoTitle: string;
    pseudo: string;
  };
  code: {
    title: string;
    label: string;
    intro: string;
    file: string;
    stages: { tag: string; title: string; text: string }[];
    lines: CodeLine[];
    legendAdd: string;
    legendDel: string;
    stageLabel: string;
  };
  edge: {
    title: string;
    lead: string;
    columns: [string, string, string, string];
    rows: [string, string, string, string][];
    goal: string;
    note: string;
  };
  why: {
    title: string;
    lead: string;
    items: { name: string; claim: string; text: string; source: string }[];
    gap: { name: string; text: string; slot: string };
  };
  stack: {
    title: string;
    lead: string;
    hint: string;
    nodes: Record<
      "engine" | "llm" | "sim" | "evaluator" | "baselines" | "tracking",
      { name: string; tool: string; role: string }
    >;
    edges: Record<
      "llmEngine" | "engineLlm" | "engineSim" | "simEval" | "evalEngine" | "baseEval" | "engineTrack",
      string
    >;
    principles: { title: string; intro: string; items: string[]; checked: string };
  };
  metrics: {
    title: string;
    banner: string;
    reading: string;
    columns: { measures: string; target: string; status: string };
    items: { name: string; measures: string; target: string; ref: string; kind: GaugeKind }[];
  };
  roadmap: {
    title: string;
    here: string;
    done: string;
    planned: string;
    phases: { id: string; name: string; dates: string; what: string }[];
  };
  vision: {
    title: string;
    tag: string;
    lead: string;
    text: string;
    steps: { name: string; text: string }[];
    status: string;
    figure: string;
    labels: { slab: string; power: string; racks: string; cooling: string; vibration: string };
  };
  markets: {
    title: string;
    phrase: string;
    pick: string;
    engine: string;
    evaluatorSlot: string;
    output: string;
    codeNote: string;
    items: {
      id: string;
      name: string;
      text: string;
      evaluator: string;
      out: string;
      code: string;
    }[];
  };
  business: {
    title: string;
    tag: string;
    steps: { who: string; text: string }[];
    clientsLabel: string;
    clients: string;
    expansionLabel: string;
    expansion: string[];
    first: string;
  };
  risks: {
    title: string;
    lead: string;
    mitigation: string;
    items: { risk: string; mitigation: string }[];
  };
  author: {
    title: string;
    name: string;
    bio: string;
    links: { label: string; href: string; handle: string }[];
    closing: string;
    cold: string;
  };
  sources: {
    title: string;
    items: string[];
    foot: string;
  };
}
