import type { ReactNode } from "react";
import { fontVars } from "@/app/fonts";

/** Documento raíz compartido por las dos versiones de idioma. */
export function Shell({ lang, children }: { lang: "es" | "en"; children: ReactNode }) {
  return (
    <html lang={lang} className={`${fontVars} js-off antialiased`} suppressHydrationWarning>
      <body>
        {/* Marca que hay JS antes del primer pintado (animaciones de entrada). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.replace('js-off','js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
