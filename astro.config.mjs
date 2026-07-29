import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://imhdxein.org.mx',
  output: 'server',
  // react() es requerido por el panel de administración de Keystatic
  // (renderiza su UI con `client:only="react"`), aunque no haya componentes .tsx propios.
  integrations: [vue(), react(), markdoc(), keystatic(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
