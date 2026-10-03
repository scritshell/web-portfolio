// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160), // también sirve como meta description
      year: z.number().int(),
      updated: z.date().optional(),     // última vez que se tocó, independiente de status

      status: z.enum(['completed', 'in-progress', 'maintained', 'archived']),
      category: z.enum(['app', 'tool', 'config']), // amplía solo cuando de verdad haga falta

      technologies: z.array(z.string()),
      context: z.string().optional(),   // "proyecto final de 2º DAM, trabajo en equipo", etc.

      featured: z.boolean().default(false), // destaca en Home
      order: z.number().int().optional(),   // orden manual, opcional
      draft: z.boolean().default(false),    // escrito pero no publicado
      private: z.boolean().default(false),  // sin repo/demo visibles, badge "proyecto privado"

      repository: z.string().url().optional(),
      demo: z.string().url().optional(),

      cover: image().optional(),            // si falta, se usa el arte de respaldo (accent)
      coverAlt: z.string().optional(),      // texto accesible de la cover; obligatorio en la práctica en cuanto haya cover real
      accent: z.enum(['blue', 'violet', 'rose', 'amber', 'teal', 'gold']).default('blue'),
      screenshots: z
        .array(z.object({ src: image(), alt: z.string() }))
        .optional(), // galería en la página del proyecto; alt obligatorio por captura
      ogImage: image().optional(),          // composición propia para redes; si falta, se usa cover y si no, el fallback del sitio
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      publishedAt: z.date(),
      updatedAt: z.date().optional(),
      tags: z.array(z.string()).optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      ogImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, blog };
