import { Archivo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

/** Display: variable con ejes wdth y wght. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Texto. */
export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

/** Datos, código y telemetría. */
export const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
  preload: false, // Etiquetas pequeñas: deja el ancho de banda inicial al CSS y al titular.
});

export const fontVars = `${archivo.variable} ${plex.variable} ${jbmono.variable}`;
