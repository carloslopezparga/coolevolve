"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Scroll suave con Lenis. Desactivado con `prefers-reduced-motion`. */
export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const sync = () => {
      if (mq.matches) {
        lenis?.destroy();
        lenis = null;
      } else if (!lenis) {
        lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.11 });
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      lenis?.destroy();
    };
  }, []);

  return null;
}
