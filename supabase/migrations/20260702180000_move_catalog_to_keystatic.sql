-- ============================================
-- Migración de catálogo a Keystatic (Content Collections)
-- ============================================
-- El catálogo de terapias, terapeutas, testimonios, productos y artículos
-- del blog ahora se gestiona con Keystatic y vive como archivos versionados
-- en el repositorio (ver `keystatic.config.ts` y `src/content/*`). Esta
-- migración retira las tablas de catálogo de Supabase y ajusta las tablas
-- transaccionales que dependían de ellas.

-- 1. appointments.therapy_id dejará de referenciar la tabla `therapies`
--    (que se elimina) y en su lugar almacenará el slug de la terapia
--    definida en Keystatic (src/content/therapies/<slug>.json).
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_therapy_id_fkey;
ALTER TABLE appointments ALTER COLUMN therapy_id TYPE TEXT USING therapy_id::text;

-- 2. Eliminar tablas de catálogo (ya no son la fuente de verdad).
DROP TABLE IF EXISTS therapies;
DROP TABLE IF EXISTS therapists;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS blog_posts;
