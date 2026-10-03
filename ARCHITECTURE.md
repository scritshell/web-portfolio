# SCRITSHELL — Architecture

Complementa `ASTRO_HANDOFF.md` (rutas, estructura de carpetas, secuencia de ejecución) — no se repite aquí. Este documento cubre lo que decide la implementación técnica.

## Stack

- Astro, salida estática por defecto
- `@astrojs/sitemap` — único plugin de build imprescindible
- `@astrojs/mdx` solo si algún proyecto/artículo necesita componentes embebidos dentro del contenido; si todo se queda en Markdown plano, no hace falta
- Fuentes auto-alojadas (`@fontsource/space-grotesk`, `@fontsource/manrope`, `@fontsource/dm-mono`)
- Sin framework de UI (React/Vue) — ninguna interacción actual lo requiere (compartir y progreso de lectura se resuelven con JS nativo)

## Qué se descarta del prototipo (no se traduce a Astro)

| Del ZIP | Motivo |
| --- | --- |
| `server/`, `dist/` (Express) | Backend de la plantilla Vite, sin relación con un sitio estático |
| `client/public/__manus__/*` | Instrumentación interna de Manus para sus propias previews |
| Snippet de analítica Umami en `index.html` | Variables de plantilla sin resolver (`%VITE_ANALYTICS_ENDPOINT%`); es boilerplate de la plataforma, no una decisión tomada. Si se quiere analítica respetuosa con privacidad, se decide aparte (Plausible/GoatCounter/Umami propio) |
| `client/src/components/ui/*` (shadcn/Radix) | Ninguno se usa en `Home.tsx` |
| `ManusDialog.tsx`, `Map.tsx` | No están importados en ningún sitio — código muerto de la plantilla base |
| ~25 dependencias de `package.json` (framer-motion, recharts, embla-carousel, cmdk, cada `@radix-ui/*`, axios, express, react-hook-form...) | Ninguna se usa en la página real |

## Lo que sí se conserva

Los tokens y clases documentados en `DESIGN_SYSTEM.md`, y la lógica condicional del panel de proyecto — formalizada como función pura en vez de cuatro plantillas distintas:

```ts
// src/lib/project-actions.ts
type ProjectAction = { label: string; href: string; variant: 'primary' | 'secondary' };

export function getProjectActions(project: {
  private: boolean;
  repository?: string;
  demo?: string;
}): ProjectAction[] {
  if (project.private) return [];
  const actions: ProjectAction[] = [];
  if (project.repository) actions.push({ label: 'GitHub', href: project.repository, variant: 'secondary' });
  if (project.demo) actions.push({ label: 'Live Demo', href: project.demo, variant: 'primary' });
  return actions;
}
```

Extensible sin rediseño: el día que exista un proyecto con vídeo o descarga, se añade un `if` más y, solo entonces, el campo correspondiente en el schema — no antes.

## Imágenes

`astro:assets` (helper `image()` dentro de Content Collections) para `cover`, `screenshots` y `ogImage` — optimización y formatos modernos automáticos, sin librería adicional.

## Despliegue

GitHub (repositorio + build) → **Cloudflare Pages** (hosting, HTTPS, dominio personalizado, y Pages Functions disponibles el día que el formulario de contacto necesite una función serverless). Decisión cerrada en la conversación y confirmada por `ASTRO_HANDOFF.md`; sustituye la idea inicial de GitHub Pages, que no soporta funciones serverless.
