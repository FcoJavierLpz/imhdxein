-- ============================================
-- IMHDXEIN - Vía de entrada "Consulta General"
-- Añade columna `origin` a contact_messages para poder distinguir
-- los mensajes que provienen de la tarjeta "Consulta General y de
-- Diagnóstico" en la página de Terapias (Escenario 3 del Test Dosha).
-- ============================================

ALTER TABLE contact_messages
  ADD COLUMN origin TEXT NOT NULL DEFAULT 'contacto' CHECK (origin IN ('contacto', 'consulta_general'));
