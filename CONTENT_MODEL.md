# SCRITSHELL — Content Model

Content Collections locales (`src/content/`), sin backend ni CMS. Schema completo en `content.config.ts` (junto a este documento).

## Colección `projects`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `title` | string | |
| `description` | string, ≤160 | Se reutiliza como meta description |
| `year` | number | |
| `updated` | date, opcional | Independiente de `status` |
| `status` | `completed` \| `in-progress` \| `maintained` \| `archived` | |
| `category` | `app` \| `tool` \| `config` | Se amplía solo cuando haga falta un valor nuevo |
| `technologies` | string[] | |
| `context` | string, opcional | Lo que no cabe en `technologies`: académico, en equipo, privado... |
| `featured` | boolean | Destaca en Home |
| `order` | number, opcional | Orden manual si no basta con `year`/`updated` |
| `draft` | boolean | Escrito pero no publicado |
| `private` | boolean | Oculta `repository`/`demo`, muestra badge |
| `repository` / `demo` | url, opcionales | |
| `cover` | imagen, opcional | Si falta, se usa el arte de respaldo (`accent`) |
| `accent` | `blue` \| `violet` \| `rose` \| `amber` \| `teal` \| `gold` | Color del arte de respaldo — ver `DESIGN_SYSTEM.md` |
| `screenshots` | imagen[], opcional | Galería en la página del proyecto |
| `ogImage` | imagen, opcional | Composición propia para redes (no una captura cualquiera), tal como pedía `ASTRO_HANDOFF.md` |

Sin campo `slug`: Astro lo saca del nombre de archivo.

### Inventario real (reemplaza los datos inventados del prototipo)

El prototipo de Manus rellenó los 6 proyectos con descripciones y stacks tecnológicos inventados para poder maquetar (MateMate como app web de estudio en React, osu-hud como "HUD experiment" web, el downloader en Node.js...). Ninguno de esos datos es correcto. Esta tabla usa solo lo confirmado en la conversación; lo marcado "pendiente" se rellena al escribir cada ficha, no se inventa.

| title | category | accent | private | context | technologies |
| --- | --- | --- | --- | --- | --- |
| MateMate | app | blue | false | Proyecto final de 2º DAM · trabajo en equipo · app de ajedrez y foro comunitario | Kotlin, Android (resto pendiente) |
| ASCII Image Converter | tool | violet | false | — | pendiente |
| osu-hud | tool | rose | false | Terminales Linux para streaming y grabación jugando a osu! | pendiente (Linux, OBS) |
| Descargador de vídeo/audio | tool | amber | false | Descarga contenido multimedia de redes sociales | Python |
| Dotfiles — CachyOS | config | teal | true | Proyecto privado — solo capturas que demuestren su existencia + descripción general breve. Sin código fuente, configuración detallada ni enlaces de acceso | Shell, CachyOS |
| Presupuestador de cocinas | tool | gold | true | Proyecto privado — solo capturas, sin repo ni demo | pendiente |

### Regla de contenido para proyectos `private: true`

Aplica a Dotfiles — CachyOS y Presupuestador de cocinas: el cuerpo (Markdown) se limita a una descripción general y capturas seleccionadas. Nunca código fuente, configuración/implementación detallada, enlaces de acceso, demo ni información sensible del proyecto o de terceros. La plantilla ya lo resuelve a nivel de interfaz — `getProjectActions()` devuelve un array vacío cuando `private: true`, así que no hay botón de repo/demo que mostrar por error — pero la etiqueta **"Private Project"** debe quedar inequívoca en el diseño de la página (`.private-label` en el prototipo ya lo hacía así, se conserva ese patrón).

## Colección `blog`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `title` | string | |
| `description` | string, ≤160 | |
| `publishedAt` | date | |
| `updatedAt` | date, opcional | |
| `tags` | string[], opcional | Reutiliza el patrón visual de `.tech-row` |
| `cover` | imagen, opcional | |
| `ogImage` | imagen, opcional | |
| `draft` | boolean | |

No se define todavía nada de tiempo de lectura, autor, series de artículos, etc. — se añade cuando haya un primer artículo real que lo necesite.
