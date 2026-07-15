import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase
 */

const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SECRET_KEY as string | undefined;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing Supabase server environment variables. Ensure SUPABASE_URL and SUPABASE_SECRET_KEY are defined in your .env file.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
