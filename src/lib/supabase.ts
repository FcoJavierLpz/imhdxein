import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'http://localhost:54321',
  supabaseAnonKey ?? 'public-anon-key'
);

/**
 * NOTE: El catálogo (terapias, productos, terapeutas, testimonios y artículos
 * del blog) ahora se gestiona con Keystatic y vive como Astro Content
 * Collections en `src/content/*` (ver `src/content.config.ts` y
 * `keystatic.config.ts`). Este archivo solo conserva el cliente de Supabase
 * para las tablas transaccionales que reciben envíos de formularios:
 * `appointments`, `contact_messages` y `product_orders`.
 */
