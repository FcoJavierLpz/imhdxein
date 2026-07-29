# Seguridad — IMHDXEIN

Este documento describe los controles de seguridad **realmente implementados**
en el estado actual del código y de la base de datos (Supabase). Sustituye a
una versión anterior que describía un sistema de roles/RLS de lectura que
nunca llegó a existir en producción.

## Modelo de acceso a datos

No hay sistema de autenticación de usuarios ni de roles (`roles`,
`profiles`, `user_roles` fueron eliminados explícitamente en la migración
`20260624003417_remove_roles_and_permissions_system.sql`). El acceso a
Supabase ocurre en dos niveles:

1. **Cliente → Astro Actions**: el navegador nunca habla con Supabase
   directamente; solo invoca las Astro Actions (`src/actions/*.ts`), que
   corren en el servidor.
2. **Astro Actions → Supabase**: las Actions usan `supabaseAdmin`
   (`src/lib/supabaseAdmin.ts`), un cliente inicializado con la
   `SUPABASE_SECRET_KEY` (service role). Este cliente **ignora RLS por
   completo**; la seguridad real de las escrituras depende de la validación
   Zod de cada Action, no de las políticas de la base de datos.

### Políticas RLS actuales

RLS está habilitado en todas las tablas transaccionales, pero las únicas
políticas activas son de **INSERT** para los roles `anon`/`authenticated`
(pensadas por si algún cliente llegara a llamar a Supabase directamente con
la clave anónima, aunque hoy no ocurre):

| Tabla              | Política          | Notas                                             |
|---------------------|--------------------|----------------------------------------------------|
| `appointments`       | INSERT únicamente | Sin SELECT/UPDATE/DELETE públicos.                 |
| `contact_messages`   | INSERT únicamente | Sin SELECT/UPDATE/DELETE públicos.                 |
| `dosha_results`      | INSERT únicamente | Sin SELECT/UPDATE/DELETE públicos.                 |
| `product_orders`     | INSERT únicamente | Tabla reservada, sin flujo activo (ver más abajo). |

Al no existir política de `SELECT` pública, cualquier lectura anónima queda
denegada por defecto — es el comportamiento correcto dado que no hay panel
de usuario ni autenticación en el sitio. Las lecturas administrativas
(revisar citas, mensajes, etc.) se hacen fuera de la aplicación web, con la
service role.

## Protección anti-abuso en formularios públicos

Los tres formularios públicos (`appointments.submit`, `contact.submit`,
`dosha.submit`) implementan un **honeypot**: un campo oculto (`website`) que
solo un bot llenaría. Si llega con contenido, la Action responde "éxito"
simulado sin insertar nada en la base de datos ni disparar correos, para no
revelar al bot que fue detectado.

No hay CAPTCHA ni rate limiting a nivel de red/IP. Si el volumen de spam
aumenta pese al honeypot, la siguiente mejora recomendada es Cloudflare
Turnstile o un contador por IP/ventana de tiempo (Netlify Blobs o una tabla
en Supabase).

## Validación de entrada

Cada Action valida su payload con un schema Zod. Las reglas comunes a varias
Actions y a los formularios Vue (formato de email, teléfono, longitud
mínima de nombre) viven en un módulo compartido (`src/lib/validation/*.ts`),
importado tanto por las Actions como por los componentes `.vue`, para que
cliente y servidor apliquen exactamente la misma regla sin duplicarla a
mano.

La validación del cliente es solo una mejora de UX (feedback inmediato); la
única validación que realmente protege los datos es la del servidor, ya que
un cliente puede saltarse el formulario y llamar a la Action directamente.

## Sanitización de salida (correos)

Las plantillas de correo (`src/lib/email/*`) escapan el HTML de cualquier
dato proporcionado por el usuario (`escapeHtml`) antes de interpolarlo en el
cuerpo del correo, evitando HTML/CSS injection en los correos enviados vía
Resend.

## Manejo de errores de envío de correo

Un fallo al enviar un correo (Resend) nunca bloquea ni revierte la
escritura ya confirmada en Supabase: se registra con `console.error` y la
respuesta al usuario sigue siendo de éxito. Es una decisión intencional
para no dejar al usuario sin confirmación por un problema del proveedor de
correo, a costa de que hoy no exista alerta/reintento si Resend empieza a
fallar de forma sostenida.

## Tabla `product_orders`

Existe en el schema desde la migración inicial (con RLS INSERT-only e
índices) pero **no tiene ningún flujo activo hoy**: `ProductShop.vue`
resuelve los pedidos abriendo un enlace de WhatsApp (`whatsappLink`), no hay
una Action `orders.submit`. Se mantiene intencionalmente porque está
reservada para el futuro carrito de compras; el flujo de WhatsApp es
provisional, no definitivo. Ver el comentario de esta tabla en la base de
datos (migración `20260729000000_document_product_orders_table.sql`).

## Cabeceras de seguridad HTTP

Configuradas en `netlify.toml`: `Content-Security-Policy`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` y
`Strict-Transport-Security` para el sitio público (mitigan clickjacking
sobre los formularios con PII y restringen la carga de recursos externos).
El panel `/keystatic` usa una CSP propia, más permisiva, dado que es una
SPA de terceros con necesidades distintas.

## Secretos y variables de entorno

`.gitignore` cubre `.env*` y `.netlify/`; no hay secretos versionados en el
historial. Las claves sensibles (`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`,
credenciales de Keystatic) solo existen como variables de entorno server-side
y nunca se prefijan con `VITE_`/`PUBLIC_`, que sí se incluirían en el bundle
del cliente.

## Pendientes conocidos

- CAPTCHA / rate limiting por IP (ver "Protección anti-abuso" arriba).
- Alertas si Resend empieza a fallar de forma sostenida (hoy solo se
  loguea).
