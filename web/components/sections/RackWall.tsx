"use client";

import { useEffect, useRef } from "react";
import { hash2, ramp } from "@/lib/thermal";

const COLS = 12;
const ROWS = 8;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_front;
uniform float u_cool0;
uniform float u_cool1;
const vec2 GRID = vec2(${COLS}.0, ${ROWS}.0);

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }

// Rampa térmica del proyecto: 0 = frío, 1 = caliente. Mezcla en luz lineal
// para que la zona templada salga neutra y no verdosa.
vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
vec3 ramp(float t){
  vec3 c0 = lin(vec3(0.875, 0.969, 0.980));
  vec3 c1 = lin(vec3(0.247, 0.816, 0.878));
  vec3 c2 = lin(vec3(0.498, 0.878, 0.918));
  vec3 c3 = lin(vec3(1.000, 0.698, 0.220));
  vec3 c4 = lin(vec3(1.000, 0.416, 0.169));
  vec3 c5 = lin(vec3(0.898, 0.282, 0.106));
  t = clamp(t, 0.0, 1.0) * 5.0;
  vec3 c;
  if (t < 1.0) c = mix(c0, c1, t);
  else if (t < 2.0) c = mix(c1, c2, t - 1.0);
  else if (t < 3.0) c = mix(c2, c3, t - 2.0);
  else if (t < 4.0) c = mix(c3, c4, t - 3.0);
  else c = mix(c4, c5, t - 4.0);
  return pow(c, vec3(1.0 / 2.2));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res; uv.y = 1.0 - uv.y;
  vec2 g = uv * GRID; vec2 id = floor(g); vec2 f = fract(g);
  vec2 c = (id + 0.5) / GRID;

  // Calor por celda: ruido que fluye + parpadeo.
  float n = fbm(c * vec2(3.2, 2.4) + vec2(u_time * 0.06, -u_time * 0.045));
  float n2 = hash(id + 3.7);
  float flick = (noise(id * 5.1 + u_time * 0.9) - 0.5) * 0.16;
  float heat = clamp(0.76 + (n - 0.5) * 0.95 + flick, 0.58, 1.0);

  // Barrido del agente: enfría un poco lo que deja atrás.
  float d = c.x * 0.86 + (1.0 - c.y) * 0.14;
  float behind = 1.0 - smoothstep(u_front - 0.035, u_front + 0.035, d);
  float cool = pow(mix(u_cool0, u_cool1, behind), 1.5);
  heat = max(heat - cool * (0.60 + 0.36 * n2), 0.04 + 0.12 * n2);

  vec3 col = ramp(heat);
  float units = 0.80 + 0.20 * step(0.24, fract(f.y * 6.0));
  col *= units * (0.86 + 0.14 * (1.0 - f.y));

  float edge = exp(-pow((d - u_front) * 16.0, 2.0)) * step(-0.1, u_front) * step(u_front, 1.1);
  col = mix(col, vec3(0.875, 0.969, 0.980), edge * 0.55);

  vec2 m = vec2(0.075, 0.06);
  vec2 aa = GRID / u_res;
  float inside = smoothstep(m.x - aa.x, m.x + aa.x, f.x) * smoothstep(m.x - aa.x, m.x + aa.x, 1.0 - f.x)
               * smoothstep(m.y - aa.y, m.y + aa.y, f.y) * smoothstep(m.y - aa.y, m.y + aa.y, 1.0 - f.y);
  vec3 bg = vec3(0.027, 0.043, 0.071) + ramp(heat) * 0.07 * heat;
  gl_FragColor = vec4(mix(bg, col, inside), 1.0);
}`;

/* Ciclo: 7 barridos (6 generaciones cada uno), pausa en frío y vuelta a caliente. */
const SWEEPS = 7;
const TRAVEL = 1.7;
const REST = 1.0;
const HOLD = 2.4;
const RESET = 1.5;
const SWEEP = TRAVEL + REST;
const GEN_PER_SWEEP = 6;
const CYCLE = SWEEPS * SWEEP + HOLD + RESET;

function state(time: number) {
  const t = time % CYCLE;
  if (t < SWEEPS * SWEEP) {
    const k = Math.floor(t / SWEEP);
    const tr = Math.min((t - k * SWEEP) / TRAVEL, 1);
    const e = tr * tr * (3 - 2 * tr);
    return {
      front: -0.15 + e * 1.3,
      cool0: k / SWEEPS,
      cool1: (k + 1) / SWEEPS,
      gen: Math.round((k + e) * GEN_PER_SWEEP),
      sweeping: tr < 1,
    };
  }
  const t2 = t - SWEEPS * SWEEP;
  if (t2 < HOLD) return { front: 2, cool0: 1, cool1: 1, gen: SWEEPS * GEN_PER_SWEEP, sweeping: false };
  const r = (t2 - HOLD) / RESET;
  return {
    front: 2,
    cool0: 1 - r,
    cool1: 1 - r,
    gen: Math.round(SWEEPS * GEN_PER_SWEEP * (1 - r)),
    sweeping: false,
  };
}

/** Fotograma fijo para `prefers-reduced-motion`: el barrido a medio camino. */
const STILL = { time: 12.0, front: 0.46, cool0: 0.3, cool1: 0.9, gen: 21 };

const pad = (n: number) => String(n).padStart(4, "0");

/** Muro estático de reserva (sin WebGL o antes de que arranque el shader). */
function StaticWall() {
  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const d = ((x + 0.5) / COLS) * 0.86 + (1 - (y + 0.5) / ROWS) * 0.14;
      const n = hash2(x, y);
      const cooled = d < STILL.front ? STILL.cool1 : STILL.cool0;
      const heat = Math.max(
        0.62 + n * 0.38 - Math.pow(cooled, 1.5) * (0.6 + 0.36 * hash2(y, x)),
        0.05 + 0.12 * n,
      );
      cells.push(
        <rect key={`${x}-${y}`} x={x + 0.075} y={y + 0.06} width={0.85} height={0.88} fill={ramp(1 - heat)} />,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      {cells}
    </svg>
  );
}

interface Props {
  genLabel: string;
  cota: string;
  agent: string;
  caption: string;
}

/** Muro de racks 12×8 pintado por un fragment shader propio. Visualización ilustrativa. */
export function RackWall({ genLabel, cota, agent, caption }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const genRef = useRef<HTMLSpanElement | null>(null);
  const agentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gl: WebGLRenderingContext | null = null;
    let raf = 0;
    let visible = true;
    let started = false;
    let t0 = 0;
    let lastGen = -1;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;

    const setGen = (g: number, sweeping: boolean) => {
      if (g !== lastGen && genRef.current) {
        lastGen = g;
        genRef.current.textContent = pad(g);
      }
      if (agentRef.current) agentRef.current.style.opacity = sweeping ? "1" : "0.35";
    };

    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(box.clientWidth * dpr));
      const h = Math.max(1, Math.round(box.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (time: number, front: number, cool0: number, cool1: number) => {
      if (!gl) return;
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.front, front);
      gl.uniform1f(uniforms.cool0, cool0);
      gl.uniform1f(uniforms.cool1, cool1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const still = () => {
      resize();
      draw(STILL.time, STILL.front, STILL.cool0, STILL.cool1);
      setGen(STILL.gen, false);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || reduce.matches) return;
      if (!t0) t0 = now;
      const time = (now - t0) / 1000;
      const s = state(time);
      draw(time + 3, s.front, s.cool0, s.cool1);
      setGen(s.gen, s.sweeping);
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (!gl) return;
      if (reduce.matches) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        still();
      } else if (!raf && visible) {
        raf = requestAnimationFrame(frame);
      }
    };

    const init = () => {
      if (started) return;
      started = true;
      try {
        gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
      } catch {
        gl = null;
      }
      if (!gl) return; // Se queda el muro estático.

      const compile = (type: number, src: string) => {
        const sh = gl!.createShader(type)!;
        gl!.shaderSource(sh, src);
        gl!.compileShader(sh);
        return gl!.getShaderParameter(sh, gl!.COMPILE_STATUS) ? sh : null;
      };
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) {
        gl = null;
        return;
      }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl = null;
        return;
      }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uniforms = {
        res: gl.getUniformLocation(prog, "u_res"),
        time: gl.getUniformLocation(prog, "u_time"),
        front: gl.getUniformLocation(prog, "u_front"),
        cool0: gl.getUniformLocation(prog, "u_cool0"),
        cool1: gl.getUniformLocation(prog, "u_cool1"),
      };

      resize();
      still();
      canvas.style.opacity = "1";

      ro = new ResizeObserver(() => {
        resize();
        if (reduce.matches || !raf) still();
      });
      ro.observe(box);

      // El canvas se pausa fuera de pantalla.
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        play();
      });
      io.observe(box);
      reduce.addEventListener("change", play);
      play();
    };

    // El shader arranca cuando el navegador está libre: el LCP es el titular.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(init, { timeout: 1200 })
      : window.setTimeout(init, 300);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      reduce.removeEventListener("change", play);
    };
  }, []);

  return (
    <figure className="relative">
      <div className="mono mb-2 flex items-end justify-between gap-4 text-dim lg:pr-(--gutter)" aria-hidden="true">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-px bg-rule" />
          {cota}
          <span className="inline-block h-px w-10 bg-rule" />
        </span>
        <span className="text-fg">
          {genLabel}{" "}
          <span ref={genRef} className="tabular-nums text-accent">
            {pad(STILL.gen)}
          </span>
        </span>
      </div>
      <div
        ref={boxRef}
        className="crop relative aspect-4/3 overflow-hidden border border-rule bg-ink-900 lg:aspect-auto lg:h-[min(62svh,40rem)]"
      >
        <StaticWall />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 size-full opacity-0 transition-opacity duration-700"
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 lg:pr-(--gutter)">
        <span className="chip chip-dash">{caption}</span>
        <span ref={agentRef} className="mono text-dim transition-opacity duration-300" aria-hidden="true">
          {agent} <span className="text-accent">▸</span>
        </span>
      </figcaption>
    </figure>
  );
}
