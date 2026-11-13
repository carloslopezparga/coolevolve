import type { Content } from "./types";

/**
 * Todo el texto de la web en español.
 * Fuente única: docs/PROJECT.md. No añadir cifras ni resultados que no estén allí.
 */
export const es: Content = {
  locale: "es",
  meta: {
    title: "CoolEvolve — IA que descubre cómo enfriar la IA",
    description:
      "CoolEvolve es un agente que escribe, prueba y evoluciona controladores en código, puntuados por un simulador. Primera misión: la refrigeración de centros de datos. Proyecto en desarrollo (fase F0).",
    ogAlt: "CoolEvolve: la IA se está calentando. Un muro de racks pasa de caliente a frío.",
    ogKicker: "IA que descubre cómo enfriar la IA",
    ogFoot: "en desarrollo · F0 · visualización ilustrativa",
  },
  sections: {
    idea: { id: "idea", tag: "idea" },
    problem: { id: "problema", tag: "problema" },
    loop: { id: "bucle", tag: "bucle" },
    code: { id: "codigo", tag: "código" },
    edge: { id: "diferencial", tag: "diferencial" },
    why: { id: "ahora", tag: "por qué ahora" },
    stack: { id: "arquitectura", tag: "arquitectura" },
    metrics: { id: "metricas", tag: "métricas" },
    roadmap: { id: "ruta", tag: "hoja de ruta" },
    vision: { id: "vision", tag: "visión" },
    markets: { id: "mercados", tag: "mercados" },
    business: { id: "negocio", tag: "negocio" },
    risks: { id: "riesgos", tag: "riesgos" },
    author: { id: "autor", tag: "autor" },
    sources: { id: "fuentes", tag: "fuentes" },
  },
  ui: {
    skip: "Saltar al contenido",
    navLabel: "Secciones",
    navItems: ["problem", "loop", "edge", "stack", "roadmap", "vision", "author"],
    navLabels: {
      problem: "Problema",
      loop: "Bucle",
      edge: "Diferencial",
      stack: "Arquitectura",
      roadmap: "Hoja de ruta",
      vision: "Visión",
      author: "Autor",
    },
    menu: "Índice",
    close: "Cerrar",
    github: "GitHub",
    langSwitch: "Idioma",
    hudTemp: "T_página",
    source: "fuente",
    pending: "pendiente",
    generation: "gen",
  },
  hero: {
    status: "en desarrollo · F0",
    headline: ["La IA", "se está", "calentando."],
    sub: "CoolEvolve es un agente que escribe, prueba y evoluciona controladores en código, puntuados por un simulador, hasta superar al estándar industrial.",
    points: [
      { label: "Primera aplicación", text: "la refrigeración de centros de datos." },
      { label: "Después", text: "cualquier sistema industrial que tenga simulador." },
    ],
    ctaHow: "Ver cómo funciona",
    ctaGithub: "GitHub",
    wallLabel: "Visualización ilustrativa · no son datos reales",
    wallCota: "muro de racks · 12 × 8",
    wallAgent: "barrido del agente",
    note: "TFG en la ETSII-UPM con vocación de startup. Noviembre de 2026: todavía no hay resultados publicados.",
    scrollHint: "Baja: la página se enfría mientras lees",
  },
  problem: {
    title: "La IA tiene un problema de energía",
    chart: {
      caption: "Consumo eléctrico de los centros de datos",
      unit: "TWh",
      startLabel: "2024",
      startNote: "cerca del 1,5 % de la electricidad mundial",
      endLabel: "2030 · previsión",
      endNote: "algo más que todo Japón hoy",
      japan: "Japón hoy",
      japanNote:
        "La marca de Japón es orientativa: la IEA sitúa los 945 TWh «algo más» por encima de su consumo actual.",
      scaleNote: "Solo dos datos: 2024 y la previsión para 2030. La barra no representa años intermedios.",
      source: "IEA, Energy and AI (2025)",
    },
    ai: {
      value: "> ×4",
      text: "Los centros de datos optimizados para IA multiplicarán su consumo por más de 4 de aquí a 2030.",
      source: "IEA, Energy and AI (2025)",
    },
    cooling: {
      title: "Peso de la refrigeración en la energía de un centro de datos",
      ranges: [
        { who: "IIR", from: 30, to: 55 },
        { who: "IEA", from: 7, to: 30, note: "en función de la eficiencia" },
      ],
      axis: "% de la energía del centro de datos",
      source: "IIR · IEA",
    },
    google: {
      kicker: "Precedente",
      value: "−40 %",
      text: "Google recortó un 40 % la energía de refrigeración de sus centros de datos con IA.",
      before: "antes",
      after: "con IA",
      source: "Technology Magazine (2025)",
    },
    hvac: {
      kicker: "Siguiente mercado",
      value: "> 50 %",
      text: "La climatización (HVAC) supone más de la mitad de la demanda energética de los edificios en países desarrollados.",
      source: "arXiv 2601.23225",
    },
    message:
      "Cada punto de ahorro en refrigeración es dinero recurrente para el operador y menos emisiones.",
  },
  loop: {
    title: "Cómo funciona: un bucle evolutivo",
    lead: "Cuatro pasos que se repiten. Cada vuelta es una generación.",
    steps: [
      {
        name: "Propone",
        text: "Un LLM escribe una variante del controlador en Python, mutando los mejores programas anteriores.",
      },
      {
        name: "Simula",
        text: "Sinergym + EnergyPlus simulan la operación del centro de datos con ese controlador.",
      },
      {
        name: "Puntúa",
        text: "Un evaluador mide la energía de refrigeración y penaliza las temperaturas fuera de rango.",
      },
      {
        name: "Selecciona",
        text: "Los mejores programas sobreviven en una base de datos y alimentan la siguiente generación.",
      },
    ],
    resultLabel: "resultado",
    result:
      "Tras muchas generaciones, un controlador final en código legible, auditable y desplegable en el sistema de gestión del edificio.",
    ringNote: "Esquema ilustrativo del bucle",
    lapNote: "cada vuelta = una generación",
    pseudoTitle: "Pseudocódigo del bucle",
    pseudo: `poblacion = [controlador_base]

for generacion in range(N):
    padres = seleccionar(poblacion, k=4)              # los mejores + diversidad
    hijo = llm.mutar(padres, contexto=informe_errores)
    resultado = simulador.ejecutar(hijo, episodio="semana_tipo")
    puntuacion = energia(resultado) + penalizacion_termica(resultado)
    if cumple_restricciones(resultado):
        poblacion.añadir(hijo, puntuacion)

mejor = validar_en_episodios_ocultos(top(poblacion))`,
  },
  code: {
    title: "El código evoluciona",
    label: "Ejemplo ilustrativo, no es un resultado",
    intro:
      "Así podría cambiar un controlador entre la generación 0 y la generación N. Es un ejemplo para explicar la idea.",
    file: "controller.py",
    stages: [
      {
        tag: "generación 0",
        title: "Consigna fija",
        text: "El punto de partida: control por consigna fija, pase lo que pase fuera.",
      },
      {
        tag: "generación …",
        title: "Aprende free cooling",
        text: "Aprovecha el aire exterior frío: si fuera hay menos de 16 °C y la sala está por debajo de 26 °C, relaja la consigna.",
      },
      {
        tag: "generación N",
        title: "Anticipa picos de carga",
        text: "Cuando la carga de IT supera el 75 %, baja la consigna con margen antes de que suba la temperatura.",
      },
    ],
    lines: [
      { text: "def controller(obs):", from: 0 },
      {
        text: '    t_out, load, t_in = obs["outdoor_temp"], obs["it_load"], obs["zone_temp"]',
        from: 1,
      },
      { text: "", from: 1 },
      { text: "    # Aprovecha el aire exterior frío (free cooling)", from: 1 },
      { text: "    if t_out < 16 and t_in < 26:", from: 1 },
      { text: '        return {"cooling_setpoint": 27.0, "heating_setpoint": 18.0}', from: 1 },
      { text: "", from: 1 },
      {
        text: '    return {"cooling_setpoint": 24.0, "heating_setpoint": 18.0}',
        from: 0,
        until: 2,
      },
      { text: "    # Anticipa picos de carga bajando la consigna con margen", from: 2 },
      { text: "    margin = 0.8 if load > 0.75 else 0.0", from: 2 },
      {
        text: '    return {"cooling_setpoint": round(25.5 - margin, 1), "heating_setpoint": 18.0}',
        from: 2,
      },
    ],
    legendAdd: "línea añadida",
    legendDel: "línea eliminada",
  },
  edge: {
    title: "El diferencial: código legible, no caja negra",
    lead: "La columna de CoolEvolve recoge objetivos del proyecto, no mediciones.",
    columns: ["Criterio", "Control estándar", "RL (PPO / SAC)", "CoolEvolve"],
    rows: [
      ["Ahorro energético", "Referencia", "Alto en simulación", "Objetivo: igual o mejor que RL"],
      ["Interpretabilidad", "Total", "Caja negra", "Código legible"],
      [
        "Ensayos necesarios",
        "Pocos",
        "Miles de episodios, cada uno un año simulado",
        "Menos (a medir)",
      ],
      ["Despliegue en sistemas existentes", "Directo", "Difícil", "Directo: es código"],
      ["Confianza del operador", "Alta", "Baja", "Alta: auditable"],
    ],
    goal: "Objetivo del TFG: igualar o superar al RL en ahorro, con menos simulaciones y un resultado que un ingeniero pueda leer.",
    note: "objetivo",
  },
  why: {
    title: "Por qué ahora",
    lead: "Los agentes de código evolutivo ya funcionan. Falta llevarlos al control industrial.",
    items: [
      {
        name: "AlphaEvolve",
        claim: "Abrió el camino",
        text: "El agente de código evolutivo de DeepMind descubrió algoritmos nuevos en matemáticas y mejoró la infraestructura de Google.",
        source: "AlphaEvolve (DeepMind, 2025)",
      },
      {
        name: "CodeEvolve",
        claim: "El open source ya compite",
        text: "Iguala o supera a AlphaEvolve en 5 de 9 problemas de su benchmark.",
        source: "arXiv 2510.14150",
      },
      {
        name: "ShinkaEvolve",
        claim: "Aceptado en ICLR 2026",
        text: "Otro motor evolutivo de código abierto, aceptado en ICLR 2026.",
        source: "ShinkaEvolve (ICLR 2026)",
      },
      {
        name: "GoalEvolve / ArchAgent",
        claim: "Salta a la ingeniería",
        text: "Ya se aplica al diseño físico de chips (GoalEvolve) y a la arquitectura de computadores (prefetchers de datos).",
        source: "arXiv 2608.16733 · arXiv 2608.09874",
      },
    ],
    gap: {
      name: "El hueco",
      text: "Control industrial y energía, casi sin explorar.",
      slot: "aquí va CoolEvolve",
    },
  },
  stack: {
    title: "Arquitectura técnica",
    lead: "Piezas de código abierto alrededor de un evaluador propio.",
    hint: "Pasa el ratón o enfoca una pieza para ver su detalle.",
    nodes: {
      engine: {
        name: "Motor evolutivo",
        tool: "ShinkaEvolve, OpenEvolve o CodeEvolve (open source)",
        role: "Guarda la población de programas y elige a los padres de cada generación.",
      },
      llm: {
        name: "LLMs",
        tool: "API de Claude o Gemini; modelo abierto como opción",
        role: "Escriben cada variante del controlador a partir de los mejores programas.",
      },
      sim: {
        name: "Simulador",
        tool: "Sinergym + EnergyPlus, con interfaz Gymnasium (entorno de centro de datos de dos zonas)",
        role: "Simula la operación del centro de datos con cada controlador.",
      },
      evaluator: {
        name: "Evaluador",
        tool: "Propio: energía de refrigeración + penalización térmica + restricciones duras",
        role: "Puntúa cada controlador. Es la pieza crítica.",
      },
      baselines: {
        name: "Baselines",
        tool: "Control por defecto de Sinergym, PPO y SAC (Stable-Baselines3)",
        role: "La referencia contra la que se mide el resultado.",
      },
      tracking: {
        name: "Seguimiento",
        tool: "Git, GitHub y Weights & Biases",
        role: "Registro de versiones y de experimentos.",
      },
    },
    edges: {
      llmEngine: "variante",
      engineLlm: "padres + informe de errores",
      engineSim: "controlador",
      simEval: "episodio simulado",
      evalEngine: "puntuación",
      baseEval: "referencia",
      engineTrack: "registro",
    },
    principles: {
      title: "Principios del evaluador (la pieza crítica)",
      intro:
        "El agente optimiza lo que mide el evaluador, así que tiene que ser imposible de trampear:",
      items: [
        "Restricciones duras de temperatura: si se violan, el controlador queda descartado.",
        "Episodios de test ocultos que el agente nunca ve durante la evolución.",
        "Validación en climas y cargas no vistos.",
        "Ejecución en sandbox y límite de complejidad del código.",
        "Revisión manual del controlador ganador.",
      ],
      checked: "principio de diseño",
    },
  },
  metrics: {
    title: "Métricas de éxito",
    banner: "Objetivos, no resultados. Todavía no hay mediciones.",
    reading: "sin lectura",
    columns: { measures: "Qué mide", target: "Objetivo", status: "Estado" },
    items: [
      {
        name: "Ahorro de energía de refrigeración",
        measures: "Frente al control por defecto de Sinergym",
        target: "por definir",
        ref: "control por defecto",
        kind: "open",
      },
      {
        name: "Violaciones térmicas",
        measures: "Tiempo con temperatura fuera de rango",
        target: "No peor que el baseline",
        ref: "baseline",
        kind: "below",
      },
      {
        name: "Eficiencia muestral",
        measures: "Simulaciones necesarias frente a PPO y SAC",
        target: "Menos",
        ref: "PPO / SAC",
        kind: "below",
      },
      {
        name: "Generalización",
        measures: "Rendimiento en climas y cargas no vistos",
        target: "Sin caída grave",
        ref: "climas vistos",
        kind: "near",
      },
      {
        name: "Interpretabilidad",
        measures: "Tamaño y claridad del controlador final",
        target: "Legible por un ingeniero sin ayuda",
        ref: "revisión humana",
        kind: "check",
      },
    ],
  },
  roadmap: {
    title: "Hoja de ruta",
    here: "estamos aquí",
    planned: "previsto",
    phases: [
      {
        id: "F0",
        name: "Base técnica",
        dates: "Oct–nov 2026",
        what: "Python a fondo, reproducir un ejemplo de ShinkaEvolve y ejecutar Sinergym.",
      },
      {
        id: "F1",
        name: "MVP",
        dates: "Dic 2026–feb 2027",
        what: "Baselines (por defecto y PPO/SAC), primer controlador evolucionado y repo público.",
      },
      {
        id: "F2",
        name: "Rigor",
        dates: "Mar–jun 2027",
        what: "Tutor y cotutor, varios climas y cargas, competición actúaupm y post técnico.",
      },
      {
        id: "F3",
        name: "Paper",
        dates: "Jun–ago 2027",
        what: "Envío a un workshop de NeurIPS o ICLR y primeras charlas con operadores.",
      },
      {
        id: "F4",
        name: "Piloto",
        dates: "Sep–dic 2027",
        what: "Piloto con un gemelo digital real.",
      },
      {
        id: "F5",
        name: "TFG y lanzamiento",
        dates: "Ene–jun 2028",
        what: "Memoria, defensa y solicitud a Y Combinator.",
      },
    ],
  },
  vision: {
    title: "Visión: CoolEvolve Sites",
    tag: "concepto · fase 2",
    lead: "De enfriar centros de datos a crearlos.",
    text: "La IA necesita capacidad de cómputo más rápido de lo que se construyen centros de datos nuevos. Mientras, hay muchos edificios existentes infrautilizados.",
    steps: [
      {
        name: "Alta",
        text: "Empresas, inmobiliarias o particulares dan de alta su inmueble.",
      },
      {
        name: "Estructura",
        text: "La plataforma combina IA y cálculo estructural: capacidad de carga de los forjados para racks y vibraciones.",
      },
      {
        name: "Electricidad",
        text: "Potencia eléctrica disponible en el edificio.",
      },
      {
        name: "Retrofit",
        text: "Con ese análisis genera el plan de retrofit. El propietario gana dinero cediendo espacio y energía.",
      },
      {
        name: "Refrigeración",
        text: "Analiza las opciones de refrigeración y, una vez en marcha, CoolEvolve la controla.",
      },
    ],
    status: "Estado: idea, posterior al TFG.",
    figure: "Edificio isométrico ilustrativo: no representa un inmueble real",
    labels: {
      slab: "carga en forjados",
      power: "cuadros eléctricos",
      racks: "racks por planta",
      cooling: "refrigeración",
      vibration: "vibraciones",
    },
  },
  markets: {
    title: "Un motor, muchos mercados",
    phrase: "Cambias el evaluador, cambias de industria.",
    pick: "Elige un mercado",
    engine: "motor evolutivo",
    evaluatorSlot: "evaluador",
    output: "sale",
    codeNote: "Línea de ejemplo ilustrativa",
    items: [
      {
        id: "dc",
        name: "Centros de datos",
        text: "La primera aplicación: la refrigeración de centros de datos.",
        evaluator: "Sinergym + EnergyPlus",
        out: "controlador de refrigeración",
        code: "score = energia_refrigeracion(sim) + penalizacion_termica(sim)",
      },
      {
        id: "factory",
        name: "Fábrica",
        text: "Planificación de fábrica: heurísticas para secuenciar pedidos y máquinas.",
        evaluator: "simulación del taller",
        out: "heurística de secuenciación",
        code: "score = retrasos(plan) + tiempo_total(plan)",
      },
      {
        id: "process",
        name: "Procesos",
        text: "Control de procesos: lazos de control y consignas en plantas químicas o de alimentación.",
        evaluator: "simulador del proceso",
        out: "lazos y consignas",
        code: "score = error_consigna(planta) + energia(planta)",
      },
      {
        id: "grid",
        name: "Baterías",
        text: "Baterías y red: cuándo cargar, descargar y vender energía.",
        evaluator: "simulación de red y precios",
        out: "política de carga y venta",
        code: "score = -ingresos(bateria, precios)",
      },
      {
        id: "buildings",
        name: "Edificios",
        text: "Hospitales y oficinas, con benchmarks como BOPTEST o Sinergym.",
        evaluator: "BOPTEST o Sinergym",
        out: "controlador de climatización",
        code: "score = energia_hvac(edificio) + disconfort(edificio)",
      },
      {
        id: "robotics",
        name: "Robótica",
        text: "Políticas de movimiento evaluadas en MuJoCo.",
        evaluator: "MuJoCo",
        out: "política de movimiento",
        code: "score = -recompensa(mujoco.rollout(politica))",
      },
      {
        id: "trading",
        name: "Trading",
        text: "Estrategias con el backtest como evaluador.",
        evaluator: "backtest",
        out: "estrategia",
        code: "score = -rentabilidad(backtest(estrategia))",
      },
    ],
  },
  business: {
    title: "Modelo de negocio",
    tag: "planteamiento · aún sin clientes",
    steps: [
      {
        who: "El cliente aporta",
        text: "el gemelo digital (modelo EnergyPlus) de su centro de datos y datos de operación.",
      },
      {
        who: "CoolEvolve entrega",
        text: "un controlador en código, validado en simulación, con un informe de ahorro esperado.",
      },
      {
        who: "Cobro",
        text: "un porcentaje del ahorro verificado o una licencia anual.",
      },
    ],
    clientsLabel: "Clientes iniciales",
    clients:
      "Operadores de colocation, ingenierías de mantenimiento y fabricantes de sistemas de gestión de edificios.",
    expansionLabel: "Expansión",
    expansion: [
      "centros de datos",
      "hospitales y oficinas",
      "control de procesos",
      "planificación de fábrica",
    ],
    first: "primera parada",
  },
  risks: {
    title: "Riesgos y cómo se gestionan",
    lead: "Lo que puede salir mal, y el plan para cada caso.",
    mitigation: "Mitigación",
    items: [
      {
        risk: "Salto de la simulación a la realidad",
        mitigation:
          "El TFG vive en simulación; el piloto real es fase de startup. Validación en varios climas y cargas.",
      },
      {
        risk: "Trampas al evaluador",
        mitigation:
          "Restricciones duras, episodios de test ocultos y revisión manual del código ganador.",
      },
      {
        risk: "Coste de API",
        mitigation:
          "Modelos baratos para mutar y caros solo para refinar; episodios cortos para filtrar.",
      },
      {
        risk: "Simulación lenta",
        mitigation: "Paralelizar y empezar con episodios de semanas, no de años completos.",
      },
      {
        risk: "Que alguien lo publique antes",
        mitigation:
          "Velocidad, repo público pronto y diferenciación en rigor experimental y despliegue.",
      },
    ],
  },
  author: {
    title: "Sobre el autor",
    name: "Carlos López Parga",
    bio: "Estudiante de Ingeniería en Tecnologías Industriales en la ETSII-UPM (Madrid). Construye CoolEvolve como TFG con vocación de startup.",
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
    closing: "Primera misión: enfriar la infraestructura de la IA.",
    cold: "página fría",
  },
  sources: {
    title: "Fuentes",
    items: [
      "IEA, Energy and AI (2025): consumo de los centros de datos en 2024 y previsión para 2030.",
      "IIR (Instituto Internacional de Refrigeración): peso de la refrigeración en el consumo de un centro de datos.",
      "Technology Magazine (septiembre de 2025): recorte del 40 % en refrigeración de Google con IA.",
      "Sinergym (Jiménez-Raboso et al., 2021): simulador y entorno de centro de datos sobre EnergyPlus.",
      "Agile RL through Separable Neural Architecture (arXiv 2601.23225): coste de los episodios de entrenamiento, rango de la IEA y peso del HVAC.",
      "AlphaEvolve (DeepMind, 2025) · CodeEvolve (arXiv 2510.14150) · ShinkaEvolve (ICLR 2026).",
      "GoalEvolve (arXiv 2608.16733) · ArchAgent v2 (arXiv 2608.09874).",
    ],
    foot: "CoolEvolve · proyecto en desarrollo · las cifras describen el problema y los objetivos, no logros conseguidos.",
  },
};
