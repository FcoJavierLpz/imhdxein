import type { Config } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

/**
 * El sitio solo escribe en Supabase cuando alguien
 * envía un formulario (citas, contacto, test de dosha), así que sin esta
 * función el proyecto podría pausarse en semanas sin visitantes activos.
 *
 * No reutiliza src/lib/supabaseAdmin.ts: ese módulo lee `import.meta.env`
 * (procesado por Vite en el build de Astro), pero las Netlify Functions
 * corren en un runtime Node plano donde solo existe `process.env`.
 */
export default async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('keep-supabase-alive: faltan SUPABASE_URL o SUPABASE_SECRET_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabase.from('dosha_results').select('id').limit(1);

  if (error) {
    console.error('keep-supabase-alive: fallo la consulta de mantenimiento', error);
    return;
  }

  console.log('keep-supabase-alive: consulta de mantenimiento ejecutada correctamente');
};

export const config: Config = {
  // Lunes y jueves a las 06:00 UTC: dos ejecuciones por semana como margen
  // de seguridad frente a un fallo puntual, dentro de la ventana de 7 días
  // que evalúa Supabase para pausar proyectos Free.
  schedule: '0 6 * * 1,4',
};
