"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { REPO_URL } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";

interface Props {
  locale: "es" | "en";
  navLabel: string;
  items: { id: string; label: string }[];
  all: { id: string; num: string; label: string }[];
  menu: string;
  close: string;
  github: string;
  langSwitch: string;
}

/** Barra mínima: se oculta al bajar y vuelve al subir. */
export function Nav({ locale, navLabel, items, all, menu, close, github, langSwitch }: Props) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 160);
        lastY.current = y;
      }
      setSolid(y > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  const show = !hidden || open;
  const home = locale === "es" ? "/" : "/en";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[transform,background-color,border-color] duration-300 ease-machine focus-within:translate-y-0 ${
        show ? "translate-y-0" : "-translate-y-full"
      } ${solid || open ? "border-rule bg-ink-950" : "border-transparent bg-transparent"}`}
    >
      <div className="flex h-(--nav-h) items-center gap-5 px-(--gutter) lg:pr-52">
        <Link href={home} className="flex-none" aria-label="CoolEvolve">
          <Logo />
        </Link>

        <nav aria-label={navLabel} className="hidden min-w-0 flex-1 xl:block">
          <ul className="mono flex items-center gap-5">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  className="text-dim transition-colors hover:text-fg focus-visible:text-fg"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mono ml-auto flex items-center gap-4">
          <div ref={menuRef} className="relative xl:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-index"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 cursor-pointer items-center gap-2 border border-rule px-2.5 text-fg"
            >
              <span aria-hidden="true" className="text-accent">
                {open ? "×" : "§"}
              </span>
              {open ? close : menu}
            </button>
            {open && (
              <nav
                id="site-index"
                aria-label={navLabel}
                className="absolute right-0 top-11 max-h-[70vh] w-64 overflow-y-auto border border-rule bg-ink-950 py-2"
                data-lenis-prevent
              >
                <ul>
                  {all.map((it) => (
                    <li key={it.id}>
                      <a
                        href={`#${it.id}`}
                        onClick={() => setOpen(false)}
                        className="flex gap-3 px-3 py-1.5 text-fg hover:bg-ink-800"
                      >
                        <span className="text-accent">{it.num}</span>
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div role="group" aria-label={langSwitch} className="flex items-center border border-rule">
            <Link
              href="/"
              hrefLang="es"
              lang="es"
              prefetch={false}
              aria-current={locale === "es" ? "page" : undefined}
              className={`flex h-9 items-center px-2 ${locale === "es" ? "bg-ink-800 text-fg" : "text-dim hover:text-fg"}`}
            >
              <span className="sr-only">Español</span>
              <span aria-hidden="true">ES</span>
            </Link>
            <Link
              href="/en"
              hrefLang="en"
              lang="en"
              prefetch={false}
              aria-current={locale === "en" ? "page" : undefined}
              className={`flex h-9 items-center border-l border-rule px-2 ${locale === "en" ? "bg-ink-800 text-fg" : "text-dim hover:text-fg"}`}
            >
              <span className="sr-only">English</span>
              <span aria-hidden="true">EN</span>
            </Link>
          </div>

          <a href={REPO_URL} className="link hidden sm:inline" rel="noopener">
            {github}
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
