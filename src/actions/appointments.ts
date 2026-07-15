import { getEntry } from 'astro:content';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import {
  buildAppointmentHtml,
  buildAppointmentSubject,
  buildAppointmentText,
} from '../lib/email/appointmentNotification';

const appointmentInputSchema = z.object({
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
  // Honeypot: campo oculto que solo un bot completaría. Debe llegar vacío.
  website: z.string().max(0).optional().or(z.literal('')),
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const ADMIN_EMAIL = import.meta.env.ADMIN_NOTIFICATION_EMAIL ?? 'imhdxein@gmail.com';
const EMAIL_FROM = 'Instituto Holístico Dxein <contacto@imhdxein.org.mx>';

const resolveTherapyName = async (therapyId: string | null): Promise<string | null> => {
  if (!therapyId) return null;
  try {
    const entry = await getEntry('therapies', therapyId);
    return entry?.data.name ?? null;
  } catch {
    return null;
  }
};

const sendAdminNotification = async (data: {
  fullName: string;
  email: string;
  phone: string | null;
  therapyName: string | null;
  message: string | null;
  createdAt: Date;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: buildAppointmentSubject(data),
      html: buildAppointmentHtml(data),
      text: buildAppointmentText(data),
      replyTo: data.email,
    });

    if (error) {
      console.error('[appointments.submit] Resend rechazó el envío del correo:', error);
    }
  } catch (error) {
    // La cita ya quedó registrada en Supabase; un fallo de correo no debe
    // impedir que el usuario reciba confirmación de éxito. Solo se loguea.
    console.error('[appointments.submit] Error inesperado al enviar el correo:', error);
  }
};


export const appointments = {
  submit: defineAction({
    accept: 'json',
    input: appointmentInputSchema,
    handler: async (input) => {
      // Honeypot activado: se responde "éxito" simulado sin persistir nada,
      // para no revelar al bot que fue detectado.
      if (input.website) {
        return { success: true } as const;
      }

      const therapyName = await resolveTherapyName(input.therapyId);

      const { error: insertError } = await supabaseAdmin.from('appointments').insert({
        full_name: input.fullName,
        email: input.email,
        phone: input.phone,
        therapy_id: input.therapyId,
        message: input.message,
      });

      if (insertError) {
        console.error('[appointments.submit] Error al insertar en Supabase:', insertError);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No pudimos registrar tu solicitud. Por favor intenta de nuevo.',
        });
      }

      await sendAdminNotification({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        therapyName,
        message: input.message,
        createdAt: new Date(),
      });

      return { success: true } as const;
    },
  }),
};
