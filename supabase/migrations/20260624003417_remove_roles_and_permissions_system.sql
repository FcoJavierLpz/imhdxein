-- ============================================
-- Eliminar Sistema de Roles y Permisos
-- ============================================
-- NOTA: Todo este bloque se ejecuta solo si las tablas del sistema de roles
-- (roles, profiles, user_roles) existen. En proyectos nuevos donde ese
-- sistema nunca se llegó a crear, este bloque se omite de forma segura
-- (evita el error "relation does not exist" que lanza `DROP POLICY/TRIGGER
-- IF EXISTS ... ON <tabla>` cuando la tabla referenciada no existe).
DO $$
BEGIN
  IF to_regclass('public.roles') IS NOT NULL THEN
    -- 1. Eliminar todas las políticas de las tablas de roles primero
    DROP POLICY IF EXISTS "select_roles_authenticated" ON roles;
    DROP POLICY IF EXISTS "insert_roles_admin" ON roles;
    DROP POLICY IF EXISTS "update_roles_admin" ON roles;
  END IF;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "select_profiles" ON profiles;
    DROP POLICY IF EXISTS "insert_profiles_own" ON profiles;
    DROP POLICY IF EXISTS "update_profiles_own" ON profiles;
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  END IF;

  IF to_regclass('public.user_roles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "select_user_roles" ON user_roles;
    DROP POLICY IF EXISTS "insert_user_roles_admin" ON user_roles;
    DROP POLICY IF EXISTS "update_user_roles_admin" ON user_roles;
    DROP POLICY IF EXISTS "delete_user_roles_admin" ON user_roles;
  END IF;
END $$;

-- 2. Eliminar políticas de therapies creadas por el sistema de roles
DROP POLICY IF EXISTS "select_therapies_anon" ON therapies;
DROP POLICY IF EXISTS "select_therapies_authenticated" ON therapies;
DROP POLICY IF EXISTS "insert_therapies_editor" ON therapies;
DROP POLICY IF EXISTS "update_therapies_editor" ON therapies;
DROP POLICY IF EXISTS "delete_therapies_editor" ON therapies;
DROP POLICY IF EXISTS "select_therapies" ON therapies;

-- 3. Eliminar políticas de products creadas por el sistema de roles
DROP POLICY IF EXISTS "select_products_anon" ON products;
DROP POLICY IF EXISTS "select_products_authenticated" ON products;
DROP POLICY IF EXISTS "insert_products_editor" ON products;
DROP POLICY IF EXISTS "update_products_editor" ON products;
DROP POLICY IF EXISTS "delete_products_editor" ON products;
DROP POLICY IF EXISTS "select_products" ON products;

-- 4. Eliminar políticas de blog_posts creadas por el sistema de roles
DROP POLICY IF EXISTS "select_blog_posts_anon" ON blog_posts;
DROP POLICY IF EXISTS "select_blog_posts_authenticated" ON blog_posts;
DROP POLICY IF EXISTS "insert_blog_posts_editor" ON blog_posts;
DROP POLICY IF EXISTS "update_blog_posts_editor" ON blog_posts;
DROP POLICY IF EXISTS "delete_blog_posts_editor" ON blog_posts;
DROP POLICY IF EXISTS "select_blog_posts" ON blog_posts;

-- 5. Eliminar índices del sistema de roles
DROP INDEX IF EXISTS idx_therapies_created_by;
DROP INDEX IF EXISTS idx_products_created_by;
DROP INDEX IF EXISTS idx_blog_posts_created_by;
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role_id;

-- 6. Eliminar tablas de roles (CASCADE elimina dependencias, incluyendo
--    cualquier trigger asociado; DROP TABLE IF EXISTS no requiere que la
--    tabla exista previamente, a diferencia de DROP POLICY/TRIGGER).
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 7. Eliminar campos de auditoría
ALTER TABLE therapies DROP COLUMN IF EXISTS created_by;
ALTER TABLE therapies DROP COLUMN IF EXISTS updated_by;
ALTER TABLE products DROP COLUMN IF EXISTS created_by;
ALTER TABLE products DROP COLUMN IF EXISTS updated_by;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS created_by;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS updated_by;

-- 8. Eliminar funciones helper
DROP FUNCTION IF EXISTS has_role(UUID, TEXT);
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_editor(UUID);
DROP FUNCTION IF EXISTS can_edit_resource(UUID, UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 9. Restaurar políticas RLS simples
CREATE POLICY "select_therapies_public" ON therapies FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "select_products_public" ON products FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "select_blog_posts_public" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);
