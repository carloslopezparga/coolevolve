# web

La web de CoolEvolve: una página de un solo scroll que se enfría mientras lees.

- **Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, Motion, Lenis, un fragment shader WebGL propio y Shiki en build time.
- **Contenido:** `content/es.ts` y `content/en.ts`. Los componentes no llevan texto propio.
- **Rutas:** `/` en español y `/en` en inglés.
- **Tokens:** colores y tipografía como variables CSS en `app/globals.css`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Notas

- Todo lo que no es dato real lleva una etiqueta visible de «ilustrativo».
- Con `prefers-reduced-motion` se desactivan el scroll suave, las secciones fijas y el shader animado.
- Las fuentes de `assets/fonts/` (Archivo y JetBrains Mono, licencia SIL OFL 1.1) solo se usan para generar la imagen Open Graph.
