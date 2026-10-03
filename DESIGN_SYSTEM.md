# SCRITSHELL — Design System

Identidad: **Signal Observatory** (la filosofía completa vive en `ideas.md`, no se repite aquí). Este documento son los valores implementables.

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--inky` | `#090914` | Fondo base |
| `--pearl` | `#F0EDE6` | Texto principal |
| `--muted` | `#A9A5B7` | Texto secundario |
| `--orbital` | `#7D8CFF` | Acento único — estados activos, coordenadas, acción primaria. No se usa suelto como decoración. |
| `--border` | `oklch(0.9 0.03 275 / 16%)` | Borde de panel de cristal |

### Paleta de acento por proyecto (arte de respaldo)

Cuando un proyecto no tiene `cover` todavía, se renderiza un fondo procedural según `accent`:

| accent | Colores |
| --- | --- |
| `blue` (por defecto) | `#9CA8FF → #5260B6` sobre `#101020` |
| `violet` | `#B89CFF → #5A3F8C` sobre `#14101F` — **nuevo**, ver nota |
| `rose` | `#D39BD9 → #684472` sobre `#101020` |
| `teal` | `#86D3C2 → #34766E` sobre `#0F1920` |
| `gold` | `#F2C481 → #7C5E3A` sobre `#181310` |
| `amber` | `#E6C38F → #725540` sobre `#16120F` |

> **Corrección respecto al prototipo:** los datos de Manus usaban 6 valores de `hue` (`blue`, `violet`, `rose`, `amber`, `teal`, `gold`) pero el CSS solo definía 4 variantes reales. Los proyectos `blue` y `violet` caían en el mismo degradado, indistinguibles. Aquí se define `violet` como variante propia; `blue` es el degradado base sin modificador.

## Tipografía

| Rol | Fuente | Uso |
| --- | --- | --- |
| Display | Space Grotesk 400–700 | Titulares, marca |
| Cuerpo | Manrope 400–600 | Texto de lectura |
| Mono | DM Mono 400–500 | Metadatos, coordenadas, chips de tecnología |

**Cambio respecto al prototipo:** auto-alojar las 3 familias (`@fontsource/*` o WOFF2 propios) en vez de `fonts.googleapis.com`, para evitar la petición externa — alineado con el principio de rendimiento de `ASTRO_HANDOFF.md`.

## Marca (resuelto)

Hero y wordmark ya recibidos en `scritshell-portable-assets.zip`:

- `scritshell-signal-observatory-hero.png` (2560×1440) → `src/assets/images/`. Original recuperado, no es una recreación.
- `scritshell-orbital-mark.svg` (viewBox 512×512, ya usa `#7D8CFF`/`#F0EDE6`) → `public/icons/`. **Nota:** la ruta `/manus-storage/…orbital-mark…png` que usaba el prototipo apuntaba a una generación fallida — nunca fue una imagen real. Este SVG es una reconstrucción vectorial fiel del concepto aprobado (dos arcos orbitales segmentados + núcleo central), no un archivo "recuperado". Sirve directamente como fuente para `favicon.svg`, `favicon.ico`, apple-touch-icon e íconos de manifest — eso se deriva en la Fase 3 del roadmap, no hace falta generarlo ya.

## Patrones reutilizables (clase actual → futuro componente Astro)

| Patrón CSS | Futuro componente | Notas |
| --- | --- | --- |
| `.site-rail` + `.rail-nav` | `SiteNav.astro` | Resaltado activo por **ruta actual**, no por scroll (ya no es una sola página) |
| `.lens-panel` | clase compartida | Único tratamiento de cristal — nunca contenedor por defecto |
| `.section-index` | parte de las secciones | Etiqueta numerada tipo "03 · PROJECT ATLAS" |
| `.project-atlas` / `.project-node` | `ProjectAtlas.astro` | Índice de `/projects` |
| `.project-detail` | plantilla de `/projects/[slug].astro` | Pasa de panel expandible a página completa |
| `.tech-row` | chip list reutilizable | Detalle de proyecto y `tags` de artículos |
| `.procedural-art` | fallback de imagen | Ver paleta de acento |
| `.micro-player` | isla mínima | Sin autoplay, ya acordado |
| `.notes-stream` / `.note` | listado de `/blog` | El prototipo solo mostraba 3 notas de ejemplo; en Astro es un índice real |
| `.contact-form` | `contact.astro` | Campos ya acordados: Nombre, Email, Tipo de proyecto, Mensaje |

## Movimiento

Rotación orbital lenta (90s linear), pulso en puntos de estado, aparición suave de imagen (`soft-arrive`, ~440ms), elevación 10–14px en hover. Todo deshabilitado bajo `prefers-reduced-motion` — el prototipo ya lo hace bien, se mantiene igual.

## Breakpoints

`980px` y `720px`, con composiciones específicas por tramo (no solo apilar columnas) — se conserva ese criterio.
