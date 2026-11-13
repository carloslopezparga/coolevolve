"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

interface Options {
  /**
   * `pin`: el elemento es una pista alta con contenido `sticky`; el progreso
   * recorre toda la pista. `flow`: el elemento cruza la pantalla en flujo normal.
   */
  mode: "pin" | "flow";
  /** Solo `flow`: fracción de la altura de pantalla donde empieza y acaba. */
  from?: number;
  to?: number;
  /** Si es `false`, no escucha el scroll y fija el progreso en 1 (estado final). */
  enabled?: boolean;
}

/**
 * Progreso (0–1) de un elemento respecto al scroll, con Motion como fuente.
 * `cb` solo se llama cuando el valor cambia.
 */
export function useElementProgress(
  ref: RefObject<HTMLElement | null>,
  cb: (p: number) => void,
  { mode, from = 0.85, to = 0.25, enabled = true }: Options,
) {
  const { scrollY } = useScroll();
  const last = useRef(-1);
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  });

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    let p = 1;
    if (enabled) {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      p =
        mode === "pin"
          ? clamp(-r.top / Math.max(1, r.height - vh))
          : clamp((from * vh - r.top) / Math.max(1, (from - to) * vh));
    }
    if (p !== last.current) {
      last.current = p;
      cbRef.current(p);
    }
  };

  useMotionValueEvent(scrollY, "change", measure);

  useEffect(() => {
    last.current = -1;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, enabled, from, to]);
}

/** Tramo [a, b] de un progreso, reescalado a 0–1. */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * Encoge el contenido de una sección fija para que quepa en la altura de
 * pantalla (portátiles bajos). Solo actúa con el pin activo.
 */
export function useFitZoom(ref: RefObject<HTMLElement | null>, enabled: boolean, reserve = 40) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.style.zoom = "";
      return;
    }
    const fit = () => {
      el.style.zoom = "1";
      const natural = el.getBoundingClientRect().height;
      const z = Math.max(0.68, Math.min(1, (window.innerHeight - reserve) / Math.max(1, natural)));
      el.style.zoom = z < 0.995 ? z.toFixed(3) : "";
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      window.removeEventListener("resize", fit);
      el.style.zoom = "";
    };
  }, [ref, enabled, reserve]);
}
