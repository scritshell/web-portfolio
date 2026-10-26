import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://scritshell.pages.dev';

export default defineConfig({
  output: 'static',
  site,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/^\/(?:es\/)?(?:privacy|legal-notice|privacidad|aviso-legal)\/?$/.test(new URL(page).pathname),
    }),
  ],
});
