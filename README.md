# CoolEvolve

![status: en desarrollo](https://img.shields.io/badge/status-en%20desarrollo-FF6A2B?style=flat-square&labelColor=070B12)
![fase: F0](https://img.shields.io/badge/fase-F0-3FD0E0?style=flat-square&labelColor=070B12)

**Un agente de IA que descubre algoritmos de control industrial. Primera misión: enfriar la infraestructura de la IA.**

**Web del proyecto:** pendiente de despliegue en Vercel (ver [Despliegue](#despliegue)).

> **Estado:** en desarrollo (fase F0, noviembre de 2026). Proyecto de TFG del Grado en Ingeniería en Tecnologías Industriales (ETSII-UPM) con vocación de startup. Todavía no hay resultados publicados: las cifras de este repositorio describen el problema y los objetivos, no logros conseguidos.

## Resumen

CoolEvolve es un agente que **escribe, prueba y evoluciona controladores en código**, puntuados por un simulador, hasta superar al estándar industrial.

- **Primera aplicación:** la refrigeración de centros de datos.
- **Después:** cualquier sistema industrial que tenga simulador.

El resultado no es una red neuronal opaca: es un controlador en **código legible, auditable y desplegable** en el sistema de gestión del edificio.

## Cómo funciona

Un bucle evolutivo de cuatro pasos:

1. **Propone.** Un LLM escribe una variante del controlador en Python, mutando los mejores programas anteriores.
2. **Simula.** Sinergym + EnergyPlus simulan la operación del centro de datos con ese controlador.
3. **Puntúa.** Un evaluador mide la energía de refrigeración y penaliza las temperaturas fuera de rango.
4. **Selecciona.** Los mejores programas sobreviven en una base de datos y alimentan la siguiente generación.

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

## Hoja de ruta

| Fase | Fechas | Qué |
|---|---|---|
| **F0 · Base técnica** *(ahora)* | Oct–nov 2026 | Python a fondo, reproducir un ejemplo de ShinkaEvolve y ejecutar Sinergym |
| **F1 · MVP** | Dic 2026–feb 2027 | Baselines (por defecto y PPO/SAC), primer controlador evolucionado y repo público |
| **F2 · Rigor** | Mar–jun 2027 | Tutor y cotutor, varios climas y cargas, competición actúaupm y post técnico |
| **F3 · Paper** | Jun–ago 2027 | Envío a un workshop de NeurIPS o ICLR y primeras charlas con operadores |
| **F4 · Piloto** | Sep–dic 2027 | Piloto con un gemelo digital real |
| **F5 · TFG y lanzamiento** | Ene–jun 2028 | Memoria, defensa y solicitud a Y Combinator |

## Estructura del repositorio

```
coolevolve/
├── README.md          ← este archivo
├── docs/
│   └── PROJECT.md     ← documento completo del proyecto
├── engine/            ← aquí vivirá el motor evolutivo (fase F1)
└── web/               ← la web del proyecto (Next.js)
```

El documento completo, con el problema, la arquitectura, las métricas, el modelo de negocio, los riesgos y las fuentes, está en [`docs/PROJECT.md`](docs/PROJECT.md).

## La web

Vive en [`web/`](web/). Es estática (Next.js, sin backend) y todo su texto sale de `docs/PROJECT.md`, guardado en `web/content/es.ts` y `web/content/en.ts`.

```bash
cd web
npm install
npm run dev
```

### Despliegue

En Vercel: **Add New → Project**, importar `coolevolve`, **Root Directory: `web`** y **Deploy**. A partir de ahí, cada push a `main` se despliega solo.

## Autor

**Carlos López Parga**, estudiante de Ingeniería en Tecnologías Industriales en la ETSII-UPM (Madrid).

- GitHub: [github.com/carloslopezparga](https://github.com/carloslopezparga)
- LinkedIn: [linkedin.com/in/carloslopezparga](https://linkedin.com/in/carloslopezparga)
