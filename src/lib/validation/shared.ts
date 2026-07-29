import { z } from 'astro/zod';

// Reglas de validación compartidas entre las Astro Actions (servidor) y los
// componentes Vue (cliente): un cambio de regla se hace en un solo lugar en
// vez de replicarse a mano en cada formulario.

export const emailSchema = z.email('Ingresa un correo electrónico válido').trim();

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9\s\-+()]{10,20}$/, 'Ingresa un teléfono válido');

export const fullNameSchema = z
  .string()
  .trim()
  .min(3, 'Ingresa un nombre válido (mínimo 3 caracteres)')
  .max(120, 'El nombre es demasiado largo');

// Honeypot: campo oculto que solo un bot completaría. Debe llegar vacío.
export const websiteHoneypotSchema = z.string().max(0).optional().or(z.literal(''));
