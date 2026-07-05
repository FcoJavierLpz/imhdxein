import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://imhdxein.com',
  output: 'server',
  integrations: [vue(), react(), markdoc(), keystatic()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
