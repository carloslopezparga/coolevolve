/** Rampa térmica del proyecto, de caliente (0) a frío (1). */
export const RAMP = ["#E5481B", "#FF6A2B", "#FFB238", "#7FE0EA", "#3FD0E0", "#DFF7FA"] as const;

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mezcla en luz lineal: la zona templada sale neutra en vez de verdosa. */
function mix(a: RGB, b: RGB, t: number): RGB {
  const ch = (x: number, y: number) => {
    const lx = Math.pow(x / 255, 2.2);
    const ly = Math.pow(y / 255, 2.2);
    return Math.pow(lx + (ly - lx) * t, 1 / 2.2) * 255;
  };
  return [ch(a[0], b[0]), ch(a[1], b[1]), ch(a[2], b[2])];
}

function toCss([r, g, b]: RGB): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

function sample(stops: readonly (readonly [number, string])[], t: number): RGB {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 1; i < stops.length; i++) {
    const [p1, c1] = stops[i];
    const [p0, c0] = stops[i - 1];
    if (x <= p1) return mix(hexToRgb(c0), hexToRgb(c1), p1 === p0 ? 0 : (x - p0) / (p1 - p0));
  }
  return hexToRgb(stops[stops.length - 1][1]);
}

const RAMP_STOPS = RAMP.map((c, i) => [i / (RAMP.length - 1), c] as const);

/** Color de la rampa completa: 0 = más caliente, 1 = más frío. */
export function ramp(t: number): string {
  return toCss(sample(RAMP_STOPS, t));
}

/**
 * Acento global según el progreso de scroll (0–1).
 * Se queda en caliente durante el problema y llega al frío hacia la solución.
 */
const ACCENT_STOPS = [
  [0, "#FF6A2B"],
  [0.16, "#FF6A2B"],
  [0.4, "#FFB238"],
  [0.58, "#7FE0EA"],
  [0.78, "#3FD0E0"],
  [1, "#3FD0E0"],
] as const;

export function accentAt(p: number): string {
  return toCss(sample(ACCENT_STOPS, p));
}

/** Color del pulso del bucle: de caliente a frío sin pasar por el hielo. */
const PULSE_STOPS = [
  [0, "#FF6A2B"],
  [0.4, "#FFB238"],
  [0.72, "#7FE0EA"],
  [1, "#3FD0E0"],
] as const;

export function pulseAt(t: number): string {
  return toCss(sample(PULSE_STOPS, t));
}

/** Temperatura decorativa de la página: 41,0 °C arriba, 22,0 °C abajo. */
export const T_HOT = 41;
export const T_COLD = 22;

export function pageTemp(p: number, locale: string): string {
  const t = T_HOT - (T_HOT - T_COLD) * Math.min(1, Math.max(0, p));
  const s = t.toFixed(1);
  return `${locale === "es" ? s.replace(".", ",") : s} °C`;
}

/** Ruido determinista para el muro estático (sin WebGL). */
export function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
