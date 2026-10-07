import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

/**
 * @vitejs/plugin-vue compila los SFC con `lang="ts"` pasando la config global `oxc` de Vite,
 * que react() deja con `jsx.refresh: true` sin aplicar sus filtros include/exclude. Así, React
 * Fast Refresh instrumenta cualquier composable `use*` de un .vue y el SSR de desarrollo falla
 * con "$RefreshSig$ is not defined". No hay componentes React propios (Keystatic llega
 * precompilado desde node_modules, que Fast Refresh ya excluye), así que se desactiva.
 */
function disableReactRefreshForVue() {
  return {
    name: 'imhdxein:disable-react-refresh',
    configResolved(config) {
      if (typeof config.oxc?.jsx === 'object') {
        config.oxc.jsx.refresh = false;
      }
    },
  };
}

export default defineConfig({
  site: 'https://imhdxein.org.mx',
  output: 'server',
  // react() es requerido por el panel de administración de Keystatic
  // (renderiza su UI con `client:only="react"`), aunque no haya componentes .tsx propios.
  integrations: [vue(), react(), markdoc(), keystatic(), sitemap()],

  vite: {
    plugins: [tailwindcss(), disableReactRefreshForVue()],
    build: {
      // El panel de administración de Keystatic (/keystatic) se empaqueta como un
      // único chunk de terceros (~2.7 MB) que solo cargan los administradores, no
      // los visitantes del sitio público. Se sube el límite para no generar una
      // advertencia de tamaño sobre ese bundle en cada build.
      chunkSizeWarningLimit: 3000,
    },
  },

  // Fuentes alojadas en el propio sitio (Fontsource se descarga al compilar). Las variables
  // --font-inter y --font-gelasio incluyen un fallback con métricas ajustadas para evitar saltos.
  // Gelasio tiene las mismas métricas que Georgia: los titulares conservan su carácter y ahora
  // se ven igual en Android y Linux, que no traen Georgia.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Gelasio',
      cssVariable: '--font-gelasio',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],

  adapter: netlify(),
});
