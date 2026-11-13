import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";

/** Tema propio: el código es la solución, así que usa la mitad fría de la paleta. */
const theme: ThemeRegistration = {
  name: "coolevolve",
  type: "dark",
  colors: {
    "editor.background": "#0B111C",
    "editor.foreground": "#E9EEF2",
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#A9B6C4", fontStyle: "italic" } },
    { scope: ["keyword", "storage.type", "storage.modifier", "keyword.operator.logical"], settings: { foreground: "#3FD0E0" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call.generic"], settings: { foreground: "#DFF7FA" } },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#FFB238" } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#7FE0EA" } },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: "#C3CEDA" } },
    { scope: ["variable.parameter"], settings: { foreground: "#E9EEF2" } },
  ],
};

export interface Tok {
  c: string;
  color?: string;
  i?: boolean;
}
export type TokLine = Tok[];

let highlighter: Promise<Highlighter> | null = null;

function get(): Promise<Highlighter> {
  highlighter ??= createHighlighter({ themes: [theme], langs: ["python"] });
  return highlighter;
}

/** Resalta Python en build time y devuelve tokens serializables. */
export async function tokenize(code: string): Promise<TokLine[]> {
  const h = await get();
  const { tokens } = h.codeToTokens(code, { lang: "python", theme: "coolevolve" });
  return tokens.map((line) =>
    line.map((t) => ({
      c: t.content,
      color: t.color && t.color.toUpperCase() !== "#E9EEF2" ? t.color : undefined,
      i: t.fontStyle === 1 ? true : undefined,
    })),
  );
}
