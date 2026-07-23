# Estrategia Integral de Integración de Test de Dosha en IMHDXEIN

Este documento resume la estrategia de UX/UI y la implementación técnica del Test de Dosha
gratuito integrado en imhdxein.org.mx, siguiendo los 3 escenarios de negocio definidos:

1. **Paciente Cualificado** — Test después de agendar una cita.
2. **Lead Frío** — Test desde el menú principal, sin cita previa.
3. **Paciente Perdido** — Test tras solicitar una "Consulta General y de Diagnóstico".

> 📁 Código relacionado:
> - `supabase/migrations/20260703000000_create_dosha_results.sql`
> - `supabase/migrations/20260703000100_add_origin_to_contact_messages.sql`
> - `src/lib/dosha/` (preguntas, scoring, perfiles)
> - `src/actions/dosha.ts`, `src/actions/appointments.ts`, `src/actions/contact.ts`
> - `src/lib/email/doshaNotification.ts`, `src/lib/email/doshaUpdateNotification.ts`, `src/lib/email/appointmentNotification.ts`
> - `src/components/DoshaQuiz.vue`, `src/pages/test-dosha.astro`
> - `src/components/ContactForm.vue`, `src/pages/terapias.astro`, `src/components/Nav.astro`


---

## 1. Arquitectura de Base de Datos (Supabase)

### Tabla `dosha_results`

```sql
CREATE TABLE dosha_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relación 1:1 opcional con appointments (Escenario 1). Nulo si el
  -- test se hizo sin cita previa (lead frío).
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,

  -- Columna crucial para vincular la información del test con el
  -- paciente hoy mismo (antes de tener panel de usuario/auth).
  email TEXT NOT NULL,

  full_name TEXT,

  -- Cuestionario completo (respuestas + puntajes) en JSON.
  respuestas_json JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Dosha dominante calculado.
  resultado_principal TEXT NOT NULL CHECK (resultado_principal IN ('Vata', 'Pitta', 'Kapha')),

  -- Origen del test: diferencia los 3 escenarios de negocio.
  origen TEXT NOT NULL DEFAULT 'lead' CHECK (origen IN ('appointment', 'lead', 'consulta_general')),

  -- Referencia temporal al mensaje de "Consulta General" (Escenario 3).
  contact_message_id UUID REFERENCES contact_messages(id) ON DELETE SET NULL,

  fecha_realizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE dosha_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_dosha_results" ON dosha_results
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX idx_dosha_results_email ON dosha_results(email);
CREATE INDEX idx_dosha_results_appointment_id ON dosha_results(appointment_id);
CREATE INDEX idx_dosha_results_created ON dosha_results(fecha_realizacion DESC);
```

### Cambio en `contact_messages`

```sql
ALTER TABLE contact_messages
  ADD COLUMN origin TEXT NOT NULL DEFAULT 'contacto'
  CHECK (origin IN ('contacto', 'consulta_general'));
```

Esto permite distinguir los mensajes que provienen de la tarjeta "Consulta General y de
Diagnóstico" en Terapias (Escenario 3), sin necesidad de una tabla adicional.

### Por qué `email` (y no solo `appointment_id`)

`email` es la clave de vinculación **hoy mismo**, sin depender de autenticación de usuario:
- Permite relacionar un test hecho **antes** de que exista la cita (o sin cita) con citas
  futuras del mismo correo (ver Punto 3, notificación al administrador).
- Es la base para un futuro panel de usuario (`auth.users` de Supabase), donde `email` podría
  usarse para hacer el "claim" retroactivo de resultados anónimos a una cuenta.

---

## 2. Flujos de Usuario y Casos Borde

### Escenario 1 — Paciente Cualificado

1. El usuario llena el formulario de cita (`ContactForm.vue`, pestaña "Solicitar Información").
2. `appointments.submit` inserta en `appointments` y devuelve `{ success, appointmentId }`.
3. En la pantalla de éxito se muestra la invitación al test con un botón que enlaza a:
   `/test-dosha?appointmentId=<uuid>&email=<email>&name=<nombre>`.
4. `DoshaQuiz.vue` lee esos parámetros de la URL (`onMounted`) y los envía ocultos al completar
   el test. `dosha.submit` los recibe como `appointmentId` y guarda `origen = 'appointment'`.
5. **No** se envía notificación comercial (el paciente ya tiene seguimiento vía la cita).

### Escenario 2 — Lead Frío

1. El usuario entra directo a `/test-dosha` desde el menú ("Test Dosha Gratuito").
2. Completa el cuestionario; en el "email gate" final ingresa su correo (y opcionalmente nombre).
3. `dosha.submit` no recibe `appointmentId` ni `contactMessageId` → `origen = 'lead'`.
4. Se dispara `sendLeadNotification(...)` → correo a `ADMIN_NOTIFICATION_EMAIL` con asunto:
   `"Nuevo Resultado de Test Dosha (Lead sin cita): [Nombre/Email]"`.

### Escenario 3 — Paciente Perdido (Consulta General)

1. En `/terapias`, la tarjeta "¿No sabes qué terapia elegir?" enlaza a
   `/contacto?origin=consulta_general`.
2. `ContactForm.vue` detecta el parámetro `origin` en `onMounted`, cambia a la pestaña
   "Mensaje General" y precompleta el asunto con "Consulta General y de Diagnóstico".
3. Al enviar, `contact.submit` guarda `origin = 'consulta_general'` en `contact_messages` y
   devuelve `{ success, contactMessageId }`.
4. En la pantalla de éxito se invita al Test de Dosha (mismo componente de invitación que el
   Escenario 1), enlazando a `/test-dosha?contactId=<uuid>&email=...`.
5. `dosha.submit` recibe `contactMessageId` → `origen = 'consulta_general'`.
6. **Sí** se envía notificación comercial (aún no hay cita confirmada), con el asunto indicando
   que proviene de Consulta General.

---

## 3. Guion del Test de Dosha (18 preguntas)

Ubicado en `src/lib/dosha/questions.ts`. Explora 6 categorías clásicas de la valoración
ayurvédica de *Prakriti*:

| # | Categoría | Pregunta (resumen) |
|---|---|---|
| 1 | Cuerpo | Contextura corporal |
| 2 | Cuerpo | Tipo de piel |
| 3 | Cuerpo | Tipo de cabello |
| 4 | Digestión | Apetito |
| 5 | Digestión | Digestión general |
| 6 | Digestión | Comportamiento del peso |
| 7 | Sueño y energía | Calidad del sueño |
| 8 | Sueño y energía | Nivel de energía diario |
| 9 | Sueño y energía | Preferencia climática |
| 10 | Mente y emociones | Temperamento |
| 11 | Mente y emociones | Reacción al estrés |
| 12 | Mente y emociones | Memoria |
| 13 | Mente y emociones | Toma de decisiones |
| 14 | Estilo de vida | Forma de hablar |
| 15 | Estilo de vida | Forma de moverse |
| 16 | Estilo de vida | Relación con rutinas |
| 17 | Estilo de vida | Sistema inmunológico |
| 18 | Estilo de vida | Necesidad de equilibrio |

Cada pregunta tiene exactamente 3 opciones (Vata / Pitta / Kapha, en ese orden).

### Algoritmo de cálculo (`src/lib/dosha/scoring.ts`)

1. Cada pregunta contestada suma **+1** al dosha de la opción elegida.
2. El dosha con más puntos es el `resultado_principal`.
3. En caso de empate, se prioriza **Vata > Pitta > Kapha** (orden convencional ayurvédico).
4. Se calcula un dosha **secundario** (segundo lugar) para poder comunicar constituciones
   duales (ej. "Vata-Pitta"), aunque en la base de datos solo se persiste un dosha principal.

---

## 4. Wireframe conceptual de `/test-dosha`

```
┌─────────────────────────────────────────────┐
│  HERO (gradiente spirit→brand→deep)          │
│  "100% Gratuito"                             │
│  Test de Dosha                               │
│  Descubre tu constitución Ayurvédica...      │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  INTRO                                       │
│  Explicación breve de Vata/Pitta/Kapha       │
│  [Vata] [Pitta] [Kapha]  (tarjetas de color) │
│  [ Comenzar el Test ]                        │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  QUIZ (1 pregunta a la vez)                  │
│  Barra de progreso + "Pregunta X de 18"      │
│  Categoría (ej. "Digestión")                 │
│  Pregunta                                    │
│  ( ) Opción Vata                             │
│  ( ) Opción Pitta                            │
│  ( ) Opción Kapha                            │
│  [Atrás]                    [Siguiente]      │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  EMAIL GATE (antes de calcular el resultado) │
│  Nombre (opcional) / Correo (obligatorio)    │
│  [ Ver mi resultado ]                        │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  RESULTADO                                   │
│  "Tu dosha dominante es [Vata]"              │
│  Descripción + Recomendaciones               │
│  Influencia secundaria (si aplica)           │
│  ┌───────────────────────────────────────┐   │
│  │ ¿Quieres profundizar en tu equilibrio?│   │
│  │ [ Agendar una consulta ]  → /contacto │   │
│  └───────────────────────────────────────┘   │
│  [ Volver a hacer el test ]                  │
└─────────────────────────────────────────────┘
```

El "email gate" se coloca **al final** del cuestionario (no al inicio) para maximizar la tasa
de finalización: el usuario ya invirtió tiempo respondiendo y está más dispuesto a dejar su
correo para ver el resultado ("efecto de compromiso").

---

## 5. Flujo de Notificaciones

### 5.1 Estado Dosha en el correo de nueva cita (Punto 3)

Implementado en `src/actions/appointments.ts` (`resolveDoshaStatus`) y
`src/lib/email/doshaNotification.ts` (`buildDoshaStatusHtml` / `buildDoshaStatusText`).

Lógica de servidor, ejecutada en cada `appointments.submit`:

```ts
const resolveDoshaStatus = async (email: string): Promise<Dosha | null> => {
  const { data } = await supabaseAdmin
    .from('dosha_results')
    .select('resultado_principal')
    .eq('email', email)
    .order('fecha_realizacion', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.resultado_principal ?? null;
};
```

El resultado se inyecta como bloque destacado dentro del correo de notificación de cita:

- ✅ **Si encuentra resultado:**
  `🔔 ESTADO DOSHA: Paciente YA completó el test. Resultado: Vata.`
- ⚪ **Si no encuentra resultado:**
  `🔔 ESTADO DOSHA: Paciente AÚN NO ha realizado el test.`

Se consulta por el resultado **más reciente** de ese correo (`order by fecha_realizacion desc
limit 1`), para cubrir el caso de un usuario que repite el test.

### 5.2 Notificación comercial de "Lead sin cita" (solo Escenario 2 puro)

Implementado en `src/actions/dosha.ts` (`sendLeadNotification`) y
`src/lib/email/doshaNotification.ts` (`buildDoshaLeadHtml` / `buildDoshaLeadText`).

Asunto del correo: `Nuevo Resultado de Test Dosha (Lead sin cita): [Nombre/Email]`.
El cuerpo incluye nombre, correo, resultado (con color/elemento del dosha) y un botón
"Contactar para ofrecer consulta" (`mailto:` directo al lead).

Se dispara **únicamente cuando NO existe ninguna solicitud previa vinculada** (ni
`appointmentId` ni `contactMessageId` presentes), es decir, exclusivamente en el Escenario 2
("lead frío" que entra directo a `/test-dosha` desde el menú principal). Ver la lógica unificada
en el punto 5.3, que reemplaza el uso de este correo para los Escenarios 1 y 3.

### 5.3 Notificación de "Actualización" unificada (Escenarios 1 y 3) — Requerimiento adicional

**Problema que resuelve:** en los Escenarios 1 y 3, el administrador recibe un primer correo
(de `appointments.submit` o `contact.submit`) indicando "Estado Dosha: AÚN NO" si el usuario
todavía no había hecho el test al momento de enviar su solicitud inicial. Si el usuario completa
el test **después** de ese primer correo (minutos u horas más tarde), el administrador nunca se
enteraba — hasta ahora.

**Lógica de servidor unificada**, implementada en `src/actions/dosha.ts`, ejecutada en cada
`dosha.submit` justo después de insertar en `dosha_results`:

```ts
const hasLinkedRequest = Boolean(input.appointmentId || input.contactMessageId);

if (hasLinkedRequest) {
  // Escenarios 1 y 3: ya existía una solicitud previa (cita o mensaje de
  // Consulta General). Se resuelve su información (resolveLinkedRequestInfo)
  // y se envía el correo de Actualización.
  const linkedInfo = await resolveLinkedRequestInfo(appointmentId, contactMessageId, fallback);
  if (linkedInfo) {
    await sendUpdateNotification({ ...linkedInfo, dosha: dominant, createdAt });
  }
} else {
  // Escenario 2 puro (lead frío sin ninguna solicitud previa).
  await sendLeadNotification({ fullName, email, dosha: dominant, createdAt, origin: 'lead' });
}
```

`resolveLinkedRequestInfo` consulta la tabla correspondiente para obtener datos consistentes con
la solicitud original en lugar de depender únicamente de lo que el usuario haya vuelto a escribir
en el test:
- Si hay `appointmentId`: consulta `appointments` (nombre, correo, `therapy_id`) y resuelve el
  nombre de la terapia vía Keystatic (`getEntry('therapies', slug)`), igual que
  `resolveDoshaStatus` en `appointments.ts`. `sourceLabel` = `"Terapia agendada: <nombre>"`.
- Si hay `contactMessageId`: consulta `contact_messages` (nombre, correo, `subject`).
  `sourceLabel` = `"Solicitud General: <asunto>"`.

**Correo de Actualización** (`src/lib/email/doshaUpdateNotification.ts`):
- Asunto: `🔄 ACTUALIZACIÓN: El usuario [Nombre] YA completó el Test Dosha`.
- Cuerpo: informa que el usuario completó voluntariamente el test después de su solicitud
  inicial, mostrando Nombre, Correo, Solicitud original (Terapia agendada / Solicitud General) y
  Nuevo Estado Dosha (con color/elemento). Tono meramente informativo — no incluye ningún CTA
  comercial urgente, solo una nota de que el dato ya está disponible para enriquecer el
  seguimiento del paciente/cliente.

**Integración asíncrona:** el `insert` en `dosha_results` se hace primero (crítico, con
`await`); el envío del correo ocurre después dentro de un `try/catch` que solo hace
`console.error` ante cualquier fallo de Resend/Supabase — nunca lanza `ActionError`. Esto es
consistente con el patrón ya usado en `sendLeadNotification`, `sendAdminNotification`, etc., en
todo el proyecto: un fallo de correo jamás bloquea ni retrasa la respuesta de éxito al usuario.

### 5.4 Optimización del "Email Gate" según origen (Escenarios 1 y 3)

**Problema que resuelve:** en los Escenarios 1 y 3, el correo y nombre del usuario ya están
guardados en `appointments` / `contact_messages` y llegan como parámetros en la URL
(`/test-dosha?appointmentId=...&email=...&name=...` o `?contactId=...&email=...`). Pedirle de
nuevo esos datos en el "Email Gate" final es una fricción innecesaria.

**Lógica de frontend**, implementada en `src/components/DoshaQuiz.vue`:

```ts
const canSkipEmailGate = computed(
  () => (!!appointmentId.value || !!contactMessageId.value) && validateEmail(email.value)
);

const goNext = async () => {
  if (!canGoNext.value) return;
  if (isLastQuestion.value) {
    if (canSkipEmailGate.value) {
      await submitQuiz(); // guarda directo, sin mostrar el Email Gate
    } else {
      step.value = 'email-gate';
    }
    return;
  }
  currentIndex.value += 1;
};
```

- **Escenarios 1 y 3** (con `appointmentId`/`contactId` y un `email` prellenado válido): al
  responder la última pregunta, el test se guarda automáticamente (`submitQuiz()`) y el usuario
  pasa directo a la pantalla de Resultado. El botón final muestra el estado `"Calculando..."`
  mientras se completa el envío.
- **Escenario 2** (lead frío, sin ids): se conserva el comportamiento original — se muestra el
  Email Gate pidiendo correo (obligatorio) y nombre (opcional).
- **Red de seguridad:** si el email prellenado en la URL no es válido (o no vino), `canSkipEmailGate`
  es `false` y se cae de vuelta al Email Gate manual. Del mismo modo, si el envío automático
  falla (error de red/servidor), `submitQuiz()` regresa a `step = 'email-gate'` mostrando el
  error, permitiendo reintentar sin perder las respuestas ya contestadas.

No fue necesario modificar el schema de `dosha.submit` (`src/actions/dosha.ts`): ya aceptaba
`fullName`/`email` sin distinguir su procedencia, por lo que el cambio quedó acotado al
componente Vue.

---


## 6. Estrategia de Copys

### Invitación tras agendar cita (Escenario 1)

> **🌿 Te invitamos a realizar tu Test Dosha gratuito**
> Evalúa tu situación actual antes de la cita: descubre tu constitución Ayurvédica (Vata, Pitta
> o Kapha) y llega con información valiosa para tu especialista.
> **[ Hacer el Test Dosha ]**

### Tarjeta "Consulta General" en Terapias (Escenario 3, entrada)

> **¿No sabes qué terapia elegir?**
> Comienza con una Consulta General y de Diagnóstico
> Nuestro equipo médico integrativo evaluará tu situación actual y te orientará hacia la
> terapia o combinación de terapias más adecuada para ti. Ideal si no estás seguro/a por dónde
> empezar.
> **[ Solicitar Consulta General ]**

### Invitación tras enviar mensaje de Consulta General (Escenario 3, salida)

> **🌿 Mientras te contactamos, conoce tu Dosha**
> Aprovecha estos minutos para hacer nuestro Test de Dosha gratuito. Así tu especialista podrá
> orientar mejor la Consulta General y de Diagnóstico hacia lo que realmente necesitas.
> **[ Hacer el Test Dosha ]**

### Hero de la página `/test-dosha`

> **100% Gratuito**
> **Test de Dosha**
> Descubre tu constitución Ayurvédica (Prakriti) y recibe recomendaciones personalizadas para
> equilibrar cuerpo, mente y energía.

### Página de resultado — CTA final

> **¿Quieres profundizar en tu equilibrio?**
> Un especialista puede ayudarte a diseñar un plan personalizado a partir de tu constitución
> Ayurvédica.
> **[ Agendar una consulta ]** → `/contacto`

### Perfiles de resultado (resumen — ver `doshaProfiles.ts` para texto completo)

- **Vata** (Aire y Éter) — *"Creatividad en movimiento"*: creativo/a, entusiasta, rápido/a para
  aprender; en desequilibrio: ansiedad, insomnio, dificultad para sostener rutinas.
- **Pitta** (Fuego y Agua) — *"Foco, pasión y determinación"*: decidido/a, apasionado/a,
  liderazgo; en desequilibrio: irritabilidad, inflamación, autoexigencia.
- **Kapha** (Tierra y Agua) — *"Estabilidad y calma profunda"*: tranquilo/a, leal, resistente;
  en desequilibrio: letargo, apego, dificultad para soltar.

---

## 7. Resumen de archivos entregados

| Área | Archivo |
|---|---|
| SQL | `supabase/migrations/20260703000000_create_dosha_results.sql` |
| SQL | `supabase/migrations/20260703000100_add_origin_to_contact_messages.sql` |
| Guion + scoring | `src/lib/dosha/questions.ts`, `scoring.ts`, `doshaProfiles.ts`, `index.ts` |
| Backend | `src/actions/dosha.ts` |
| Backend (actualizado) | `src/actions/appointments.ts`, `src/actions/contact.ts` |
| Emails | `src/lib/email/doshaNotification.ts`, `src/lib/email/doshaUpdateNotification.ts` |
| Emails (actualizado) | `src/lib/email/appointmentNotification.ts` |
| UI Test (actualizado) | `src/components/DoshaQuiz.vue`, `src/pages/test-dosha.astro` |
| UI Integración | `src/components/Nav.astro`, `src/components/ContactForm.vue`, `src/pages/terapias.astro` |

