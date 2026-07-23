import { ActionError, defineAction } from 'astro:actions';
import { getEntry } from 'astro:content';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import type { Dosha } from '../lib/dosha/questions';
import {
  buildAppointmentHtml,
  buildAppointmentSubject,
  buildAppointmentText,
  buildPatientConfirmationHtml,
  buildPatientConfirmationSubject,
  buildPatientConfirmationText,
} from '../lib/email/appointmentNotification';
import { supabaseAdmin } from '../lib/supabaseAdmin';

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
const ADMIN_EMAIL = import.meta.env.ADMIN_NOTIFICATION_EMAIL;
const EMAIL_FROM = 'Instituto Holístico <notificaciones@imhdxein.org.mx>';
const EMAIL_REPLY_TO = 'imhdxein@gmail.com';

const resolveTherapyName = async (therapyId: string | null): Promise<string | null> => {
  if (!therapyId) return null;
  try {
    const entry = await getEntry('therapies', therapyId);
    return entry?.data.name ?? null;
  } catch {
    return null;
  }
};

/**
 * Punto 3 de la estrategia de Test de Dosha: al generar la notificación de
 * una nueva cita, se consulta `dosha_results` por email para informar al
 * administrador si el paciente ya completó el test (y con qué resultado).
 */
const resolveDoshaStatus = async (email: string): Promise<Dosha | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('dosha_results')
      .select('resultado_principal')
      .eq('email', email)
      .order('fecha_realizacion', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[appointments.submit] Error al consultar dosha_results:', error);
      return null;
    }

    return (data?.resultado_principal as Dosha | undefined) ?? null;
  } catch (error) {
    console.error('[appointments.submit] Error inesperado al consultar dosha_results:', error);
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
  doshaResult: Dosha | null;
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

const sendPatientConfirmation = async (data: {
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
      to: data.email,
      subject: buildPatientConfirmationSubject(),
      html: buildPatientConfirmationHtml(data),
      text: buildPatientConfirmationText(data),
      replyTo: EMAIL_REPLY_TO,
    });

    if (error) {
      console.error(
        '[appointments.submit] Resend rechazó el envío de la copia de cortesía:',
        error
      );
    }
  } catch (error) {
    // La cita ya quedó registrada en Supabase; un fallo de correo no debe
    // impedir que el usuario reciba confirmación de éxito. Solo se loguea.
    console.error('[appointments.submit] Error inesperado al enviar la copia de cortesía:', error);
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
        return { success: true, appointmentId: null } as const;
      }

      const therapyName = await resolveTherapyName(input.therapyId);

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('appointments')
        .insert({
          full_name: input.fullName,
          email: input.email,
          phone: input.phone,
          therapy_id: input.therapyId,
          message: input.message,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('[appointments.submit] Error al insertar en Supabase:', insertError);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No pudimos registrar tu solicitud. Por favor intenta de nuevo.',
        });
      }

      const createdAt = new Date();
      const appointmentId = inserted?.id ?? null;

      // Escenario 1 del Test de Dosha: el paciente ya agendó su cita.
      // Se le invitará (desde el frontend) a hacer el test pasando este id.
      const doshaResult = await resolveDoshaStatus(input.email);

      await Promise.all([
        sendAdminNotification({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          therapyName,
          message: input.message,
          createdAt,
          doshaResult,
        }),
        sendPatientConfirmation({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          therapyName,
          message: input.message,
          createdAt,
        }),
      ]);

      return { success: true, appointmentId } as const;
    },
  }),
};
