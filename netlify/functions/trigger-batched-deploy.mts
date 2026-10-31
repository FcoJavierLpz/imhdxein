import type { Config } from '@netlify/functions';

/**
 * Los commits de keystatic-cloud[bot] se saltan en netlify.toml (build.ignore)
 * para no pagar un deploy por cada edición de contenido. Esta función los
 * "libera" una vez a la semana disparando un Build Hook, que ignora esa regla
 * y construye main con todo lo acumulado desde el último deploy real.
 */
export default async () => {
  const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;

  if (!buildHookUrl) {
    console.error('trigger-batched-deploy: falta la variable NETLIFY_BUILD_HOOK_URL');
    return;
  }

  const response = await fetch(buildHookUrl, { method: 'POST' });

  if (!response.ok) {
    console.error('trigger-batched-deploy: el build hook respondió', response.status, await response.text());
    return;
  }

  console.log('trigger-batched-deploy: deploy semanal disparado correctamente');
};

export const config: Config = {
  // Lunes 07:00 UTC, una hora después del ping de keep-supabase-alive.
  schedule: '0 7 * * 1',
};
