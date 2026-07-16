import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const contactInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Ingresa un nombre válido (mínimo 3 caracteres)')
    .max(120, 'El nombre es demasiado largo'),
  email: z.email('Ingresa un correo electrónico válido').trim(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9\s\-+()]{10,20}$/, 'Ingresa un teléfono válido')
    .optional()
    .or(z.literal(''))
    .transform((value) => (value ? value : null)),
  subject: z
    .string()
    .trim()
    .min(5, 'Ingresa un asunto válido (mínimo 5 caracteres)')
    .max(200, 'El asunto es demasiado largo'),
  message: z
    .string()
    .trim()
    .min(10, 'Ingresa un mensaje válido (mínimo 10 caracteres)')
    .max(2000, 'El mensaje es demasiado largo'),
});

export const contact = {
  submit: defineAction({
    accept: 'json',
    input: contactInputSchema,
    handler: async (input) => {
      const { error: insertError } = await supabaseAdmin.from('contact_messages').insert({
        full_name: input.fullName,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
      });

      if (insertError) {
        console.error('[contact.submit] Error al insertar en Supabase:', insertError);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.',
        });
      }

      return { success: true } as const;
    },
  }),
};
