"use client";

import { useEffect, useRef } from "react";

/** Retícula de cámara termográfica que acompaña al cursor (solo puntero fino y con movimiento). */
export function Reticle() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!ok.matches) return;

    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    let shown = false;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      el.dataset.on = t?.closest?.("a,button,summary,[role=button],[role=radio],[tabindex]") ? "1" : "0";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="group pointer-events-none fixed left-0 top-0 z-[70] opacity-0 transition-opacity duration-200"
    >
      <div className="relative -ml-4 -mt-4 size-8 text-accent transition-transform duration-200 group-data-[on=1]:scale-150">
        <span className="absolute left-0 top-1/2 h-px w-2.5 bg-current" />
        <span className="absolute right-0 top-1/2 h-px w-2.5 bg-current" />
        <span className="absolute left-1/2 top-0 h-2.5 w-px bg-current" />
        <span className="absolute bottom-0 left-1/2 h-2.5 w-px bg-current" />
      </div>
    </div>
  );
}
