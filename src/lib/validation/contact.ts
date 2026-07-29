import { z } from 'astro/zod';
import { emailSchema, fullNameSchema, phoneSchema, websiteHoneypotSchema } from './shared';

export const subjectSchema = z
  .string()
  .trim()
  .min(5, 'Ingresa un asunto válido (mínimo 5 caracteres)')
  .max(200, 'El asunto es demasiado largo');

export const messageSchema = z
  .string()
  .trim()
  .min(10, 'Ingresa un mensaje válido (mínimo 10 caracteres)')
  .max(2000, 'El mensaje es demasiado largo');

export const contactInputSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  subject: subjectSchema,
  message: messageSchema,
  // Escenario 3 del Test de Dosha: campo oculto que marca que este mensaje
  // proviene de la tarjeta "Consulta General y de Diagnóstico" en Terapias.
  origin: z.enum(['contacto', 'consulta_general']).optional().default('contacto'),
  website: websiteHoneypotSchema,
});
