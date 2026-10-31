import { defineMiddleware } from 'astro:middleware';

// Rutas de servidor que nunca deben indexarse: el panel de Keystatic, su API y los endpoints
// de Astro Actions. robots.txt solo impide rastrearlas; esta cabecera impide que se indexen
// aunque alguien las enlace. Se pone aquí (no en netlify.toml) porque son respuestas de la
// función de servidor, donde las cabeceras estáticas de Netlify no siempre se aplican.
const NOINDEX_PREFIXES = ['/keystatic', '/api/', '/_actions/'];

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (NOINDEX_PREFIXES.some((prefix) => context.url.pathname.startsWith(prefix))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
});
