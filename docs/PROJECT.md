# CoolEvolve

**Un agente de IA que descubre algoritmos de control industrial. Primera misión: enfriar la infraestructura de la IA.**

> **Estado:** en desarrollo (fase F0, noviembre de 2026). Proyecto de TFG del Grado en Ingeniería en Tecnologías Industriales (ETSII-UPM) con vocación de startup. Todavía no hay resultados publicados: las cifras de este documento describen el problema y los objetivos, no logros conseguidos.

---

## 1. La idea en una frase

CoolEvolve es un agente que **escribe, prueba y evoluciona controladores en código**, puntuados por un simulador, hasta superar al estándar industrial.

- **Primera aplicación:** la refrigeración de centros de datos.
- **Después:** cualquier sistema industrial que tenga simulador.

---

## 2. El problema: la IA tiene un problema de energía

| Dato | Cifra | Fuente |
|---|---|---|
| Consumo eléctrico de los centros de datos en 2024 | ~415 TWh, cerca del 1,5 % de la electricidad mundial | IEA, *Energy and AI* (2025) |
| Previsión para 2030 | ~945 TWh, algo más que todo Japón hoy | IEA, *Energy and AI* (2025) |
| Centros de datos optimizados para IA | Su consumo se multiplicará por más de 4 de aquí a 2030 | IEA, *Energy and AI* (2025) |
| Peso de la refrigeración | 30–55 % de la energía de un centro de datos (IIR); 7–30 % según la IEA, en función de la eficiencia | IIR · IEA |
| Precedente | Google recortó un 40 % la energía de refrigeración de sus centros de datos con IA | Technology Magazine (2025) |
| Siguiente mercado | La climatización (HVAC) supone más de la mitad de la demanda energética de los edificios en países desarrollados | arXiv 2601.23225 |

**Mensaje clave:** cada punto de ahorro en refrigeración es dinero recurrente para el operador y menos emisiones.

---

## 3. Cómo funciona: un bucle evolutivo

1. **Propone.** Un LLM escribe una variante del controlador en Python, mutando los mejores programas anteriores.
2. **Simula.** Sinergym + EnergyPlus simulan la operación del centro de datos con ese controlador.
3. **Puntúa.** Un evaluador mide la energía de refrigeración y penaliza las temperaturas fuera de rango.
4. **Selecciona.** Los mejores programas sobreviven en una base de datos y alimentan la siguiente generación.

**Resultado:** tras muchas generaciones, un controlador final en **código legible, auditable y desplegable** en el sistema de gestión del edificio.

### Pseudocódigo del bucle

```python
poblacion = [controlador_base]

for generacion in range(N):
    padres = seleccionar(poblacion, k=4)              # los mejores + diversidad
    hijo = llm.mutar(padres, contexto=informe_errores)
    resultado = simulador.ejecutar(hijo, episodio="semana_tipo")
    puntuacion = energia(resultado) + penalizacion_termica(resultado)
    if cumple_restricciones(resultado):
        poblacion.añadir(hijo, puntuacion)

mejor = validar_en_episodios_ocultos(top(poblacion))
```

### Ejemplo ilustrativo de evolución

> **Ojo:** es un ejemplo para explicar la idea, **no un resultado**.

Generación 0, control por consigna fija:

```python
def controller(obs):
    return {"cooling_setpoint": 24.0, "heating_setpoint": 18.0}
```

Generación N, ilustrativo:

```python
def controller(obs):
    t_out, load, t_in = obs["outdoor_temp"], obs["it_load"], obs["zone_temp"]

    # Aprovecha el aire exterior frío (free cooling)
    if t_out < 16 and t_in < 26:
        return {"cooling_setpoint": 27.0, "heating_setpoint": 18.0}

    # Anticipa picos de carga bajando la consigna con margen
    margin = 0.8 if load > 0.75 else 0.0
    return {"cooling_setpoint": round(25.5 - margin, 1), "heating_setpoint": 18.0}
```

---

## 4. El diferencial: código legible, no caja negra

| Criterio | Control estándar | RL (PPO / SAC) | **CoolEvolve** |
|---|---|---|---|
| Ahorro energético | Referencia | Alto en simulación | **Objetivo: igual o mejor que RL** |
| Interpretabilidad | Total | Caja negra | **Código legible** |
| Ensayos necesarios | Pocos | Miles de episodios, cada uno un año simulado | **Menos (a medir)** |
| Despliegue en sistemas existentes | Directo | Difícil | **Directo: es código** |
| Confianza del operador | Alta | Baja | **Alta: auditable** |

**Objetivo del TFG:** igualar o superar al RL en ahorro, con menos simulaciones y un resultado que un ingeniero pueda leer.

---

## 5. Por qué ahora

- **AlphaEvolve abrió el camino.** El agente de código evolutivo de DeepMind descubrió algoritmos nuevos en matemáticas y mejoró la infraestructura de Google.
- **El open source ya compite.** CodeEvolve iguala o supera a AlphaEvolve en 5 de 9 problemas de su benchmark. ShinkaEvolve fue aceptado en ICLR 2026.
- **Salta a la ingeniería.** Ya se aplica al diseño físico de chips (GoalEvolve) y a la arquitectura de computadores (prefetchers de datos).
- **El hueco:** control industrial y energía, casi sin explorar.

---

## 6. Arquitectura técnica

| Pieza | Herramienta |
|---|---|
| Motor evolutivo | ShinkaEvolve, OpenEvolve o CodeEvolve (open source) |
| Simulador | Sinergym + EnergyPlus, con interfaz Gymnasium (entorno de centro de datos de dos zonas) |
| Evaluador | Propio: energía de refrigeración + penalización térmica + restricciones duras |
| Baselines | Control por defecto de Sinergym, PPO y SAC (Stable-Baselines3) |
| LLMs | API de Claude o Gemini; modelo abierto como opción |
| Seguimiento | Git, GitHub y Weights & Biases |

### Principios del evaluador (la pieza crítica)

El agente optimiza lo que mide el evaluador, así que tiene que ser imposible de trampear:

- Restricciones duras de temperatura: si se violan, el controlador queda descartado.
- Episodios de test ocultos que el agente nunca ve durante la evolución.
- Validación en climas y cargas no vistos.
- Ejecución en sandbox y límite de complejidad del código.
- Revisión manual del controlador ganador.

---

## 7. Métricas de éxito

| Métrica | Qué mide | Objetivo |
|---|---|---|
| Ahorro de energía de refrigeración | Frente al control por defecto de Sinergym | [por definir] |
| Violaciones térmicas | Tiempo con temperatura fuera de rango | No peor que el baseline |
| Eficiencia muestral | Simulaciones necesarias frente a PPO y SAC | Menos |
| Generalización | Rendimiento en climas y cargas no vistos | Sin caída grave |
| Interpretabilidad | Tamaño y claridad del controlador final | Legible por un ingeniero sin ayuda |

---

## 8. Hoja de ruta

| Fase | Fechas | Qué |
|---|---|---|
| **F0 · Base técnica** *(ahora)* | Oct–nov 2026 | Python a fondo, reproducir un ejemplo de ShinkaEvolve y ejecutar Sinergym |
| **F1 · MVP** | Dic 2026–feb 2027 | Baselines (por defecto y PPO/SAC), primer controlador evolucionado y repo público |
| **F2 · Rigor** | Mar–jun 2027 | Tutor y cotutor, varios climas y cargas, competición actúaupm y post técnico |
| **F3 · Paper** | Jun–ago 2027 | Envío a un workshop de NeurIPS o ICLR y primeras charlas con operadores |
| **F4 · Piloto** | Sep–dic 2027 | Piloto con un gemelo digital real |
| **F5 · TFG y lanzamiento** | Ene–jun 2028 | Memoria, defensa y solicitud a Y Combinator |

---

## 9. Visión: CoolEvolve Sites (fase 2, concepto)

**De enfriar centros de datos a crearlos.** La IA necesita capacidad de cómputo más rápido de lo que se construyen centros de datos nuevos. Mientras, hay muchos edificios existentes infrautilizados.

**La idea:**

- Empresas, inmobiliarias o particulares dan de alta su inmueble.
- La plataforma combina IA y cálculo estructural para analizar si puede alojar computación:
  - capacidad de carga de los forjados para racks;
  - potencia eléctrica disponible;
  - opciones de refrigeración;
  - vibraciones.
- Con eso genera el plan de retrofit.
- El propietario gana dinero cediendo espacio y energía.
- Una vez en marcha, CoolEvolve controla la refrigeración.

**Estado:** idea, posterior al TFG.

---

## 10. Un motor, muchos mercados

Cambias el evaluador, cambias de industria:

- **Planificación de fábrica:** heurísticas para secuenciar pedidos y máquinas.
- **Control de procesos:** lazos de control y consignas en plantas químicas o de alimentación.
- **Baterías y red:** cuándo cargar, descargar y vender energía.
- **Edificios:** hospitales y oficinas, con benchmarks como BOPTEST o Sinergym.
- **Robótica:** políticas de movimiento evaluadas en MuJoCo.
- **Trading:** estrategias con el backtest como evaluador.

---

## 11. Modelo de negocio

1. **El cliente aporta** el gemelo digital (modelo EnergyPlus) de su centro de datos y datos de operación.
2. **CoolEvolve entrega** un controlador en código, validado en simulación, con un informe de ahorro esperado.
3. **Cobro:** un porcentaje del ahorro verificado o una licencia anual.

**Clientes iniciales:** operadores de colocation, ingenierías de mantenimiento y fabricantes de sistemas de gestión de edificios.

**Expansión:** centros de datos → hospitales y oficinas → control de procesos → planificación de fábrica.

---

## 12. Riesgos y cómo se gestionan

| Riesgo | Mitigación |
|---|---|
| Salto de la simulación a la realidad | El TFG vive en simulación; el piloto real es fase de startup. Validación en varios climas y cargas |
| Trampas al evaluador | Restricciones duras, episodios de test ocultos y revisión manual del código ganador |
| Coste de API | Modelos baratos para mutar y caros solo para refinar; episodios cortos para filtrar |
| Simulación lenta | Paralelizar y empezar con episodios de semanas, no de años completos |
| Que alguien lo publique antes | Velocidad, repo público pronto y diferenciación en rigor experimental y despliegue |

---

## 13. Sobre el autor

**Carlos López Parga**, estudiante de Ingeniería en Tecnologías Industriales en la ETSII-UPM (Madrid). Construye CoolEvolve como TFG con vocación de startup.

- GitHub: [github.com/carloslopezparga](https://github.com/carloslopezparga)
- LinkedIn: [linkedin.com/in/carloslopezparga](https://linkedin.com/in/carloslopezparga)
- Email: [opcional]

---

## 14. Fuentes

- IEA, *Energy and AI* (2025): consumo de los centros de datos en 2024 y previsión para 2030.
- IIR (Instituto Internacional de Refrigeración): peso de la refrigeración en el consumo de un centro de datos.
- Technology Magazine (septiembre de 2025): recorte del 40 % en refrigeración de Google con IA.
- Sinergym (Jiménez-Raboso et al., 2021): simulador y entorno de centro de datos sobre EnergyPlus.
- *Agile RL through Separable Neural Architecture* (arXiv 2601.23225): coste de los episodios de entrenamiento, rango de la IEA y peso del HVAC.
- AlphaEvolve (DeepMind, 2025) · CodeEvolve (arXiv 2510.14150) · ShinkaEvolve (ICLR 2026).
- GoalEvolve (arXiv 2608.16733) · ArchAgent v2 (arXiv 2608.09874).
