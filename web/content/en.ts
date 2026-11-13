import type { Content } from "./types";

/**
 * All site copy in English.
 * Single source: docs/PROJECT.md. Do not add figures or results that are not there.
 */
export const en: Content = {
  locale: "en",
  meta: {
    title: "CoolEvolve — AI that discovers how to cool AI",
    description:
      "CoolEvolve is an agent that writes, tests and evolves controllers as code, scored by a simulator. First mission: data center cooling. Project in development (phase F0).",
    ogAlt: "CoolEvolve: AI is running hot. A wall of racks goes from hot to cold.",
    ogKicker: "AI that discovers how to cool AI",
    ogFoot: "in development · F0 · illustrative visualization",
  },
  sections: {
    idea: { id: "idea", tag: "idea" },
    problem: { id: "problem", tag: "problem" },
    loop: { id: "loop", tag: "loop" },
    code: { id: "code", tag: "code" },
    edge: { id: "edge", tag: "edge" },
    why: { id: "why-now", tag: "why now" },
    stack: { id: "architecture", tag: "architecture" },
    metrics: { id: "metrics", tag: "metrics" },
    roadmap: { id: "roadmap", tag: "roadmap" },
    vision: { id: "vision", tag: "vision" },
    markets: { id: "markets", tag: "markets" },
    business: { id: "business", tag: "business" },
    risks: { id: "risks", tag: "risks" },
    author: { id: "author", tag: "author" },
    sources: { id: "sources", tag: "sources" },
  },
  ui: {
    skip: "Skip to content",
    navLabel: "Sections",
    navItems: ["problem", "loop", "edge", "stack", "roadmap", "vision", "author"],
    navLabels: {
      problem: "Problem",
      loop: "Loop",
      edge: "Edge",
      stack: "Architecture",
      roadmap: "Roadmap",
      vision: "Vision",
      author: "Author",
    },
    menu: "Index",
    close: "Close",
    github: "GitHub",
    langSwitch: "Language",
    hudTemp: "T_page",
    source: "source",
    pending: "pending",
    generation: "gen",
  },
  hero: {
    status: "in development · F0",
    headline: ["AI is", "running", "hot."],
    sub: "CoolEvolve is an agent that writes, tests and evolves controllers as code, scored by a simulator, until they beat the industry standard.",
    points: [
      { label: "First application", text: "data center cooling." },
      { label: "Next", text: "any industrial system that has a simulator." },
    ],
    ctaHow: "See how it works",
    ctaGithub: "GitHub",
    wallLabel: "Illustrative visualization · not real data",
    wallCota: "rack wall · 12 × 8",
    wallAgent: "agent sweep",
    note: "Bachelor's thesis at ETSII-UPM with startup ambitions. November 2026: no published results yet.",
    scrollHint: "Scroll: the page cools down as you read",
  },
  problem: {
    title: "AI has an energy problem",
    chart: {
      caption: "Data center electricity consumption",
      unit: "TWh",
      startLabel: "2024",
      startNote: "around 1.5% of the world's electricity",
      endLabel: "2030 · forecast",
      endNote: "slightly more than all of Japan today",
      japan: "Japan today",
      japanNote:
        "The Japan mark is indicative: the IEA places 945 TWh “slightly” above its current consumption.",
      scaleNote: "Only two data points: 2024 and the 2030 forecast. The bar does not represent the years in between.",
      source: "IEA, Energy and AI (2025)",
    },
    ai: {
      value: "> ×4",
      text: "AI-optimized data centers will more than quadruple their consumption between now and 2030.",
      source: "IEA, Energy and AI (2025)",
    },
    cooling: {
      title: "Cooling's share of a data center's energy",
      ranges: [
        { who: "IIR", from: 30, to: 55 },
        { who: "IEA", from: 7, to: 30, note: "depending on efficiency" },
      ],
      axis: "% of the data center's energy",
      source: "IIR · IEA",
    },
    google: {
      kicker: "Precedent",
      value: "−40%",
      text: "Google cut the cooling energy of its data centers by 40% using AI.",
      before: "before",
      after: "with AI",
      source: "Technology Magazine (2025)",
    },
    hvac: {
      kicker: "Next market",
      value: "> 50%",
      text: "Heating, ventilation and air conditioning (HVAC) accounts for more than half of buildings' energy demand in developed countries.",
      source: "arXiv 2601.23225",
    },
    message:
      "Every point saved on cooling is recurring money for the operator and fewer emissions.",
  },
  loop: {
    title: "How it works: an evolutionary loop",
    lead: "Four steps on repeat. Every lap is a generation.",
    steps: [
      {
        name: "Propose",
        text: "An LLM writes a variant of the controller in Python, mutating the best previous programs.",
      },
      {
        name: "Simulate",
        text: "Sinergym + EnergyPlus simulate the operation of the data center with that controller.",
      },
      {
        name: "Score",
        text: "An evaluator measures cooling energy and penalizes out-of-range temperatures.",
      },
      {
        name: "Select",
        text: "The best programs survive in a database and feed the next generation.",
      },
    ],
    resultLabel: "result",
    result:
      "After many generations, a final controller in readable, auditable code that can be deployed in the building management system.",
    ringNote: "Illustrative diagram of the loop",
    lapNote: "one lap = one generation",
    pseudoTitle: "Loop pseudocode",
    pseudo: `population = [base_controller]

for generation in range(N):
    parents = select(population, k=4)                 # the best + diversity
    child = llm.mutate(parents, context=error_report)
    result = simulator.run(child, episode="typical_week")
    score = energy(result) + thermal_penalty(result)
    if meets_constraints(result):
        population.add(child, score)

best = validate_on_hidden_episodes(top(population))`,
  },
  code: {
    title: "The code evolves",
    label: "Illustrative example, not a result",
    intro:
      "This is how a controller could change between generation 0 and generation N. It is an example to explain the idea.",
    file: "controller.py",
    stages: [
      {
        tag: "generation 0",
        title: "Fixed setpoint",
        text: "The starting point: fixed-setpoint control, whatever happens outside.",
      },
      {
        tag: "generation …",
        title: "Learns free cooling",
        text: "It uses cold outdoor air: if it is below 16 °C outside and the room is under 26 °C, it relaxes the setpoint.",
      },
      {
        tag: "generation N",
        title: "Anticipates load peaks",
        text: "When IT load goes above 75%, it lowers the setpoint with a margin before the temperature rises.",
      },
    ],
    lines: [
      { text: "def controller(obs):", from: 0 },
      {
        text: '    t_out, load, t_in = obs["outdoor_temp"], obs["it_load"], obs["zone_temp"]',
        from: 1,
      },
      { text: "", from: 1 },
      { text: "    # Use cold outdoor air (free cooling)", from: 1 },
      { text: "    if t_out < 16 and t_in < 26:", from: 1 },
      { text: '        return {"cooling_setpoint": 27.0, "heating_setpoint": 18.0}', from: 1 },
      { text: "", from: 1 },
      {
        text: '    return {"cooling_setpoint": 24.0, "heating_setpoint": 18.0}',
        from: 0,
        until: 2,
      },
      { text: "    # Anticipate load peaks by lowering the setpoint with a margin", from: 2 },
      { text: "    margin = 0.8 if load > 0.75 else 0.0", from: 2 },
      {
        text: '    return {"cooling_setpoint": round(25.5 - margin, 1), "heating_setpoint": 18.0}',
        from: 2,
      },
    ],
    legendAdd: "added line",
    legendDel: "removed line",
  },
  edge: {
    title: "The edge: readable code, not a black box",
    lead: "The CoolEvolve column lists project targets, not measurements.",
    columns: ["Criterion", "Standard control", "RL (PPO / SAC)", "CoolEvolve"],
    rows: [
      ["Energy savings", "Baseline", "High in simulation", "Target: equal to or better than RL"],
      ["Interpretability", "Full", "Black box", "Readable code"],
      [
        "Trials needed",
        "Few",
        "Thousands of episodes, each one a simulated year",
        "Fewer (to be measured)",
      ],
      ["Deployment on existing systems", "Direct", "Hard", "Direct: it is code"],
      ["Operator trust", "High", "Low", "High: auditable"],
    ],
    goal: "Thesis goal: match or beat RL on savings, with fewer simulations and a result an engineer can read.",
    note: "target",
  },
  why: {
    title: "Why now",
    lead: "Evolutionary coding agents already work. What is missing is taking them to industrial control.",
    items: [
      {
        name: "AlphaEvolve",
        claim: "Opened the way",
        text: "DeepMind's evolutionary coding agent discovered new algorithms in mathematics and improved Google's infrastructure.",
        source: "AlphaEvolve (DeepMind, 2025)",
      },
      {
        name: "CodeEvolve",
        claim: "Open source already competes",
        text: "It matches or beats AlphaEvolve on 5 of the 9 problems in its benchmark.",
        source: "arXiv 2510.14150",
      },
      {
        name: "ShinkaEvolve",
        claim: "Accepted at ICLR 2026",
        text: "Another open-source evolutionary engine, accepted at ICLR 2026.",
        source: "ShinkaEvolve (ICLR 2026)",
      },
      {
        name: "GoalEvolve / ArchAgent",
        claim: "The jump to engineering",
        text: "It is already applied to physical chip design (GoalEvolve) and to computer architecture (data prefetchers).",
        source: "arXiv 2608.16733 · arXiv 2608.09874",
      },
    ],
    gap: {
      name: "The gap",
      text: "Industrial control and energy, almost unexplored.",
      slot: "CoolEvolve goes here",
    },
  },
  stack: {
    title: "Technical architecture",
    lead: "Open-source parts around an evaluator of our own.",
    hint: "Hover or focus a part to see its details.",
    nodes: {
      engine: {
        name: "Evolutionary engine",
        tool: "ShinkaEvolve, OpenEvolve or CodeEvolve (open source)",
        role: "Keeps the population of programs and picks the parents of each generation.",
      },
      llm: {
        name: "LLMs",
        tool: "Claude or Gemini API; an open model as an option",
        role: "Write each controller variant from the best programs.",
      },
      sim: {
        name: "Simulator",
        tool: "Sinergym + EnergyPlus, with a Gymnasium interface (two-zone data center environment)",
        role: "Simulates the operation of the data center with each controller.",
      },
      evaluator: {
        name: "Evaluator",
        tool: "Own: cooling energy + thermal penalty + hard constraints",
        role: "Scores every controller. It is the critical part.",
      },
      baselines: {
        name: "Baselines",
        tool: "Sinergym's default control, PPO and SAC (Stable-Baselines3)",
        role: "The reference the result is measured against.",
      },
      tracking: {
        name: "Tracking",
        tool: "Git, GitHub and Weights & Biases",
        role: "A record of versions and experiments.",
      },
    },
    edges: {
      llmEngine: "variant",
      engineLlm: "parents + error report",
      engineSim: "controller",
      simEval: "simulated episode",
      evalEngine: "score",
      baseEval: "reference",
      engineTrack: "log",
    },
    principles: {
      title: "Evaluator principles (the critical part)",
      intro:
        "The agent optimizes whatever the evaluator measures, so it has to be impossible to game:",
      items: [
        "Hard temperature constraints: if they are violated, the controller is discarded.",
        "Hidden test episodes the agent never sees during evolution.",
        "Validation on unseen climates and loads.",
        "Sandboxed execution and a limit on code complexity.",
        "Manual review of the winning controller.",
      ],
      checked: "design principle",
    },
  },
  metrics: {
    title: "Success metrics",
    banner: "Targets, not results. There are no measurements yet.",
    reading: "no reading",
    columns: { measures: "What it measures", target: "Target", status: "Status" },
    items: [
      {
        name: "Cooling energy savings",
        measures: "Against Sinergym's default control",
        target: "to be defined",
        ref: "default control",
        kind: "open",
      },
      {
        name: "Thermal violations",
        measures: "Time with temperature out of range",
        target: "No worse than the baseline",
        ref: "baseline",
        kind: "below",
      },
      {
        name: "Sample efficiency",
        measures: "Simulations needed compared with PPO and SAC",
        target: "Fewer",
        ref: "PPO / SAC",
        kind: "below",
      },
      {
        name: "Generalization",
        measures: "Performance on unseen climates and loads",
        target: "No serious drop",
        ref: "seen climates",
        kind: "near",
      },
      {
        name: "Interpretability",
        measures: "Size and clarity of the final controller",
        target: "Readable by an engineer without help",
        ref: "human review",
        kind: "check",
      },
    ],
  },
  roadmap: {
    title: "Roadmap",
    here: "we are here",
    planned: "planned",
    phases: [
      {
        id: "F0",
        name: "Technical foundation",
        dates: "Oct–Nov 2026",
        what: "Python in depth, reproduce a ShinkaEvolve example and run Sinergym.",
      },
      {
        id: "F1",
        name: "MVP",
        dates: "Dec 2026–Feb 2027",
        what: "Baselines (default and PPO/SAC), first evolved controller and public repo.",
      },
      {
        id: "F2",
        name: "Rigor",
        dates: "Mar–Jun 2027",
        what: "Advisor and co-advisor, several climates and loads, the actúaupm competition and a technical post.",
      },
      {
        id: "F3",
        name: "Paper",
        dates: "Jun–Aug 2027",
        what: "Submission to a NeurIPS or ICLR workshop and first conversations with operators.",
      },
      {
        id: "F4",
        name: "Pilot",
        dates: "Sep–Dec 2027",
        what: "Pilot with a real digital twin.",
      },
      {
        id: "F5",
        name: "Thesis and launch",
        dates: "Jan–Jun 2028",
        what: "Written thesis, defense and Y Combinator application.",
      },
    ],
  },
  vision: {
    title: "Vision: CoolEvolve Sites",
    tag: "concept · phase 2",
    lead: "From cooling data centers to creating them.",
    text: "AI needs compute capacity faster than new data centers get built. Meanwhile, plenty of existing buildings sit underused.",
    steps: [
      {
        name: "Listing",
        text: "Companies, real estate firms or individuals list their property.",
      },
      {
        name: "Structure",
        text: "The platform combines AI and structural analysis: floor load capacity for racks, and vibrations.",
      },
      {
        name: "Power",
        text: "Electrical power available in the building.",
      },
      {
        name: "Retrofit",
        text: "From that analysis it generates the retrofit plan. The owner earns money by providing space and power.",
      },
      {
        name: "Cooling",
        text: "It analyzes the cooling options and, once the site is running, CoolEvolve controls it.",
      },
    ],
    status: "Status: idea, after the thesis.",
    figure: "Illustrative isometric building: it does not represent a real property",
    labels: {
      slab: "floor loads",
      power: "electrical panels",
      racks: "racks per floor",
      cooling: "cooling",
      vibration: "vibrations",
    },
  },
  markets: {
    title: "One engine, many markets",
    phrase: "Change the evaluator, change the industry.",
    pick: "Pick a market",
    engine: "evolutionary engine",
    evaluatorSlot: "evaluator",
    output: "output",
    codeNote: "Illustrative example line",
    items: [
      {
        id: "dc",
        name: "Data centers",
        text: "The first application: data center cooling.",
        evaluator: "Sinergym + EnergyPlus",
        out: "cooling controller",
        code: "score = cooling_energy(sim) + thermal_penalty(sim)",
      },
      {
        id: "factory",
        name: "Factory",
        text: "Factory scheduling: heuristics to sequence orders and machines.",
        evaluator: "shop-floor simulation",
        out: "sequencing heuristic",
        code: "score = delays(plan) + total_time(plan)",
      },
      {
        id: "process",
        name: "Process",
        text: "Process control: control loops and setpoints in chemical or food plants.",
        evaluator: "process simulator",
        out: "loops and setpoints",
        code: "score = setpoint_error(plant) + energy(plant)",
      },
      {
        id: "grid",
        name: "Batteries",
        text: "Batteries and the grid: when to charge, discharge and sell energy.",
        evaluator: "grid and price simulation",
        out: "charge and sell policy",
        code: "score = -revenue(battery, prices)",
      },
      {
        id: "buildings",
        name: "Buildings",
        text: "Hospitals and offices, with benchmarks such as BOPTEST or Sinergym.",
        evaluator: "BOPTEST or Sinergym",
        out: "HVAC controller",
        code: "score = hvac_energy(building) + discomfort(building)",
      },
      {
        id: "robotics",
        name: "Robotics",
        text: "Motion policies evaluated in MuJoCo.",
        evaluator: "MuJoCo",
        out: "motion policy",
        code: "score = -reward(mujoco.rollout(policy))",
      },
      {
        id: "trading",
        name: "Trading",
        text: "Strategies with the backtest as the evaluator.",
        evaluator: "backtest",
        out: "strategy",
        code: "score = -returns(backtest(strategy))",
      },
    ],
  },
  business: {
    title: "Business model",
    tag: "plan · no customers yet",
    steps: [
      {
        who: "The customer provides",
        text: "the digital twin (EnergyPlus model) of their data center and operating data.",
      },
      {
        who: "CoolEvolve delivers",
        text: "a controller as code, validated in simulation, with a report of the expected savings.",
      },
      {
        who: "Pricing",
        text: "a percentage of the verified savings or an annual license.",
      },
    ],
    clientsLabel: "First customers",
    clients:
      "Colocation operators, maintenance engineering firms and makers of building management systems.",
    expansionLabel: "Expansion",
    expansion: ["data centers", "hospitals and offices", "process control", "factory scheduling"],
    first: "first stop",
  },
  risks: {
    title: "Risks and how they are managed",
    lead: "What can go wrong, and the plan for each case.",
    mitigation: "Mitigation",
    items: [
      {
        risk: "The jump from simulation to reality",
        mitigation:
          "The thesis lives in simulation; the real pilot belongs to the startup phase. Validation on several climates and loads.",
      },
      {
        risk: "Gaming the evaluator",
        mitigation:
          "Hard constraints, hidden test episodes and manual review of the winning code.",
      },
      {
        risk: "API cost",
        mitigation:
          "Cheap models to mutate and expensive ones only to refine; short episodes to filter.",
      },
      {
        risk: "Slow simulation",
        mitigation: "Parallelize and start with episodes of weeks, not full years.",
      },
      {
        risk: "Someone publishes it first",
        mitigation:
          "Speed, an early public repo and differentiation through experimental rigor and deployment.",
      },
    ],
  },
  author: {
    title: "About the author",
    name: "Carlos López Parga",
    bio: "Industrial Technologies Engineering student at ETSII-UPM (Madrid). He is building CoolEvolve as his bachelor's thesis, with startup ambitions.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/carloslopezparga",
        handle: "github.com/carloslopezparga",
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/carloslopezparga",
        handle: "linkedin.com/in/carloslopezparga",
      },
    ],
    closing: "First mission: cool the infrastructure of AI.",
    cold: "page is cold",
  },
  sources: {
    title: "Sources",
    items: [
      "IEA, Energy and AI (2025): data center consumption in 2024 and forecast for 2030.",
      "IIR (International Institute of Refrigeration): cooling's share of a data center's consumption.",
      "Technology Magazine (September 2025): Google's 40% cut in cooling with AI.",
      "Sinergym (Jiménez-Raboso et al., 2021): simulator and data center environment on top of EnergyPlus.",
      "Agile RL through Separable Neural Architecture (arXiv 2601.23225): cost of training episodes, the IEA range and the weight of HVAC.",
      "AlphaEvolve (DeepMind, 2025) · CodeEvolve (arXiv 2510.14150) · ShinkaEvolve (ICLR 2026).",
      "GoalEvolve (arXiv 2608.16733) · ArchAgent v2 (arXiv 2608.09874).",
    ],
    foot: "CoolEvolve · project in development · the figures describe the problem and the targets, not achievements.",
  },
};
