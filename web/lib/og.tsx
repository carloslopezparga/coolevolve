import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Content } from "@/content/types";
import { hash2, rampHex } from "./thermal";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Se leen una vez al cargar el módulo: así la imagen se genera en el build.
const fonts = join(process.cwd(), "assets/fonts");
const archivo = await readFile(join(fonts, "ArchivoExpanded-ExtraBold.ttf"));
const mono = await readFile(join(fonts, "JetBrainsMono-Medium.ttf"));

const COLS = 7;
const ROWS = 9;
const CELL_W = 62;
const CELL_H = 68;
const GAP = 8;

/** Imagen Open Graph: el titular sobre un muro térmico a medio enfriar (ilustrativo). */
export async function ogImage(c: Content) {
  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const n = hash2(x + 1, y + 1);
      // El barrido enfría de izquierda a derecha: a la derecha sigue caliente.
      const d = (x + 0.5) / COLS + (y / ROWS) * 0.14;
      const heat = d < 0.36 ? 0.08 + n * 0.3 : d < 0.5 ? 0.42 + n * 0.25 : 0.68 + n * 0.32;
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{ width: CELL_W, height: CELL_H, marginRight: GAP, marginBottom: GAP, backgroundColor: rampHex(1 - heat) }}
        />,
      );
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#070B12",
          color: "#E9EEF2",
          fontFamily: "JetBrains Mono",
        }}
      >
        {/* Muro térmico, a la derecha */}
        <div
          style={{
            position: "absolute",
            left: 712,
            top: -14,
            width: COLS * (CELL_W + GAP),
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {cells}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 0 52px 64px", width: 700 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", width: 16, height: 16, backgroundColor: "#FF6A2B", marginRight: 14 }} />
              <div style={{ display: "flex", fontFamily: "Archivo", fontSize: 32 }}>CoolEvolve</div>
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 22, color: "#A9B6C4" }}>{c.meta.ogKicker}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo", fontSize: 88, lineHeight: 0.96, letterSpacing: -2.5 }}>
            {c.hero.headline.map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 21, color: "#A9B6C4" }}>
            <div
              style={{
                display: "flex",
                width: 300,
                height: 8,
                marginBottom: 14,
                backgroundImage: "linear-gradient(90deg, #E5481B, #FF6A2B, #FFB238, #7FE0EA, #3FD0E0, #DFF7FA)",
              }}
            />
            {c.meta.ogFoot}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: archivo, weight: 800, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
