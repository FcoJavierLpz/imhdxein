-- ============================================
-- IMHDXEIN - Test de Dosha
-- Tabla `dosha_results`: almacena las respuestas y el resultado
-- del Test de Dosha, vinculado opcionalmente a una cita (appointments)
-- o a un mensaje de contacto (contact_messages) mediante el email.
-- ============================================

CREATE TABLE dosha_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relación 1:1 opcional con appointments. Si el paciente hizo el test
  -- después de agendar una cita, aquí se guarda el id de esa cita.
  -- Puede ser nulo si el test se realizó sin cita previa (lead frío).
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,

  -- Columna crucial para vincular la información del test con el
  -- paciente hoy mismo (antes de tener un panel de usuario/auth).
  email TEXT NOT NULL,

  -- Nombre opcional del paciente (útil para las notificaciones comerciales).
  full_name TEXT,

  -- Cuestionario completo: preguntas, opción elegida y dosha asociado
  -- a cada respuesta. Se guarda como JSON para máxima flexibilidad.
  respuestas_json JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Dosha dominante calculado a partir de las respuestas.
  resultado_principal TEXT NOT NULL CHECK (resultado_principal IN ('Vata', 'Pitta', 'Kapha')),

  -- Origen del test, para diferenciar los 3 escenarios de negocio:
  --   'appointment'      -> Escenario 1: test después de agendar cita
  --   'lead'             -> Escenario 2: test desde el menú principal (lead frío)
  --   'consulta_general' -> Escenario 3: test tras el formulario de Consulta General
  origen TEXT NOT NULL DEFAULT 'lead' CHECK (origen IN ('appointment', 'lead', 'consulta_general')),

  -- Referencia temporal al mensaje de contacto de "Consulta General"
  -- (Escenario 3), mientras no exista un panel de usuario/auth formal.
  contact_message_id UUID REFERENCES contact_messages(id) ON DELETE SET NULL,

  fecha_realizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE dosha_results ENABLE ROW LEVEL SECURITY;

-- El formulario público del test inserta directamente (igual que
-- appointments/contact_messages/product_orders).
CREATE POLICY "insert_dosha_results" ON dosha_results FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============================================
-- Índices
-- ============================================
CREATE INDEX idx_dosha_results_email ON dosha_results(email);
CREATE INDEX idx_dosha_results_appointment_id ON dosha_results(appointment_id);
CREATE INDEX idx_dosha_results_created ON dosha_results(fecha_realizacion DESC);
