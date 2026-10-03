# SCRITSHELL — Roadmap

La secuencia de construcción en Astro ya está definida en `ASTRO_HANDOFF.md` ("Secuencia de ejecución para Claude", 9 pasos) — no se repite aquí. Este documento es el estado del proyecto y lo pendiente antes de esa secuencia.

## Fase 0 — Antes de tocar código

- [x] Prototipo visual de Manus revisado y contrastado con `ASTRO_HANDOFF.md`
- [x] Sistema de diseño documentado (`DESIGN_SYSTEM.md`)
- [x] Schema de contenido cerrado, incluyendo `blog` (`CONTENT_MODEL.md`)
- [x] Hero y wordmark reales recibidos (`scritshell-portable-assets.zip`) — el wordmark ya es SVG, listo para derivar favicon/apple-touch-icon/manifest en la Fase 3
- [x] Confirmado: los dotfiles de CachyOS son privados — solo capturas + descripción general, sin repo/código/config detallada/enlaces/demo
- [ ] Escribir el contenido real (Markdown) de los 6 proyectos con los datos correctos — no los del prototipo

## Fase 1 — Base Astro (pasos 1–2 de `ASTRO_HANDOFF.md`)
Proyecto Astro, tokens y estilos migrados, `BaseLayout`, `MetaHead`, navegación, pie, 404 propia (no la plantilla shadcn del ZIP).

## Fase 2 — Contenido (pasos 3–4)
Content Collections activas, migración de los 6 proyectos reales, páginas `/projects` y `/projects/[slug]`, `/blog` y `/blog/[slug]`.

## Fase 3 — SEO y assets de aplicación (paso 5)
`@astrojs/sitemap`, `robots.txt`, manifest, iconos — dependen del wordmark en SVG.

## Fase 4 — Interacción (paso 6)
Barra de progreso de lectura, compartir con `navigator.share()`, sin dependencias pesadas.

## Fase 5 — Legal y FAQ (paso 7)
Solo cuando el contenido real (privacidad, cookies, términos, preguntas reales) esté escrito.

## Fase 6 — Auditoría y despliegue (pasos 8–9)
Rendimiento, responsive y accesibilidad → dominio, Cloudflare Pages y HTTPS.

## Fuera de alcance por ahora
Backend, CMS, autenticación, base de datos, newsletter, dashboard. Regla ya acordada: **build for extensibility, not speculative complexity.**
