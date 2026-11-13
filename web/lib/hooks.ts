"use client";

import { useSyncExternalStore } from "react";

export const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
export const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

function subscribe(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** Media query reactiva. En servidor (y antes de hidratar) devuelve `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** `true` cuando las secciones fijas están activas (escritorio y con movimiento). */
export function usePinned(): boolean {
  return useMediaQuery(PIN_QUERY);
}

/** `true` cuando el usuario acepta movimiento. */
export function useMotionOk(): boolean {
  return useMediaQuery(MOTION_QUERY);
}
