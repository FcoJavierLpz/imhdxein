/**
 * Datos de contacto globales de IMHDXEIN.
 *
 * Fuente única de verdad para el teléfono y correo electrónico institucional.
 * Cualquier componente (Astro o Vue) que necesite mostrar o enlazar estos
 * datos DEBE importar las constantes de este archivo en lugar de escribirlas
 * directamente ("hardcodear"), para que una futura actualización solo
 * requiera un cambio en este único lugar.
 */

/** Teléfono en formato legible para mostrar en UI. */
export const CONTACT_PHONE_DISPLAY = '+52 33 1842 2251' as const;

/** Teléfono en formato internacional E.164 (usado para `tel:` y como base de wa.me). */
export const CONTACT_PHONE_E164 = '+523318422251' as const;

/** Href listo para usar en enlaces `<a href="tel:...">`. */
export const CONTACT_PHONE_TEL_HREF = `tel:${CONTACT_PHONE_E164}` as const;

/**
 * Número de WhatsApp: wa.me solo acepta dígitos (sin `+`, espacios ni guiones).
 * Se deriva automáticamente de CONTACT_PHONE_E164 para evitar duplicar el dato.
 */
export const CONTACT_WHATSAPP_PHONE = CONTACT_PHONE_E164.replace(/\D/g, '');

/** Correo electrónico institucional. */
export const CONTACT_EMAIL = 'imhdxein@gmail.com' as const;

/** Href listo para usar en enlaces `<a href="mailto:...">`. */
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}` as const;

/** Calle y número. */
export const CONTACT_ADDRESS_STREET = 'Calle Buenos Aires 2910' as const;

/** Colonia/barrio. */
export const CONTACT_ADDRESS_NEIGHBORHOOD = 'Col. Providencia' as const;

/** Código postal. */
export const CONTACT_ADDRESS_ZIP = '66439' as const;

/** Ciudad/estado. */
export const CONTACT_ADDRESS_CITY = 'Guadalajara Jalisco' as const;

/** País (código ISO 3166-1 alfa-2, usado en JSON-LD). */
export const CONTACT_ADDRESS_COUNTRY_CODE = 'MX' as const;

/** Dirección completa en una sola línea, lista para mostrar en UI. */
export const CONTACT_ADDRESS_FULL =
  `${CONTACT_ADDRESS_STREET}, ${CONTACT_ADDRESS_NEIGHBORHOOD}, CP ${CONTACT_ADDRESS_ZIP}, ${CONTACT_ADDRESS_CITY}` as const;
