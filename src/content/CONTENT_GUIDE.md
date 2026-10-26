# Escribir artículos del blog

Los artículos originales se escriben en español dentro de `src/content/blog/`. Para publicar una traducción inglesa, crea un segundo archivo MDX y relaciona ambos con el mismo `translationId` y distinto `locale` (`es` o `en`). La traducción es editorial y manual; no se traduce contenido durante la navegación.

```yaml
---
title: Título del artículo
description: Resumen breve
publishedAt: 2026-10-04
locale: es
translationId: identificador-compartido
draft: false
---
```

La fecha y el `translationId` deben coincidir entre idiomas. El selector dentro del artículo solo aparece cuando existe la otra versión publicada. Los borradores no se muestran en el archivo.

## Imágenes, GIF y vídeo

Guarda los recursos locales en `src/assets/` y pásalos a los componentes MDX mediante import:

```mdx
import screenshot from '../../assets/images/example.webp';
import animation from '../../assets/images/example.gif';
import MediaImage from '../../components/media/MediaImage.astro';
import MediaGif from '../../components/media/MediaGif.astro';
import MediaVideo from '../../components/media/MediaVideo.astro';
import MediaGallery from '../../components/media/MediaGallery.astro';

<MediaImage src={screenshot} alt="Descripción útil de la interfaz" caption="Vista de la pantalla principal." />
<MediaGif src={animation} alt="La interfaz abre el panel de ajustes." />
<MediaGallery label="Capturas del proyecto" items={[{ src: screenshot, alt: 'Pantalla principal', caption: 'Vista inicial' }]} />
<MediaVideo src="/media/demo.mp4" captions="/media/demo.es.vtt" captionLabel="Español" locale="es" description="Demostración del flujo de trabajo" />
```

`MediaImage` y `MediaGallery` usan `astro:assets` para generar imágenes optimizadas y versiones adaptables. Escribe siempre un `alt` que describa la información relevante; usa `alt=""` solo si la imagen es puramente decorativa. Los pies son opcionales. `MediaGif` conserva la animación original, por lo que conviene reducir dimensiones y peso antes de añadir el archivo. Mantén vídeos y subtítulos en el propio sitio, usa los controles nativos e incluye un archivo WebVTT de subtítulos sincronizados (`.vtt`) en el idioma del artículo.
