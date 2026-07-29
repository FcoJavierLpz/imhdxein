import { z } from 'astro/zod';
import { emailSchema, fullNameSchema, phoneSchema, websiteHoneypotSchema } from './shared';

export const appointmentInputSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  therapyId: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  message: z
    .string()
    .trim()
    .max(2000, 'El mensaje es demasiado largo')
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  website: websiteHoneypotSchema,
});
