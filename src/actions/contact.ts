import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import {
  buildContactConfirmationHtml,
  buildContactConfirmationSubject,
  buildContactConfirmationText,
} from '../lib/email/contactNotification';
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
  // Escenario 3 del Test de Dosha: campo oculto que marca que este mensaje
  // proviene de la tarjeta "Consulta General y de Diagnóstico" en Terapias.
  origin: z.enum(['contacto', 'consulta_general']).optional().default('contacto'),
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const EMAIL_FROM = 'Instituto Holístico <notificaciones@imhdxein.org.mx>';
const EMAIL_REPLY_TO = 'imhdxein@gmail.com';

/**
 * Enmascara un correo electrónico para poder loguearlo sin exponer el dato
 * completo (evita que Netlify bloquee el despliegue por "Secrets Scanning"
 * y protege la privacidad del remitente).
 * Ej: "juan.perez@gmail.com" -> "ju***@gmail.com"
 */
const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (!user || !domain) return '***';
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
};

const sendContactConfirmation = async (data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.email,
      subject: buildContactConfirmationSubject(),
      html: buildContactConfirmationHtml(data),
      text: buildContactConfirmationText(data),
      replyTo: EMAIL_REPLY_TO,
    });

    if (error) {
      console.error(
        '[contact.submit] Resend rechazó el envío del correo de confirmación:',
        JSON.stringify(error, null, 2)
      );
    }
  } catch (error) {
    // El mensaje ya quedó registrado en Supabase; un fallo de correo no debe
    // impedir que el usuario reciba confirmación de éxito. Solo se loguea.
    console.error('[contact.submit] Error inesperado al enviar el correo de confirmación:', error);
  }
};

export const contact = {
  submit: defineAction({
    accept: 'json',
    input: contactInputSchema,
    handler: async (input) => {
      try {
        // Log de entrada: útil para descartar si Zod rechazó campos o si
        // llegó algún valor inesperado desde el formulario. El correo se
        // enmascara para no exponer datos personales/reales en los logs.
        console.log('[contact.submit] Input recibido:', {
          fullName: input.fullName,
          email: maskEmail(input.email),
          phone: input.phone ? '(provisto)' : null,
          subject: input.subject,
          messageLength: input.message.length,
          origin: input.origin,
        });

        // Log de verificación de configuración: confirma si la API key de
        // Resend está presente en el entorno de Netlify, sin exponer su valor.
        console.log(
          '[contact.submit] RESEND_API_KEY configurada:',
          !!import.meta.env.RESEND_API_KEY
        );

        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('contact_messages')
          .insert({
            full_name: input.fullName,
            email: input.email,
            phone: input.phone,
            subject: input.subject,
            message: input.message,
            origin: input.origin,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('[contact.submit] Error al insertar en Supabase:', insertError);
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.',
          });
        }

        await sendContactConfirmation({
          fullName: input.fullName,
          email: input.email,
          subject: input.subject,
          message: input.message,
          createdAt: new Date(),
        });

        return { success: true, contactMessageId: inserted?.id ?? null } as const;
      } catch (err) {
        console.error('[contact.submit] Error inesperado en el handler:', err);
        throw err;
      }
    },
  }),
};
